
namespace SGIA.Application.Common.Interfaces
{
    public interface IAuditService
    {
        string GetCurrentUserId();
        string GetCurrentUserName();
        DateTime GetCurrentDateTime();
    }
}
