using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TuEmpleo.API.Controllers;
using TuEmpleo.Application.DTOs;
using TuEmpleo.Domain.Entities;
using TuEmpleo.Infrastructure.Repositories;
using TuEmpleo.Infrastructure.Services;

namespace TuEmpleo.Tests.Controllers
{
    public class EmpleosControllerTests
    {
        private readonly Mock<IEmpleoRepository> _mockEmpleoRepository;
        private readonly Mock<IUsuarioRepository> _mockUsuarioRepository;
        private readonly Mock<IPostulacionRepository> _mockPostulacionRepository;
        private readonly Mock<ICurrentUserService> _mockCurrentUserService;
        private readonly Mock<IAuditService> _mockAuditService;
        private readonly Mock<IMapper> _mockMapper;
        private readonly EmpleosController _controller;

        public EmpleosControllerTests()
        {
            _mockEmpleoRepository = new Mock<IEmpleoRepository>();
            _mockUsuarioRepository = new Mock<IUsuarioRepository>();
            _mockPostulacionRepository = new Mock<IPostulacionRepository>();
            _mockCurrentUserService = new Mock<ICurrentUserService>();
            _mockAuditService = new Mock<IAuditService>();
            _mockMapper = new Mock<IMapper>();
            
            _controller = new EmpleosController(
                _mockEmpleoRepository.Object,
                _mockUsuarioRepository.Object,
                _mockPostulacionRepository.Object,
                _mockMapper.Object,
                _mockAuditService.Object,
                _mockCurrentUserService.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkResult_WithListOfEmpleos()
        {
            var empleos = new List<Empleo>
            {
                new Empleo { Id = 1, Titulo = "Desarrollador Senior", Modalidad = ModalidadTrabajo.Remoto, TipoContrato = TipoContrato.TiempoCompleto },
                new Empleo { Id = 2, Titulo = "Diseñador UX", Modalidad = ModalidadTrabajo.Hibrido, TipoContrato = TipoContrato.MedioTiempo }
            };
            var empleoDtos = new List<EmpleoDto>
            {
                new EmpleoDto { Id = 1, Titulo = "Desarrollador Senior", Modalidad = "Remoto", TipoContrato = "TiempoCompleto" },
                new EmpleoDto { Id = 2, Titulo = "Diseñador UX", Modalidad = "Hibrido", TipoContrato = "MedioTiempo" }
            };

            _mockEmpleoRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(empleos);
            _mockMapper.Setup(m => m.Map<IEnumerable<EmpleoDto>>(empleos)).Returns(empleoDtos);

            var result = await _controller.GetAll(null);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenEmpleoDoesNotExist()
        {
            _mockEmpleoRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Empleo?)null);

            var result = await _controller.GetById(999);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetById_ReturnsOkResult_WhenEmpleoExists()
        {
            var empleo = new Empleo { Id = 1, Titulo = "Desarrollador", Modalidad = ModalidadTrabajo.Remoto, TipoContrato = TipoContrato.TiempoCompleto };
            var empleoDto = new EmpleoDto { Id = 1, Titulo = "Desarrollador", Modalidad = "Remoto", TipoContrato = "TiempoCompleto" };

            _mockEmpleoRepository.Setup(r => r.GetWithPostulacionesAsync(1)).ReturnsAsync(empleo);
            _mockMapper.Setup(m => m.Map<EmpleoDto>(empleo)).Returns(empleoDto);

            var result = await _controller.GetById(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task GetDestacados_ReturnsOkResult_WithFeaturedJobs()
        {
            var empleos = new List<Empleo>
            {
                new Empleo { Id = 1, Titulo = "Empleo Destacado 1", Destacado = true, Modalidad = ModalidadTrabajo.Remoto, TipoContrato = TipoContrato.TiempoCompleto },
                new Empleo { Id = 2, Titulo = "Empleo Destacado 2", Destacado = true, Modalidad = ModalidadTrabajo.Hibrido, TipoContrato = TipoContrato.MedioTiempo }
            };
            var empleoDtos = new List<EmpleoDto>
            {
                new EmpleoDto { Id = 1, Titulo = "Empleo Destacado 1", Destacado = true, Modalidad = "Remoto", TipoContrato = "TiempoCompleto" },
                new EmpleoDto { Id = 2, Titulo = "Empleo Destacado 2", Destacado = true, Modalidad = "Hibrido", TipoContrato = "MedioTiempo" }
            };

            _mockEmpleoRepository.Setup(r => r.GetDestacadosAsync(5)).ReturnsAsync(empleos);
            _mockMapper.Setup(m => m.Map<IEnumerable<EmpleoDto>>(empleos)).Returns(empleoDtos);

            var result = await _controller.GetDestacados();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public void Empleo_ShouldHaveCorrectDefaultValues()
        {
            var empleo = new Empleo();
            Assert.Equal(ModalidadTrabajo.Presencial, empleo.Modalidad);
            Assert.Equal(TipoContrato.TiempoCompleto, empleo.TipoContrato);
            Assert.True(empleo.VacantesDisponibles);
            Assert.Equal(1, empleo.NumeroVacantes);
            Assert.False(empleo.Destacado);
        }

        [Fact]
        public void Postulacion_ShouldHaveCorrectDefaultValues()
        {
            var postulacion = new Postulacion();
            Assert.Equal(EstadoPostulacion.Pendiente, postulacion.Estado);
            Assert.NotNull(postulacion.Movimientos);
        }

        [Fact]
        public void Usuario_ShouldHaveCorrectDefaultValues()
        {
            var usuario = new Usuario();
            Assert.Equal(TipoRol.Postulante, usuario.Rol);
        }
    }
}
