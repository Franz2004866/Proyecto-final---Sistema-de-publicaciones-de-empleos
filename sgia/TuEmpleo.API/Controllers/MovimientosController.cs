using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using TuEmpleo.Application.DTOs;
using TuEmpleo.Infrastructure.Repositories;
using TuEmpleo.Infrastructure.Services;

namespace TuEmpleo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MovimientosController : ControllerBase
{
    private readonly IMovimientoPostulacionRepository _movimientoRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuditService _auditService;
    private readonly IMapper _mapper;

    public MovimientosController(
        IMovimientoPostulacionRepository movimientoRepository,
        ICurrentUserService currentUserService,
        IAuditService auditService,
        IMapper mapper)
    {
        _movimientoRepository = movimientoRepository;
        _currentUserService = currentUserService;
        _auditService = auditService;
        _mapper = mapper;
    }

    [HttpGet("postulacion/{postulacionId}")]
    public async Task<ActionResult<IEnumerable<MovimientoPostulacionDto>>> GetByPostulacion(int postulacionId)
    {
        var movimientos = await _movimientoRepository.GetByPostulacionIdAsync(postulacionId);
        return Ok(_mapper.Map<IEnumerable<MovimientoPostulacionDto>>(movimientos));
    }

    [HttpGet("empleo/{empleoId}")]
    [Authorize(Policy = "EmpresaOrAdmin")]
    public async Task<ActionResult<IEnumerable<MovimientoPostulacionDto>>> GetByEmpleo(int empleoId)
    {
        var movimientos = await _movimientoRepository.GetByEmpleoIdAsync(empleoId);
        return Ok(_mapper.Map<IEnumerable<MovimientoPostulacionDto>>(movimientos));
    }

    internal async Task RegistrarMovimientoAsync(int postulacionId, string tipo, string estadoAnterior, string estadoNuevo, string? observacion = null)
    {
        var movimiento = new Domain.Entities.MovimientoPostulacion
        {
            PostulacionId = postulacionId,
            TipoMovimiento = tipo,
            EstadoAnterior = estadoAnterior,
            EstadoNuevo = estadoNuevo,
            Observacion = observacion,
            UsuarioResponsable = _currentUserService.GetUsername() ?? "Sistema",
            FechaCreacion = _auditService.GetCurrentDateTime(),
            CreadoPor = _currentUserService.GetUsername() ?? "Sistema"
        };

        await _movimientoRepository.AddAsync(movimiento);
    }
}
