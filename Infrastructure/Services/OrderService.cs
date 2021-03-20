using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Entities.Payment;
using Core.Entities.Payment.Response;
using Core.Entities.Payment.Webhook;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.Extensions.Configuration;
using Transaction = Core.Entities.Payment.Transaction;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IPaymentService _paymentService;
        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public OrderService(
            IPaymentService paymentService,
            IBasketRepository basketRepo,
            IUnitOfWork unitOfWork,
            IConfiguration config)
        {
            _unitOfWork = unitOfWork;
            _config = config;
            _paymentService = paymentService;
            _basketRepo = basketRepo;
        }

        public async Task<Order> CreateOrderAsync(Transaction transaction)
        {
            //Obtener canasta del repositorio
            var basket = await _basketRepo.GetBasketAsync(transaction.basketId);

            //Obtener items del repositorio de productos
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name,
                productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            //Obtener metodo de envio del repositorio
            // var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            //Calcular subtotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);


            transaction.amount_in_cents = Int32.Parse($"{subtotal}00");
            transaction.currency = "COP";
            transaction.shipping_address.country = "CO";
            transaction.shipping_address.region = "Magdalena";
            transaction.customer_data.full_name = transaction.shipping_address.name;
            transaction.customer_data.phone_number = transaction.shipping_address.phone_number;

            DataMerchant dataMerchant = await _paymentService.GetMerchantAsync();
            transaction.acceptance_token = dataMerchant.data.presigned_acceptance.acceptance_token;
            transaction.reference = await _paymentService.GenerateReferenceOrderAsync();
            TransactionResponse transactionResponse = await _paymentService.CreateTransactionAsync(transaction);

            Order order = null;

            if (transactionResponse.data != null)
            {
                Address addressShipping = new Address
                {
                    City = transaction.shipping_address.city,
                    Name = transaction.shipping_address.name,
                    PhoneNumber = transaction.shipping_address.phone_number,
                    UserAddress = transaction.shipping_address.address_line_1
                };

                //Crear orden
                order = new Order(items, transaction.customer_email, addressShipping,
                 subtotal, transaction.reference, transactionResponse.data.id);

                _unitOfWork.Repository<Order>().Add(order);

                //Guardar la orden en la base de datos
                var result = await _unitOfWork.Complete();

                if (result <= 0) return null;
            }

            //Retornar la orden
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);

            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);

            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}