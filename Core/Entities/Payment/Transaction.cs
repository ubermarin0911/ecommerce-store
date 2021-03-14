using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Dynamic;

namespace Core.Entities.Payment
{
    public class Transaction
    {
        public string basketId { get; set; }
        public string acceptance_token { get; set; }
        public int? amount_in_cents { get; set; }
        public string currency { get; set; }
        public string customer_email { get; set; }
        [Required]
        public PaymentMethod payment_method { get; set; }
        public string reference
        { get; set; }
        public CustomerData customer_data { get; set; }
        public ShippingAddress shipping_address { get; set; }
    }

    public class PaymentMethod
    {
        public string type { get; set; }
        public string payment_description { get; set; }
        public string user_type { get; set; }
        public string sandbox_status { get; set; }
        public int? installments { get; set; }
        public string token { get; set; }
        public string phone_number { get; set; } = "0";
        public string user_legal_id_type { get; set; }
        public string user_legal_id { get; set; } = "0";
        public string financial_institution_code { get; set; } = "0";
    }

    public class CustomerData
    {
        public string phone_number { get; set; }
        public string full_name { get; set; }
    }

    public class ShippingAddress
    {
        public string address_line_1 { get; set; }
        public string country { get; set; }
        public string region { get; set; }
        public string city { get; set; }
        public string name { get; set; }
        public string phone_number { get; set; }
    }
}