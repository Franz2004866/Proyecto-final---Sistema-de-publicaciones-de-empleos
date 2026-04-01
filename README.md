# SGIA - Sistema de Gestión de Inventario y Almacén

## Descripción

SGIA es una aplicación fullstack completa para la gestión de inventario y almacén. El sistema permite administrar productos, categorías, registrar movimientos de inventario (entradas y salidas), y generar reportes en tiempo real.

## Stack Tecnológico

### Backend

- **Framework:** .NET Core 10
- **Base de Datos:** PostgreSQL 18
- **Autenticación:** Keycloak 26
- **ORM:** Entity Framework Core
- **Arquitectura:** Clean Architecture (Domain, Application, Infrastructure, API)

### Frontend

- **Framework:** Angular 21
- **UI Library:** Angular Material
- **Gestión de Estado:** RxJS / Signals
- **Build:** Yarn + Vite
- **Servidor:** Nginx (Alpine)

### Infraestructura

- **Contenedores:** Docker + Docker Compose
- **Puertos:**
  | Servicio | Puerto |
  |----------|--------|
  | Frontend (Angular) | 42000 |
  | Backend (API) | 7193 |
  | Keycloak (Admin) | 8088 |
  | PostgreSQL | 5434 |

## Estructura del Proyecto

```
sgia-project/
├── compose.yaml              # Orquestación de servicios Docker
├── keycloak/                 # Configuración de realm y clientes
├── Scripts/                  # Scripts de base de datos
├── sgia/                     # Proyecto Backend .NET
│   ├── SGIA.API/            # Capa de presentación (Controllers)
│   ├── SGIA.Application/    # Capa de aplicación (Servicios, DTOs)
│   ├── SGIA.Domain/         # Capa de dominio (Entidades)
│   ├── SGIA.Infrastructure/ # Capa de infraestructura (Repositorios)
│   └── SGIA.Tests/          # Pruebas unitarias
└── sgia-front/              # Proyecto Frontend Angular
    ├── src/                  # Código fuente Angular
    ├── nginx.conf           # Configuración Nginx
    └── Dockerfile           # Build multi-stage
```

## Características

### Módulos Implementados

1. **Dashboard**
   - Resumen de productos, categorías y valor total de stock
   - Alertas de productos con stock bajo
   - Actividad reciente de movimientos

2. **Productos**
   - CRUD completo de productos
   - Filtrado por categoría
   - Búsqueda por código, nombre o descripción
   - Control de stock (actual vs mínimo)

3. **Categorías**
   - CRUD de categorías con color identificador
   - Estados activos/inactivos

4. **Movimientos**
   - Registro de entradas y salidas de inventario
   - Historial de movimientos con filtros
   - Validación de stock para salidas

5. **Reportes**
   - Valor de stock por producto y categoría
   - Productos con stock bajo
   - Resumen de movimientos
   - Exportación a CSV

## Requisitos Previos

- Docker Desktop (última versión)
- Git

## Pasos de Ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sgia-project
```

### 2. Levantar los servicios

```bash
docker compose up -d --build
```

### 3. Verificar que todos los servicios estén corriendo

```bash
docker ps
```

Deberían可见 4 servicios:

- `sgia_postgres` - Base de datos
- `sgia_keycloak` - Servidor de autenticación
- `sgia_webapi` - API backend
- `sgia_frontend` - Frontend Nginx

### 4. Acceder a la aplicación

| Servicio       | URL                           |
| -------------- | ----------------------------- |
| Frontend       | http://localhost:42000        |
| API            | http://localhost:7193         |
| Swagger UI     | http://localhost:7193/swagger |
| Keycloak Admin | http://localhost:8088         |

### 5. Credenciales Keycloak

- **Usuario:** admin
- **Contraseña:** admin

## Configuración de Desarrollo

### Variables de Entorno (Backend)

```yaml
ASPNETCORE_ENVIRONMENT: Development
ConnectionStrings__DefaultConnection: Host=postgres;Port=5432;Database=sgia_db;Username=postgres;Password=Lasin1234
Keycloak__Authority: http://keycloak:8080/realms/sgia-realm
Keycloak__Audience: backend-client
```

### Configuración Frontend

La aplicación usa proxy nginx para comunicar con la API:

- API: `http://webapi:5150/api/`
- Keycloak: `http://keycloak:8080/realms/`

## Detener los Servicios

```bash
docker compose down
```

Para eliminar también los volúmenes (base de datos):

```bash
docker compose down -v
```

## Notas Adicionales

- El backend está configurado para usar HTTP internamente (puerto 5150) mapeado al puerto externo 7193
- La redirección HTTPS está deshabilitada para el contenedor
- Los datos de la base de datos persisten en volúmenes Docker
- El frontend usa Angular Signals para gestión de estado reactiva

## Licencia

Este proyecto es para fines educativos y de demostración.
