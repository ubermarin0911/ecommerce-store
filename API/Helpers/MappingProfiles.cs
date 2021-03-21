using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
            .ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
            .ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name))
            .ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());

            //Con ReverseMap nos aseguramos que se mapee desde el objeto origen al destino y viceversa.
            CreateMap<Core.Entities.Identity.Address, AddressDto>()
            .ForMember(d => d.Address_line_1, o => o.MapFrom(s => s.UserAddress))
            .ForMember(d => d.Phone_number, o => o.MapFrom(s => s.PhoneNumber))
            .ReverseMap()
            .ForMember(d => d.PhoneNumber, o => o.MapFrom(s => s.Phone_number))
            .ForMember(d => d.UserAddress, o => o.MapFrom(s => s.Address_line_1));

            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>()
                           .ForMember(d => d.PhoneNumber, o => o.MapFrom(s => s.Phone_number))
                           .ForMember(d => d.UserAddress, o => o.MapFrom(s => s.Address_line_1));

            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
            CreateMap<Order, OrderToReturnDto>();

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<OrderItemUrlResolver>());
        }
    }
}