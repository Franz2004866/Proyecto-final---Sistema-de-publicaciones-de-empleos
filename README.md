# TuEmpleo - Plataforma de Publicacion de Empleos

## Descripcion

TuEmpleo es una aplicacion fullstack completa para la publicacion y busqueda de empleos. El sistema permite a las empresas publicar ofertas laborales y a los postulantes aplicar a estas posiciones de manera eficiente.

## Stack Tecnologico

### Backend

- **Framework:** .NET Core 10
- **Base de Datos:** PostgreSQL 18.1
- **Autenticacion:** Keycloak 26.5.4
- **ORM:** Entity Framework Core
- **Arquitectura:** Clean Architecture (Domain, Application, Infrastructure, API)

### Frontend

- **Framework:** Angular 21 con soporte PWA
- **UI Library:** Angular Material
- **Gestion de Estado:** RxJS / Signals
- **Build:** Yarn + Vite
- **Servidor:** Nginx (Alpine)

### Infraestructura

- **Contenedores:** Docker + Docker Compose
- **Puertos:**
  | Servicio | Puerto |
  |----------|--------|
  | Frontend (Angular) | 42000 |
  | Backend (API) | 5150 |
  | Keycloak (Admin) | 8088 |
  | PostgreSQL | 5434 |

## Estructura del Proyecto

```
tuempleo-project/
├── compose.yaml              # Orquestacion de servicios Docker
├── keycloak/                # Configuracion de realm y clientes
├── Scripts/                 # Scripts de base de datos
├── sgia/                    # Proyecto Backend .NET (TuEmpleo.API)
│   ├── TuEmpleo.API/       # Capa de presentacion (Controllers)
│   ├── TuEmpleo.Application/ # Capa de aplicacion (Servicios, DTOs)
│   ├── TuEmpleo.Domain/    # Capa de dominio (Entidades)
│   ├── TuEmpleo.Infrastructure/ # Capa de infraestructura (Repositorios)
│   └── TuEmpleo.Tests/     # Pruebas unitarias
└── sgia-front/             # Proyecto Frontend Angular
    ├── src/                 # Codigo fuente Angular
    ├── nginx.conf           # Configuracion Nginx
    └── Dockerfile           # Build multi-stage
```

## Caracteristicas

### Modulos Implementados

1. **Inicio (Home)**
   - Pagina principal con empleos destacados
   - Categorias de trabajo
   - Estadisticas de la plataforma

2. **Empleos**
   - Lista de empleos con filtros
   - Detalle de empleo
   - Publicar nuevos empleos (empresas)
   - Editar y eliminar empleos

3. **Postulaciones**
   - Aplicar a empleos (postulantes)
   - Gestionar postulaciones (empresas)
   - Estados: Pendiente, En Revision, Entrevista, Aprobado, Rechazado

4. **Categorias**
   - CRUD de categorias de empleo
   - Colores e iconos personalizados

5. **Dashboard**
   - Estadisticas generales
   - Empleos recientes
   - Postulaciones recientes

## Requisitos Previos

- Docker Desktop (ultima version)
- Git

## Pasos de Ejecucion

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd tuempleo-project
```

### 2. Levantar los servicios

```bash
docker compose up -d
```

### 3. Verificar que todos los servicios esten corriendo

```bash
docker ps
```

Deberian verse 4 servicios:

- `tuempleo_postgres` - Base de datos
- `tuempleo_kc` - Servidor de autenticacion
- `tuempleo_webapi` - API backend
- `tuempleo_frontend` - Frontend Nginx

### 4. Acceder a la aplicacion

| Servicio       | URL                           |
| -------------- | ----------------------------- |
| Frontend       | http://localhost:42000        |
| API            | http://localhost:5150         |
| Swagger UI     | http://localhost:5150/swagger |
| Keycloak Admin | http://localhost:8088         |

### 5. Credenciales Keycloak

- **Usuario:** admin
- **Contrasena:** admin

## Configuracion de Desarrollo

### Variables de Entorno (Backend)

```yaml
ASPNETCORE_ENVIRONMENT: Development
ConnectionStrings__DefaultConnection: Host=postgres;Port=5432;Database=tuempleo_db;Username=postgres;Password=Lasin1234
Keycloak__Authority: http://keycloak:8080/realms/tuempleo-realm
Keycloak__Audience: backend-client
```

### Configuracion Frontend

La aplicacion usa proxy nginx para comunicar con la API:

- API: `http://webapi:5150/api/`
- Keycloak: `http://keycloak:8080/realms/`

## Detener los Servicios

```bash
docker compose down
```

Para eliminar tambien los volumenes (base de datos):

```bash
docker compose down -v
```

## Notas Adicionales

- El backend esta configurado para usar HTTP internamente (puerto 5150)
- La redireccion HTTPS esta deshabilitada para el contenedor
- Los datos de la base de datos persisten en volumenes Docker
- El frontend usa Angular Signals para gestion de estado reactiva
- Roles disponibles: admin, empresa, postulante

## Licencia

Este proyecto es para fines educativos y de demostracion.
