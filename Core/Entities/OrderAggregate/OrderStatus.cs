using System.Runtime.Serialization;

namespace Core.Entities.OrderAggregate
{
    public enum OrderStatus
    {
        [EnumMember(Value = "Pendiente")]
        Pending,
        [EnumMember(Value = "Pago recibido")]
        PaymentReceived,
        [EnumMember(Value = "Pago fallido")]
        PaymentFailed
    }
}
