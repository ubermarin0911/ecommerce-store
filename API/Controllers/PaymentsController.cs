using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Entities.Payment;
using Core.Entities.Payment.Webhook;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;
using Transaction = Core.Entities.Payment.Transaction;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<IPaymentService> _logger;
        private readonly IMapper _mapper;

        public PaymentsController(IPaymentService paymentService, ILogger<IPaymentService> logger,
         IMapper mapper)
        {
            _mapper = mapper;
            _logger = logger;
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpGet("presignedAcceptance")]
        public async Task<ActionResult<PresignedAcceptance>> GetPresignedAcceptance()
        {
            var merchant = await _paymentService.GetMerchantAsync();
            var presignedAcceptance = merchant.data.presigned_acceptance;

            return presignedAcceptance;
        }


        [Authorize]
        [HttpPost("transaction")]
        public async Task CreateTransaction(Transaction transaction)
        {
            await _paymentService.CreateTransactionAsync(transaction);
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> WompiWebhook(WompiWebhook webhook)
        {
            await _paymentService.UpdatePayment(webhook);

            return new EmptyResult();
        }

    }
}