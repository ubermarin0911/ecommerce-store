using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IProductService
    {
        Task<ProductData> GetProducts(ProductSpecParams productParams);
        Task<Product> GetProduct(int id);
        Task<IReadOnlyList<ProductBrand>> GetProductBrands();
        Task<IReadOnlyList<ProductType>> GetProductTypes();
    }
}