using System;
using System.Linq.Expressions;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrderByReferenceSpecification : BaseSpecification<Order>
    {
        public OrderByReferenceSpecification(string reference)
            : base(o => o.Reference == reference)
        {

        }
    }
}