using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Entities.Payment;
using Core.Entities.Payment.Response;

namespace Core.Interfaces
{
    public interface IPaymentService
    {
        Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId);
        Task<Order> UpdateOrderPaymentFailed(string paymentIntentId);
        Task<DataMerchant> GetMerchantAsync();
        Task<TransactionResponse> CreateTransactionAsync(Transaction transaction);
        Task<string> GenerateReferenceOrderAsync();
    }
}