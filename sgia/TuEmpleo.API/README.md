# 📚 Guía para el Proyecto Final - Programación Web II

## Universidad Privada Domingo Savio
### Facultad de Ingeniería - Carrera de Ingeniería de Sistemas
### Sexto Semestre - Gestión 2026

---

## 📌 DATOS DEL PROYECTO

| Campo | Información |
|-------|-------------|
| **Módulo** | Programación Web II (SIS-0301) |
| **Docente** | [Nombre del Docente] |
| **Período** | 11 de marzo - 8 de abril 2026 |
| **Modalidad** | Presencial - Desarrollo por Equipos |
| **Tecnologías** | .NET Core 9, Angular 21, Keycloak v26, PostgreSQL 18 |

---

## 🎯 OBJETIVO DEL DOCUMENTO

El presente documento sirve como **guía base para el desarrollo del proyecto final** del módulo Programación Web II. Cada equipo de estudiantes deberá utilizar esta estructura para elaborar su propio documento de proyecto, adaptándolo a la problemática específica que haya elegido resolver.

---

## 📋 ESTRUCTURA DEL DOCUMENTO DE PROYECTO

### 1. PORTADA
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│ UNIVERSIDAD PRIVADA                                             │
│ DOMINGO SAVIO                                                   │
│                                                                 │
│ FACULTAD DE INGENIERÍA                                          │
│ CARRERA DE INGENIERÍA DE SISTEMAS                               │
│                                                                 │
│ ┌─────────────────┐                                             │
│ │ LOGO UPDS       │                                             │
│ └─────────────────┘                                             │
│                                                                 │
│ PROGRAMACIÓN WEB II                                             │
│ SEXTO SEMESTRE                                                  │
│                                                                 │
│ ┌─────────────────────────────────┐                             │
│ │ NOMBRE DEL PROYECTO             │                             │
│ └─────────────────────────────────┘                             │
│                                                                 │
│ SISTEMA DE [NOMBRE DEL SISTEMA]                                 │
│                                                                 │
│                                                                 │
│ ESTUDIANTES:                                                    │
│ • [Apellidos, Nombres] - CI: [N°]                               │
│ • [Apellidos, Nombres] - CI: [N°]                               │
│ • [Apellidos, Nombres] - CI: [N°]                               │
│ • [Apellidos, Nombres] - CI: [N°]                               │
│                                                                 │
│                                                                 │
│ DOCENTE: [Nombre del Docente]                                   │
│                                                                 │
│ La Paz - Bolivia                                                │
│ [Fecha de entrega]                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

---

### 2. ÍNDICE GENERAL

## TABLA DE CONTENIDO

1. INTRODUCCIÓN .................................................. 4
   1.1. Contexto General .......................................... 4
   1.2. Problemática .............................................. 5
   1.3. Justificación ............................................. 6
   1.4. Alcance y Limitaciones .................................... 7

2. OBJETIVOS ..................................................... 8
   2.1. Objetivo General ......................................... 8
   2.2. Objetivos Específicos .................................... 8

3. MARCO TEÓRICO ................................................. 9
   3.1. Arquitectura Limpia (Clean Architecture) ................. 9
   3.2. .NET Core 9 ............................................. 10
   3.3. Angular 21 y PWA ........................................ 11
   3.4. Keycloak y OAuth2 ....................................... 12
   3.5. PostgreSQL y UUID v7 .................................... 13

4. ANÁLISIS DEL SISTEMA ......................................... 14
   4.1. Requerimientos Funcionales .............................. 14
   4.2. Requerimientos No Funcionales ........................... 16
   4.3. Actores del Sistema ..................................... 17
   4.4. Casos de Uso ............................................ 18

5. DISEÑO DEL SISTEMA ........................................... 20
   5.1. Arquitectura del Sistema ................................ 20
   5.2. Diagrama de Componentes ................................. 21
   5.3. Modelo de Base de Datos ................................. 22
   5.4. Diccionario de Datos .................................... 24

6. IMPLEMENTACIÓN ............................................... 26
   6.1. Configuración del Entorno ............................... 26
   6.2. Estructura del Backend (Arquitectura Limpia) ............ 27
   6.3. Estructura del Frontend (Angular) ....................... 29
   6.4. Configuración de Keycloak ............................... 30
   6.5. Endpoints de la API ..................................... 31
   6.6. Componentes Principales del Frontend .................... 33

7. PRUEBAS ....................................................... 35
   7.1. Casos de Prueba ......................................... 35
   7.2. Resultados de Pruebas ................................... 37

8. CONCLUSIONES Y RECOMENDACIONES ............................... 38
   8.1. Conclusiones ............................................ 38
   8.2. Recomendaciones ......................................... 39
   8.3. Trabajos Futuros ........................................ 39

9. BIBLIOGRAFÍA ................................................. 40

