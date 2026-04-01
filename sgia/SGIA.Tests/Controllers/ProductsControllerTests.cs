using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SGIA.API.Controllers;
using SGIA.Application.Common.Interfaces;
using SGIA.Application.DTOs;
using SGIA.Domain.Entities;

namespace SGIA.Tests.Controllers
{
    public class ProductsControllerTests
    {
        private readonly Mock<IGenericRepository<Product>> _mockRepository;
        private readonly Mock<IAuditService> _mockAuditService;
        private readonly Mock<IMapper> _mockMapper;
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            _mockRepository = new Mock<IGenericRepository<Product>>();
            _mockAuditService = new Mock<IAuditService>();
            _mockMapper = new Mock<IMapper>();
            _controller = new ProductsController(
                _mockRepository.Object,
                _mockAuditService.Object,
                _mockMapper.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkResult_WithListOfProducts()
        {
            var products = new List<Product>
            {
                new Product { Id = Guid.NewGuid(), Name = "Product 1", IsActive = true },
                new Product { Id = Guid.NewGuid(), Name = "Product 2", IsActive = true }
            };
            var productDtos = new List<ProductDto>
            {
                new ProductDto { Id = products[0].Id, Name = "Product 1", IsActive = true },
                new ProductDto { Id = products[1].Id, Name = "Product 2", IsActive = true }
            };

            _mockRepository.Setup(r => r.GetAllAsync(false)).ReturnsAsync(products);
            _mockMapper.Setup(m => m.Map<IEnumerable<ProductDto>>(products)).Returns(productDtos);

            var result = await _controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenProductDoesNotExist()
        {
            var productId = Guid.NewGuid();
            _mockRepository.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync((Product?)null);

            var result = await _controller.GetById(productId);

            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetById_ReturnsOkResult_WhenProductExists()
        {
            var productId = Guid.NewGuid();
            var product = new Product { Id = productId, Name = "Test Product" };
            var productDto = new ProductDto { Id = productId, Name = "Test Product" };

            _mockRepository.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync(product);
            _mockMapper.Setup(m => m.Map<ProductDto>(product)).Returns(productDto);

            var result = await _controller.GetById(productId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task Create_ReturnsCreatedAtAction_WhenModelIsValid()
        {
            var createDto = new CreateProductDto
            {
                Code = "P001",
                Name = "New Product",
                Description = "Description",
                UnitPrice = 100,
                CurrentStock = 10,
                MinimalStock = 5,
                Category = "Electronics"
            };

            var product = new Product
            {
                Id = Guid.NewGuid(),
                Code = createDto.Code,
                Name = createDto.Name
            };

            var productDto = new ProductDto
            {
                Id = product.Id,
                Code = createDto.Code,
                Name = createDto.Name
            };

            _mockMapper.Setup(m => m.Map<Product>(createDto)).Returns(product);
            _mockAuditService.Setup(a => a.GetCurrentDateTime()).Returns(DateTime.UtcNow);
            _mockAuditService.Setup(a => a.GetCurrentUserId()).Returns("test-user");
            _mockRepository.Setup(r => r.AddAsync(It.IsAny<Product>())).ReturnsAsync(product);
            _mockMapper.Setup(m => m.Map<ProductDto>(product)).Returns(productDto);

            var result = await _controller.Create(createDto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(201, createdResult.StatusCode);
            Assert.Equal(nameof(ProductsController.GetById), createdResult.ActionName);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenProductDoesNotExist()
        {
            var productId = Guid.NewGuid();
            var updateDto = new UpdateProductDto
            {
                Code = "P001",
                Name = "Updated Product",
                UnitPrice = 200,
                CurrentStock = 20,
                MinimalStock = 10,
                Category = "Electronics"
            };

            _mockRepository.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync((Product?)null);

            var result = await _controller.Update(productId, updateDto);

            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task Update_ReturnsOk_WhenProductExists()
        {
            var productId = Guid.NewGuid();
            var existingProduct = new Product { Id = productId, Name = "Old Product" };
            var updateDto = new UpdateProductDto
            {
                Code = "P001",
                Name = "Updated Product",
                Description = "Updated",
                UnitPrice = 200,
                CurrentStock = 20,
                MinimalStock = 10,
                Category = "Electronics"
            };
            var productDto = new ProductDto { Id = productId, Name = "Updated Product" };

            _mockRepository.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync(existingProduct);
            _mockMapper.Setup(m => m.Map(updateDto, existingProduct));
            _mockAuditService.Setup(a => a.GetCurrentDateTime()).Returns(DateTime.UtcNow);
            _mockAuditService.Setup(a => a.GetCurrentUserId()).Returns("test-user");
            _mockRepository.Setup(r => r.UpdateAsync(It.IsAny<Product>())).Returns(Task.CompletedTask);
            _mockMapper.Setup(m => m.Map<ProductDto>(existingProduct)).Returns(productDto);

            var result = await _controller.Update(productId, updateDto);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task Delete_ReturnsNoContent_WhenProductExists()
        {
            var productId = Guid.NewGuid();
            var product = new Product { Id = productId, Name = "Test Product" };

            _mockRepository.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync(product);
            _mockRepository.Setup(r => r.DisableAsync(It.IsAny<Product>())).Returns(Task.CompletedTask);

            var result = await _controller.Delete(productId);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenProductDoesNotExist()
        {
            var productId = Guid.NewGuid();
            _mockRepository.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync((Product?)null);

            var result = await _controller.Delete(productId);

            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}
