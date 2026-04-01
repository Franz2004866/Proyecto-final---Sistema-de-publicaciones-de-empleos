namespace SGIA.Application.Common.Interfaces
{
    public interface IDatabaseSeeder
    {
        Task SeedAsync();
        Task<bool> HasSeededAsync();
    }
}
