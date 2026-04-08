export interface Postulacion {
  id: number;
  empleoId: number;
  tituloEmpleo: string;
  nombreEmpresa: string;
  postulanteId: number;
  nombrePostulante: string;
  emailPostulante: string;
  estado: string;
  fechaPostulacion: string;
  comentarios?: string;
  activo: boolean;
}

export interface CrearPostulacionDto {
  empleoId: number;
  comentarios?: string;
}

export interface ActualizarPostulacionDto {
  estado: string;
  comentarios?: string;
}

export interface PostulacionFiltro {
  empleoId?: number;
  postulanteId?: number;
  estado?: string;
  page?: number;
  pageSize?: number;
}
