using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuEmpleo.Infrastructure.Data;
using TuEmpleo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace TuEmpleo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> GetDashboard()
        {
            var totalEmpleos = await _context.Empleos.CountAsync(e => e.Activo);
            var totalPostulaciones = await _context.Postulaciones.CountAsync(p => p.Activo);
            var totalPostulantes = await _context.Usuarios.CountAsync(u => u.Rol == TipoRol.Postulante && u.Activo);
            var totalEmpresas = await _context.Usuarios.CountAsync(u => u.Rol == TipoRol.Empresa && u.Activo);
            var empleosActivos = await _context.Empleos.CountAsync(e => e.Activo && e.VacantesDisponibles);
            var empleosDestacados = await _context.Empleos.CountAsync(e => e.Activo && e.Destacado);
            var postulacionesPendientes = await _context.Postulaciones.CountAsync(p => p.Estado == EstadoPostulacion.Pendiente && p.Activo);

            var empleosRecientes = await _context.Empleos
                .Where(e => e.Activo)
                .Include(e => e.Empresa)
                .Include(e => e.Postulaciones)
                .OrderByDescending(e => e.FechaCreacion)
                .Take(5)
                .Select(e => new
                {
                    e.Id,
                    e.Titulo,
                    NombreEmpresa = e.Empresa != null ? $"{e.Empresa.Nombre} {e.Empresa.Apellido}" : "",
                    Modalidad = e.Modalidad.ToString(),
                    e.FechaCreacion,
                    TotalPostulaciones = e.Postulaciones.Count(p => p.Activo)
                })
                .ToListAsync();

            var postulacionesRecientes = await _context.Postulaciones
                .Where(p => p.Activo)
                .Include(p => p.Postulante)
                .Include(p => p.Empleo)
                .OrderByDescending(p => p.FechaPostulacion)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    NombrePostulante = p.Postulante != null ? $"{p.Postulante.Nombre} {p.Postulante.Apellido}" : "",
                    TituloEmpleo = p.Empleo != null ? p.Empleo.Titulo : "",
                    Estado = p.Estado.ToString(),
                    p.FechaPostulacion
                })
                .ToListAsync();

            var estadisticasPorCategoria = await _context.CategoriasEmpleo
                .Where(c => c.Activo)
                .Include(c => c.Empleos)
                .Select(c => new
                {
                    CategoriaId = c.Id,
                    c.Nombre,
                    c.Color,
                    TotalEmpleos = c.Empleos.Count(e => e.Activo),
                    TotalPostulaciones = c.Empleos.SelectMany(e => e.Postulaciones).Count(p => p.Activo)
                })
                .ToListAsync();

            return Ok(new
            {
                totalEmpleos,
                totalPostulaciones,
                totalPostulantes,
                totalEmpresas,
                empleosActivos,
                empleosDestacados,
                postulacionesPendientes,
                empleosRecientes,
                postulacionesRecientes,
                estadisticasPorCategoria
            });
        }

        [HttpGet("stats")]
        public async Task<ActionResult> GetStats()
        {
            var totalEmpleos = await _context.Empleos.CountAsync(e => e.Activo && e.VacantesDisponibles);
            var empleosDestacados = await _context.Empleos.CountAsync(e => e.Activo && e.Destacado);

            return Ok(new
            {
                totalEmpleos,
                empleosDestacados
            });
        }
    }
}
