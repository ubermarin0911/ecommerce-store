using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Entities.Payment;

namespace Core.Interfaces
{
    public interface IPaymentService
    {
        Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId);
        Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId);
        Task<Order> UpdateOrderPaymentFailed(string paymentIntentId);
        Task<DataMerchant> GetMerchantAsync();
        Task CreateTransactionAsync(Transaction transaction);
        Task<string> GenerateReferenceOrderAsync();
    }
}