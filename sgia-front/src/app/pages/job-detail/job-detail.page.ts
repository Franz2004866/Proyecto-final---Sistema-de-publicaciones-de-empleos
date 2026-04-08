import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { EmpleoService } from '../../core/api/empleo.service';
import { PostulacionService } from '../../core/api/postulacion.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { Empleo } from '../../core/api/models/empleo.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="detail-container">
      <nav class="navbar">
        <a routerLink="/" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </a>
      </nav>

      @if (loading()) {
        <div class="loading">Cargando...</div>
      } @else if (empleo()) {
        <div class="detail-content">
          <div class="main-info">
            <div class="header">
              <div>
                <h1>{{ empleo()!.titulo }}</h1>
                <p class="empresa">{{ empleo()!.nombreEmpresa }}</p>
              </div>
              @if (empleo()!.destacado) {
                <span class="badge-destacado">Destacado</span>
              }
            </div>

            <div class="info-grid">
              <div class="info-item">
                <mat-icon>location_on</mat-icon>
                <span>{{ empleo()!.ubicacion || 'No especificado' }}</span>
              </div>
              <div class="info-item">
                <mat-icon>{{ getModalidadIcon(empleo()!.modalidad) }}</mat-icon>
                <span>{{ empleo()!.modalidad }}</span>
              </div>
              <div class="info-item">
                <mat-icon>schedule</mat-icon>
                <span>{{ empleo()!.tipoContrato }}</span>
              </div>
              @if (empleo()!.fechaLimite) {
                <div class="info-item">
                  <mat-icon>event</mat-icon>
                  <span>Hasta: {{ empleo()!.fechaLimite | date:'dd/MM/yyyy' }}</span>
                </div>
              }
            </div>

            @if (empleo()!.salarioMinimo) {
              <div class="salario">
                <mat-icon>payments</mat-icon>
                <span>{{ empleo()!.moneda }} {{ empleo()!.salarioMinimo | number }} - {{ empleo()!.salarioMaximo | number }}</span>
              </div>
            }

            <div class="section">
              <h2>Descripción</h2>
              <p>{{ empleo()!.descripcion }}</p>
            </div>

            @if (empleo()!.requisitos) {
              <div class="section">
                <h2>Requisitos</h2>
                <p>{{ empleo()!.requisitos }}</p>
              </div>
            }

            <div class="actions">
              @if (authService.isAuthenticated()) {
                @if (!yaPostulo) {
                  <button mat-flat-button class="btn-postular" (click)="postularse()">
                    <mat-icon>send</mat-icon>
                    Postularme
                  </button>
                } @else {
                  <div class="ya-postulado">
                    <mat-icon>check_circle</mat-icon>
                    Ya postulaste a este empleo
                  </div>
                }
              } @else {
                <a routerLink="/login" class="btn-login-required">
                  Inicia sesión para postulart
                </a>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-container {
      min-height: 100vh;
      background: #f8fafc;
      color: #1e293b;
    }

    .navbar {
      padding: 1rem 2rem;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s;
    }

    .back-btn:hover { color: white; }

    .loading {
      text-align: center;
      padding: 4rem;
      color: #94a3b8;
    }

    .detail-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 2rem;
      color: white;
      margin-bottom: 0.5rem;
    }

    .empresa {
      color: #3b82f6;
      font-size: 1.1rem;
    }

    .badge-destacado {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
    }

    .info-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
    }

    .info-item mat-icon {
      color: #64748b;
    }

    .salario {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #10b981;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 2rem;
    }

    .section {
      margin-bottom: 2rem;
    }

    .section h2 {
      color: white;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .section p {
      color: #94a3b8;
      line-height: 1.7;
      white-space: pre-line;
    }

    .actions {
      margin-top: 3rem;
    }

    .btn-postular {
      background: #10b981 !important;
      color: white !important;
      padding: 1rem 2rem !important;
      font-size: 1.1rem;
    }

    .ya-postulado {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #10b981;
      font-weight: 500;
    }

    .btn-login-required {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
    }
  `],
})
export class JobDetailPage implements OnInit {
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private empleoService = inject(EmpleoService);
  private postulacionService = inject(PostulacionService);
  private snackBar = inject(MatSnackBar);

  empleo = signal<Empleo | null>(null);
  loading = signal(true);
  yaPostulo = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmpleo(id);
  }

  loadEmpleo(id: number): void {
    this.empleoService.getById(id).subscribe({
      next: (data) => {
        this.empleo.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getModalidadIcon(modalidad: string): string {
    switch (modalidad) {
      case 'Remoto': return 'home_work';
      case 'Hibrido': return 'sync_alt';
      default: return 'business';
    }
  }

  postularse(): void {
    const empleoId = this.empleo()?.id;
    if (!empleoId) return;

    this.postulacionService.create({ empleoId }).subscribe({
      next: () => {
        this.yaPostulo = true;
        this.snackBar.open('¡Postulación enviada con éxito!', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al enviar postulación', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
