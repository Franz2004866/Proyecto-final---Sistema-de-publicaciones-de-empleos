export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ubicacion?: string;
  urlCurriculo?: string;
  habilidades?: string;
  experiencia?: string;
  nombreRol: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface CrearUsuarioDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ubicacion?: string;
  habilidades?: string;
  experiencia?: string;
  rol: TipoRol;
}

export interface ActualizarUsuarioDto {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  ubicacion?: string;
  urlCurriculo?: string;
  habilidades?: string;
  experiencia?: string;
}

export enum TipoRol {
  Postulante = 1,
  Empresa = 2,
  Administrador = 3
}
