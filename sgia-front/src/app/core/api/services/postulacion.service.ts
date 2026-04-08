import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Postulacion, CrearPostulacionDto, ActualizarPostulacionDto, PostulacionFiltro } from '../models/postulacion.model';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Postulaciones`;

  getAll(filtro?: PostulacionFiltro): Observable<Postulacion[]> {
    let params = new HttpParams();
    if (filtro) {
      if (filtro.empleoId) params = params.set('empleoId', filtro.empleoId.toString());
      if (filtro.postulanteId) params = params.set('postulanteId', filtro.postulanteId.toString());
      if (filtro.estado) params = params.set('estado', filtro.estado.toString());
      if (filtro.page) params = params.set('page', filtro.page.toString());
      if (filtro.pageSize) params = params.set('pageSize', filtro.pageSize.toString());
    }
    return this.http.get<Postulacion[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Postulacion> {
    return this.http.get<Postulacion>(`${this.apiUrl}/${id}`);
  }

  getByEmpleo(empleoId: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.apiUrl}/empleo/${empleoId}`);
  }

  getMyPostulaciones(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.apiUrl}/mis-postulaciones`);
  }

  create(postulacion: CrearPostulacionDto): Observable<Postulacion> {
    return this.http.post<Postulacion>(this.apiUrl, postulacion);
  }

  update(id: number, postulacion: ActualizarPostulacionDto): Observable<Postulacion> {
    return this.http.put<Postulacion>(`${this.apiUrl}/${id}`, postulacion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
