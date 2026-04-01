using SGIA.Application.Common.Interfaces;
using SGIA.Domain.Entities;
using SGIA.Infrastructure.Data;

namespace SGIA.Infrastructure.Services
{
    public class DatabaseSeeder : IDatabaseSeeder
    {
        private readonly ApplicationDbContext _context;

        public DatabaseSeeder(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasSeededAsync()
        {
            return await Task.FromResult(_context.Products.Any() || _context.Categories.Any());
        }

        public async Task SeedAsync()
        {
            if (_context.Products.Any() || _context.Categories.Any())
                return;

            var now = DateTime.UtcNow;
            var systemUser = "system";

            var categories = new List<Category>
            {
                new Category
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000101"),
                    Name = "Electrónica",
                    Color = "#3498db",
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Category
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000102"),
                    Name = "Oficina",
                    Color = "#2ecc71",
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Category
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000103"),
                    Name = "Muebles",
                    Color = "#e74c3c",
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Category
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000104"),
                    Name = "Suministros",
                    Color = "#f39c12",
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Category
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000105"),
                    Name = "Herramientas",
                    Color = "#9b59b6",
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                }
            };

            _context.Categories.AddRange(categories);

            var products = new List<Product>
            {
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000201"),
                    Code = "ELEC-001",
                    Name = "Laptop HP Pavilion",
                    Description = "Laptop 15.6 pulgadas, 8GB RAM, 256GB SSD",
                    Category = "Electrónica",
                    UnitPrice = 549.99m,
                    CurrentStock = 15,
                    MinimalStock = 5,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000202"),
                    Code = "ELEC-002",
                    Name = "Monitor Samsung 24\"",
                    Description = "Monitor LED Full HD 1920x1080",
                    Category = "Electrónica",
                    UnitPrice = 149.99m,
                    CurrentStock = 8,
                    MinimalStock = 3,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000203"),
                    Code = "ELEC-003",
                    Name = "Teclado Mecánico RGB",
                    Description = "Teclado gamer con iluminación RGB",
                    Category = "Electrónica",
                    UnitPrice = 79.99m,
                    CurrentStock = 25,
                    MinimalStock = 10,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000204"),
                    Code = "ELEC-004",
                    Name = "Mouse Inalámbrico",
                    Description = "Mouse óptico inalámbrico 2.4GHz",
                    Category = "Electrónica",
                    UnitPrice = 29.99m,
                    CurrentStock = 3,
                    MinimalStock = 5,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000205"),
                    Code = "ELEC-005",
                    Name = "Webcam HD 1080p",
                    Description = "Cámara web Full HD con micrófono",
                    Category = "Electrónica",
                    UnitPrice = 59.99m,
                    CurrentStock = 12,
                    MinimalStock = 5,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000206"),
                    Code = "OFIC-001",
                    Name = "Escritorio Regulable",
                    Description = "Escritorio height adjustable 120x60cm",
                    Category = "Oficina",
                    UnitPrice = 299.99m,
                    CurrentStock = 7,
                    MinimalStock = 2,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000207"),
                    Code = "OFIC-002",
                    Name = "Silla Ergonómica",
                    Description = "Silla de oficina con soporte lumbar",
                    Category = "Oficina",
                    UnitPrice = 199.99m,
                    CurrentStock = 4,
                    MinimalStock = 5,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000208"),
                    Code = "OFIC-003",
                    Name = "Impressora Laser",
                    Description = "Impresora láser monochrome 40ppm",
                    Category = "Oficina",
                    UnitPrice = 249.99m,
                    CurrentStock = 6,
                    MinimalStock = 2,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000209"),
                    Code = "MUEB-001",
                    Name = "Estantería Metal 5 pisos",
                    Description = "Estantería industrial de metal 150x45x180cm",
                    Category = "Muebles",
                    UnitPrice = 89.99m,
                    CurrentStock = 20,
                    MinimalStock = 5,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000210"),
                    Code = "SUMI-001",
                    Name = "Resma de Papel A4",
                    Description = "Paquete 500 hojas papel blanco 80g",
                    Category = "Suministros",
                    UnitPrice = 4.99m,
                    CurrentStock = 100,
                    MinimalStock = 20,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000211"),
                    Code = "SUMI-002",
                    Name = "Bolígrafos Pack x10",
                    Description = "Pack de 10 bolígrafos azul",
                    Category = "Suministros",
                    UnitPrice = 3.99m,
                    CurrentStock = 50,
                    MinimalStock = 15,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000212"),
                    Code = "HERR-001",
                    Name = "Taladro Inalámbrico",
                    Description = "Taladro percutor battery 18V",
                    Category = "Herramientas",
                    UnitPrice = 129.99m,
                    CurrentStock = 8,
                    MinimalStock = 3,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = systemUser
                }
            };

            _context.Products.AddRange(products);

            await _context.SaveChangesAsync();
        }
    }
}
