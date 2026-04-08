import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PostulacionService } from '../../../core/api/postulacion.service';
import { Postulacion } from '../../../core/api/models/postulacion.model';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="my-applications-page">
      <h1>Mis Postulaciones</h1>

      @if (loading()) {
        <p class="loading">Cargando...</p>
      } @else if (postulaciones().length === 0) {
        <div class="empty-state">
          <mat-icon>assignment</mat-icon>
          <p>No has postulado a ningún empleo aún</p>
          <a href="/" class="btn-primary">Ver Empleos</a>
        </div>
      } @else {
        <div class="postulaciones-list">
          @for (post of postulaciones(); track post.id) {
            <div class="postulacion-card">
              <div class="post-info">
                <h3>{{ post.tituloEmpleo }}</h3>
                <p class="empresa">{{ post.nombreEmpresa }}</p>
                <p class="fecha">Postulado: {{ post.fechaPostulacion | date:'dd/MM/yyyy' }}</p>
              </div>
              <div class="post-status">
                <span class="estado" [class]="getEstadoClass(post.estado)">{{ post.estado }}</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .my-applications-page { max-width: 800px; }
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

    .btn-primary {
      display: inline-block;
      margin-top: 1rem;
      background: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
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
      align-items: center;
    }

    h3 { color: #1e293b; margin: 0 0 0.25rem 0; }
    .empresa { color: #3b82f6; margin: 0 0 0.5rem 0; }
    .fecha { color: #64748b; font-size: 0.85rem; margin: 0; }

    .estado {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
    }

    .estado.Pendiente { background: #64748b; color: white; }
    .estado.Revisando { background: #f59e0b; color: white; }
    .estado.Aceptado { background: #10b981; color: white; }
    .estado.Rechazado { background: #ef4444; color: white; }
  `],
})
export class MyApplicationsPage implements OnInit {
  private postulacionService = inject(PostulacionService);

  postulaciones = signal<Postulacion[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadPostulaciones();
  }

  loadPostulaciones(): void {
    this.postulacionService.getMyPostulaciones().subscribe({
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
}
