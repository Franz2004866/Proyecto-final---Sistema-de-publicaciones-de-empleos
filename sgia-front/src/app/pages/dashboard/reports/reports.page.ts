import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Reportes del Sistema</h1>
      </div>

      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card blue">
            <div class="stat-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()['usuarios'] || 0 }}</span>
              <span class="stat-label">Total Usuarios</span>
            </div>
          </div>

          <div class="stat-card green">
            <div class="stat-icon">
              <mat-icon>work</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()['empleos'] || 0 }}</span>
              <span class="stat-label">Empleos Publicados</span>
            </div>
          </div>

          <div class="stat-card purple">
            <div class="stat-icon">
              <mat-icon>assignment</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()['postulaciones'] || 0 }}</span>
              <span class="stat-label">Postulaciones</span>
            </div>
          </div>
        </div>

        <div class="charts-section">
          <div class="chart-card">
            <h3>Resumen General</h3>
            <div class="chart-content">
              <div class="chart-bar">
                <div class="bar-label">Usuarios</div>
                <div class="bar-container">
                  <div class="bar blue" [style.width.%]="getPercentage(stats()['usuarios'])"></div>
                </div>
                <div class="bar-value">{{ stats()['usuarios'] || 0 }}</div>
              </div>
              <div class="chart-bar">
                <div class="bar-label">Empleos</div>
                <div class="bar-container">
                  <div class="bar green" [style.width.%]="getPercentage(stats()['empleos'])"></div>
                </div>
                <div class="bar-value">{{ stats()['empleos'] || 0 }}</div>
              </div>
              <div class="chart-bar">
                <div class="bar-label">Postulaciones</div>
                <div class="bar-container">
                  <div class="bar purple" [style.width.%]="getPercentage(stats()['postulaciones'])"></div>
                </div>
                <div class="bar-value">{{ stats()['postulaciones'] || 0 }}</div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; color: #1e293b; }
    
    .page-header { margin-bottom: 2rem; }
    h1 { font-size: 1.5rem; font-weight: 600; color: #1e293b; margin: 0; }
    
    .loading {
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
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
    }
    
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .stat-icon mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }
    
    .stat-card.blue .stat-icon { background: #dbeafe; color: #3b82f6; }
    .stat-card.green .stat-icon { background: #d1fae5; color: #10b981; }
    .stat-card.purple .stat-icon { background: #ede9fe; color: #8b5cf6; }
    
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.75rem; font-weight: 700; color: #1e293b; }
    .stat-label { font-size: 0.85rem; color: #64748b; }
    
    .charts-section { margin-top: 2rem; }
    
    .chart-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
    }
    
    .chart-card h3 {
      margin: 0 0 1.5rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }
    
    .chart-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .bar-label {
      width: 100px;
      font-size: 0.9rem;
      color: #64748b;
    }
    
    .bar-container {
      flex: 1;
      height: 24px;
      background: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .bar {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s;
    }
    
    .bar.blue { background: #3b82f6; }
    .bar.green { background: #10b981; }
    .bar.purple { background: #8b5cf6; }
    
    .bar-value {
      width: 50px;
      text-align: right;
      font-weight: 600;
      color: #1e293b;
    }
    
    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ReportsPage implements OnInit {
  private http = inject(HttpClient);
  
  stats = signal<{usuarios?: number, empleos?: number, postulaciones?: number}>({});
  loading = signal(true);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.http.get<any>(`${environment.apiUrl}/reportes/resumen`).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getPercentage(value?: number): number {
    const max = Math.max(
      this.stats()['usuarios'] || 0,
      this.stats()['empleos'] || 0,
      this.stats()['postulaciones'] || 0
    );
    if (max === 0 || !value) return 0;
    return (value / max) * 100;
  }
}