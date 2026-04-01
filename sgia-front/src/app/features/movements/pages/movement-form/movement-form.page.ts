import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovementService } from '../../../../core/api/services/movement.service';
import { ProductService } from '../../../../core/api/services/product.service';
import { CreateMovementDto, MovementType } from '../../../../core/api/models/movement.model';
import { Product } from '../../../../core/api/models/product.model';

@Component({
  selector: 'app-movement-form-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Nuevo Movimiento</mat-card-title>
          <mat-card-subtitle>Registrar entrada o salida de inventario</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tipo de Movimiento</mat-label>
              <mat-select formControlName="type">
                <mat-option value="Entry">
                  <mat-icon>arrow_downward</mat-icon>
                  Entrada
                </mat-option>
                <mat-option value="Exit">
                  <mat-icon>arrow_upward</mat-icon>
                  Salida
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Producto</mat-label>
              <mat-select formControlName="productId">
                @for (product of products(); track product.id) {
                  <mat-option [value]="product.id">
                    {{ product.name }} ({{ product.code }}) - Stock: {{ product.currentStock }}
                  </mat-option>
                }
              </mat-select>
              @if (form.get('productId')?.hasError('required') && form.get('productId')?.touched) {
                <mat-error>El producto es requerido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Cantidad</mat-label>
              <input matInput formControlName="quantity" type="number" min="1" />
              @if (form.get('quantity')?.hasError('required') && form.get('quantity')?.touched) {
                <mat-error>La cantidad es requerida</mat-error>
              }
              @if (form.get('quantity')?.hasError('min') && form.get('quantity')?.touched) {
                <mat-error>La cantidad debe ser mayor a 0</mat-error>
              }
              @if (selectedProduct()) {
                <mat-hint>Stock disponible: {{ selectedProduct()?.currentStock }}</mat-hint>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Motivo</mat-label>
              <input
                matInput
                formControlName="reason"
                placeholder="Ej: Compra, Venta, Ajuste, etc."
              />
              @if (form.get('reason')?.hasError('required') && form.get('reason')?.touched) {
                <mat-error>El motivo es requerido</mat-error>
              }
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/movements">Cancelar</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="form.invalid || saving()"
              >
                @if (saving()) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  Registrar Movimiento
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 1rem;
        max-width: 600px;
        margin: 0 auto;
      }

      mat-card-header {
        margin-bottom: 1rem;
      }

      mat-form-field {
        width: 100%;
        margin-bottom: 0.5rem;
      }

      .full-width {
        width: 100%;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
      }

      mat-spinner {
        display: inline-block;
      }
    `,
  ],
})
export class MovementFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private movementService = inject(MovementService);
  private productService = inject(ProductService);

  form: FormGroup;
  saving = signal(false);
  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);

  constructor() {
    this.form = this.fb.group({
      type: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products.filter((p) => p.isActive));
      },
    });

    this.form.get('productId')?.valueChanges.subscribe((productId) => {
      const product = this.products().find((p) => p.id === productId);
      this.selectedProduct.set(product || null);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const movement: CreateMovementDto = {
      productId: formValue.productId,
      type: formValue.type as MovementType,
      quantity: parseInt(formValue.quantity, 10),
      reason: formValue.reason,
    };

    this.saving.set(true);
    this.movementService.create(movement).subscribe({
      next: () => {
        this.router.navigate(['/movements']);
      },
      error: (err) => {
        this.saving.set(false);
        alert('Error al crear movimiento: ' + err.message);
      },
    });
  }
}
