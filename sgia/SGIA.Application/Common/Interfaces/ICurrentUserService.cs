namespace SGIA.Application.Common.Interfaces
{
    public interface ICurrentUserService
    {
        string? GetUserId();
        string? GetUsername();
        string? GetEmail();
        List<string> GetRoles();
        bool IsInRole(string role);
        bool IsAdmin();
    }
}
