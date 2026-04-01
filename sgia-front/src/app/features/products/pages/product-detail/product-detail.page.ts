import { Component, inject, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService } from '../../../../core/api/services/product.service';
import { Product } from '../../../../core/api/models/product.model';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
  ],
  template: `
    <div class="detail-container">
      <div class="header">
        <button mat-icon-button routerLink="/products">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Detalle del Producto</h1>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      } @else if (product()) {
        <mat-card class="product-card">
          <mat-card-header>
            <div mat-card-avatar class="product-avatar">
              <mat-icon>inventory</mat-icon>
            </div>
            <mat-card-title>{{ product()!.name }}</mat-card-title>
            <mat-card-subtitle>{{ product()!.code }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <mat-icon>category</mat-icon>
                <div>
                  <label>Categoría</label>
                  <span>{{ product()!.category }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon>description</mat-icon>
                <div>
                  <label>Descripción</label>
                  <span>{{ product()!.description || 'Sin descripción' }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon>attach_money</mat-icon>
                <div>
                  <label>Precio Unitario</label>
                  <span>{{ product()!.unitPrice | currency }}</span>
                </div>
              </div>

              <div
                class="detail-item"
                [class.warning]="product()!.currentStock <= product()!.minimalStock"
              >
                <mat-icon>inventory_2</mat-icon>
                <div>
                  <label>Stock Actual</label>
                  <span>
                    {{ product()!.currentStock }}
                    @if (product()!.currentStock <= product()!.minimalStock) {
                      <mat-icon class="warn-icon">warning</mat-icon>
                    }
                  </span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon>trending_down</mat-icon>
                <div>
                  <label>Stock Mínimo</label>
                  <span>{{ product()!.minimalStock }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon>toggle_on</mat-icon>
                <div>
                  <label>Estado</label>
                  <mat-chip [color]="product()!.isActive ? 'primary' : 'warn'" highlighted>
                    {{ product()!.isActive ? 'Activo' : 'Inactivo' }}
                  </mat-chip>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon>calendar_today</mat-icon>
                <div>
                  <label>Fecha de Creación</label>
                  <span>{{ product()!.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>

              @if (product()!.imageUrl) {
                <div class="detail-item full-width">
                  <mat-icon>image</mat-icon>
                  <div>
                    <label>Imagen</label>
                    <img [src]="product()!.imageUrl" alt="Producto" class="product-image" />
                  </div>
                </div>
              }
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button routerLink="/products">
              <mat-icon>list</mat-icon>
              Ver Todos
            </button>
            <button
              mat-raised-button
              color="primary"
              [routerLink]="['/products', product()!.id, 'edit']"
            >
              <mat-icon>edit</mat-icon>
              Editar
            </button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `
      .detail-container {
        padding: 1rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }

      h1 {
        margin: 0;
        color: #333;
      }

      .product-card {
        overflow: hidden;
      }

      .product-avatar {
        background: #1976d2;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        padding: 1rem 0;
      }

      .detail-item {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
      }

      .detail-item.full-width {
        grid-column: 1 / -1;
      }

      .detail-item mat-icon {
        color: #1976d2;
        margin-top: 0.25rem;
      }

      .detail-item div {
        display: flex;
        flex-direction: column;
      }

      .detail-item label {
        font-size: 0.8rem;
        color: #666;
        margin-bottom: 0.25rem;
      }

      .detail-item span {
        font-size: 1rem;
        color: #333;
      }

      .detail-item.warning span {
        color: #f57c00;
      }

      .warn-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
        color: #f57c00;
        vertical-align: middle;
        margin-left: 0.5rem;
      }

      .product-image {
        max-width: 200px;
        max-height: 200px;
        border-radius: 8px;
        margin-top: 0.5rem;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 3rem;
      }

      mat-card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1rem;
      }
    `,
  ],
})
export class ProductDetailPage implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  product = signal<Product | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
