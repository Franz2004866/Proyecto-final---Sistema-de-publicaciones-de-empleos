using System.Text.Json.Serialization;

namespace SGIA.Application.Common.Models
{
    public class ApiResponse<T>
    {
        [JsonPropertyName("status")]
        public int Status { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        public T? Data { get; set; }

        public static ApiResponse<T> Success(T data, string message = "", int statusCode = 200)
        {
            return new ApiResponse<T>
            {
                Status = statusCode,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse<T> Success(string message = "")
        {
            return new ApiResponse<T>
            {
                Status = 200,
                Message = message,
                Data = default
            };
        }
    }

    public class ApiResponse
    {
        [JsonPropertyName("status")]
        public int Status { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        public object? Data { get; set; }

        public static ApiResponse Success(object data, string message = "", int statusCode = 200)
        {
            return new ApiResponse
            {
                Status = statusCode,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse Success(string message = "")
        {
            return new ApiResponse
            {
                Status = 200,
                Message = message,
                Data = null
            };
        }
    }
}