10. ANEXOS ....................................................... 41
    10.1. Código Fuente (Repositorio GitHub) .................... 41
    10.2. Capturas de Pantalla .................................. 42
    10.3. Video Demostración .................................... 43
    10.4. Docker Compose ........................................ 44

## 1. INTRODUCCIÓN

### 1.1. Contexto General

En la actualidad, las organizaciones requieren herramientas tecnológicas que les permitan optimizar sus procesos operativos y mejorar la toma de decisiones. [NOMBRE DE LA ORGANIZACIÓN] es una [tipo de organización: empresa comercial / institución educativa / negocio local] que actualmente gestiona sus [procesos principales] de manera [manual / con herramientas básicas como Excel].

Esta situación ha generado diversas limitaciones como:
- Procesos lentos y propensos a errores humanos
- Falta de trazabilidad de las operaciones
- Información no disponible en tiempo real
- Dificultad para generar reportes y análisis

### 1.2. Problemática

El problema central identificado es la **falta de un sistema automatizado** que permita gestionar de manera eficiente y segura los procesos de [procesos clave de la organización].

**Subproblemas identificados:**

1. **Gestión de usuarios**: No existe un control de acceso adecuado que permita diferenciar roles y responsabilidades.

2. **Control de [entidad principal]**: La información de [productos/estudiantes/clientes] se encuentra desactualizada y sin una estructura definida.

3. **Registro de transacciones**: No se lleva un historial de las operaciones realizadas, dificultando la auditoría.

4. **Reportes**: La generación de reportes requiere trabajo manual y no es confiable.

### 1.3. Justificación

El desarrollo de este proyecto se justifica por:

| Tipo | Justificación |
|------|---------------|
| **Técnica** | Permite aplicar tecnologías modernas (.NET Core 9, Angular 21) siguiendo Arquitectura Limpia, garantizando un sistema mantenible y escalable. |
| **Operativa** | Automatiza procesos manuales, reduciendo tiempos de respuesta y minimizando errores. |
| **Económica** | Reduce costos operativos al optimizar recursos humanos y tiempo. |
| **Social** | Mejora la experiencia de usuarios y clientes al ofrecer un servicio más ágil y confiable. |

### 1.4. Alcance y Limitaciones

#### Alcance del Proyecto

| Módulo | Descripción |
|--------|-------------|
| Autenticación | Login, registro, recuperación de contraseña con Keycloak |
| Gestión de Usuarios | CRUD de usuarios, asignación de roles (ADMIN, USER) |
| Gestión de [Entidad 1] | CRUD completo de [productos/estudiantes/clientes] |
| Gestión de [Entidad 2] | CRUD completo de [categorías/materias/ventas] |
| Auditoría | Registro de operaciones CREATE, UPDATE, DELETE |
| Reportes | Mínimo 2 reportes con filtros y exportación |
| Seguridad | Autenticación OAuth2, autorización por roles |

#### Limitaciones

| Limitación | Descripción |
|------------|-------------|
| Tiempo | 4 semanas para desarrollo completo |
| Infraestructura | Desarrollo local con contenedores Docker |
| Integraciones | Sin integraciones con APIs externas adicionales |
| Escalabilidad | Sistema diseñado para uso interno de la organización |

## 2. OBJETIVOS

### 2.1. Objetivo General

Desarrollar un sistema web para [NOMBRE DE LA ORGANIZACIÓN] que permita gestionar de manera eficiente y segura los procesos de [procesos principales], utilizando .NET Core 9, Angular 21, Keycloak v26 y PostgreSQL 18, aplicando los principios de Arquitectura Limpia y buenas prácticas de desarrollo.

### 2.2. Objetivos Específicos

| N° | Objetivo Específico | Indicador de Logro |
|----|---------------------|-------------------|
| OE1 | Analizar los requerimientos funcionales y no funcionales del sistema | Documento de análisis aprobado por el docente |
| OE2 | Diseñar el modelo relacional de la base de datos utilizando UUID v7 | Diagrama Entidad-Relación entregado en la Semana 1 |
| OE3 | Implementar el backend con .NET Core 9 siguiendo Arquitectura Limpia | API REST funcional con documentación Swagger |
| OE4 | Implementar el frontend con Angular 21 como PWA | Interfaz responsiva con navegación completa |
| OE5 | Configurar Keycloak para autenticación y autorización | Sistema de login/registro funcional con roles ADMIN/USER |
| OE6 | Implementar auditoría para operaciones críticas | Registro de logs en base de datos con trazabilidad |
| OE7 | Realizar pruebas de funcionamiento y seguridad | Reporte de pruebas ejecutadas y resultados |
| OE8 | Documentar el proyecto y preparar defensa | Documentación completa y presentación final |

## 3. MARCO TEÓRICO

### 3.1. Arquitectura Limpia (Clean Architecture)

La Arquitectura Limpia, propuesta por Robert C. Martin, establece una organización del código en capas que separa las preocupaciones del dominio de la lógica de aplicación y la infraestructura.

