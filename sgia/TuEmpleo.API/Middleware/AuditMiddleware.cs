using System.Diagnostics;
using TuEmpleo.Infrastructure.Services;

namespace TuEmpleo.API.Middleware;

public class AuditMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuditMiddleware> _logger;

    public AuditMiddleware(RequestDelegate next, ILogger<AuditMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, ICurrentUserService currentUserService)
    {
        var stopwatch = Stopwatch.StartNew();
        var request = context.Request;

        var auditInfo = new
        {
            Timestamp = DateTime.UtcNow,
            Method = request.Method,
            Path = request.Path.Value,
            QueryString = request.QueryString.Value,
            UserId = currentUserService.GetUserId(),
            Username = currentUserService.GetUsername(),
            IpAddress = context.Connection.RemoteIpAddress?.ToString(),
            UserAgent = request.Headers.UserAgent.ToString()
        };

        try
        {
            await _next(context);
            
            stopwatch.Stop();
            
            auditInfo = auditInfo with { };
            
            _logger.LogInformation(
                "AUDIT: {Method} {Path} responded {StatusCode} in {ElapsedMs}ms by {Username} ({UserId}) from {IpAddress}",
                request.Method,
                request.Path.Value,
                context.Response.StatusCode,
                stopwatch.ElapsedMilliseconds,
                auditInfo.Username ?? "Anonymous",
                auditInfo.UserId ?? "N/A",
                auditInfo.IpAddress
            );
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            
            _logger.LogError(
                ex,
                "AUDIT ERROR: {Method} {Path} failed after {ElapsedMs}ms - {Error}",
                request.Method,
                request.Path.Value,
                stopwatch.ElapsedMilliseconds,
                ex.Message
            );
            
            throw;
        }
    }
}

public static class AuditMiddlewareExtensions
{
    public static IApplicationBuilder UseAuditMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AuditMiddleware>();
    }
}
