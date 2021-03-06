using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Entities.Payment;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.Extensions.Configuration;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;
using Product = Core.Entities.Product;
using Newtonsoft.Json;
using System;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public PaymentService(IBasketRepository basketRepository, IUnitOfWork unitOfWork,
        IConfiguration config)
        {
            _config = config;
            _unitOfWork = unitOfWork;
            _basketRepository = basketRepository;
        }

        public async Task<DataMerchant> GetMerchantAsync()
        {
            var url = _config["Wompi:Url"];
            var publicKey = _config["Wompi:PublicKey"];

            DataMerchant dataMerchant = null;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{url}merchants/{publicKey}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    dataMerchant = JsonConvert.DeserializeObject<DataMerchant>(apiResponse);
                }
            }

            return dataMerchant;
        }

        public async Task CreateTransactionAsync(Transaction transaction)
        {
            var url = _config["Wompi:Url"];
            var publicKey = _config["Wompi:PublicKey"];

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", publicKey);

                var transactionJson = await Task.FromResult(JsonConvert.SerializeObject(transaction));

                var httpContent = new StringContent(transactionJson, Encoding.UTF8, "application/json");

                var httpResponse = await httpClient.PostAsync($"{url}transactions", httpContent);

                if (httpResponse.Content != null)
                {
                    var responseContent = await httpResponse.Content.ReadAsStringAsync();
                    // From here on you could deserialize the ResponseContent back again to a concrete C# type using Json.Net
                }
            }
        }

        public async Task<string> GenerateReferenceOrderAsync()
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const int lenght = 30;

            var randomString = new string(Enumerable.Repeat(chars, lenght)
            .Select(s => s[random.Next(s.Length)]).ToArray());

            return randomString;
        }

        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            var basket = await _basketRepository.GetBasketAsync(basketId);

            if (basket == null) return null;

            var shippingPrice = 0m;

            if (basket.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>()
                    .GetByIdAsync((int)basket.DeliveryMethodId);
                shippingPrice = deliveryMethod.Price;
            }

            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>()
                .GetByIdAsync(item.Id);

                if (item.Price != productItem.Price)
                {
                    item.Price = productItem.Price;
                }
            }

            var service = new PaymentIntentService();

            PaymentIntent intent;

            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100))
                    + (long)shippingPrice * 100,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };
                intent = await service.CreateAsync(options);
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100))
                   + (long)shippingPrice * 100
                };
                await service.UpdateAsync(basket.PaymentIntentId, options);
            }
            await _basketRepository.UpdateBasketAsync(basket);

            return basket;
        }

        public async Task<Order> UpdateOrderPaymentFailed(string paymentIntentId)
        {
            var spec = new OrderByReferenceSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) return null;

            order.Status = OrderStatus.PaymentFailed;
            await _unitOfWork.Complete();

            return order;
        }

        public async Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId)
        {
            var spec = new OrderByReferenceSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) return null;

            order.Status = OrderStatus.PaymentReceived;
            _unitOfWork.Repository<Order>().Update(order);

            await _unitOfWork.Complete();

            return order;
        }
    }

}
