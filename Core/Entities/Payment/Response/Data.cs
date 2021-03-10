namespace Core.Entities.Payment.Response
{
    public class Data
    {
        public string id { get; set; }
        public string created_at { get; set; }
        public string status { get; set; }
        public string payment_method_type { get; set; }
        public string redirect_url { get; set; }
        public string payment_link_id { get; set; }
    }
}