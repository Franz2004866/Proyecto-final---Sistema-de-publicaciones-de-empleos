import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/services/auth.service';
import { EmpleoService } from '../../core/api/empleo.service';
import { PostulacionService } from '../../core/api/postulacion.service';
import { Empleo } from '../../core/api/models/empleo.model';
import { Postulacion } from '../../core/api/models/postulacion.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard">
      <div class="welcome">
        <h1>Bienvenido, {{ authService.user()?.username }}</h1>
        <p>{{ getWelcomeMessage() }}</p>
      </div>

      <div class="stats-grid">
        @if (authService.isAdmin()) {
          <div class="stat-card">
            <mat-icon class="stat-icon blue">work</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ empleos().length }}</span>
              <span class="stat-label">Total Empleos</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon class="stat-icon green">people</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ totalPostulaciones() }}</span>
              <span class="stat-label">Total Postulaciones</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon class="stat-icon purple">pending_actions</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ postulacionesPendientes() }}</span>
              <span class="stat-label">Pendientes</span>
            </div>
          </div>
        }

        @if (authService.isEmpresa()) {
          <div class="stat-card">
            <mat-icon class="stat-icon blue">work</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ empleos().length }}</span>
              <span class="stat-label">Empleos Publicados</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon class="stat-icon green">people</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ totalPostulaciones() }}</span>
              <span class="stat-label">Total Postulaciones</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon class="stat-icon purple">pending_actions</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ postulacionesPendientes() }}</span>
              <span class="stat-label">Pendientes</span>
            </div>
          </div>
        }

        @if (authService.isPostulante()) {
          <div class="stat-card">
            <mat-icon class="stat-icon blue">send</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ misPostulaciones().length }}</span>
              <span class="stat-label">Mis Postulaciones</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon class="stat-icon yellow">hourglass_empty</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ postulacionesPendientes() }}</span>
              <span class="stat-label">Pendientes</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon class="stat-icon green">check_circle</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ postulacionesAceptadas() }}</span>
              <span class="stat-label">Aceptadas</span>
            </div>
          </div>
        }
      </div>

      @if (authService.isAdmin()) {
        <div class="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div class="actions-row">
            <a routerLink="/app/categorias" class="action-btn primary">
              <mat-icon>category</mat-icon>
              Gestionar Categorías
            </a>
            <a routerLink="/" class="action-btn">
              <mat-icon>visibility</mat-icon>
              Ver Empleos
            </a>
          </div>
        </div>
      }

      @if (authService.isEmpresa()) {
        <div class="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div class="actions-row">
            <a routerLink="/app/empleos/nuevo" class="action-btn primary">
              <mat-icon>add</mat-icon>
              Publicar Empleo
            </a>
            <a routerLink="/app/postulaciones" class="action-btn">
              <mat-icon>visibility</mat-icon>
              Ver Postulaciones
            </a>
          </div>
        </div>

        <div class="recent-section">
          <h2>Empleos Recientes</h2>
          @if (empleos().length === 0) {
            <p class="empty-text">No tienes empleos publicados aún.</p>
          } @else {
            <div class="empleos-list">
              @for (empleo of empleos().slice(0, 5); track empleo.id) {
                <div class="empleo-item">
                  <div class="empleo-info">
                    <h3>{{ empleo.titulo }}</h3>
                    <span class="empleo-meta">{{ empleo.totalPostulaciones }} postulaciones</span>
                  </div>
                  <a [routerLink]="['/app/empleos', empleo.id, 'editar']" class="edit-link">
                    <mat-icon>edit</mat-icon>
                  </a>
                </div>
              }
            </div>
          }
        </div>
      }

      @if (authService.isPostulante()) {
        <div class="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div class="actions-row">
            <a routerLink="/" class="action-btn primary">
              <mat-icon>search</mat-icon>
              Buscar Empleos
            </a>
            <a routerLink="/app/mis-postulaciones" class="action-btn">
              <mat-icon>visibility</mat-icon>
              Ver Mis Postulaciones
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
    }

    .welcome {
      margin-bottom: 2rem;
    }

    h1 {
      color: white;
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: #64748b;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .stat-icon.blue { color: #3b82f6; }
    .stat-icon.green { color: #10b981; }
    .stat-icon.purple { color: #8b5cf6; }
    .stat-icon.yellow { color: #f59e0b; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      color: white;
      font-size: 2rem;
      font-weight: 700;
    }

    .stat-label {
      color: #64748b;
      font-size: 0.9rem;
    }

    h2 {
      color: white;
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .quick-actions {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .actions-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
      background: #94a3b8;
      color: white;
    }

    .action-btn:hover {
      background: #64748b;
    }

    .action-btn.primary {
      background: #3b82f6;
      color: white;
    }

    .action-btn.primary:hover {
      background: #2563eb;
    }

    .recent-section {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
    }

    .empty-text {
      color: #64748b;
      text-align: center;
      padding: 2rem;
    }

    .empleos-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .empleo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f1f5f9;
      border-radius: 8px;
    }

    .empleo-info h3 {
      color: #1e293b;
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .empleo-meta {
      color: #64748b;
      font-size: 0.85rem;
    }

    .edit-link {
      color: #64748b;
      transition: color 0.2s;
    }

    .edit-link:hover {
      color: #3b82f6;
    }
  `],
})
export class DashboardPage implements OnInit {
  authService = inject(AuthService);
  private empleoService = inject(EmpleoService);
  private postulacionService = inject(PostulacionService);

  empleos = signal<Empleo[]>([]);
  misPostulaciones = signal<Postulacion[]>([]);
  totalPostulaciones = signal(0);
  postulacionesPendientes = signal(0);
  postulacionesAceptadas = signal(0);

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.loadAdminData();
    } else if (this.authService.isEmpresa()) {
      this.loadEmpresaData();
    } else if (this.authService.isPostulante()) {
      this.loadPostulanteData();
    }
  }

  loadAdminData(): void {
    this.empleoService.getAll().subscribe({
      next: (data) => {
        this.empleos.set(data);
      },
    });

    this.postulacionService.getAll().subscribe({
      next: (data) => {
        this.totalPostulaciones.set(data.length);
        this.postulacionesPendientes.set(data.filter(p => p.estado === 'Pendiente').length);
      },
    });
  }

  loadEmpresaData(): void {
    this.empleoService.getAll().subscribe({
      next: (data) => {
        this.empleos.set(data);
        const total = data.reduce((sum, e) => sum + (e.totalPostulaciones || 0), 0);
        this.totalPostulaciones.set(total);
      },
    });

    this.postulacionService.getAll().subscribe({
      next: (data) => {
        const pendientes = data.filter(p => p.estado === 'Pendiente').length;
        this.postulacionesPendientes.set(pendientes);
      },
    });
  }

  loadPostulanteData(): void {
    this.postulacionService.getMyPostulaciones().subscribe({
      next: (data) => {
        this.misPostulaciones.set(data);
        const pendientes = data.filter(p => p.estado === 'Pendiente').length;
        const aceptadas = data.filter(p => p.estado === 'Aceptado').length;
        this.postulacionesPendientes.set(pendientes);
        this.postulacionesAceptadas.set(aceptadas);
      },
    });
  }

  getWelcomeMessage(): string {
    if (this.authService.isAdmin()) {
      return 'Panel de administración del sistema. Gestiona usuarios, categorías y contenido.';
    }
    if (this.authService.isEmpresa()) {
      return 'Gestiona tus empleos y revisa las postulaciones de tus candidatos.';
    }
    return 'Revisa el estado de tus postulaciones y encuentra nuevas oportunidades.';
  }
}
