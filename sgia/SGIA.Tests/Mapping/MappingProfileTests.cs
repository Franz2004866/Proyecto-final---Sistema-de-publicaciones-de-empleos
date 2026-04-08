using TuEmpleo.Domain.Entities;

namespace TuEmpleo.Tests.Mapping
{
    public class EntityTests
    {
        [Fact]
        public void Empleo_ShouldHaveDefaultValues()
        {
            var empleo = new Empleo();

            Assert.Equal(ModalidadTrabajo.Presencial, empleo.Modalidad);
            Assert.Equal(TipoContrato.TiempoCompleto, empleo.TipoContrato);
            Assert.True(empleo.VacantesDisponibles);
            Assert.Equal(1, empleo.NumeroVacantes);
            Assert.False(empleo.Destacado);
        }

        [Fact]
        public void Postulacion_ShouldHaveDefaultValues()
        {
            var postulacion = new Postulacion();

            Assert.Equal(EstadoPostulacion.Pendiente, postulacion.Estado);
            Assert.NotNull(postulacion.Movimientos);
            Assert.Empty(postulacion.Movimientos);
        }

        [Fact]
        public void Usuario_ShouldHaveDefaultValues()
        {
            var usuario = new Usuario();

            Assert.Equal(TipoRol.Postulante, usuario.Rol);
            Assert.NotNull(usuario.EmpleosPublicados);
            Assert.NotNull(usuario.Postulaciones);
        }

        [Fact]
        public void CategoriaEmpleo_ShouldHaveDefaultValues()
        {
            var categoria = new CategoriaEmpleo();

            Assert.True(categoria.Activo);
            Assert.NotNull(categoria.Empleos);
        }

        [Fact]
        public void ModalidadTrabajo_ShouldHaveCorrectValues()
        {
            Assert.Equal(1, (int)ModalidadTrabajo.Presencial);
            Assert.Equal(2, (int)ModalidadTrabajo.Remoto);
            Assert.Equal(3, (int)ModalidadTrabajo.Hibrido);
        }

        [Fact]
        public void TipoContrato_ShouldHaveCorrectValues()
        {
            Assert.Equal(1, (int)TipoContrato.TiempoCompleto);
            Assert.Equal(2, (int)TipoContrato.MedioTiempo);
            Assert.Equal(3, (int)TipoContrato.ContratoTemporal);
            Assert.Equal(4, (int)TipoContrato.Practicas);
            Assert.Equal(5, (int)TipoContrato.PorProyecto);
        }

        [Fact]
        public void EstadoPostulacion_ShouldHaveCorrectValues()
        {
            Assert.Equal(1, (int)EstadoPostulacion.Pendiente);
            Assert.Equal(2, (int)EstadoPostulacion.EnRevision);
            Assert.Equal(3, (int)EstadoPostulacion.Entrevista);
            Assert.Equal(4, (int)EstadoPostulacion.Aprobado);
            Assert.Equal(5, (int)EstadoPostulacion.Rechazado);
        }

        [Fact]
        public void TipoRol_ShouldHaveCorrectValues()
        {
            Assert.Equal(1, (int)TipoRol.Postulante);
            Assert.Equal(2, (int)TipoRol.Empresa);
            Assert.Equal(3, (int)TipoRol.Administrador);
        }

        [Fact]
        public void MovimientoPostulacion_ShouldBeCreated()
        {
            var movimiento = new MovimientoPostulacion
            {
                PostulacionId = 1,
                TipoMovimiento = "CREACION",
                EstadoAnterior = "",
                EstadoNuevo = "Pendiente",
                Observacion = "Prueba",
                UsuarioResponsable = "TestUser"
            };

            Assert.Equal(1, movimiento.PostulacionId);
            Assert.Equal("CREACION", movimiento.TipoMovimiento);
            Assert.Equal("Pendiente", movimiento.EstadoNuevo);
            Assert.Equal("TestUser", movimiento.UsuarioResponsable);
        }
    }
}