**Principios fundamentales:**

┌─────────────────────────────────────────────────────────────┐
│ Capa de Presentación                                        │
│ (WebAPI - Controllers)                                      │                      
├─────────────────────────────────────────────────────────────┤
│ Capa de Aplicación                                          │
│ (Casos de uso, DTOs)                                        │
├─────────────────────────────────────────────────────────────┤
│ Capa de Dominio                                             │
│ (Entidades, Interfaces)                                     │
├─────────────────────────────────────────────────────────────┤
│ Capa de Infraestructura                                     │
│ (Repositorios, Base de Datos)                               │
└─────────────────────────────────────────────────────────────┘

**Beneficios:**
- Independencia de frameworks externos
- Facilidad de pruebas (testeabilidad)
- Independencia de la interfaz de usuario
- Independencia de la base de datos

### 3.2. .NET Core 9

.NET Core 9 es el framework de desarrollo de aplicaciones multiplataforma de Microsoft. Sus características principales son:

- **Rendimiento mejorado**: Una de las plataformas más rápidas para desarrollo web
- **Multiplataforma**: Funciona en Windows, Linux y macOS
- **Open Source**: Código abierto con comunidad activa
- **Entity Framework Core 9**: ORM moderno para acceso a datos
- **Minimal APIs**: Simplificación para endpoints básicos

### 3.3. Angular 21 y PWA

Angular es un framework de desarrollo frontend basado en TypeScript. La versión 21 incorpora:

- **Componentes independientes**: Mejor modularización
- **Signals**: Sistema reactivo de estado
- **Mejoras en rendimiento**: Bundling optimizado

**PWA (Progressive Web App)**:
- Funciona offline mediante Service Workers
- Instalable como aplicación nativa
- Actualizaciones automáticas
- Experiencia similar a app móvil

### 3.4. Keycloak y OAuth2

Keycloak es un Identity and Access Management (IAM) open source que proporciona:

- **Autenticación centralizada**: Single Sign-On (SSO)
- **Autorización basada en roles**: RBAC
- **Protocolos**: OAuth2, OpenID Connect, SAML
- **Administración de usuarios**: Interfaz gráfica para gestión

**Flujo de autenticación OAuth2:**
1. Usuario ingresa credenciales
2. Keycloak valida y genera JWT token
3. Token se envía en cada petición
4. Backend valida token con Keycloak
5. Se otorga acceso según roles

### 3.5. PostgreSQL y UUID v7

PostgreSQL es un sistema gestor de bases de datos relacional de código abierto.

**UUID v7**:
- Combina timestamp con valores aleatorios
- Ordenable cronológicamente (mejor rendimiento en índices)
- Único a nivel global
- Evita secuencias y vulnerabilidades de enumeración

**Estructura de UUID v7:**

48 bits timestamp	4 bits version	12 bits random	62 bits random

## 4. ANÁLISIS DEL SISTEMA

### 4.1. Requerimientos Funcionales

#### Módulo de Autenticación

| ID | Requerimiento | Descripción | Prioridad |
|----|---------------|-------------|-----------|
| RF-001 | Login | Usuario puede iniciar sesión con username/email y contraseña | Alta |
| RF-002 | Registro | Nuevo usuario puede registrarse en el sistema | Alta |
| RF-003 | Logout | Usuario puede cerrar sesión | Alta |
| RF-004 | Recuperación de contraseña | Usuario puede solicitar recuperación de contraseña | Media |
| RF-005 | Roles | Sistema maneja roles (ADMIN, USER) con permisos diferenciados | Alta |

#### Módulo de Gestión de [Entidad Principal]

| ID | Requerimiento | Descripción | Prioridad |
|----|---------------|-------------|-----------|
| RF-006 | Listar | Visualizar lista de [entidades] con filtros y paginación | Alta |
| RF-007 | Crear | Registrar nuevas [entidades] con validaciones | Alta |
| RF-008 | Editar | Modificar información de [entidades] existentes | Alta |
| RF-009 | Eliminar | Eliminar [entidades] (lógica o física) | Alta |
| RF-010 | Ver Detalle | Visualizar información completa de una [entidad] | Media |

#### Módulo de Auditoría

| ID | Requerimiento | Descripción | Prioridad |
|----|---------------|-------------|-----------|
| RF-011 | Registro | Registrar toda operación CREATE, UPDATE, DELETE | Alta |
| RF-012 | Visualización | Administrador puede ver log de auditoría | Alta |
| RF-013 | Filtros | Filtrar por usuario, fecha, tipo de operación | Media |

#### Módulo de Reportes

| ID | Requerimiento | Descripción | Prioridad |
|----|---------------|-------------|-----------|
| RF-014 | Reporte 1 | Reporte de [tipo] con filtros | Alta |
| RF-015 | Reporte 2 | Reporte de [tipo] con diferentes indicadores | Alta |
| RF-016 | Exportación | Exportar reportes a PDF o Excel | Media |

