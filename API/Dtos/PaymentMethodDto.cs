namespace API.Dtos
{
    public class PaymentMethodDto
    {
        public string type { get; set; }
        public string token { get; set; }
        public int? installments { get; set; }
        public string phone_number { get; set; }
    }
}