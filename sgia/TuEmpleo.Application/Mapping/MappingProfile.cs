using AutoMapper;
using TuEmpleo.Application.DTOs;
using TuEmpleo.Domain.Entities;

namespace TuEmpleo.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Usuario, UsuarioDto>()
                .ForMember(dest => dest.NombreRol, opt => opt.MapFrom(src => src.Rol.ToString()));
            CreateMap<CrearUsuarioDto, Usuario>();
            CreateMap<ActualizarUsuarioDto, Usuario>();

            CreateMap<Empleo, EmpleoDto>()
                .ForMember(dest => dest.NombreEmpresa, opt => opt.MapFrom(src => src.Empresa != null ? $"{src.Empresa.Nombre} {src.Empresa.Apellido}" : ""))
                .ForMember(dest => dest.NombreCategoria, opt => opt.MapFrom(src => src.Categoria != null ? src.Categoria.Nombre : ""))
                .ForMember(dest => dest.Modalidad, opt => opt.MapFrom(src => src.Modalidad.ToString()))
                .ForMember(dest => dest.TipoContrato, opt => opt.MapFrom(src => src.TipoContrato.ToString()))
                .ForMember(dest => dest.TotalPostulaciones, opt => opt.MapFrom(src => src.Postulaciones != null ? src.Postulaciones.Count : 0));
            CreateMap<CrearEmpleoDto, Empleo>();
            CreateMap<ActualizarEmpleoDto, Empleo>();

            CreateMap<Postulacion, PostulacionDto>()
                .ForMember(dest => dest.TituloEmpleo, opt => opt.MapFrom(src => src.Empleo != null ? src.Empleo.Titulo : ""))
                .ForMember(dest => dest.NombrePostulante, opt => opt.MapFrom(src => src.Postulante != null ? $"{src.Postulante.Nombre} {src.Postulante.Apellido}" : ""))
                .ForMember(dest => dest.EmailPostulante, opt => opt.MapFrom(src => src.Postulante != null ? src.Postulante.Email : ""))
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado.ToString()));
            CreateMap<CrearPostulacionDto, Postulacion>();
            CreateMap<ActualizarPostulacionDto, Postulacion>();

            CreateMap<CategoriaEmpleo, CategoriaEmpleoDto>()
                .ForMember(dest => dest.TotalEmpleos, opt => opt.MapFrom(src => src.Empleos != null ? src.Empleos.Count : 0));
            CreateMap<CrearCategoriaEmpleoDto, CategoriaEmpleo>();
            CreateMap<ActualizarCategoriaEmpleoDto, CategoriaEmpleo>();

            CreateMap<MovimientoPostulacion, MovimientoPostulacionDto>()
                .ForMember(dest => dest.TituloEmpleo, opt => opt.MapFrom(src => src.Postulacion != null && src.Postulacion.Empleo != null ? src.Postulacion.Empleo.Titulo : ""))
                .ForMember(dest => dest.NombrePostulante, opt => opt.MapFrom(src => src.Postulacion != null && src.Postulacion.Postulante != null ? $"{src.Postulacion.Postulante.Nombre} {src.Postulacion.Postulante.Apellido}" : ""));
            CreateMap<MovimientoPostulacionCreateDto, MovimientoPostulacion>();
        }
    }
}