### 4.2. Requerimientos No Funcionales

| ID | Requerimiento | Descripción | Métrica |
|----|---------------|-------------|---------|
| RNF-001 | Seguridad | Autenticación OAuth2, contraseñas encriptadas, protección SQL injection | Sin vulnerabilidades críticas |
| RNF-002 | Rendimiento | Tiempo de respuesta de la API | < 2 segundos |
| RNF-003 | Disponibilidad | Sistema disponible durante horario de evaluación | 100% |
| RNF-004 | Mantenibilidad | Código documentado, arquitectura limpia | Estructura definida |
| RNF-005 | Usabilidad | Interfaz intuitiva con mensajes claros | Feedback del usuario |
| RNF-006 | Compatibilidad | Navegadores modernos | Chrome, Firefox, Edge |
| RNF-007 | Responsividad | Adaptación a diferentes dispositivos | Móvil, tablet, escritorio |

### 4.3. Actores del Sistema

| Actor | Descripción | Permisos |
|-------|-------------|----------|
| **ADMIN** | Administrador del sistema | • Acceso total al sistema<br>• Gestión de usuarios<br>• Visualización de auditoría<br>• Configuración del sistema |
| **USER** | Usuario regular | • Acceso a módulos asignados<br>• CRUD de entidades autorizadas<br>• Visualización de reportes<br>• Edición de perfil propio |

### 4.4. Casos de Uso

#### CU-01: Iniciar Sesión

| Elemento | Descripción |
|----------|-------------|
| **Actor** | Usuario no autenticado |
| **Precondición** | Usuario registrado en Keycloak |
| **Flujo principal** | 1. Usuario ingresa username/email y contraseña<br>2. Sistema valida credenciales con Keycloak<br>3. Sistema recibe JWT token<br>4. Sistema redirige al dashboard |
| **Postcondición** | Usuario autenticado con sesión iniciada |
| **Flujo alternativo** | Credenciales incorrectas → mensaje de error |

#### CU-02: Gestionar [Entidad]

| Elemento | Descripción |
|----------|-------------|
| **Actor** | ADMIN / USER |
| **Precondición** | Usuario autenticado |
| **Flujo principal** | 1. Usuario accede al módulo<br>2. Sistema muestra lista de [entidades]<br>3. Usuario selecciona acción (crear/editar/eliminar)<br>4. Sistema valida datos<br>5. Sistema registra en BD y en auditoría<br>6. Sistema muestra mensaje de confirmación |
| **Postcondición** | [Entidad] modificada en el sistema |

## 5. DISEÑO DEL SISTEMA

### 5.1. Arquitectura del Sistema

El sistema sigue una Arquitectura Limpia con 4 capas principales:

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENTE (Browser)                                                   │
│ Angular 21 + PWA                                                    │
└─────────────────────────────────────────────────────────────────────┘
│
│ HTTPS / HTTP
▼
┌─────────────────────────────────────────────────────────────────────┐
│ CAPA DE PRESENTACIÓN                                                │
│ WebAPI (.NET Core 9 - Controllers)                                  │
│ • Endpoints RESTful • Middleware • Filters                          │
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│ CAPA DE APLICACIÓN                                                  │
│ (Application - Services)                                            │
│ • Casos de uso • DTOs • Mappings                                    │                
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│ CAPA DE DOMINIO                                                     │
│ (Domain - Entities)                                                 │
│ • Entidades de negocio • Interfaces • Enums                         │
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│ CAPA DE INFRAESTRUCTURA                                             │
│ (Infrastructure - Repositories)                                     │
│ • Acceso a datos • DbContext • Keycloak Client                      │
└─────────────────────────────────────────────────────────────────────┘
│
┌───────────────────────┼───────────────────────┐
▼ ▼ ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ PostgreSQL 18     │ │ Keycloak 26       │ │ Docker/Podman     │
│ • UUID v7         │ │ • Autenticación   │ │ • Contenedores    │
│ • Datos           │ │ • Roles           │ │ • Orquestación    │
└───────────────────┘ └───────────────────┘ └───────────────────┘

### 5.2. Diagrama de Base de Datos

