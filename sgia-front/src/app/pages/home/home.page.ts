import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { EmpleoService } from '../../core/api/empleo.service';
import { PostulacionService } from '../../core/api/postulacion.service';
import { Empleo } from '../../core/api/models/empleo.model';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  template: `
    <div class="home-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-brand">
          <mat-icon class="brand-icon">work</mat-icon>
          <span class="brand-text">TuEmpleo</span>
        </div>
        <div class="nav-actions">
          @if (!authService.isAuthenticated()) {
            <a routerLink="/login" class="nav-link">Iniciar Sesión</a>
            <a routerLink="/registro" class="nav-link btn-primary">Crear Cuenta</a>
          } @else {
            <a routerLink="/app/dashboard" class="nav-link btn-primary">Mi Cuenta</a>
          }
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            Encuentra el empleo<br>
            <span class="highlight">perfecto para ti</span>
          </h1>
          <p class="hero-subtitle">
            Conecta con empresas que buscan talento como tú
          </p>
          
          <!-- Search Box -->
          <div class="search-box">
            <div class="search-row">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Buscar empleo</mat-label>
                <input matInput [(ngModel)]="busqueda" (keyup.enter)="buscar()">
                <mat-icon matPrefix>search</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Modalidad</mat-label>
                <mat-select [(ngModel)]="modalidadFiltro">
                  <mat-option value="">Todas</mat-option>
                  <mat-option value="Remoto">Remoto</mat-option>
                  <mat-option value="Presencial">Presencial</mat-option>
                  <mat-option value="Hibrido">Híbrido</mat-option>
                </mat-select>
              </mat-form-field>
              
              <button mat-flat-button class="search-btn" (click)="buscar()">
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Empleos Section -->
      <section class="empleos-section">
        <div class="section-header">
          <h2>Empleos Disponibles</h2>
          <span class="empleos-count">{{ empleos().length }} ofertas</span>
        </div>

        @if (loading()) {
          <div class="loading">
            <mat-icon class="spinner">refresh</mat-icon>
            <p>Cargando empleos...</p>
          </div>
        } @else if (empleos().length === 0) {
          <div class="empty-state">
            <mat-icon>work_off</mat-icon>
            <p>No se encontraron empleos</p>
          </div>
        } @else {
          <div class="empleos-grid">
            @for (empleo of empleos(); track empleo.id) {
              <div class="empleo-card">
                @if (empleo.destacado) {
                  <div class="badge-destacado">Destacado</div>
                }
                <div class="card-header">
                  <h3>{{ empleo.titulo }}</h3>
                  <span class="empresa">{{ empleo.nombreEmpresa }}</span>
                </div>
                <div class="card-info">
                  <span class="info-item">
                    <mat-icon>location_on</mat-icon>
                    {{ empleo.ubicacion || 'No especificado' }}
                  </span>
                  <span class="info-item">
                    <mat-icon>{{ getModalidadIcon(empleo.modalidad) }}</mat-icon>
                    {{ empleo.modalidad }}
                  </span>
                  <span class="info-item">
                    <mat-icon>schedule</mat-icon>
                    {{ empleo.tipoContrato }}
                  </span>
                </div>
                @if (empleo.salarioMinimo) {
                  <div class="salario">
                    <mat-icon>payments</mat-icon>
                    {{ empleo.moneda }} {{ empleo.salarioMinimo | number }} - {{ empleo.salarioMaximo | number }}
                  </div>
                }
                <div class="card-actions">
                  <a [routerLink]="['/empleos', empleo.id]" class="btn-details">
                    Ver Detalles
                  </a>
                </div>
              </div>
            }
          </div>
        }
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-brand">
            <mat-icon>work</mat-icon>
            <span>TuEmpleo</span>
          </div>
          <p class="footer-text">Plataforma de empleo - Bolivia</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: #f8fafc;
      color: #1e293b;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-icon {
      color: #3b82f6;
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .brand-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }

    .nav-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-link {
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-link:hover {
      color: white;
    }

    .btn-primary {
      background: #3b82f6;
      color: white !important;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .hero {
      padding: 4rem 2rem;
      text-align: center;
      background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      color: #1e293b;
    }

    .highlight {
      background: linear-gradient(135deg, #3b82f6, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #94a3b8;
      margin-bottom: 2rem;
    }

    .search-box {
      max-width: 800px;
      margin: 0 auto;
    }

    .search-row {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    .filter-field {
      width: 150px;
    }

    .search-btn {
      background: #3b82f6 !important;
      color: white !important;
      height: 56px;
      padding: 0 2rem !important;
    }

    .empleos-section {
      padding: 3rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
    }

    .empleos-count {
      color: #94a3b8;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 4rem;
      color: #94a3b8;
    }

    .spinner {
      animation: spin 1s linear infinite;
      font-size: 3rem;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .empleos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .empleo-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      position: relative;
      transition: all 0.3s;
    }

    .empleo-card:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
    }

    .badge-destacado {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .card-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.25rem;
    }

    .empresa {
      color: #3b82f6;
      font-size: 0.9rem;
    }

    .card-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .info-item mat-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
      color: #64748b;
    }

    .salario {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #10b981;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .card-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn-details {
      background: transparent;
      border: 1px solid #3b82f6;
      color: #3b82f6;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-details:hover {
      background: #3b82f6;
      color: white;
    }

    .footer {
      background: #1e293b;
      padding: 2rem;
      margin-top: 3rem;
      border-top: 1px solid #334155;
    }

    .footer-content {
      text-align: center;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .footer-brand mat-icon {
      color: #3b82f6;
    }

    .footer-brand span {
      font-weight: 700;
      color: white;
    }

    .footer-text {
      color: #64748b;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .search-row {
        flex-direction: column;
      }

      .search-field, .filter-field {
        width: 100%;
      }

      .empleos-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class HomePage implements OnInit {
  authService = inject(AuthService);
  private empleoService = inject(EmpleoService);

  empleos = signal<Empleo[]>([]);
  loading = signal(true);
  busqueda = '';
  modalidadFiltro = '';

  ngOnInit(): void {
    this.loadEmpleos();
  }

  loadEmpleos(): void {
    this.loading.set(true);
    const filtro: any = {};
    if (this.busqueda) filtro['busqueda'] = this.busqueda;
    if (this.modalidadFiltro) filtro['modalidad'] = this.modalidadFiltro;

    this.empleoService.getAll(filtro).subscribe({
      next: (data) => {
        this.empleos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  buscar(): void {
    this.loadEmpleos();
  }

  getModalidadIcon(modalidad: string): string {
    switch (modalidad) {
      case 'Remoto': return 'home_work';
      case 'Hibrido': return 'sync_alt';
      default: return 'business';
    }
  }
}
