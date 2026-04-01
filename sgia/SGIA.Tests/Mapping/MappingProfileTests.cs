using AutoMapper;
using SGIA.Application.DTOs;
using SGIA.Application.Mapping;
using SGIA.Domain.Entities;

namespace SGIA.Tests.Mapping
{
    public class MappingProfileTests
    {
        private readonly IConfigurationProvider _configuration;
        private readonly IMapper _mapper;

        public MappingProfileTests()
        {
            _configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });
            _mapper = _configuration.CreateMapper();
        }

        [Fact]
        public void ShouldHaveValidConfiguration()
        {
            _configuration.AssertConfigurationIsValid();
        }

        [Fact]
        public void ShouldMap_Product_To_ProductDto()
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Code = "P001",
                Name = "Test Product",
                Description = "Description",
                UnitPrice = 100.50m,
                CurrentStock = 10,
                MinimalStock = 5,
                Category = "Electronics",
                ImageUrl = "https://example.com/image.jpg",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "test-user"
            };

            var result = _mapper.Map<ProductDto>(product);

            Assert.NotNull(result);
            Assert.Equal(product.Id, result.Id);
            Assert.Equal(product.Code, result.Code);
            Assert.Equal(product.Name, result.Name);
            Assert.Equal(product.Description, result.Description);
            Assert.Equal(product.UnitPrice, result.UnitPrice);
            Assert.Equal(product.CurrentStock, result.CurrentStock);
            Assert.Equal(product.MinimalStock, result.MinimalStock);
            Assert.Equal(product.Category, result.Category);
            Assert.Equal(product.ImageUrl, result.ImageUrl);
            Assert.Equal(product.IsActive, result.IsActive);
        }

        [Fact]
        public void ShouldMap_CreateProductDto_To_Product()
        {
            var createDto = new CreateProductDto
            {
                Code = "P001",
                Name = "New Product",
                Description = "New Description",
                UnitPrice = 200,
                CurrentStock = 15,
                MinimalStock = 3,
                Category = "Books",
                ImageUrl = "https://example.com/new.jpg"
            };

            var result = _mapper.Map<Product>(createDto);

            Assert.NotNull(result);
            Assert.Equal(createDto.Code, result.Code);
            Assert.Equal(createDto.Name, result.Name);
            Assert.Equal(createDto.Description, result.Description);
            Assert.Equal(createDto.UnitPrice, result.UnitPrice);
            Assert.Equal(createDto.CurrentStock, result.CurrentStock);
            Assert.Equal(createDto.MinimalStock, result.MinimalStock);
            Assert.Equal(createDto.Category, result.Category);
            Assert.Equal(createDto.ImageUrl, result.ImageUrl);
        }

        [Fact]
        public void ShouldMap_UpdateProductDto_To_Product()
        {
            var existingProduct = new Product
            {
                Id = Guid.NewGuid(),
                Code = "P001",
                Name = "Old Name",
                Description = "Old Description",
                UnitPrice = 50,
                CurrentStock = 5,
                MinimalStock = 1,
                Category = "Old Category"
            };

            var updateDto = new UpdateProductDto
            {
                Code = "P001",
                Name = "Updated Name",
                Description = "Updated Description",
                UnitPrice = 100,
                CurrentStock = 20,
                MinimalStock = 5,
                Category = "Updated Category"
            };

            _mapper.Map(updateDto, existingProduct);

            Assert.Equal(updateDto.Name, existingProduct.Name);
            Assert.Equal(updateDto.Description, existingProduct.Description);
            Assert.Equal(updateDto.UnitPrice, existingProduct.UnitPrice);
            Assert.Equal(updateDto.CurrentStock, existingProduct.CurrentStock);
            Assert.Equal(updateDto.MinimalStock, existingProduct.MinimalStock);
            Assert.Equal(updateDto.Category, existingProduct.Category);
        }

        [Fact]
        public void ShouldHandle_NullImageUrl_InCreateProductDto()
        {
            var createDto = new CreateProductDto
            {
                Code = "P001",
                Name = "Product Without Image",
                Description = "Description",
                UnitPrice = 100,
                CurrentStock = 10,
                MinimalStock = 5,
                Category = "Electronics",
                ImageUrl = null
            };

            var result = _mapper.Map<Product>(createDto);

            Assert.NotNull(result);
            Assert.Null(result.ImageUrl);
        }
    }
}