┌─────────────────┐ ┌─────────────────┐
│ Usuarios        │ │ UsuarioRoles    │
├─────────────────┤ ├─────────────────┤
│ id (UUID) PK    │<│ id (UUID) PK    │
│ nombre          │ │ usuario_id (FK) │
│ apellido        │ │ rol             │
│ email (U)       │ │ keycloak_role_id│
│ keycloak_id (U) │ │ activo          │
│ username (U)    │ │ fecha_creacion  │
│ activo          │ └─────────────────┘
│ fecha_creacion  │
└─────────────────┘
│
│ 1
▼
┌─────────────────┐ ┌─────────────────┐
│ Auditorias      │ │ Productos       │
├─────────────────┤ ├─────────────────┤
│ id (UUID) PK    │ │ id (UUID) PK    │
│ usuario_id (FK) │ │ codigo (U)      │
│ accion          │ │ nombre          │
│ entidad         │ │ descripcion     │
│ entidad_id      │ │ precio          │
│ datos_anteriores│<│ stock           │
│ datos_nuevos    │ │ categoria_id(FK)│
│ ip_address      │ │ imagen_url      │
│ fecha_creacion  │ │ activo          │
│ exitoso         │ │ fecha_creacion  │
└─────────────────┘ └─────────────────┘
│
│ N
▼
┌─────────────────┐
│ Categorias      │
├─────────────────┤
│ id (UUID) PK    │
│ nombre (U)      │
│ descripcion     │
│ activo          │
│ fecha_creacion  │
└─────────────────┘


### 5.3. Diccionario de Datos

#### Tabla: Usuarios

| Campo | Tipo | Longitud | Descripción | Restricciones |
|-------|------|----------|-------------|---------------|
| Id | UUID | - | Identificador único | PK, Default: gen_random_uuid() |
| Nombre | VARCHAR | 100 | Nombres del usuario | NOT NULL |
| Apellido | VARCHAR | 100 | Apellidos del usuario | NOT NULL |
| Email | VARCHAR | 255 | Correo electrónico | NOT NULL, UNIQUE |
| KeycloakId | VARCHAR | 255 | ID en Keycloak | NOT NULL, UNIQUE |
| Username | VARCHAR | 50 | Nombre de usuario | UNIQUE |
| Activo | BOOLEAN | - | Estado del usuario | DEFAULT TRUE |
| FechaCreacion | TIMESTAMP | - | Fecha de registro | DEFAULT CURRENT_TIMESTAMP |
| FechaModificacion | TIMESTAMP | - | Fecha de última modificación | NULLABLE |

#### Tabla: Auditorias

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| Id | UUID | Identificador único | PK |
| UsuarioId | UUID | Usuario que realizó la acción | FK → Usuarios(Id) |
| Accion | VARCHAR(50) | Tipo de operación (CREATE, UPDATE, DELETE, LOGIN) | NOT NULL |
| Entidad | VARCHAR(100) | Nombre de la entidad afectada | NOT NULL |
| EntidadId | VARCHAR(50) | ID de la entidad afectada | |
| DatosAnteriores | JSONB | Datos antes del cambio (en formato JSON) | |
| DatosNuevos | JSONB | Datos después del cambio (en formato JSON) | |
| IpAddress | VARCHAR(50) | Dirección IP del usuario | |
| FechaCreacion | TIMESTAMP | Fecha y hora de la acción | DEFAULT CURRENT_TIMESTAMP |
| Exitoso | BOOLEAN | Indica si la operación fue exitosa | DEFAULT TRUE |

## 6. IMPLEMENTACIÓN

### 6.1. Configuración del Entorno

#### Requisitos Previos

| Herramienta | Versión | Comando de verificación |
|-------------|---------|------------------------|
| .NET SDK | 9.0 | `dotnet --version` |
| Node.js | 20.x | `node --version` |
| Yarn | 1.22 | `yarn --version` |
| Docker | Latest | `docker --version` |
| PostgreSQL | 18 | `psql --version` |

#### Variables de Entorno (.env)

env
# Configuración del Proyecto
PROYECTO_NOMBRE=[nombre_proyecto]
PROYECTO_DB=[nombre_base_datos]

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=[nombre_base_datos]
DB_USER=admin
DB_PASSWORD=Admin123*

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=Admin123*
KEYCLOAK_REALM=[nombre_realm]

# Backend
ASPNETCORE_ENVIRONMENT=Development
BACKEND_PORT=5000

# Frontend
FRONTEND_PORT=4200

### 6.2. Estructura del Backend (Arquitectura Limpia)

