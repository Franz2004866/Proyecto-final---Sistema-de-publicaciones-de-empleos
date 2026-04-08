import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmpleoService } from '../../../core/api/empleo.service';
import { Empleo } from '../../../core/api/models/empleo.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="job-form-page">
      <h1>{{ isEdit ? 'Editar Empleo' : 'Nuevo Empleo' }}</h1>

      <form (ngSubmit)="guardar()" class="form">
        <div class="form-group">
          <label>Título del empleo *</label>
          <input type="text" [(ngModel)]="empleo.titulo" name="titulo" required placeholder="Ej: Desarrollador Frontend">
        </div>

        <div class="form-group">
          <label>Descripción *</label>
          <textarea [(ngModel)]="empleo.descripcion" name="descripcion" rows="4" required placeholder="Describe las funciones del puesto..."></textarea>
        </div>

        <div class="form-group">
          <label>Requisitos</label>
          <textarea [(ngModel)]="empleo.requisitos" name="requisitos" rows="3" placeholder="Requisitos del puesto..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Ubicación</label>
            <input type="text" [(ngModel)]="empleo.ubicacion" name="ubicacion" placeholder="Ej: La Paz, Bolivia">
          </div>
          <div class="form-group">
            <label>Modalidad *</label>
            <select [(ngModel)]="empleo.modalidad" name="modalidad" required>
              <option value="">Seleccionar</option>
              <option value="Remoto">Remoto</option>
              <option value="Presencial">Presencial</option>
              <option value="Hibrido">Híbrido</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Tipo de contrato</label>
            <select [(ngModel)]="empleo.tipoContrato" name="tipoContrato">
              <option value="TiempoCompleto">Tiempo Completo</option>
              <option value="MedioTiempo">Medio Tiempo</option>
              <option value="PorContrato">Por Contrato</option>
              <option value="Temporal">Temporal</option>
            </select>
          </div>
          <div class="form-group">
            <label>Número de vacantes</label>
            <input type="number" [(ngModel)]="empleo.numeroVacantes" name="numeroVacantes" min="1" value="1">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Salario mínimo</label>
            <input type="number" [(ngModel)]="empleo.salarioMinimo" name="salarioMinimo" placeholder="0">
          </div>
          <div class="form-group">
            <label>Salario máximo</label>
            <input type="number" [(ngModel)]="empleo.salarioMaximo" name="salarioMaximo" placeholder="0">
          </div>
          <div class="form-group">
            <label>Moneda</label>
            <select [(ngModel)]="empleo.moneda" name="moneda">
              <option value="BOB">BOB</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Fecha límite</label>
            <input type="date" [(ngModel)]="empleo.fechaLimite" name="fechaLimite">
          </div>
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="empleo.destacado" name="destacado">
              <span>Empleo destacado</span>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" routerLink="/app/empleos" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save" [disabled]="saving()">
            {{ saving() ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .job-form-page { max-width: 800px; }
    h1 { color: #1e293b; margin-bottom: 2rem; }

    .form {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      color: #64748b;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      color: #1e293b;
      font-size: 1rem;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .checkbox-group {
      display: flex;
      align-items: flex-end;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox-label input {
      width: 20px;
      height: 20px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn-cancel {
      padding: 0.75rem 1.5rem;
      background: #f1f5f9;
      color: #64748b;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .btn-save {
      padding: 0.75rem 2rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-save:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `],
})
export class JobFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private empleoService = inject(EmpleoService);
  private snackBar = inject(MatSnackBar);

  isEdit = false;
  empleoId: number | null = null;
  saving = signal(false);

  empleo: any = {
    titulo: '',
    descripcion: '',
    requisitos: '',
    ubicacion: '',
    modalidad: '',
    tipoContrato: 'TiempoCompleto',
    numeroVacantes: 1,
    salarioMinimo: null,
    salarioMaximo: null,
    moneda: 'BOB',
    fechaLimite: '',
    destacado: false,
  };

  ngOnInit(): void {
    this.empleoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.empleoId) {
      this.isEdit = true;
      this.loadEmpleo();
    }
  }

  loadEmpleo(): void {
    if (!this.empleoId) return;
    this.empleoService.getById(this.empleoId).subscribe({
      next: (data) => {
        this.empleo = { ...data };
      },
    });
  }

  guardar(): void {
    if (!this.empleo.titulo || !this.empleo.descripcion || !this.empleo.modalidad) {
      this.snackBar.open('Completa los campos obligatorios', 'Cerrar', { duration: 3000 });
      return;
    }

    this.saving.set(true);

    const action = this.isEdit && this.empleoId
      ? this.empleoService.update(this.empleoId, this.empleo)
      : this.empleoService.create(this.empleo);

    action.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open(this.isEdit ? 'Empleo actualizado' : 'Empleo creado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/app/empleos']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
