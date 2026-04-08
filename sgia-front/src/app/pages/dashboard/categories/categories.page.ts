import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoriaService } from '../../../core/api/services/categoria.service';
import { CategoriaEmpleo } from '../../../core/api/models/categoria.model';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestión de Categorías</h1>
        <button class="btn-primary">
          <mat-icon>add</mat-icon>
          Nueva Categoría
        </button>
      </div>

      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      } @else if (categorias().length === 0) {
        <div class="empty-state">
          <mat-icon>category</mat-icon>
          <p>No hay categorías disponibles</p>
          <p class="empty-subtitle">Crea la primera categoría para comenzar</p>
        </div>
      } @else {
        <div class="categories-grid">
          @for (categoria of categorias(); track categoria.id) {
            <div class="category-card">
              <div class="category-icon" [style.background]="categoria.color || '#3b82f6'">
                <mat-icon>{{ categoria.icono || 'category' }}</mat-icon>
              </div>
              <div class="category-info">
                <h3>{{ categoria.nombre }}</h3>
                <p class="description">{{ categoria.descripcion || 'Sin descripción' }}</p>
                <span class="count">{{ categoria.totalEmpleos || 0 }} empleos</span>
              </div>
              <div class="category-actions">
                <button class="btn-icon" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button class="btn-icon delete" title="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; color: #1e293b; }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    h1 { font-size: 1.5rem; font-weight: 600; color: #1e293b; margin: 0; }
    
    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .btn-primary:hover { background: #2563eb; }
    
    .loading, .empty-state {
      text-align: center;
      padding: 4rem;
      color: #64748b;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    
    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #94a3b8;
    }
    
    .empty-subtitle { font-size: 0.9rem; color: #94a3b8; }
    
    .categories-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .category-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem;
    }
    
    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .category-icon mat-icon { font-size: 1.5rem; }
    
    .category-info { flex: 1; }
    
    .category-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      color: #1e293b;
    }
    
    .category-info .description {
      margin: 0 0 0.25rem 0;
      font-size: 0.85rem;
      color: #64748b;
    }
    
    .category-info .count {
      font-size: 0.75rem;
      color: #3b82f6;
      background: #eff6ff;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
    
    .category-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-icon {
      background: #f1f5f9;
      border: none;
      color: #64748b;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-icon:hover { background: #e2e8f0; color: #1e293b; }
    
    .btn-icon.delete:hover { background: #fee2e2; color: #ef4444; }
  `]
})
export class CategoriesPage implements OnInit {
  private categoriaService = inject(CategoriaService);
  
  categorias = signal<CategoriaEmpleo[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}