backend/src/
├── Domain/                           # Capa de Dominio - Clases Puras
│   ├── Entities/
│   │   ├── Base/
│   │   │   └── BaseEntity.cs        # Entidad base con UUID, fechas
│   │   ├── Usuario.cs
│   │   ├── Producto.cs
│   │   ├── Categoria.cs
│   │   └── Auditoria.cs
│   ├── Enums/
│   │   └── Roles.cs
│   └── Interfaces/
│       └── Repositories/
│           ├── IGenericRepository.cs
│           └── IAuditoriaRepository.cs
│
├── Application/                      # Capa de Aplicación
│   ├── DTOs/
│   │   ├── Common/
│   │   │   ├── ApiResponse.cs        # Formato de respuesta exitosa
│   │   │   └── ErrorResponse.cs      # Formato de error RFC 7802
│   │   ├── Producto/
│   │   │   ├── ProductoRequestDTO.cs
│   │   │   └── ProductoResponseDTO.cs
│   │   └── Usuario/
│   │       ├── UsuarioRequestDTO.cs
│   │       ├── UsuarioResponseDTO.cs
│   │       └── LoginDTO.cs
│   ├── Interfaces/
│   │   ├── IProductoService.cs
│   │   └── IUsuarioService.cs
│   ├── Services/
│   │   ├── ProductoService.cs
│   │   └── UsuarioService.cs
│   ├── Mappings/
│   │   └── MappingProfile.cs
│   └── Validators/
│       ├── ProductoValidator.cs
│       └── UsuarioValidator.cs
│
├── Infrastructure/                   # Capa de Infraestructura
│   ├── Persistence/
│   │   ├── Context/
│   │   │   └── ApplicationDbContext.cs
│   │   ├── Repositories/
│   │   │   ├── GenericRepository.cs
│   │   │   └── AuditoriaRepository.cs
│   │   ├── Configurations/
│   │   │   ├── ProductoConfiguration.cs
│   │   │   └── UsuarioConfiguration.cs
│   │   └── Migrations/
│   ├── Identity/
│   │   ├── Keycloak/
│   │   │   ├── KeycloakAuthService.cs
│   │   │   └── KeycloakConfig.cs
│   │   └── Jwt/
│   │       └── JwtService.cs
│   └── Extensions/
│       └── ServiceExtensions.cs
│
└── WebAPI/                          # Capa de Presentación
    ├── Controllers/
    │   └── v1/
    │       ├── AuthController.cs
    │       ├── ProductosController.cs
    │       ├── UsuariosController.cs
    │       └── AuditoriaController.cs
    ├── Middleware/
    │   ├── ErrorHandlingMiddleware.cs   # Manejo global de errores
    │   └── AuditMiddleware.cs           # Registro de auditoría
    ├── Filters/
    │   └── ApiResponseFilter.cs
    ├── Program.cs
    ├── appsettings.json
    └── appsettings.Development.json

### 6.3. Estructura del Frontend (Angular 21)
frontend/src/
├── app/
│   ├── core/                         # Funcionalidad central
│   │   ├── guards/
│   │   │   ├── auth.guard.ts         # Protección de rutas
│   │   │   └── role.guard.ts         # Protección por roles
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts   # Inyección de token
│   │   │   └── error.interceptor.ts  # Manejo de errores
│   │   ├── services/
│   │   │   ├── auth.service.ts       # Autenticación con Keycloak
│   │   │   ├── api.service.ts        # Peticiones HTTP
│   │   │   └── notification.service.ts # SweetAlert2
│   │   └── models/
│   │       ├── api-response.model.ts
│   │       └── usuario.model.ts
│   │
│   ├── features/                     # Módulos funcionales
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   └── login.component.css
│   │   │   └── register/
│   │   │       └── ...
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.ts
│   │   │   ├── dashboard.component.html
│   │   │   └── dashboard.component.css
│   │   ├── productos/
│   │   │   ├── producto-list/
│   │   │   ├── producto-form/
│   │   │   └── producto-detail/
│   │   ├── categorias/
│   │   │   └── ...
│   │   └── reportes/
│   │       └── ...
│   │
│   └── shared/                       # Componentes compartidos
│       ├── components/
│       │   ├── navbar/
│       │   └── footer/
│       └── pipes/
│
├── assets/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── index.html
├── main.ts
├── manifest.webmanifest              # Configuración PWA
├── package.json
└── yarn.lock

### 6.4. Endpoints (Sugerencia de estructura)

Autenticación (/api/v1/auth)
Método	Endpoint	Descripción	Roles
POST	/login	Iniciar sesión	Público
POST	/register	Registrar nuevo usuario	Público
POST	/refresh	Refrescar token	Autenticado
POST	/logout	Cerrar sesión	Autenticado
Productos (/api/v1/productos)
Método	Endpoint	Descripción	Roles
GET	/	Listar productos	ADMIN, USER
GET	/{id}	Obtener producto por ID	ADMIN, USER
POST	/	Crear producto	ADMIN, USER
PUT	/{id}	Actualizar producto	ADMIN, USER
DELETE	/{id}	Eliminar producto	ADMIN
GET	/categoria/{categoriaId}	Productos por categoría	ADMIN, USER
Usuarios (/api/v1/usuarios)
Método	Endpoint	Descripción	Roles
GET	/	Listar usuarios	ADMIN
GET	/{id}	Obtener usuario	ADMIN
POST	/	Crear usuario	ADMIN
PUT	/{id}	Actualizar usuario	ADMIN
DELETE	/{id}	Eliminar usuario	ADMIN
Auditoría (/api/v1/auditoria)
Método	Endpoint	Descripción	Roles
GET	/	Listar auditoría	ADMIN
GET	/usuario/{usuarioId}	Auditoría por usuario	ADMIN
GET	/fechas	Auditoría por rango de fechas	ADMIN

### 6.5. Formatos de respuesta

Respuesta Exitosa (RFC 7802 adaptado)

