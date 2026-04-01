# 🚀 Guía de Despliegue - SGIA con Keycloak

## Estructura del Proyecto

```
sgia/
├── SGIA.slnx
├── SGIA.API/          (Backend .NET 10)
├── SGIA.Application/  (Capa de aplicación)
├── SGIA.Domain/       (Capa de dominio)
├── SGIA.Infrastructure/ (Capa de infraestructura)
└── SGIA.Tests/       (Pruebas unitarias)
```

---

## ⚡ Pasos para Ejecutar

### 1. Prerrequisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| .NET SDK | 10.0 |
| PostgreSQL | 18.x |
| Docker (opcional) | Latest |

### 2. Configurar Base de Datos PostgreSQL

```sql
-- Crear base de datos
CREATE DATABASE sgia_db_dev;

-- Crear usuario
CREATE USER sgia_user WITH PASSWORD 'D3v310p34%.%';

-- Asignar permisos
GRANT ALL PRIVILEGES ON DATABASE sgia_db_dev TO sgia_user;
```

### 3. Configurar Keycloak

#### Opción A: Docker (Recomendado)
```bash
# Ejecutar Keycloak
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.0 start-dev
```

#### Opción B: Manual
1. Descargar Keycloak desde https://www.keycloak.org/downloads
2. Extraer y ejecutar: `bin/kc.bat start-dev`
3. Acceder a http://localhost:8080
4. Crear usuario admin

#### Configurar Realm en Keycloak
1. Ir a **Master** → **Create Realm**
2. Nombre: `sgia-realm`
3. Ir a **Clients** → **Create**
   - Client ID: `backend-client`
   - Client Protocol: `openid-connect`
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:42000/*`
   - Web Origins: `http://localhost:42000`
4. Ir **Credentials** → copiar **Secret**

### 4. Configurar appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=sgia_db_dev;Username=sgia_user;Password=D3v310p34%.%"
  },
  "Keycloak": {
    "Authority": "http://localhost:8080/realms/sgia-realm",
    "Audience": "backend-client"
  }
}
```

### 5. Ejecutar Migraciones

```bash
cd SGIA.API
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 6. Ejecutar el Proyecto

```bash
# Desarrollo
dotnet run --project SGIA.API

# La API estará disponible en: https://localhost:5001
# Swagger UI en: https://localhost:5001/swagger
```

---

## 🔐 Endpoints Protegidos

### Productos (Requiere Token JWT)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar productos |
| GET | `/api/products/{id}` | Obtener producto |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/{id}` | Actualizar producto |
| DELETE | `/api/products/{id}` | Eliminar producto |

### Obtener Token de Acceso

```bash
# Solicitud a Keycloak
curl -X POST http://localhost:8080/realms/sgia-realm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=backend-client" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "username=admin" \
  -d "password=admin"
```

### Ejemplo de Llamada Protegida

```bash
curl -X GET https://localhost:5001/api/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🧪 Ejecutar Pruebas Unitarias

```bash
# Ejecutar todos los tests
dotnet test

# Con coverage
dotnet test --collect:"XPlat Code Coverage"
```

---

## 📋 Configuración para Producción

### Variables de Entorno Recomendadas

```bash
# Base de datos
ConnectionStrings__DefaultConnection=Host=postgres;Port=5432;Database=sgia_prod;Username=sgia_user;Password=${DB_PASSWORD}

# Keycloak producción
Keycloak__Authority=https://keycloak.example.com/realms/sgia-realm
Keycloak__Audience=backend-client

# Seguridad
ASPNETCORE_ENVIRONMENT=Production
```

### Docker Compose Completo

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:18-alpine
    environment:
      POSTGRES_DB: sgia_db_dev
      POSTGRES_USER: sgia_user
      POSTGRES_PASSWORD: D3v310p34%.%
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  keycloak:
    image: quay.io/keycloak/keycloak:26.0
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8080:8080"

  api:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - keycloak

volumes:
  postgres_data:
```

---

## ✅ Verificación

1. **API**: Acceder a `https://localhost:5001/swagger`
2. **Keycloak**: Acceder a `http://localhost:8080/realms/sgia-realm`
3. **PostgreSQL**: Conectar con cualquier cliente SQL

---

## 📞 Solución de Problemas

| Problema | Solución |
|----------|----------|
| Error de conexión a PostgreSQL | Verificar que PostgreSQL esté ejecutándose y las credenciales sean correctas |
| Error 401 en endpoints | Verificar que el token JWT sea válido y no haya expirado |
| Error de CORS | Verificar configuración en `Program.cs` |
| Keycloak no responde | Verificar que el contenedor esté ejecutándose |
