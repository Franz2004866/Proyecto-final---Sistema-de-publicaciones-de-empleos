import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Movement, CreateMovementDto, MovementType } from '../models/movement.model';
import { APP_CONFIG } from '../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private http = inject(HttpClient);
  private apiUrl = APP_CONFIG.apiUrl + '/movements';

  private _movements = signal<Movement[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  readonly movements = this._movements.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  getAll(
    productId?: string,
    type?: MovementType,
    dateFrom?: string,
    dateTo?: string,
  ): Observable<Movement[]> {
    this._loading.set(true);
    this._error.set(null);

    const params: any = {};
    if (productId) params.productId = productId;
    if (type) params.type = type;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    return this.http.get<Movement[]>(this.apiUrl, { params }).pipe(
      tap((movements) => {
        this._movements.set(movements);
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        return of([]);
      }),
    );
  }

  getByProductId(productId: string): Observable<Movement[]> {
    this._loading.set(true);
    return this.http.get<Movement[]>(`${this.apiUrl}/product/${productId}`).pipe(
      tap((movements) => {
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        return of([]);
      }),
    );
  }

  getRecent(count = 10): Observable<Movement[]> {
    return this.http
      .get<Movement[]>(`${this.apiUrl}/recent`, { params: { count: count.toString() } })
      .pipe(
        catchError((error) => {
          this._error.set(error.message);
          return of([]);
        }),
      );
  }

  create(movement: CreateMovementDto): Observable<Movement> {
    this._loading.set(true);
    return this.http.post<Movement>(this.apiUrl, movement).pipe(
      tap((newMovement) => {
        this._movements.update((movements) => [...movements, newMovement]);
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        throw error;
      }),
    );
  }
}
