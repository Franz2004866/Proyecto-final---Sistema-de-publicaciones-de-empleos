import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ReportService } from '../../../../core/api/services/report.service';
import {
  StockValueReport,
  LowStockReport,
  MovementSummary,
} from '../../../../core/api/models/report.model';

@Component({
  selector: 'app-report-view-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  template: `
    <div class="page-container">
      <h1>Reportes</h1>

      <mat-tab-group animationDuration="200ms">
        <mat-tab label="Valor de Stock">
          <div class="tab-content">
            @if (loadingStockValue()) {
              <div class="loading-container">
                <mat-spinner diameter="50"></mat-spinner>
              </div>
            } @else if (stockValueReport()) {
              <mat-card class="summary-card">
                <mat-card-content>
                  <div class="summary-grid">
                    <div class="summary-item">
                      <span class="label">Total Productos</span>
                      <span class="value">{{ stockValueReport()?.totalProducts }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="label">Valor Total</span>
                      <span class="value">{{ stockValueReport()?.totalValue | currency }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Valor por Categoría</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <table
                    mat-table
                    [dataSource]="stockValueReport()?.byCategory || []"
                    class="full-width-table"
                  >
                    <ng-container matColumnDef="category">
                      <th mat-header-cell *matHeaderCellDef>Categoría</th>
                      <td mat-cell *matCellDef="let row">{{ row.category || 'Sin categoría' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="count">
                      <th mat-header-cell *matHeaderCellDef>Productos</th>
                      <td mat-cell *matCellDef="let row">{{ row.count }}</td>
                    </ng-container>
                    <ng-container matColumnDef="value">
                      <th mat-header-cell *matHeaderCellDef>Valor</th>
                      <td mat-cell *matCellDef="let row">{{ row.value | currency }}</td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="categoryColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: categoryColumns"></tr>
                  </table>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </mat-tab>

        <mat-tab label="Stock Bajo">
          <div class="tab-content">
            @if (loadingLowStock()) {
              <div class="loading-container">
                <mat-spinner diameter="50"></mat-spinner>
              </div>
            } @else if (lowStockReport().length > 0) {
              <mat-card>
                <mat-card-content>
                  <table mat-table [dataSource]="lowStockReport()" class="full-width-table">
                    <ng-container matColumnDef="code">
                      <th mat-header-cell *matHeaderCellDef>Código</th>
                      <td mat-cell *matCellDef="let row">{{ row.code }}</td>
                    </ng-container>
                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef>Nombre</th>
                      <td mat-cell *matCellDef="let row">{{ row.name }}</td>
                    </ng-container>
                    <ng-container matColumnDef="category">
                      <th mat-header-cell *matHeaderCellDef>Categoría</th>
                      <td mat-cell *matCellDef="let row">{{ row.category }}</td>
                    </ng-container>
                    <ng-container matColumnDef="currentStock">
                      <th mat-header-cell *matHeaderCellDef>Stock Actual</th>
                      <td mat-cell *matCellDef="let row" class="stock-low">
                        {{ row.currentStock }}
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="minimalStock">
                      <th mat-header-cell *matHeaderCellDef>Stock Mínimo</th>
                      <td mat-cell *matCellDef="let row">{{ row.minimalStock }}</td>
                    </ng-container>
                    <ng-container matColumnDef="shortage">
                      <th mat-header-cell *matHeaderCellDef>Deficit</th>
                      <td mat-cell *matCellDef="let row" class="stock-deficit">
                        -{{ row.shortage }}
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="lowStockColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: lowStockColumns"></tr>
                  </table>
                </mat-card-content>
              </mat-card>
            } @else {
              <mat-card>
                <mat-card-content>
                  <div class="empty-state">
                    <mat-icon>check_circle</mat-icon>
                    <p>No hay productos con stock bajo</p>
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </mat-tab>

        <mat-tab label="Resumen de Movimientos">
          <div class="tab-content">
            @if (loadingMovementSummary()) {
              <div class="loading-container">
                <mat-spinner diameter="50"></mat-spinner>
              </div>
            } @else if (movementSummary()) {
              <mat-card class="summary-card">
                <mat-card-content>
                  <div class="summary-grid">
                    <div class="summary-item">
                      <span class="label">Total Movimientos</span>
                      <span class="value">{{ movementSummary()?.totalMovements }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="label">Entradas</span>
                      <span class="value entry">{{ movementSummary()?.totalEntries }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="label">Salidas</span>
                      <span class="value exit">{{ movementSummary()?.totalExits }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="label">Cantidad Entrada</span>
                      <span class="value entry">{{ movementSummary()?.totalQuantityIn }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="label">Cantidad Salida</span>
                      <span class="value exit">{{ movementSummary()?.totalQuantityOut }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Movimientos por Producto</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <table
                    mat-table
                    [dataSource]="movementSummary()?.byProduct || []"
                    class="full-width-table"
                  >
                    <ng-container matColumnDef="productName">
                      <th mat-header-cell *matHeaderCellDef>Producto</th>
                      <td mat-cell *matCellDef="let row">{{ row.productName }}</td>
                    </ng-container>
                    <ng-container matColumnDef="entries">
                      <th mat-header-cell *matHeaderCellDef>Entradas</th>
                      <td mat-cell *matCellDef="let row" class="entry">{{ row.entries }}</td>
                    </ng-container>
                    <ng-container matColumnDef="exits">
                      <th mat-header-cell *matHeaderCellDef>Salidas</th>
                      <td mat-cell *matCellDef="let row" class="exit">{{ row.exits }}</td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="movementProductColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: movementProductColumns"></tr>
                  </table>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </mat-tab>

        <mat-tab label="Exportar">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Exportar Datos</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Exporte los datos del inventario en formato CSV para su análisis externo.</p>
                <button mat-raised-button color="primary" (click)="exportCsv()">
                  <mat-icon>download</mat-icon>
                  Exportar CSV
                </button>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 1rem;
      }

      h1 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .tab-content {
        padding: 1rem 0;
      }

      .summary-card {
        margin-bottom: 1rem;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .summary-item {
        text-align: center;
        padding: 1rem;
      }

      .summary-item .label {
        display: block;
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 0.5rem;
      }

      .summary-item .value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
      }

      .summary-item .value.entry {
        color: #388e3c;
      }

      .summary-item .value.exit {
        color: #d32f2f;
      }

      .full-width-table {
        width: 100%;
      }

      .stock-low {
        color: #f57c00;
        font-weight: bold;
      }

      .stock-deficit {
        color: #d32f2f;
        font-weight: bold;
      }

      .entry {
        color: #388e3c;
      }

      .exit {
        color: #d32f2f;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 3rem;
      }

      .empty-state {
        text-align: center;
        padding: 2rem;
        color: #666;
      }

      .empty-state mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
        color: #4caf50;
      }
    `,
  ],
})
export class ReportViewPage implements OnInit {
  private reportService = inject(ReportService);

  loadingStockValue = signal(false);
  loadingLowStock = signal(false);
  loadingMovementSummary = signal(false);

  stockValueReport = signal<StockValueReport | null>(null);
  lowStockReport = signal<LowStockReport[]>([]);
  movementSummary = signal<MovementSummary | null>(null);

  categoryColumns = ['category', 'count', 'value'];
  lowStockColumns = ['code', 'name', 'category', 'currentStock', 'minimalStock', 'shortage'];
  movementProductColumns = ['productName', 'entries', 'exits'];

  ngOnInit(): void {
    this.loadStockValueReport();
    this.loadLowStockReport();
    this.loadMovementSummary();
  }

  loadStockValueReport(): void {
    this.loadingStockValue.set(true);
    this.reportService.getStockValueReport().subscribe({
      next: (data) => {
        this.stockValueReport.set(data);
        this.loadingStockValue.set(false);
      },
      error: () => {
        this.loadingStockValue.set(false);
      },
    });
  }

  loadLowStockReport(): void {
    this.loadingLowStock.set(true);
    this.reportService.getLowStockReport().subscribe({
      next: (data) => {
        this.lowStockReport.set(data);
        this.loadingLowStock.set(false);
      },
      error: () => {
        this.loadingLowStock.set(false);
      },
    });
  }

  loadMovementSummary(): void {
    this.loadingMovementSummary.set(true);
    this.reportService.getMovementSummary().subscribe({
      next: (data) => {
        this.movementSummary.set(data);
        this.loadingMovementSummary.set(false);
      },
      error: () => {
        this.loadingMovementSummary.set(false);
      },
    });
  }

  exportCsv(): void {
    this.reportService.exportToCsv().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert('Error al exportar: ' + err.message);
      },
    });
  }
}
