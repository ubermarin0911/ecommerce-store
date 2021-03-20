using System.Runtime.Serialization;

namespace Core.Entities.OrderAggregate
{
    public enum OrderStatus
    {
        [EnumMember(Value = "Transacción Pendiente")]
        Pending,
        [EnumMember(Value = "Transacción aprobada")]
        Approved,
        [EnumMember(Value = "Transacción rechazada")]
        Declined,
        [EnumMember(Value = "Transacción anulada")]
        Voided,
        [EnumMember(Value = "Error interno del método de pago respectivo")]
        Error
    }
}
