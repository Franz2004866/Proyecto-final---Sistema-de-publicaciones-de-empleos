export interface Empleo {
  id: number;
  titulo: string;
  descripcion: string;
  requisitos?: string;
  salarioMinimo?: number;
  salarioMaximo?: number;
  moneda?: string;
  modalidad: string;
  ubicacion?: string;
  tipoContrato: string;
  fechaLimite?: string;
  vacantesDisponibles: boolean;
  numeroVacantes?: number;
  destacado?: boolean;
  empresaId: number;
  nombreEmpresa: string;
  categoriaId?: number;
  nombreCategoria?: string;
  fechaCreacion: string;
  totalPostulaciones: number;
  activo: boolean;
}

export interface CrearEmpleoDto {
  titulo: string;
  descripcion: string;
  requisitos?: string;
  salarioMinimo?: number;
  salarioMaximo?: number;
  moneda?: string;
  modalidad: string;
  ubicacion?: string;
  tipoContrato: string;
  fechaLimite?: string;
  numeroVacantes?: number;
  destacado?: boolean;
  categoriaId?: number;
}

export interface ActualizarEmpleoDto {
  titulo?: string;
  descripcion?: string;
  requisitos?: string;
  salarioMinimo?: number;
  salarioMaximo?: number;
  moneda?: string;
  modalidad?: string;
  ubicacion?: string;
  tipoContrato?: string;
  fechaLimite?: string;
  vacantesDisponibles?: boolean;
  numeroVacantes?: number;
  destacado?: boolean;
  categoriaId?: number;
  activo?: boolean;
}

export interface EmpleoFiltro {
  busqueda?: string;
  modalidad?: string;
  tipoContrato?: string;
  categoriaId?: number;
  ubicacion?: string;
  page?: number;
  pageSize?: number;
}
