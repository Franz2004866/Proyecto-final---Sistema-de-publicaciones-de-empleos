export interface CategoriaEmpleo {
  id: number;
  nombre: string;
  descripcion?: string;
  color: string;
  icono?: string;
  totalEmpleos: number;
  activo: boolean;
  fechaCreacion: Date;
}

export interface CrearCategoriaDto {
  nombre: string;
  descripcion?: string;
  color: string;
  icono: string;
}

export interface ActualizarCategoriaDto {
  id: number;
  nombre: string;
  descripcion?: string;
  color: string;
  icono: string;
}
