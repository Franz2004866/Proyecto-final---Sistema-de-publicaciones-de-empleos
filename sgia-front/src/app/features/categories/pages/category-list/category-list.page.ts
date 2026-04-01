import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryService } from '../../../../core/api/services/category.service';
import { Category } from '../../../../core/api/models/category.model';

@Component({
  selector: 'app-category-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Categorías</h1>
        <button mat-raised-button color="primary" routerLink="/categories/new">
          <mat-icon>add</mat-icon>
          Nueva Categoría
        </button>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      } @else if (categories().length === 0) {
        <mat-card>
          <mat-card-content>
            <div class="empty-state">
              <mat-icon>folder_off</mat-icon>
              <p>No hay categorías registradas</p>
              <button mat-button color="primary" routerLink="/categories/new">
                Crear primera categoría
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card>
          <mat-card-content>
            <table mat-table [dataSource]="categories()" class="full-width-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let category">
                  <div class="category-name">
                    <span class="color-dot" [style.backgroundColor]="category.color"></span>
                    {{ category.name }}
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="isActive">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let category">
                  <mat-chip [color]="category.isActive ? 'accent' : 'warn'" highlighted>
                    {{ category.isActive ? 'Activa' : 'Inactiva' }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Fecha Creación</th>
                <td mat-cell *matCellDef="let category">
                  {{ category.createdAt | date: 'dd/MM/yyyy' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let category">
                  <button mat-icon-button [routerLink]="['/categories', category.id, 'edit']">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteCategory(category)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 1rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .page-header h1 {
        margin: 0;
        color: #333;
      }

      .full-width-table {
        width: 100%;
      }

      .category-name {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
      }

      .empty-state {
        text-align: center;
        padding: 2rem;
        color: #666;
      }

      .empty-state mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
        color: #ccc;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 3rem;
      }
    `,
  ],
})
export class CategoryListPage implements OnInit {
  private categoryService = inject(CategoryService);

  categories = this.categoryService.categories;
  loading = this.categoryService.loading;
  displayedColumns = ['name', 'isActive', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.categoryService.getAll(true).subscribe();
  }

  deleteCategory(category: Category): void {
    if (confirm(`¿Está seguro que desea eliminar la categoría "${category.name}"?`)) {
      this.categoryService.delete(category.id).subscribe({
        next: () => {
          this.categoryService.getAll(true).subscribe();
        },
        error: (err) => {
          alert('Error al eliminar categoría: ' + err.message);
        },
      });
    }
  }
}
