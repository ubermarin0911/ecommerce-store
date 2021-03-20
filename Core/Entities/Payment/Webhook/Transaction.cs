namespace Core.Entities.Payment.Webhook
{
    public class Transaction
    {
        public string id { get; set; }
        public int amount_in_cents { get; set; }
        public string reference { get; set; }
        public string customer_email { get; set; }
        public string currency { get; set; }
        public string payment_method_type { get; set; }
        public string redirect_url { get; set; }
        public string status { get; set; }
        public object shipping_address { get; set; }
        public object payment_link_id { get; set; }
        public object payment_source_id { get; set; }
    }
}