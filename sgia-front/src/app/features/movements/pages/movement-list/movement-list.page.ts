import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MovementService } from '../../../../core/api/services/movement.service';
import { Movement, MovementType } from '../../../../core/api/models/movement.model';

@Component({
  selector: 'app-movement-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Movimientos</h1>
        <button mat-raised-button color="primary" routerLink="/movements/new">
          <mat-icon>add</mat-icon>
          Nuevo Movimiento
        </button>
      </div>

      <mat-card class="filter-card">
        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select (selectionChange)="filterByType($event.value)">
            <mat-option value="">Todos</mat-option>
            <mat-option value="Entry">Entrada</mat-option>
            <mat-option value="Exit">Salida</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Buscar producto</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Nombre o código" />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </mat-card>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      } @else if (movements().length === 0) {
        <mat-card>
          <mat-card-content>
            <div class="empty-state">
              <mat-icon>swap_horiz</mat-icon>
              <p>No hay movimientos registrados</p>
              <button mat-button color="primary" routerLink="/movements/new">
                Registrar primer movimiento
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card>
          <mat-card-content>
            <table mat-table [dataSource]="dataSource" matSort>
              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Tipo</th>
                <td mat-cell *matCellDef="let movement">
                  <mat-chip [color]="movement.type === 'Entry' ? 'accent' : 'warn'" highlighted>
                    <mat-icon>{{
                      movement.type === 'Entry' ? 'arrow_downward' : 'arrow_upward'
                    }}</mat-icon>
                    {{ movement.type === 'Entry' ? 'Entrada' : 'Salida' }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="productName">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Producto</th>
                <td mat-cell *matCellDef="let movement">
                  <div class="product-info">
                    <span class="product-name">{{ movement.productName }}</span>
                    <span class="product-code">{{ movement.productCode }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Cantidad</th>
                <td mat-cell *matCellDef="let movement">
                  <span
                    [class.entry-qty]="movement.type === 'Entry'"
                    [class.exit-qty]="movement.type === 'Exit'"
                  >
                    {{ movement.type === 'Entry' ? '+' : '-' }}{{ movement.quantity }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="reason">
                <th mat-header-cell *matHeaderCellDef>Motivo</th>
                <td mat-cell *matCellDef="let movement">{{ movement.reason }}</td>
              </ng-container>

              <ng-container matColumnDef="movementDate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha</th>
                <td mat-cell *matCellDef="let movement">
                  {{ movement.movementDate | date: 'dd/MM/yyyy HH:mm' }}
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>

            <mat-paginator
              [pageSizeOptions]="[5, 10, 25, 100]"
              showFirstLastButtons
            ></mat-paginator>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 1rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .page-header h1 {
        margin: 0;
        color: #333;
      }

      .filter-card {
        padding: 1rem;
        margin-bottom: 1rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      mat-form-field {
        flex: 1;
        min-width: 200px;
      }

      table {
        width: 100%;
      }

      .product-info {
        display: flex;
        flex-direction: column;
      }

      .product-name {
        font-weight: 500;
      }

      .product-code {
        font-size: 0.8rem;
        color: #666;
      }

      .entry-qty {
        color: #388e3c;
        font-weight: bold;
      }

      .exit-qty {
        color: #d32f2f;
        font-weight: bold;
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
        color: #ccc;
      }
    `,
  ],
})
export class MovementListPage implements OnInit {
  private movementService = inject(MovementService);

  movements = this.movementService.movements;
  loading = this.movementService.loading;
  displayedColumns = ['type', 'productName', 'quantity', 'reason', 'movementDate'];
  dataSource = new MatTableDataSource<Movement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadMovements();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadMovements(): void {
    this.movementService.getAll().subscribe({
      next: (movements) => {
        this.dataSource.data = movements;
      },
      error: (err) => {
        console.error('Error loading movements:', err);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByType(type: string): void {
    if (type) {
      this.dataSource.filter = type;
    } else {
      this.dataSource.filter = '';
    }
  }
}
