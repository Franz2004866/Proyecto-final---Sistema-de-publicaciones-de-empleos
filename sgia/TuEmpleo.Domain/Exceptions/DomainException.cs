
namespace SGIA.Domain.Exceptions
{
    public class DomainException : Exception
    {
        public string Code { get; }
        public string Title { get; }

        public DomainException(string title, string message, string code = "DOMAIN_ERROR")
            : base(message)
        {
            Title = title;
            Code = code;
        }
    }
}
