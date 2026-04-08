import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoriaEmpleo, CrearCategoriaDto, ActualizarCategoriaDto } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Categorias`;

  getAll(): Observable<CategoriaEmpleo[]> {
    return this.http.get<CategoriaEmpleo[]>(this.apiUrl);
  }

  getById(id: number): Observable<CategoriaEmpleo> {
    return this.http.get<CategoriaEmpleo>(`${this.apiUrl}/${id}`);
  }

  create(categoria: CrearCategoriaDto): Observable<CategoriaEmpleo> {
    return this.http.post<CategoriaEmpleo>(this.apiUrl, categoria);
  }

  update(id: number, categoria: ActualizarCategoriaDto): Observable<CategoriaEmpleo> {
    return this.http.put<CategoriaEmpleo>(`${this.apiUrl}/${id}`, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
