import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {
  DashboardService,
  DashboardSummary,
} from '../../../../core/api/services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon class="stat-icon products">inventory</mat-icon>
            <div class="stat-value">{{ summary()?.totalProducts || 0 }}</div>
            <div class="stat-label">Total Productos</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon class="stat-icon warning">warning</mat-icon>
            <div class="stat-value">{{ summary()?.lowStockProducts || 0 }}</div>
            <div class="stat-label">Stock Bajo</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon class="stat-icon categories">category</mat-icon>
            <div class="stat-value">{{ summary()?.totalCategories || 0 }}</div>
            <div class="stat-label">Categorías</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon class="stat-icon value">attach_money</mat-icon>
            <div class="stat-value">{{ summary()?.totalStockValue | currency }}</div>
            <div class="stat-label">Valor Total Stock</div>
          </mat-card-content>
        </mat-card>
      </div>

      @if (summary()?.lowStockAlerts && summary()!.lowStockAlerts.length > 0) {
        <mat-card class="alert-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">warning</mat-icon>
            <mat-card-title>Alertas de Stock</mat-card-title>
            <mat-card-subtitle>Productos con stock bajo del mínimo</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="low-stock-list">
              @for (alert of summary()?.lowStockAlerts; track alert.productId) {
                <div class="low-stock-item">
                  <span>{{ alert.productName }}</span>
                  <span class="stock-info">
                    Actual: <strong>{{ alert.currentStock }}</strong> / Mínimo:
                    {{ alert.minimalStock }}
                  </span>
                </div>
              }
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/products">
              Ver Todos los Productos
            </button>
          </mat-card-actions>
        </mat-card>
      }

      @if (summary()?.recentActivity && summary()!.recentActivity.length > 0) {
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>history</mat-icon>
            <mat-card-title>Actividad Reciente</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              @for (activity of summary()?.recentActivity; track $index) {
                <div class="activity-item">
                  <mat-icon class="activity-icon">
                    {{ activity.type === 'Entrada' ? 'arrow_downward' : 'arrow_upward' }}
                  </mat-icon>
                  <span class="activity-desc">{{ activity.description }}</span>
                  <span class="activity-date">{{ activity.date | date: 'dd/MM HH:mm' }}</span>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 1rem;
      }

      h1 {
        margin-bottom: 1.5rem;
        color: #333;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        text-align: center;
        padding: 1rem;
      }

      .stat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 0.5rem;
      }

      .stat-icon.products {
        color: #1976d2;
      }
      .stat-icon.warning {
        color: #f57c00;
      }
      .stat-icon.categories {
        color: #7b1fa2;
      }
      .stat-icon.value {
        color: #388e3c;
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: bold;
        color: #333;
      }

      .stat-label {
        color: #666;
        font-size: 0.9rem;
      }

      .alert-card {
        border-left: 4px solid #f57c00;
        margin-bottom: 1rem;
      }

      .low-stock-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .low-stock-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        background: #fff3e0;
        border-radius: 4px;
      }

      .stock-info {
        color: #f57c00;
      }

      .activity-card {
        margin-bottom: 1rem;
      }

      .activity-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .activity-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: #f5f5f5;
        border-radius: 4px;
      }

      .activity-icon {
        color: #666;
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
      }

      .activity-desc {
        flex: 1;
      }

      .activity-date {
        color: #666;
        font-size: 0.8rem;
      }
    `,
  ],
})
export class DashboardPage implements OnInit {
  private dashboardService = inject(DashboardService);

  summary = this.dashboardService.summary;

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe();
  }
}