{
    "status": 200,
    "message": "Operación exitosa",
    "data": {
        "id": "0194d8b2-3e2a-7f4b-8c9d-1a2b3c4d5e6f",
        "nombre": "Laptop Gamer",
        "precio": 1200.00
    }
}

Respuesta de Error

{
    "detail": "El producto con el código 'PROD001' ya existe",
    "instance": "/api/v1/productos",
    "status": 409,
    "title": "Conflicto de datos",
    "timestamp": "2026-03-15T10:30:00Z"
}

## 7. PRUEBAS

### 7.1. Casos de Prueba

#### Pruebas de Autenticación

| ID | Caso de Prueba | Entrada Esperada | Resultado Esperado | Estado |
|----|----------------|------------------|-------------------|--------|
| P-01 | Login exitoso | username: admin, password: Admin123* | Token JWT, redirección a dashboard | ✅ OK |
| P-02 | Login fallido | username: admin, password: incorrecta | Mensaje de error, código 401 | ✅ OK |
| P-03 | Registro exitoso | datos válidos | Usuario creado, redirección a login | ✅ OK |
| P-04 | Acceso sin token | Endpoint protegido | Código 401 Unauthorized | ✅ OK |
| P-05 | Acceso con token expirado | Token expirado | Código 401 Unauthorized | ✅ OK |

#### Pruebas de Autorización

| ID | Caso de Prueba | Usuario | Acción | Resultado Esperado | Estado |
|----|----------------|---------|--------|-------------------|--------|
| P-06 | ADMIN crea usuario | admin | POST /usuarios | 201 Created | ✅ OK |
| P-07 | USER crea usuario | usuario1 | POST /usuarios | 403 Forbidden | ✅ OK |
| P-08 | ADMIN elimina producto | admin | DELETE /productos/{id} | 204 No Content | ✅ OK |
| P-09 | USER elimina producto | usuario1 | DELETE /productos/{id} | 403 Forbidden | ✅ OK |
| P-10 | ADMIN ve auditoría | admin | GET /auditoria | 200 OK | ✅ OK |
| P-11 | USER ve auditoría | usuario1 | GET /auditoria | 403 Forbidden | ✅ OK |

#### Pruebas de CRUD Productos

| ID | Caso de Prueba | Entrada | Resultado Esperado | Estado |
|----|----------------|---------|-------------------|--------|
| P-12 | Crear producto válido | {nombre:"Laptop", precio:1200} | 201 Created, UUID generado | ✅ OK |
| P-13 | Crear producto con código duplicado | código existente | 409 Conflict, mensaje error | ✅ OK |
| P-14 | Listar productos | - | 200 OK, array de productos | ✅ OK |
| P-15 | Actualizar producto | datos válidos | 200 OK, datos actualizados | ✅ OK |
| P-16 | Eliminar producto | ID válido | 204 No Content | ✅ OK |
| P-17 | Buscar producto inexistente | ID inválido | 404 Not Found | ✅ OK |

#### Pruebas de Auditoría

| ID | Caso de Prueba | Acción | Resultado Esperado | Estado |
|----|----------------|--------|-------------------|--------|
| P-18 | Registro CREATE | Crear producto | Registro en Auditorias con datos_nuevos | ✅ OK |
| P-19 | Registro UPDATE | Actualizar producto | Registro con datos_anteriores y datos_nuevos | ✅ OK |
| P-20 | Registro DELETE | Eliminar producto | Registro con datos_anteriores | ✅ OK |
| P-21 | Filtro por usuario | GET /auditoria?usuarioId | Registros solo del usuario | ✅ OK |
| P-22 | Filtro por fecha | GET /auditoria?fechaInicio | Registros en rango | ✅ OK |

### 7.2. Resultados de Pruebas

| Métrica | Resultado | Cumplimiento |
|---------|-----------|--------------|
| Total de pruebas | 22 | 100% |
| Pruebas exitosas | 22 | 100% |
| Pruebas fallidas | 0 | 0% |
| Tiempo promedio respuesta API | 250ms | < 2s ✅ |
| Cobertura de código | 85% | > 70% ✅ |
| Vulnerabilidades críticas | 0 | ✅ |

## 8. CONCLUSIONES Y RECOMENDACIONES

### 8.1. Conclusiones

El desarrollo del proyecto ha permitido:

1. **Aplicación práctica de Arquitectura Limpia**: Se logró implementar una separación clara de responsabilidades en 4 capas, facilitando el mantenimiento y la escalabilidad del sistema.

2. **Integración exitosa de tecnologías modernas**: La combinación de .NET Core 9, Angular 21, Keycloak v26 y PostgreSQL 18 demostró ser efectiva para construir aplicaciones web robustas y seguras.

3. **Cumplimiento de objetivos**: Todos los requerimientos funcionales y no funcionales establecidos fueron cumplidos satisfactoriamente.

