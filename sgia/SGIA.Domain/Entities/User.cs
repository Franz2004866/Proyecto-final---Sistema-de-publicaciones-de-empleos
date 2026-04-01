using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SGIA.Domain.Entities
{
    public class User: BaseEntity
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string KeycloakId { get; set; } = string.Empty; // ID del usuario en Keycloak
    }
}
