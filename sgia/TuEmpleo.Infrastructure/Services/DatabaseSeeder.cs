using TuEmpleo.Domain.Entities;
using TuEmpleo.Infrastructure.Data;

namespace TuEmpleo.Infrastructure.Services
{
    public interface IDatabaseSeeder
    {
        Task<bool> HasSeededAsync();
        Task SeedAsync();
    }

    public class DatabaseSeeder : IDatabaseSeeder
    {
        private readonly AppDbContext _context;

        public DatabaseSeeder(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasSeededAsync()
        {
            return await Task.FromResult(_context.Usuarios.Any());
        }

        public async Task SeedAsync()
        {
            if (_context.Usuarios.Any())
                return;

            var now = DateTime.UtcNow;
            var systemUser = "system";

            // ==================== CATEGORÍAS ====================
            var categorias = new List<CategoriaEmpleo>
            {
                new() { Nombre = "Tecnología", Descripcion = "Empleos en desarrollo de software, IT y sistemas", Color = "#3B82F6", Icono = "computer", Activo = true, FechaCreacion = now, CreadoPor = systemUser },
                new() { Nombre = "Marketing", Descripcion = "Empleos en marketing digital, publicidad y ventas", Color = "#10B981", Icono = "campaign", Activo = true, FechaCreacion = now, CreadoPor = systemUser },
                new() { Nombre = "Administración", Descripcion = "Empleos en gestión empresarial y administración", Color = "#F59E0B", Icono = "business", Activo = true, FechaCreacion = now, CreadoPor = systemUser },
                new() { Nombre = "Recursos Humanos", Descripcion = "Empleos en reclutamiento y gestión de personal", Color = "#EF4444", Icono = "people", Activo = true, FechaCreacion = now, CreadoPor = systemUser },
                new() { Nombre = "Diseño", Descripcion = "Empleos en diseño gráfico, UX/UI y multimedia", Color = "#8B5CF6", Icono = "palette", Activo = true, FechaCreacion = now, CreadoPor = systemUser },
                new() { Nombre = "Finanzas", Descripcion = "Empleos en contabilidad, auditoría y finanzas", Color = "#06B6D4", Icono = "account_balance", Activo = true, FechaCreacion = now, CreadoPor = systemUser },
                new() { Nombre = "Ingeniería", Descripcion = "Empleos en ingeniería civil, mecánica y eléctrica", Color = "#EC4899", Icono = "engineering", Activo = true, FechaCreacion = now, CreadoPor = systemUser },
                new() { Nombre = "Educación", Descripcion = "Empleos en enseñanza y formación académica", Color = "#14B8A6", Icono = "school", Activo = true, FechaCreacion = now, CreadoPor = systemUser }
            };

            _context.CategoriasEmpleo.AddRange(categorias);
            await _context.SaveChangesAsync();

            // ==================== EMPRESA REAL DE KEYCLOAK ====================
            var empresaBoliviaTech = new Usuario
            {
                Nombre = "Bolivia",
                Apellido = "Tech Solutions",
                Email = "contacto@boliviatech.bo",
                Telefono = "+591 2 1234567",
                Ubicacion = "La Paz, Bolivia",
                Habilidades = "Desarrollo de software, consultoría tecnológica, soluciones empresariales",
                KeycloakId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Rol = TipoRol.Empresa,
                Activo = true,
                FechaCreacion = now,
                CreadoPor = systemUser
            };

            _context.Usuarios.Add(empresaBoliviaTech);
            await _context.SaveChangesAsync();

            var empresaId = empresaBoliviaTech.Id;
            var catTecnologia = categorias.First(c => c.Nombre == "Tecnología").Id;
            var catMarketing = categorias.First(c => c.Nombre == "Marketing").Id;
            var catDiseño = categorias.First(c => c.Nombre == "Diseño").Id;
            var catAdministracion = categorias.First(c => c.Nombre == "Administración").Id;
            var catFinanzas = categorias.First(c => c.Nombre == "Finanzas").Id;
            var catRRHH = categorias.First(c => c.Nombre == "Recursos Humanos").Id;
            var catIngenieria = categorias.First(c => c.Nombre == "Ingeniería").Id;

            // ==================== 20 EMPLEOS DE TECHCORP BOLIVIA ====================
            var empleos = new List<Empleo>
            {
                // Tecnología (8 empleos)
                new() { Titulo = "Desarrollador Full Stack Senior", Descripcion = "Buscamos desarrollador Full Stack con experiencia en .NET Core, Angular y PostgreSQL para joinarse a nuestro equipo de desarrollo de productos enterprise.", Requisitos = "5+ años de experiencia, .NET Core, Angular/React, PostgreSQL, arquitecturas microservices, metodologías ágiles", SalarioMinimo = 3500, SalarioMaximo = 5500, Moneda = "USD", Modalidad = ModalidadTrabajo.Hibrido, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 2, Destacado = true, EmpresaId = empresaId, CategoriaId = catTecnologia, Activo = true, FechaCreacion = now.AddDays(-2), CreadoPor = systemUser },
                new() { Titulo = "Desarrollador Backend Python", Descripcion = "Desarrollador Backend con experiencia en Python, Django/FastAPI para desarrollo de APIs y microservicios.", Requisitos = "3+ años en Python, Django o FastAPI, PostgreSQL, Docker, experiencia con APIs RESTful", SalarioMinimo = 2800, SalarioMaximo = 4200, Moneda = "USD", Modalidad = ModalidadTrabajo.Remoto, Ubicacion = "Remoto", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 3, Destacado = true, EmpresaId = empresaId, CategoriaId = catTecnologia, Activo = true, FechaCreacion = now.AddDays(-5), CreadoPor = systemUser },
                new() { Titulo = "Ingeniero DevOps", Descripcion = "Ingeniero DevOps para gestionar infraestructura cloud, CI/CD y automatización de despliegues.", Requisitos = "Experiencia con AWS/Azure/GCP, Kubernetes, Docker, Terraform, Jenkins/GitLab CI", SalarioMinimo = 3200, SalarioMaximo = 4800, Moneda = "USD", Modalidad = ModalidadTrabajo.Hibrido, Ubicacion = "Santa Cruz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 1, Destacado = false, EmpresaId = empresaId, CategoriaId = catTecnologia, Activo = true, FechaCreacion = now.AddDays(-7), CreadoPor = systemUser },
                new() { Titulo = "Analista de Datos Senior", Descripcion = "Analista de datos para construir dashboards, análisis predictivo y reportes ejecutivos.", Requisitos = "SQL avanzado, Python/R para análisis, Power BI o Tableau, conocimientos de machine learning básico", SalarioMinimo = 3000, SalarioMaximo = 4500, Moneda = "USD", Modalidad = ModalidadTrabajo.Presencial, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 2, Destacado = false, EmpresaId = empresaId, CategoriaId = catTecnologia, Activo = true, FechaCreacion = now.AddDays(-10), CreadoPor = systemUser },
                new() { Titulo = "Desarrollador Mobile iOS/Android", Descripcion = "Desarrollador mobile para crear aplicaciones en React Native y desarrollo nativo.", Requisitos = "React Native, TypeScript, experiencia en App Store y Play Store, Firebase", SalarioMinimo = 2600, SalarioMaximo = 4000, Moneda = "USD", Modalidad = ModalidadTrabajo.Hibrido, Ubicacion = "Cochabamba", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 2, Destacado = true, EmpresaId = empresaId, CategoriaId = catTecnologia, Activo = true, FechaCreacion = now.AddDays(-3), CreadoPor = systemUser },
                new() { Titulo = "Especialista en Ciberseguridad", Descripcion = "Especialista en ciberseguridad para auditoría, pentesting y implementación de políticas de seguridad.", Requisitos = "Certificaciones CISSP/CEH, experiencia en penetration testing, gestión de incidentes", SalarioMinimo = 4000, SalarioMaximo = 6000, Moneda = "USD", Modalidad = ModalidadTrabajo.Presencial, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 1, Destacado = false, EmpresaId = empresaId, CategoriaId = catTecnologia, Activo = true, FechaCreacion = now.AddDays(-15), CreadoPor = systemUser },
                new() { Titulo = "Arquitecto de Software", Descripcion = "Arquitecto de software para diseñar soluciones escalables y guiar equipos técnicos.", Requisitos = "7+ años de experiencia, patrones de diseño, arquitecturas cloud, liderazgo técnico", SalarioMinimo = 5000, SalarioMaximo = 7000, Moneda = "USD", Modalidad = ModalidadTrabajo.Hibrido, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 1, Destacado = true, EmpresaId = empresaId, CategoriaId = catTecnologia, Activo = true, FechaCreacion = now.AddDays(-1), CreadoPor = systemUser },
                new() { Titulo = "Soporte Técnico N2", Descripcion = "Técnico de soporte para resolución de incidentes y atención a usuarios internos.", Requisitos = "Conocimientos en Windows Server, redes, Active Directory, experiencia en soporte técnico", SalarioMinimo = 1200, SalarioMaximo = 1800, Moneda = "USD", Modalidad = ModalidadTrabajo.Presencial, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 3, Destacado = false, EmpresaId = empresaId, CategoriaId = catTecnologia, Activo = true, FechaCreacion = now.AddDays(-20), CreadoPor = systemUser },

                // Marketing (3 empleos)
                new() { Titulo = "Gerente de Marketing Digital", Descripcion = "Gerente para liderar estrategias de marketing digital, SEO/SEM y gestión de redes sociales.", Requisitos = "5+ años en marketing digital, certificaciones Google Ads, experiencia en gestión de equipos", SalarioMinimo = 3000, SalarioMaximo = 4500, Moneda = "USD", Modalidad = ModalidadTrabajo.Hibrido, Ubicacion = "Santa Cruz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 1, Destacado = true, EmpresaId = empresaId, CategoriaId = catMarketing, Activo = true, FechaCreacion = now.AddDays(-4), CreadoPor = systemUser },
                new() { Titulo = "Community Manager", Descripcion = "Community manager para gestionar comunidades en redes sociales y crear contenido engage.", Requisitos = "Experiencia en gestión de redes sociales, creación de contenido, métricas de engagement", SalarioMinimo = 1000, SalarioMaximo = 1500, Moneda = "USD", Modalidad = ModalidadTrabajo.Remoto, Ubicacion = "Remoto", TipoContrato = TipoContrato.MedioTiempo, NumeroVacantes = 2, Destacado = false, EmpresaId = empresaId, CategoriaId = catMarketing, Activo = true, FechaCreacion = now.AddDays(-8), CreadoPor = systemUser },
                new() { Titulo = "Copywriter Especializado", Descripcion = "Copywriter para crear textos publicitarios, contenido web y campañas de email marketing.", Requisitos = "Portafolio demostrable, habilidades de escritura, experiencia en marketing digital", SalarioMinimo = 1500, SalarioMaximo = 2200, Moneda = "USD", Modalidad = ModalidadTrabajo.Remoto, Ubicacion = "Remoto", TipoContrato = TipoContrato.MedioTiempo, NumeroVacantes = 1, Destacado = false, EmpresaId = empresaId, CategoriaId = catMarketing, Activo = true, FechaCreacion = now.AddDays(-12), CreadoPor = systemUser },

                // Diseño (3 empleos)
                new() { Titulo = "Diseñador UX/UI Senior", Descripcion = "Diseñador UX/UI para crear interfaces intuitivas y experiencias de usuario excepcionales.", Requisitos = "5+ años en diseño UX/UI, Figma/Sketch, prototipado, investigación de usuarios", SalarioMinimo = 2800, SalarioMaximo = 4000, Moneda = "USD", Modalidad = ModalidadTrabajo.Hibrido, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 2, Destacado = true, EmpresaId = empresaId, CategoriaId = catDiseño, Activo = true, FechaCreacion = now.AddDays(-6), CreadoPor = systemUser },
                new() { Titulo = "Diseñador Gráfico", Descripcion = "Diseñador gráfico para branding, material publicitario y contenido visual para redes sociales.", Requisitos = "Adobe Creative Suite, Illustrator, Photoshop, portfolio actualizado", SalarioMinimo = 1500, SalarioMaximo = 2200, Moneda = "USD", Modalidad = ModalidadTrabajo.Presencial, Ubicacion = "Cochabamba", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 1, Destacado = false, EmpresaId = empresaId, CategoriaId = catDiseño, Activo = true, FechaCreacion = now.AddDays(-14), CreadoPor = systemUser },
                new() { Titulo = "Motion Graphics Designer", Descripcion = "Diseñador de motion graphics para videos explicativos, animaciones y contenido multimedia.", Requisitos = "After Effects, Premiere Pro, habilidades de animación, portafolio en motion graphics", SalarioMinimo = 1800, SalarioMaximo = 2800, Moneda = "USD", Modalidad = ModalidadTrabajo.Remoto, Ubicacion = "Remoto", TipoContrato = TipoContrato.MedioTiempo, NumeroVacantes = 1, Destacado = false, EmpresaId = empresaId, CategoriaId = catDiseño, Activo = true, FechaCreacion = now.AddDays(-18), CreadoPor = systemUser },

                // Administración (2 empleos)
                new() { Titulo = "Asistente Ejecutivo", Descripcion = "Asistente ejecutivo para apoyo en gestión administrativa, agenda y coordinación de reuniones.", Requisitos = "Experiencia como asistente ejecutivo, Office avanzado, excelentes habilidades de comunicación", SalarioMinimo = 1200, SalarioMaximo = 1800, Moneda = "USD", Modalidad = ModalidadTrabajo.Presencial, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 2, Destacado = false, EmpresaId = empresaId, CategoriaId = catAdministracion, Activo = true, FechaCreacion = now.AddDays(-16), CreadoPor = systemUser },
                new() { Titulo = "Coordinador de Proyectos", Descripcion = "Coordinador de proyectos para seguimiento, control y reporting de iniciativas.", Requisitos = "Certificación PMP o similar, experiencia en gestión de proyectos, MS Project", SalarioMinimo = 2500, SalarioMaximo = 3800, Moneda = "USD", Modalidad = ModalidadTrabajo.Hibrido, Ubicacion = "Santa Cruz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 1, Destacado = true, EmpresaId = empresaId, CategoriaId = catAdministracion, Activo = true, FechaCreacion = now.AddDays(-9), CreadoPor = systemUser },

                // Finanzas (2 empleos)
                new() { Titulo = "Analista Financiero", Descripcion = "Analista financiero para análisis de estados financieros, presupuestos y proyecciones.", Requisitos = "Título en Finanzas o Economía, Excel avanzado, experiencia en análisis financiero", SalarioMinimo = 2200, SalarioMaximo = 3200, Moneda = "USD", Modalidad = ModalidadTrabajo.Presencial, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 1, Destacado = false, EmpresaId = empresaId, CategoriaId = catFinanzas, Activo = true, FechaCreacion = now.AddDays(-11), CreadoPor = systemUser },
                new() { Titulo = "Contador Senior", Descripcion = "Contador senior para gestión contable, estados financieros y cumplimiento tributario.", Requisitos = "CPA o título profesional en Contaduría, 5+ años de experiencia, conocimiento tributario boliviano", SalarioMinimo = 2800, SalarioMaximo = 4000, Moneda = "USD", Modalidad = ModalidadTrabajo.Presencial, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 1, Destacado = false, EmpresaId = empresaId, CategoriaId = catFinanzas, Activo = true, FechaCreacion = now.AddDays(-13), CreadoPor = systemUser },

                // RRHH (1 empleo)
                new() { Titulo = "Analista de Reclutamiento", Descripcion = "Analista de reclutamiento para gestión de procesos de selección y atracción de talento.", Requisitos = "Título en Psicología o Recursos Humanos, experiencia en reclutamiento, habilidades de entrevista", SalarioMinimo = 1500, SalarioMaximo = 2200, Moneda = "USD", Modalidad = ModalidadTrabajo.Hibrido, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 2, Destacado = false, EmpresaId = empresaId, CategoriaId = catRRHH, Activo = true, FechaCreacion = now.AddDays(-19), CreadoPor = systemUser },

                // Ingeniería (1 empleo)
                new() { Titulo = "Ingeniero de Soporte N3", Descripcion = "Ingeniero de soporte nivel 3 para resolución de incidentes críticos en infraestructura.", Requisitos = "Ingeniería en Sistemas o similar, experiencia en soporte N3, conocimiento de redes y cloud", SalarioMinimo = 2500, SalarioMaximo = 3500, Moneda = "USD", Modalidad = ModalidadTrabajo.Presencial, Ubicacion = "La Paz", TipoContrato = TipoContrato.TiempoCompleto, NumeroVacantes = 2, Destacado = true, EmpresaId = empresaId, CategoriaId = catIngenieria, Activo = true, FechaCreacion = now.AddDays(-4), CreadoPor = systemUser }
            };

            _context.Empleos.AddRange(empleos);
            await _context.SaveChangesAsync();

// ==================== 6 POSTULANTES DE KEYCLOAK ====================
            var postulante1 = new Usuario
            {
                Nombre = "Juan",
                Apellido = "Perez",
                Email = "juan.perez@gmail.com",
                Telefono = "+591 7 1234567",
                Ubicacion = "La Paz, Bolivia",
                Habilidades = "React, Angular, TypeScript, Node.js, PostgreSQL, Git",
                Experiencia = "Desarrollador Full Stack con 4 años de experiencia en empresas de tecnología.",
                KeycloakId = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                Rol = TipoRol.Postulante,
                Activo = true,
                FechaCreacion = now.AddDays(-30),
                CreadoPor = systemUser
            };

            var postulante2 = new Usuario
            {
                Nombre = "Maria",
                Apellido = "Garcia",
                Email = "maria.garcia@hotmail.com",
                Telefono = "+591 7 2345678",
                Ubicacion = "Santa Cruz, Bolivia",
                Habilidades = "Python, Django, FastAPI, PostgreSQL, Docker, AWS, Machine Learning",
                Experiencia = "Ingeniero de Software con 6 años de experiencia. Especializado en desarrollo backend.",
                KeycloakId = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                Rol = TipoRol.Postulante,
                Activo = true,
                FechaCreacion = now.AddDays(-25),
                CreadoPor = systemUser
            };

            var postulante3 = new Usuario
            {
                Nombre = "Carlos",
                Apellido = "Mamani",
                Email = "carlos.mamani@yahoo.com",
                Telefono = "+591 7 3456789",
                Ubicacion = "Cochabamba, Bolivia",
                Habilidades = "Java, Spring Boot, MySQL, Microservices",
                Experiencia = "Desarrollador Java con 5 años de experiencia en aplicaciones empresariales.",
                KeycloakId = Guid.Parse("00000000-0000-0000-0000-000000000005"),
                Rol = TipoRol.Postulante,
                Activo = true,
                FechaCreacion = now.AddDays(-20),
                CreadoPor = systemUser
            };

            var postulante4 = new Usuario
            {
                Nombre = "Ana",
                Apellido = "Quispe",
                Email = "ana.quispe@gmail.com",
                Telefono = "+591 7 4567890",
                Ubicacion = "La Paz, Bolivia",
                Habilidades = "Figma, Sketch, Adobe XD, UI/UX Research, Prototyping, Design Systems",
                Experiencia = "Diseñadora UX/UI con 3 años de experiencia.",
                KeycloakId = Guid.Parse("00000000-0000-0000-0000-000000000006"),
                Rol = TipoRol.Postulante,
                Activo = true,
                FechaCreacion = now.AddDays(-18),
                CreadoPor = systemUser
            };

            var postulante5 = new Usuario
            {
                Nombre = "Luis",
                Apellido = "Fernandez",
                Email = "luis.fernandez@hotmail.com",
                Telefono = "+591 7 5678901",
                Ubicacion = "Santa Cruz, Bolivia",
                Habilidades = "Project Management, Scrum, Agile, MS Project",
                Experiencia = "Coordinador de proyectos con 4 años de experiencia.",
                KeycloakId = Guid.Parse("00000000-0000-0000-0000-000000000007"),
                Rol = TipoRol.Postulante,
                Activo = true,
                FechaCreacion = now.AddDays(-15),
                CreadoPor = systemUser
            };

            var postulante6 = new Usuario
            {
                Nombre = "Sofia",
                Apellido = "Castro",
                Email = "sofia.castro@gmail.com",
                Telefono = "+591 7 6789012",
                Ubicacion = "Cochabamba, Bolivia",
                Habilidades = "Contabilidad, finanzas, Excel avanzado, estados financieros",
                Experiencia = "Contadora con 5 años de experiencia en empresas de servicios.",
                KeycloakId = Guid.Parse("00000000-0000-0000-0000-000000000008"),
                Rol = TipoRol.Postulante,
                Activo = true,
                FechaCreacion = now.AddDays(-10),
                CreadoPor = systemUser
            };

            _context.Usuarios.AddRange(postulante1, postulante2, postulante3, postulante4, postulante5, postulante6);
            await _context.SaveChangesAsync();

            var p1Id = postulante1.Id;
            var p2Id = postulante2.Id;
            var p3Id = postulante3.Id;
            var p4Id = postulante4.Id;
            var p5Id = postulante5.Id;
            var p6Id = postulante6.Id;

// ==================== POSTULACIONES ====================
            var empleosList = empleos.ToList();
            
            var postulaciones = new List<Postulacion>
            {
                // Juan Perez postulaciones
                new() { EmpleoId = empleosList[0].Id, PostulanteId = p1Id, Estado = EstadoPostulacion.Pendiente, FechaPostulacion = now.AddDays(-1), CartaPresentacion = "Estimado equipo, me interesa mucho la posición de Desarrollador Full Stack Senior.", Activo = true, FechaCreacion = now.AddDays(-1), CreadoPor = systemUser },
                new() { EmpleoId = empleosList[4].Id, PostulanteId = p1Id, Estado = EstadoPostulacion.EnRevision, FechaPostulacion = now.AddDays(-3), CartaPresentacion = "Tengo experiencia en desarrollo mobile con React Native.", Activo = true, FechaCreacion = now.AddDays(-3), CreadoPor = systemUser },

                // Maria Garcia postulaciones
                new() { EmpleoId = empleosList[1].Id, PostulanteId = p2Id, Estado = EstadoPostulacion.Pendiente, FechaPostulacion = now.AddDays(-2), CartaPresentacion = "Tengo amplia experiencia en desarrollo backend con Python y Django.", Activo = true, FechaCreacion = now.AddDays(-2), CreadoPor = systemUser },
                new() { EmpleoId = empleosList[0].Id, PostulanteId = p2Id, Estado = EstadoPostulacion.EnRevision, FechaPostulacion = now.AddDays(-4), CartaPresentacion = "Me postulo para Desarrollador Full Stack Senior.", Activo = true, FechaCreacion = now.AddDays(-4), CreadoPor = systemUser },

                // Carlos Mamani postulaciones
                new() { EmpleoId = empleosList[2].Id, PostulanteId = p3Id, Estado = EstadoPostulacion.Pendiente, FechaPostulacion = now.AddDays(-5), CartaPresentacion = "Tengo experiencia como Ingeniero DevOps.", Activo = true, FechaCreacion = now.AddDays(-5), CreadoPor = systemUser },

                // Ana Quispe postulaciones
                new() { EmpleoId = empleosList[11].Id, PostulanteId = p4Id, Estado = EstadoPostulacion.Pendiente, FechaPostulacion = now.AddDays(-1), CartaPresentacion = "Me interesa el puesto de Diseñador UX/UI Senior.", Activo = true, FechaCreacion = now.AddDays(-1), CreadoPor = systemUser },
                new() { EmpleoId = empleosList[12].Id, PostulanteId = p4Id, Estado = EstadoPostulacion.EnRevision, FechaPostulacion = now.AddDays(-6), CartaPresentacion = "Me postulo para Diseñador Gráfico.", Activo = true, FechaCreacion = now.AddDays(-6), CreadoPor = systemUser },

                // Luis Fernandez postulaciones
                new() { EmpleoId = empleosList[16].Id, PostulanteId = p5Id, Estado = EstadoPostulacion.Pendiente, FechaPostulacion = now.AddDays(-2), CartaPresentacion = "Me interesa el puesto de Coordinador de Proyectos.", Activo = true, FechaCreacion = now.AddDays(-2), CreadoPor = systemUser },

                // Sofia Castro postulaciones
                new() { EmpleoId = empleosList[14].Id, PostulanteId = p6Id, Estado = EstadoPostulacion.Pendiente, FechaPostulacion = now.AddDays(-3), CartaPresentacion = "Me postulo para Analista Financiero.", Activo = true, FechaCreacion = now.AddDays(-3), CreadoPor = systemUser }
            };

            _context.Postulaciones.AddRange(postulaciones);
            await _context.SaveChangesAsync();

            // ==================== MOVIMIENTOS DE AUDITORÍA ====================
            var postulacionesGuardadas = postulaciones.ToList();
            var movimientos = new List<MovimientoPostulacion>();

            for (int i = 0; i < postulacionesGuardadas.Count; i++)
            {
                var p = postulacionesGuardadas[i];
                string postulante;
                if (p.PostulanteId == p1Id) postulante = "juan.perez@gmail.com";
                else if (p.PostulanteId == p2Id) postulante = "maria.garcia@hotmail.com";
                else if (p.PostulanteId == p3Id) postulante = "carlos.mamani@yahoo.com";
                else if (p.PostulanteId == p4Id) postulante = "ana.quispe@gmail.com";
                else if (p.PostulanteId == p5Id) postulante = "luis.fernandez@hotmail.com";
                else postulante = "sofia.castro@gmail.com";

                // Movimiento de creación
                movimientos.Add(new MovimientoPostulacion
                {
                    PostulacionId = p.Id,
                    TipoMovimiento = "CREACION",
                    EstadoAnterior = "",
                    EstadoNuevo = "Pendiente",
                    Observacion = "Postulación creada",
                    UsuarioResponsable = postulante,
                    Activo = true,
                    FechaCreacion = p.FechaPostulacion,
                    CreadoPor = systemUser
                });

                // Si tiene estado diferente a Pendiente, agregar movimiento de cambio
                if (p.Estado != EstadoPostulacion.Pendiente)
                {
                    movimientos.Add(new MovimientoPostulacion
                    {
                        PostulacionId = p.Id,
                        TipoMovimiento = "CAMBIO_ESTADO",
                        EstadoAnterior = "Pendiente",
                        EstadoNuevo = p.Estado.ToString(),
                        Observacion = p.Notas,
                        UsuarioResponsable = "contacto@boliviatech.bo",
                        Activo = true,
                        FechaCreacion = p.FechaRevision ?? now,
                        CreadoPor = systemUser
                    });
                }
            }

            _context.MovimientosPostulacion.AddRange(movimientos);
            await _context.SaveChangesAsync();
        }
    }
}
