using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Entities.Payment;
using Core.Entities.Payment.Response;
using Core.Entities.Payment.Webhook;
using Transaction = Core.Entities.Payment.Transaction;

namespace Core.Interfaces
{
    public interface IPaymentService
    {
        Task<DataMerchant> GetMerchantAsync();
        Task<TransactionResponse> CreateTransactionAsync(Transaction transaction);
        Task<string> GenerateReferenceOrderAsync();
        Task<bool> UpdatePayment(WompiWebhook webhook);
    }
}