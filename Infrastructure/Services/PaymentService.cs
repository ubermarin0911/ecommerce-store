using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;
using Core.Entities.Payment;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.Extensions.Configuration;
using Order = Core.Entities.OrderAggregate.Order;
using Newtonsoft.Json;
using System;
using Core.Entities.Payment.Response;
using System.Security.Cryptography;
using Core.Entities.Payment.Webhook;
using Transaction = Core.Entities.Payment.Transaction;
using TransactionWebhook = Core.Entities.Payment.Webhook.Transaction;
using System.Reflection;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public PaymentService(IBasketRepository basketRepository,
                              IUnitOfWork unitOfWork,
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

        public async Task<TransactionResponse> CreateTransactionAsync(Transaction transaction)
        {
            var url = _config["Wompi:Url"];
            var publicKey = _config["Wompi:PublicKey"];
            TransactionResponse transactionResponse = null;

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", publicKey);
                var transactionJson = await Task.FromResult(JsonConvert.SerializeObject(transaction));
                var httpContent = new StringContent(transactionJson, Encoding.UTF8, "application/json");
                var httpResponse = await httpClient.PostAsync($"{url}transactions", httpContent);

                if (httpResponse.Content != null)
                {
                    var responseContent = await httpResponse.Content.ReadAsStringAsync();
                    transactionResponse = JsonConvert.DeserializeObject<TransactionResponse>(responseContent);
                }
            }
            return transactionResponse;
        }

        public async Task<string> GenerateReferenceOrderAsync()
        {
            Random random = new Random();
            const string validCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const int lengthReference = 30;

            string randomReference;
            Order orderByReference = null;
            do
            {
                randomReference = new string(Enumerable.Repeat(validCharacters, lengthReference)
                .Select(s => s[random.Next(s.Length)]).ToArray());

                var spec = new OrderByReferenceSpecification(randomReference);

                orderByReference = await _unitOfWork.Repository<Order>()
                        .GetEntityWithSpec(spec);

            } while (orderByReference != null);

            return randomReference;
        }

        private string GetSHA256(string concat)
        {
            SHA256 sha256 = SHA256Managed.Create();
            ASCIIEncoding encoding = new ASCIIEncoding();
            byte[] stream = null;
            StringBuilder sb = new StringBuilder();
            stream = sha256.ComputeHash(encoding.GetBytes(concat));
            for (int i = 0; i < stream.Length; i++) sb.AppendFormat("{0:X2}", stream[i]);
            return sb.ToString();
        }

        private string GetConcatenatedEventValues(WompiWebhook webhook)
        {
            string secretEvent = _config["Wompi:SecretEvent"];
            string properties = "";

            foreach (var property in webhook.signature.properties)
            {
                string[] splitProperties = property.Split('.');
                PropertyInfo prop = typeof(TransactionWebhook).GetProperty(splitProperties[1]);
                properties += prop.GetValue(webhook.data.transaction, null);
            }

            properties += webhook.timestamp + secretEvent;

            return properties;
        }

        public async Task<bool> UpdatePayment(WompiWebhook webhook)
        {
            string concatenatedEventValues = GetConcatenatedEventValues(webhook);
            var checksum = GetSHA256(concatenatedEventValues);

            if (checksum == webhook.signature.checksum)
            {
                switch (webhook.@event)
                {
                    case "transaction.updated":
                        return await UpdateOrderStatus(webhook);
                }
            }
            return false;
        }

        private async Task<bool> UpdateOrderStatus(WompiWebhook webhook)
        {
            var spec = new OrderByReferenceSpecification(webhook.data.transaction.reference);
            Order order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            switch (webhook.data.transaction.status)
            {
                case "APPROVED":
                    order.Status = OrderStatus.Approved;
                    break;

                case "DECLINED":
                    order.Status = OrderStatus.Declined;
                    break;

                case "VOIDED":
                    order.Status = OrderStatus.Voided;
                    break;

                case "ERROR":
                    order.Status = OrderStatus.Error;
                    break;
            }

            _unitOfWork.Repository<Order>().Update(order);

            var result = await _unitOfWork.Complete();

            return order == null;
        }

    }

}
