using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuEmpleo.Infrastructure.Repositories;
using TuEmpleo.Infrastructure.Services;
using System.Collections.Generic;

namespace TuEmpleo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportesController : ControllerBase
{
    private readonly IPostulacionRepository _postulacionRepo;
    private readonly IEmpleoRepository _empleoRepo;
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly ICurrentUserService _currentUser;

    public ReportesController(
        IPostulacionRepository postulacionRepo,
        IEmpleoRepository empleoRepo,
        IUsuarioRepository usuarioRepo,
        ICurrentUserService currentUser)
    {
        _postulacionRepo = postulacionRepo;
        _empleoRepo = empleoRepo;
        _usuarioRepo = usuarioRepo;
        _currentUser = currentUser;
    }

    [HttpGet("resumen")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> GetResumen()
    {
        var listaUsuarios = _usuarioRepo.GetAllAsync().Result.ToList();
        var listaEmpleos = _empleoRepo.GetAllAsync().Result.ToList();
        var listaPostulaciones = _postulacionRepo.GetAllAsync().Result.ToList();

        var result = new Dictionary<string, int>
        {
            { "usuarios", listaUsuarios.Count },
            { "empleos", listaEmpleos.Count },
            { "postulaciones", listaPostulaciones.Count }
        };
        
        return Ok(result);
    }

    [HttpGet("empresa")]
    [Authorize(Policy = "EmpresaOrAdmin")]
    public async Task<IActionResult> GetResumenEmpresa()
    {
        var email = _currentUser.GetEmail();
        if (string.IsNullOrEmpty(email))
            return Unauthorized();

        var usuario = await _usuarioRepo.GetByEmailAsync(email);
        if (usuario == null)
            return NotFound();

        var misEmpleos = _empleoRepo.GetByEmpresaAsync(usuario.Id).Result.ToList();
        
        var result = new Dictionary<string, object>
        {
            { "empresa", usuario.Nombre },
            { "empleos", misEmpleos.Count }
        };
        
        return Ok(result);
    }
}