using Microsoft.EntityFrameworkCore;
using SGIA.Application.Common.Interfaces;
using SGIA.Domain.Entities;
using SGIA.Infrastructure.Data;

namespace SGIA.Infrastructure.Repositories
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
