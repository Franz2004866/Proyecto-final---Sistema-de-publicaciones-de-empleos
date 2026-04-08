import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardSummary {
  totalEmpleos: number;
  totalPostulaciones: number;
  totalPostulantes: number;
  totalEmpresas: number;
  empleosActivos: number;
  empleosDestacados: number;
  postulacionesPendientes: number;
  empleosRecientes: {
    id: number;
    titulo: string;
    nombreEmpresa: string;
    modalidad: string;
    fechaPublicacion: string;
    totalPostulaciones: number;
  }[];
  postulacionesRecientes: {
    id: number;
    nombrePostulante: string;
    tituloEmpleo: string;
    estado: string;
    fechaPostulacion: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/Dashboard';

  private _summary = signal<DashboardSummary | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  readonly summary = this._summary.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  getSummary(): Observable<DashboardSummary> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<DashboardSummary>(this.apiUrl).pipe(
      tap((data) => {
        this._summary.set(data);
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        return of(null as any);
      }),
    );
  }
}
