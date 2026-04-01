import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryService } from '../../../../core/api/services/category.service';
import { Category, CreateCategoryDto } from '../../../../core/api/models/category.model';

@Component({
  selector: 'app-category-form-page',
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
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode() ? 'Editar' : 'Nueva' }} Categoría</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" placeholder="Nombre de la categoría" />
              @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                <mat-error>El nombre es requerido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Color</mat-label>
              <input matInput formControlName="color" type="color" />
              <mat-hint>Seleccione un color para identificar la categoría</mat-hint>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/categories">Cancelar</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="form.invalid || saving()"
              >
                @if (saving()) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  {{ isEditMode() ? 'Actualizar' : 'Crear' }}
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
export class CategoryFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);

  form: FormGroup;
  saving = signal(false);
  isEditMode = signal(false);
  categoryId: string | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      color: ['#1976d2'],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.categoryId = id;
      this.loadCategory(id);
    }
  }

  loadCategory(id: string): void {
    this.categoryService.getById(id).subscribe({
      next: (category) => {
        this.form.patchValue({
          name: category.name,
          color: category.color,
        });
      },
      error: (err) => {
        alert('Error al cargar categoría: ' + err.message);
        this.router.navigate(['/categories']);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const formValue = this.form.value;

    if (this.isEditMode() && this.categoryId) {
      this.categoryService.update(this.categoryId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.saving.set(false);
          alert('Error al actualizar categoría: ' + err.message);
        },
      });
    } else {
      this.categoryService.create(formValue as CreateCategoryDto).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.saving.set(false);
          alert('Error al crear categoría: ' + err.message);
        },
      });
    }
  }
}
