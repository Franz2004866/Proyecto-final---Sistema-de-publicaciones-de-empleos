import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KeycloakService } from '../../../../core/authentication/services/keycloak.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>inventory_2</mat-icon>
            SGIA
          </mat-card-title>
          <mat-card-subtitle>Sistema de Gestión de Inventarios</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <p class="login-description">
            Por favor inicie sesión con sus credenciales de Keycloak para acceder al sistema.
          </p>

          <div class="login-actions">
            @if (loading) {
              <mat-spinner diameter="40"></mat-spinner>
            } @else {
              <button mat-raised-button color="primary" (click)="login()" class="login-button">
                <mat-icon>login</mat-icon>
                Iniciar Sesión
              </button>
            }
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .login-card {
        max-width: 400px;
        width: 90%;
        padding: 2rem;
        text-align: center;
      }

      mat-card-header {
        justify-content: center;
        margin-bottom: 2rem;
      }

      mat-card-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 2rem;
        color: #1976d2;
      }

      mat-card-subtitle {
        margin-top: 0.5rem;
        font-size: 1rem;
      }

      .login-description {
        color: #666;
        margin-bottom: 2rem;
      }

      .login-actions {
        display: flex;
        justify-content: center;
      }

      .login-button {
        padding: 0.5rem 2rem;
        font-size: 1.1rem;
      }
    `,
  ],
})
export class LoginPage {
  private keycloakService = inject(KeycloakService);
  loading = false;

  login(): void {
    this.loading = true;
    this.keycloakService.login();
  }
}
