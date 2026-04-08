import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="brand">
          <mat-icon class="brand-icon">work</mat-icon>
          <h1>TuEmpleo</h1>
        </div>
        
        <p class="subtitle">Crea tu cuenta como postulante</p>

        @if (success()) {
          <div class="success-message">
            <mat-icon>check_circle</mat-icon>
            <p>¡Cuenta creada exitosamente!</p>
            <p class="success-detail">Ahora puedes iniciar sesión con tus credenciales.</p>
            <a routerLink="/login" mat-flat-button class="login-btn">
              Ir a Iniciar Sesión
            </a>
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Nombre</mat-label>
                <input matInput [(ngModel)]="firstName" name="firstName" required>
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Apellido</mat-label>
                <input matInput [(ngModel)]="lastName" name="lastName" required>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <input matInput [(ngModel)]="username" name="username" required minlength="3">
              <mat-icon matPrefix>account_circle</mat-icon>
              <mat-hint>Mínimo 3 caracteres</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput [(ngModel)]="email" name="email" type="email" required>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput [(ngModel)]="password" name="password" [type]="showPassword() ? 'text' : 'password'" required minlength="8">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix (click)="showPassword.set(!showPassword())" type="button">
                <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-hint>Mínimo 8 caracteres</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar Contraseña</mat-label>
              <input matInput [(ngModel)]="confirmPassword" name="confirmPassword" [type]="showPassword() ? 'text' : 'password'" required>
              <mat-icon matPrefix>lock_outline</mat-icon>
              @if (passwordMismatch()) {
                <mat-error>Las contraseñas no coinciden</mat-error>
              }
            </mat-form-field>

            @if (error()) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                {{ error() }}
              </div>
            }

            <button mat-flat-button class="register-btn" type="submit" [disabled]="loading() || !registerForm.valid">
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Crear Cuenta
              }
            </button>
          </form>

          <p class="login-link">
            ¿Ya tienes cuenta? 
            <a routerLink="/login">Iniciar Sesión</a>
          </p>
        }
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      padding: 2rem;
    }

    .register-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      max-width: 450px;
      width: 100%;
    }

    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .brand-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #3b82f6;
    }

    h1 {
      color: #1e293b;
      font-size: 1.75rem;
      margin: 0;
    }

    .subtitle {
      color: #64748b;
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      margin-bottom: 0.5rem;
    }

    ::ng-deep .mat-mdc-form-field {
      --mdc-outlined-text-field-outline-color: #e2e8f0;
      --mdc-outlined-text-field-focus-outline-color: #3b82f6;
      --mdc-outlined-text-field-label-text-color: #64748b;
      --mdc-outlined-text-field-input-text-color: #1e293b;
      --mdc-outlined-text-field-caret-color: #3b82f6;
    }

    ::ng-deep .mat-mdc-form-field-icon-prefix {
      color: #94a3b8;
    }

    .register-btn {
      width: 100%;
      height: 48px;
      background: #3b82f6 !important;
      color: white !important;
      font-size: 1rem;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .register-btn:disabled {
      background: #94a3b8 !important;
    }

    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #ef4444;
      padding: 0.75rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .success-message {
      text-align: center;
    }

    .success-message mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #10b981;
    }

    .success-message p {
      color: #1e293b;
      font-size: 1.1rem;
    }

    .success-detail {
      color: #64748b !important;
      font-size: 0.9rem !important;
    }

    .login-link {
      color: #64748b;
      margin-top: 1.5rem;
    }

    .login-link a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';

  loading = signal(false);
  error = signal('');
  success = signal(false);
  showPassword = signal(false);
  passwordMismatch = signal(false);

  async onSubmit(): Promise<void> {
    this.error.set('');
    this.passwordMismatch.set(false);

    if (this.password !== this.confirmPassword) {
      this.passwordMismatch.set(true);
      return;
    }

    if (this.password.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.loading.set(true);

    try {
      await this.authService.register(
        this.username,
        this.email,
        this.password,
        this.firstName,
        this.lastName
      );
      this.success.set(true);
    } catch (err: any) {
      console.error('Error en registro:', err);
      if (err.status === 400) {
        this.error.set('El usuario o email ya existe');
      } else if (err.status === 0) {
        this.error.set('Error de conexión. Verifica que el servidor esté disponible.');
      } else {
        this.error.set('Error al crear la cuenta. Intenta nuevamente.');
      }
    } finally {
      this.loading.set(false);
    }
  }
}