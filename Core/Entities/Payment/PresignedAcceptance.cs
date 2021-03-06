namespace Core.Entities.Payment
{
    public class PresignedAcceptance
    {
        public string acceptance_token { get; set; }
        public string permalink { get; set; }
        public string type { get; set; }
    }
}