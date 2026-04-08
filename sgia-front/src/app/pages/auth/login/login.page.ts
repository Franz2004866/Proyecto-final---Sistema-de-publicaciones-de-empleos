import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="brand">
          <mat-icon class="brand-icon">work</mat-icon>
          <h1>TuEmpleo</h1>
        </div>
        
        <p class="subtitle">Inicia sesión para acceder a tu cuenta</p>
        
        @if (error) {
          <div class="error-message">{{ error }}</div>
        }
        
        <form (ngSubmit)="onLogin()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Usuario</mat-label>
            <input matInput [(ngModel)]="username" name="username" required>
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput [(ngModel)]="password" name="password" type="password" required>
            <mat-icon matPrefix>lock</mat-icon>
          </mat-form-field>
          
          <button mat-flat-button type="submit" class="login-btn" [disabled]="loading">
            @if (loading) {
              <span>Ingresando...</span>
            } @else {
              <mat-icon>login</mat-icon>
              <span>Iniciar Sesión</span>
            }
          </button>
        </form>
        
        <p class="register-text">
          ¿No tienes cuenta? 
          <a routerLink="/registro">Regístrate aquí</a>
        </p>
        
        <a routerLink="/" class="back-link">
          <mat-icon>arrow_back</mat-icon>
          Volver al inicio
        </a>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    }

    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .brand-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #4f46e5;
    }

    h1 {
      color: #1f2937;
      font-size: 2rem;
      margin: 0;
    }

    .subtitle {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .error-message {
      background: #fee2e2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .full-width {
      width: 100%;
    }

    .login-btn {
      width: 100%;
      height: 50px;
      background: #4f46e5 !important;
      color: white !important;
      font-size: 1.1rem;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 8px;
    }

    .login-btn:disabled {
      background: #9ca3af !important;
    }

    .register-text {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .register-text a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 500;
    }

    .register-text a:hover {
      text-decoration: underline;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #6b7280;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: #4f46e5;
    }
  `],
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  username = '';
  password = '';
  loading = false;
  error = '';

  async onLogin(): Promise<void> {
    if (!this.username || !this.password) {
      this.error = 'Por favor ingresa usuario y contraseña';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const success = await this.authService.login(this.username, this.password);
      if (success) {
        console.log('🔐 Login exitoso, redirigiendo...');
        this.router.navigate(['/app/dashboard']);
      }
    } catch (err: any) {
      console.error('🔐 Error en login:', err);
      this.error = err.message || 'Credenciales inválidas';
    } finally {
      this.loading = false;
    }
  }
}
