import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from '../../../../core/api/services/product.service';
import { Product } from '../../../../core/api/models/product.model';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  template: `
    <div class="products-container">
      <div class="header">
        <h1>Productos</h1>
        <button mat-raised-button color="primary" routerLink="/products/new">
          <mat-icon>add</mat-icon>
          Nuevo Producto
        </button>
      </div>

      <mat-card class="filter-card">
        <mat-form-field appearance="outline">
          <mat-label>Buscar</mat-label>
          <input
            matInput
            (keyup)="applyFilter($event)"
            placeholder="Código, nombre o descripción"
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <mat-select (selectionChange)="filterByCategory($event.value)">
            <mat-option value="">Todas</mat-option>
            @for (category of categories(); track category) {
              <mat-option [value]="category">{{ category }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </mat-card>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      } @else {
        <mat-card class="table-card">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="code">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
              <td mat-cell *matCellDef="let product">{{ product.code }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
              <td mat-cell *matCellDef="let product">{{ product.name }}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Categoría</th>
              <td mat-cell *matCellDef="let product">
                <mat-chip>{{ product.category }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="currentStock">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock</th>
              <td mat-cell *matCellDef="let product">
                <span [class.low-stock]="product.currentStock <= product.minimalStock">
                  {{ product.currentStock }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="unitPrice">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Precio</th>
              <td mat-cell *matCellDef="let product">{{ product.unitPrice | currency }}</td>
            </ng-container>

            <ng-container matColumnDef="isActive">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
              <td mat-cell *matCellDef="let product">
                <mat-chip [color]="product.isActive ? 'primary' : 'warn'" highlighted>
                  {{ product.isActive ? 'Activo' : 'Inactivo' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let product">
                <button mat-icon-button [routerLink]="['/products', product.id]" matTooltip="Ver">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button
                  mat-icon-button
                  [routerLink]="['/products', product.id, 'edit']"
                  matTooltip="Editar"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteProduct(product)"
                  matTooltip="Eliminar"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `
      .products-container {
        padding: 1rem;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      h1 {
        margin: 0;
        color: #333;
      }

      .filter-card {
        padding: 1rem;
        margin-bottom: 1rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      mat-form-field {
        flex: 1;
        min-width: 200px;
      }

      .table-card {
        overflow: hidden;
      }

      table {
        width: 100%;
      }

      .low-stock {
        color: #f57c00;
        font-weight: bold;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 3rem;
      }

      th.mat-header-cell {
        font-weight: bold;
      }
    `,
  ],
})
export class ProductListPage implements OnInit {
  private productService = inject(ProductService);

  displayedColumns = [
    'code',
    'name',
    'category',
    'currentStock',
    'unitPrice',
    'isActive',
    'actions',
  ];
  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = signal(false);
  categories = signal<string[]>([]);

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (products) => {
        this.dataSource.data = products;
        this.categories.set(this.productService.getCategories());
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByCategory(category: string): void {
    if (category) {
      this.dataSource.filter = category;
    } else {
      this.dataSource.filter = '';
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`¿Está seguro de eliminar el producto "${product.name}"?`)) {
      this.productService.delete(product.id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          alert('Error al eliminar producto: ' + err.message);
        },
      });
    }
  }
}
