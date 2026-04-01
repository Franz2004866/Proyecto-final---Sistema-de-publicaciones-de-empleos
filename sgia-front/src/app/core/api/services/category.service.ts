import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';
import { APP_CONFIG } from '../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = APP_CONFIG.apiUrl + '/categories';

  private _categories = signal<Category[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  getAll(includeInactive = false): Observable<Category[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .get<Category[]>(this.apiUrl, { params: { includeInactive: includeInactive.toString() } })
      .pipe(
        tap((categories) => {
          this._categories.set(categories);
          this._loading.set(false);
        }),
        catchError((error) => {
          this._error.set(error.message);
          this._loading.set(false);
          return of([]);
        }),
      );
  }

  getById(id: string): Observable<Category> {
    this._loading.set(true);
    return this.http.get<Category>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this._loading.set(false)),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        throw error;
      }),
    );
  }

  create(category: CreateCategoryDto): Observable<Category> {
    this._loading.set(true);
    return this.http.post<Category>(this.apiUrl, category).pipe(
      tap((newCategory) => {
        this._categories.update((categories) => [...categories, newCategory]);
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        throw error;
      }),
    );
  }

  update(id: string, category: UpdateCategoryDto): Observable<Category> {
    this._loading.set(true);
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category).pipe(
      tap((updatedCategory) => {
        this._categories.update((categories) =>
          categories.map((c) => (c.id === id ? updatedCategory : c)),
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
        this._categories.update((categories) => categories.filter((c) => c.id !== id));
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        throw error;
      }),
    );
  }

  getActiveCategories(): Category[] {
    return this._categories().filter((c) => c.isActive);
  }
}
