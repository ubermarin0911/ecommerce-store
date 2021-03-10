using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Entities.Payment;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;

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


        [HttpGet("referenceOrder")]
        public async Task<ActionResult<string>> GenerateReferenceOrder()
        {
            var referenceOrder = await _paymentService.GenerateReferenceOrderAsync();

            return Ok(referenceOrder);
        }

        [Authorize]
        [HttpPost("transaction")]
        public async Task CreateTransaction(Transaction transaction)
        {
            await _paymentService.CreateTransactionAsync(transaction);
        }

        // [Authorize]
        // [HttpPost("{basketId}")]
        // public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        // {
        //     var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

        //     if (basket == null) return BadRequest(new ApiResponse(400, "Problem with your basket"));

        //     return basket;
        // }

        // [HttpPost("webhook")]
        // public async Task<ActionResult> StripeWebhook()
        // {
        //     var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        //     var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
        //     WhSecret);

        //     PaymentIntent intent;
        //     Order order;

        //     switch (stripeEvent.Type)
        //     {
        //         case "payment_intent.succeeded":
        //             intent = (PaymentIntent)stripeEvent.Data.Object;
        //             _logger.LogInformation("Payment Succeeded: ", intent.Id);
        //             order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
        //             _logger.LogInformation("Order updated to payment received: ", order.Id);
        //             break;
        //         case "payment_intent.payment_failed":
        //             intent = (PaymentIntent)stripeEvent.Data.Object;
        //             _logger.LogInformation("Payment Failed: ", intent.Id);
        //             order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
        //             _logger.LogInformation("Payment Failed: ", order.Id);
        //             break;
        //     }
        //     return new EmptyResult();
        // }

    }
}