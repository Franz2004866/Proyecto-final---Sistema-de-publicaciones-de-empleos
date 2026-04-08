import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PostulacionService } from '../../../core/api/postulacion.service';
import { Postulacion } from '../../../core/api/models/postulacion.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatSelectModule, MatSnackBarModule],
  template: `
    <div class="applications-page">
      <h1>Postulaciones Recibidas</h1>

      @if (loading()) {
        <p class="loading">Cargando...</p>
      } @else if (postulaciones().length === 0) {
        <div class="empty-state">
          <mat-icon>inbox</mat-icon>
          <p>No hay postulaciones aún</p>
        </div>
      } @else {
        <div class="postulaciones-list">
          @for (post of postulaciones(); track post.id) {
            <div class="postulacion-card">
              <div class="post-info">
                <div class="post-header">
                  <h3>{{ post.nombrePostulante }}</h3>
                  <span class="estado" [class]="getEstadoClass(post.estado)">{{ post.estado }}</span>
                </div>
                <p class="email">{{ post.emailPostulante }}</p>
                <p class="empleo">Postuló a: {{ post.tituloEmpleo }}</p>
                <p class="fecha">Fecha: {{ post.fechaPostulacion | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
              <div class="post-actions">
                <select [(ngModel)]="post.estado" (change)="actualizarEstado(post)" class="estado-select">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Revisando">Revisando</option>
                  <option value="Aceptado">Aceptado</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .applications-page { max-width: 900px; }
    h1 { color: white; margin-bottom: 2rem; }

    .loading, .empty-state {
      text-align: center;
      padding: 4rem;
      color: #94a3b8;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #64748b;
      margin-bottom: 1rem;
    }

    .postulaciones-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .postulacion-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .post-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    h3 { color: #1e293b; margin: 0; }

    .estado {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .estado.Pendiente { background: #f1f5f9; color: #64748b; }
    .estado.Revisando { background: #fef3c7; color: #d97706; }
    .estado.Aceptado { background: #d1fae5; color: #059669; }
    .estado.Rechazado { background: #fee2e2; color: #dc2626; }

    .email { color: #3b82f6; margin: 0.25rem 0; }
    .empleo { color: #64748b; margin: 0.25rem 0; }
    .fecha { color: #64748b; font-size: 0.85rem; margin: 0.25rem 0; }

    .post-actions {
      display: flex;
      align-items: flex-start;
    }

    .estado-select {
      padding: 0.5rem 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      color: #1e293b;
      cursor: pointer;
    }
  `],
})
export class ApplicationsPage implements OnInit {
  private postulacionService = inject(PostulacionService);
  private snackBar = inject(MatSnackBar);

  postulaciones = signal<Postulacion[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadPostulaciones();
  }

  loadPostulaciones(): void {
    this.postulacionService.getAll().subscribe({
      next: (data) => {
        this.postulaciones.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getEstadoClass(estado: string): string {
    return estado;
  }

  actualizarEstado(postulacion: Postulacion): void {
    this.postulacionService.update(postulacion.id, { estado: postulacion.estado }).subscribe({
      next: () => {
        this.snackBar.open('Estado actualizado', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 2000 });
      },
    });
  }
}
