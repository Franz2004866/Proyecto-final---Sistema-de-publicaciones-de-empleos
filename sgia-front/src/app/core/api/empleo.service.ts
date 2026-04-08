import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empleo, CrearEmpleoDto, ActualizarEmpleoDto, EmpleoFiltro } from './models/empleo.model';

@Injectable({
  providedIn: 'root',
})
export class EmpleoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Empleos`;

  getAll(filtro?: EmpleoFiltro): Observable<Empleo[]> {
    let params = new HttpParams();
    if (filtro) {
      if (filtro.busqueda) params = params.set('busqueda', filtro.busqueda);
      if (filtro.modalidad) params = params.set('modalidad', filtro.modalidad);
      if (filtro.tipoContrato) params = params.set('tipoContrato', filtro.tipoContrato);
      if (filtro.categoriaId) params = params.set('categoriaId', filtro.categoriaId.toString());
      if (filtro.page) params = params.set('page', filtro.page.toString());
      if (filtro.pageSize) params = params.set('pageSize', filtro.pageSize.toString());
    }
    return this.http.get<Empleo[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Empleo> {
    return this.http.get<Empleo>(`${this.apiUrl}/${id}`);
  }

  getDestacados(count: number = 5): Observable<Empleo[]> {
    return this.http.get<Empleo[]>(`${this.apiUrl}/destacados?count=${count}`);
  }

  getByEmpresa(empresaId: number): Observable<Empleo[]> {
    return this.http.get<Empleo[]>(`${this.apiUrl}/empresa/${empresaId}`);
  }

  create(empleo: CrearEmpleoDto): Observable<Empleo> {
    return this.http.post<Empleo>(this.apiUrl, empleo);
  }

  update(id: number, empleo: ActualizarEmpleoDto): Observable<Empleo> {
    return this.http.put<Empleo>(`${this.apiUrl}/${id}`, empleo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
