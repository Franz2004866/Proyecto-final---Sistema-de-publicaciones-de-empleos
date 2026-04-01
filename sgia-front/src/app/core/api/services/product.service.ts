import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Product, CreateProductDto, UpdateProductDto, ApiResponse } from '../models/product.model';
import { APP_CONFIG } from '../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = APP_CONFIG.apiUrl + '/products';

  private _products = signal<Product[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  getAll(includeInactive = false): Observable<Product[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .get<Product[]>(this.apiUrl, { params: { includeInactive: includeInactive.toString() } })
      .pipe(
        tap((products) => {
          this._products.set(products);
          this._loading.set(false);
        }),
        catchError((error) => {
          this._error.set(error.message);
          this._loading.set(false);
          return of([]);
        }),
      );
  }

  getById(id: string): Observable<Product> {
    this._loading.set(true);
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this._loading.set(false)),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        throw error;
      }),
    );
  }

  create(product: CreateProductDto): Observable<Product> {
    this._loading.set(true);
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap((newProduct) => {
        this._products.update((products) => [...products, newProduct]);
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        throw error;
      }),
    );
  }

  update(id: string, product: UpdateProductDto): Observable<Product> {
    this._loading.set(true);
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap((updatedProduct) => {
        this._products.update((products) =>
          products.map((p) => (p.id === id ? updatedProduct : p)),
        );
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        throw error;
      }),
    );
  }

  delete(id: string): Observable<void> {
    this._loading.set(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._products.update((products) => products.filter((p) => p.id !== id));
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        throw error;
      }),
    );
  }

  getCategories(): string[] {
    const products = this._products();
    const categories = new Set(products.map((p) => p.category));
    return Array.from(categories).sort();
  }

  getLowStockProducts(): Product[] {
    return this._products().filter((p) => p.currentStock <= p.minimalStock);
  }
}
