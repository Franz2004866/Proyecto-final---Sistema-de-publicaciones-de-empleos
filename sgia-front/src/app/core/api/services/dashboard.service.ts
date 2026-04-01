import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { APP_CONFIG } from '../../../shared/constants/app.constants';

export interface DashboardSummary {
  totalProducts: number;
  totalStockValue: number;
  lowStockProducts: number;
  totalCategories: number;
  recentActivity: {
    type: string;
    description: string;
    date: string;
  }[];
  lowStockAlerts: {
    productId: string;
    productName: string;
    productCode: string;
    currentStock: number;
    minimalStock: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = APP_CONFIG.apiUrl + '/dashboard';

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
