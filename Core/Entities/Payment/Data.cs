using System.Collections.Generic;

namespace Core.Entities.Payment
{
    public class Data
    {
        public int id { get; set; }
        public string name { get; set; }
        public string legal_name { get; set; }
        public string legal_id { get; set; }
        public string legal_id_type { get; set; }
        public string phone_number { get; set; }
        public bool active { get; set; }
        public string logo_url { get; set; }
        public string email { get; set; }
        public string contact_name { get; set; }
        public string public_key { get; set; }
        public List<string> accepted_payment_methods { get; set; }
        public List<string> accepted_currencies { get; set; }
        public PresignedAcceptance presigned_acceptance { get; set; }
    }
}