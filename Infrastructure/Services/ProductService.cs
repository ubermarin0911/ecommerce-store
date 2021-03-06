using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Product> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);

            var product = await _unitOfWork.Repository<Product>().GetEntityWithSpec(spec);

            return product;
        }

        public async Task<IReadOnlyList<ProductBrand>> GetProductBrands()
        {
            return await _unitOfWork.Repository<ProductBrand>().ListAllAsync();
        }

        public async Task<ProductData> GetProducts(ProductSpecParams productParams)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);

            var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            var totalItems = await _unitOfWork.Repository<Product>().CountAsync(countSpec);

            var products = await _unitOfWork.Repository<Product>().ListAsync(spec);

            var productsData = new ProductData
            {
                Products = products,
                TotalItems = totalItems
            };

            return productsData;
        }

        public async Task<IReadOnlyList<ProductType>> GetProductTypes()
        {
            return await _unitOfWork.Repository<ProductType>().ListAllAsync();
        }
    }
}