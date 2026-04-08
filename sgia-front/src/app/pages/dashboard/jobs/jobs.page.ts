import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { EmpleoService } from '../../../core/api/empleo.service';
import { Empleo } from '../../../core/api/models/empleo.model';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="jobs-page">
      <div class="page-header">
        <h1>Mis Empleos</h1>
        <a routerLink="/app/empleos/nuevo" class="btn-primary">
          <mat-icon>add</mat-icon>
          Nuevo Empleo
        </a>
      </div>

      @if (loading()) {
        <p class="loading">Cargando...</p>
      } @else if (empleos().length === 0) {
        <div class="empty-state">
          <mat-icon>work_off</mat-icon>
          <p>No tienes empleos publicados</p>
          <a routerLink="/app/empleos/nuevo" class="btn-primary">Publicar el primero</a>
        </div>
      } @else {
        <div class="empleos-list">
          @for (empleo of empleos(); track empleo.id) {
            <div class="empleo-card">
              <div class="empleo-main">
                <div class="empleo-header">
                  <h3>{{ empleo.titulo }}</h3>
                  @if (empleo.destacado) {
                    <span class="badge">Destacado</span>
                  }
                </div>
                <div class="empleo-info">
                  <span><mat-icon>location_on</mat-icon> {{ empleo.ubicacion || 'N/A' }}</span>
                  <span><mat-icon>{{ getModalidadIcon(empleo.modalidad) }}</mat-icon> {{ empleo.modalidad }}</span>
                  <span><mat-icon>people</mat-icon> {{ empleo.totalPostulaciones }} postulaciones</span>
                </div>
              </div>
              <div class="empleo-actions">
                <a [routerLink]="['/app/postulaciones']" [queryParams]="{empleo: empleo.id}" class="btn-icon" title="Ver postulaciones">
                  <mat-icon>people</mat-icon>
                </a>
                <a [routerLink]="['/app/empleos', empleo.id, 'editar']" class="btn-icon" title="Editar">
                  <mat-icon>edit</mat-icon>
                </a>
                <button class="btn-icon delete" (click)="eliminar(empleo)" title="Eliminar">
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
    .jobs-page { max-width: 1000px; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 { color: white; }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 4rem;
      color: #94a3b8;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
      color: #64748b;
    }

    .empleos-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .empleo-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .empleo-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    h3 { color: #1e293b; margin: 0; }

    .badge {
      background: #fef3c7;
      color: #d97706;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .empleo-info {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .empleo-info span {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .empleo-info mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #64748b;
    }

    .empleo-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: #f1f5f9;
      border: none;
      color: #64748b;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #475569;
      color: white;
    }

    .btn-icon.delete:hover {
      background: #dc2626;
    }
  `],
})
export class JobsPage implements OnInit {
  private empleoService = inject(EmpleoService);
  private confirmService = inject(ConfirmService);
  private snackBar = inject(MatSnackBar);

  empleos = signal<Empleo[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadEmpleos();
  }

  loadEmpleos(): void {
    this.empleoService.getAll().subscribe({
      next: (data) => {
        this.empleos.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getModalidadIcon(modalidad: string): string {
    switch (modalidad) {
      case 'Remoto': return 'home_work';
      case 'Hibrido': return 'sync_alt';
      default: return 'business';
    }
  }

  async eliminar(empleo: Empleo): Promise<void> {
    const confirmed = await this.confirmService.confirm(
      '¿Eliminar empleo?',
      `¿Estás seguro de eliminar "${empleo.titulo}"?`
    );

    if (confirmed) {
      this.empleoService.delete(empleo.id).subscribe({
        next: () => {
          this.loadEmpleos();
          this.snackBar.open('Empleo eliminado', 'Cerrar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }
}
