using System.Collections.Generic;

namespace Core.Entities.Payment.Webhook
{
    public class Signature
    {
        public List<string> properties { get; set; }
        public string checksum { get; set; }
    }
}