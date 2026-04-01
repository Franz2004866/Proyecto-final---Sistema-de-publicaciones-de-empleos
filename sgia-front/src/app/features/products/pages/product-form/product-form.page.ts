import { Component, inject, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../../core/api/services/product.service';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from '../../../../core/api/models/product.model';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <div class="header">
        <button mat-icon-button routerLink="/products">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ isEditMode() ? 'Editar' : 'Nuevo' }} Producto</h1>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      } @else {
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <mat-card>
            <mat-card-content>
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Código</mat-label>
                  <input matInput formControlName="code" placeholder="Código único del producto" />
                  @if (
                    productForm.get('code')?.hasError('required') &&
                    productForm.get('code')?.touched
                  ) {
                    <mat-error>El código es requerido</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Nombre</mat-label>
                  <input matInput formControlName="name" placeholder="Nombre del producto" />
                  @if (
                    productForm.get('name')?.hasError('required') &&
                    productForm.get('name')?.touched
                  ) {
                    <mat-error>El nombre es requerido</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Descripción</mat-label>
                  <textarea
                    matInput
                    formControlName="description"
                    rows="3"
                    placeholder="Descripción del producto"
                  ></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Categoría</mat-label>
                  <input matInput formControlName="category" placeholder="Categoría del producto" />
                  @if (
                    productForm.get('category')?.hasError('required') &&
                    productForm.get('category')?.touched
                  ) {
                    <mat-error>La categoría es requerida</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Precio Unitario</mat-label>
                  <input matInput type="number" formControlName="unitPrice" placeholder="0.00" />
                  <span matTextSuffix></span>
                  @if (
                    productForm.get('unitPrice')?.hasError('required') &&
                    productForm.get('unitPrice')?.touched
                  ) {
                    <mat-error>El precio es requerido</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Stock Actual</mat-label>
                  <input matInput type="number" formControlName="currentStock" placeholder="0" />
                  @if (
                    productForm.get('currentStock')?.hasError('required') &&
                    productForm.get('currentStock')?.touched
                  ) {
                    <mat-error>El stock es requerido</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Stock Mínimo</mat-label>
                  <input matInput type="number" formControlName="minimalStock" placeholder="0" />
                  @if (
                    productForm.get('minimalStock')?.hasError('required') &&
                    productForm.get('minimalStock')?.touched
                  ) {
                    <mat-error>El stock mínimo es requerido</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>URL de Imagen</mat-label>
                  <input
                    matInput
                    formControlName="imageUrl"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </mat-form-field>
              </div>
            </mat-card-content>

            <mat-card-actions>
              <button mat-button type="button" routerLink="/products">Cancelar</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="productForm.invalid || saving()"
              >
                @if (saving()) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  <mat-icon>save</mat-icon>
                  {{ isEditMode() ? 'Actualizar' : 'Crear' }}
                }
              </button>
            </mat-card-actions>
          </mat-card>
        </form>
      }
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 1rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }

      h1 {
        margin: 0;
        color: #333;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .full-width {
        grid-column: 1 / -1;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 3rem;
      }

      mat-card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1rem;
      }

      mat-spinner {
        display: inline-block;
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class ProductFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  productForm: FormGroup;
  loading = signal(false);
  saving = signal(false);
  isEditMode = signal(false);
  productId = signal<string | null>(null);

  constructor() {
    this.productForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      minimalStock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Error al cargar el producto', 'Cerrar', { duration: 3000 });
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.saving.set(true);
    const formValue = this.productForm.value;

    if (this.isEditMode() && this.productId()) {
      const updateDto: UpdateProductDto = {
        code: formValue.code,
        name: formValue.name,
        description: formValue.description,
        category: formValue.category,
        unitPrice: formValue.unitPrice,
        currentStock: formValue.currentStock,
        minimalStock: formValue.minimalStock,
        imageUrl: formValue.imageUrl || null,
      };

      this.productService.update(this.productId()!, updateDto).subscribe({
        next: () => {
          this.saving.set(false);
          this.snackBar.open('Producto actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.saving.set(false);
          this.snackBar.open('Error al actualizar: ' + err.message, 'Cerrar', { duration: 3000 });
        },
      });
    } else {
      const createDto: CreateProductDto = {
        code: formValue.code,
        name: formValue.name,
        description: formValue.description,
        category: formValue.category,
        unitPrice: formValue.unitPrice,
        currentStock: formValue.currentStock,
        minimalStock: formValue.minimalStock,
        imageUrl: formValue.imageUrl || null,
      };

      this.productService.create(createDto).subscribe({
        next: () => {
          this.saving.set(false);
          this.snackBar.open('Producto creado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.saving.set(false);
          this.snackBar.open('Error al crear: ' + err.message, 'Cerrar', { duration: 3000 });
        },
      });
    }
  }
}
