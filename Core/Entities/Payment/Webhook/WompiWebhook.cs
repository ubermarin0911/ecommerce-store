using System;

namespace Core.Entities.Payment.Webhook
{
    public class WompiWebhook
    {
        public string @event { get; set; }
        public Data data { get; set; }
        public string environment { get; set; }
        public Signature signature { get; set; }
        public int timestamp { get; set; }
        public DateTime sent_at { get; set; }
    }
}