4. **Gestión de usuarios centralizada**: Keycloak proporcionó una solución completa para autenticación y autorización, con administración de roles y usuarios.

5. **Auditoría implementada**: El sistema registra todas las operaciones críticas, proporcionando trazabilidad completa.

6. **Experiencia de usuario**: La implementación de PWA y SweetAlert2 mejoró significativamente la experiencia de usuario.

### 8.2. Recomendaciones

| N° | Recomendación | Beneficio |
|----|---------------|-----------|
| 1 | Implementar pruebas automatizadas (unitarias e integración) | Mayor confiabilidad y detección temprana de errores |
| 2 | Agregar caché con Redis | Mejorar rendimiento en consultas frecuentes |
| 3 | Implementar CI/CD con GitHub Actions | Automatizar despliegues y pruebas |
| 4 | Agregar logging con Serilog a archivos y base de datos | Mejor trazabilidad y depuración |
| 5 | Implementar notificaciones en tiempo real con SignalR | Mejorar interacción del usuario |
| 6 | Desplegar en la nube (Azure, AWS) | Disponibilidad 24/7 |

### 8.3. Trabajos Futuros

- **Módulo de reportes avanzados**: Dashboard con gráficos interactivos
- **Notificaciones por email**: Alertas automáticas basadas en eventos
- **Aplicación móvil nativa**: Desarrollar versión móvil con Ionic
- **Integración con pasarelas de pago**: Para sistemas de ventas
- **Módulo de análisis predictivo**: Utilizar IA para predicciones de stock/ventas

## 9. BIBLIOGRAFÍA

### Libros

- Martin, R. C. (2018). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
- Freeman, A. (2024). *Pro ASP.NET Core 9*. Apress.
- Seshadri, S. (2023). *Angular: Up and Running*. O'Reilly Media.
- Duckett, J. (2022). *HTML and CSS: Design and Build Websites*. Wiley.

### Documentación Oficial

- Microsoft. (2026). *.NET Core 9 Documentation*. https://learn.microsoft.com/en-us/dotnet/core/
- Google. (2026). *Angular Documentation*. https://angular.dev/
- Keycloak Team. (2026). *Keycloak Documentation*. https://www.keycloak.org/documentation
- PostgreSQL Global Development Group. (2026). *PostgreSQL 18 Documentation*. https://www.postgresql.org/docs/

### Artículos y Recursos

- "UUID v7: The New Standard for Time-Ordered Identifiers" - PostgreSQL Blog, 2025
- "Implementing Clean Architecture in .NET 9" - Microsoft Dev Blogs, 2026
- "Progressive Web Apps: Best Practices" - Google Developers, 2025
- "Keycloak Integration with Angular" - Medium, 2025

## 10. ANEXOS

### 10.1. Enlace al Repositorio GitHub


### 10.2. Capturas de Pantalla

#### Pantalla de Login
![Login](screenshots/login.png)

#### Dashboard Principal
![Dashboard](screenshots/dashboard.png)

#### Listado de Productos
![Productos](screenshots/productos.png)

#### Formulario de Productos
![Producto Form](screenshots/producto-form.png)

#### Auditoría del Sistema
![Auditoria](screenshots/auditoria.png)

#### Reportes
![Reportes](screenshots/reportes.png)

### 10.3. Video Demostración

[Enlace al video en YouTube](https://youtu.be/[video-id])

### 10.4. Archivo docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:18-alpine
    container_name: postgres-${PROYECTO_NOMBRE}
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  keycloak:
    image: quay.io/keycloak/keycloak:26.0.5
    container_name: keycloak-${PROYECTO_NOMBRE}
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/${DB_NAME}
      KC_DB_USERNAME: ${DB_USER}
      KC_DB_PASSWORD: ${DB_PASSWORD}
      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
      KC_HOSTNAME: localhost
      KC_HTTP_ENABLED: true
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - app-network
    command: ["start-dev"]

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: backend-${PROYECTO_NOMBRE}
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ASPNETCORE_URLS: http://+:5000
      ConnectionStrings__DefaultConnection: Host=postgres;Port=5432;Database=${DB_NAME};Username=${DB_USER};Password=${DB_PASSWORD}
      Keycloak__Authority: http://keycloak:8080/realms/${KEYCLOAK_REALM}
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
      keycloak:
        condition: service_started
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend-${PROYECTO_NOMBRE}
    ports:
      - "4200:80"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:

  
---

Este README.md servirá como documento base para que los estudiantes estructuren su proyecto final. Contiene:

✅ **Estructura completa** con todos los capítulos necesarios
✅ **Instrucciones claras** para cada sección
✅ **Ejemplos concretos** de implementación
✅ **Plantillas de código** para guiar el desarrollo
✅ **Formato profesional** listo para presentar

Los estudiantes solo deberán adaptar los contenidos según el problema específico que hayan elegido resolver, manteniendo la estructura y formato propuesto.