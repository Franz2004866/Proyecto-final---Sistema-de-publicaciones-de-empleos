import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockValueReport, LowStockReport, MovementSummary } from '../models/report.model';
import { APP_CONFIG } from '../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = APP_CONFIG.apiUrl + '/reports';

  getStockValueReport(): Observable<StockValueReport> {
    return this.http.get<StockValueReport>(`${this.apiUrl}/stock-value`);
  }

  getLowStockReport(): Observable<LowStockReport[]> {
    return this.http.get<LowStockReport[]>(`${this.apiUrl}/low-stock`);
  }

  exportToCsv(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-csv`, { responseType: 'blob' });
  }

  getMovementSummary(dateFrom?: string, dateTo?: string): Observable<MovementSummary> {
    const params: any = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    return this.http.get<MovementSummary>(`${this.apiUrl}/movement-summary`, { params });
  }
}
