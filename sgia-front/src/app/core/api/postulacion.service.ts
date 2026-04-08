import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Postulacion, CrearPostulacionDto, ActualizarPostulacionDto } from './models/postulacion.model';

@Injectable({
  providedIn: 'root',
})
export class PostulacionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Postulaciones`;

  getAll(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(this.apiUrl);
  }

  getMyPostulaciones(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.apiUrl}/mis-postulaciones`);
  }

  getByEmpleo(empleoId: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.apiUrl}/empleo/${empleoId}`);
  }

  create(postulacion: CrearPostulacionDto): Observable<Postulacion> {
    return this.http.post<Postulacion>(this.apiUrl, postulacion);
  }

  update(id: number, data: ActualizarPostulacionDto): Observable<Postulacion> {
    return this.http.put<Postulacion>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
