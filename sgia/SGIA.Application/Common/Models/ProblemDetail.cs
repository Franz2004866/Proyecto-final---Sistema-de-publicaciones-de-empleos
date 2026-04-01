
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;

namespace SGIA.Application.Common.Models
{
    public class ProblemDetail
    {
        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("status")]
        public int Status { get; set; }

        [JsonPropertyName("detail")]
        public string Detail { get; set; } = string.Empty;

        [JsonPropertyName("instance")]
        public string? Instance { get; set; }

        [JsonPropertyName("timestamp")]
        public DateTime Timestamp { get; set; }

        [JsonPropertyName("errors")]
        public Dictionary<string, string[]>? Errors { get; set; }

        public static ProblemDetail Create(
            string title,
            string detail,
            int statusCode,
            string? instance = null,
            Dictionary<string, string[]>? errors = null)
        {
            return new ProblemDetail
            {
                Type = $"https://httpstatuses.com/{statusCode}",
                Title = title,
                Status = statusCode,
                Detail = detail,
                Instance = instance,
                Timestamp = DateTime.UtcNow,
                Errors = errors
            };
        }

        public static ProblemDetail ForValidation(Dictionary<string, string[]> errors, string instance)
        {
            return Create(
                "Validation Error",
                "One or more validation errors occurred.",
                StatusCodes.Status400BadRequest,
                instance,
                errors
            );
        }

        public static ProblemDetail ForNotFound(string entityName, string id, string instance)
        {
            return Create(
                "Resource Not Found",
                $"{entityName} with id '{id}' was not found.",
                StatusCodes.Status404NotFound,
                instance
            );
        }

        public static ProblemDetail ForForbidden(string instance)
        {
            return Create(
                "Access Forbidden",
                "You don't have permission to access this resource.",
                StatusCodes.Status403Forbidden,
                instance
            );
        }
    }
}
