import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { KeycloakService } from '../../../core/authentication/services/keycloak.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <mat-icon>inventory_2</mat-icon>
          <span>SGIA</span>
        </div>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/products" routerLinkActive="active">
            <mat-icon matListItemIcon>inventory</mat-icon>
            <span matListItemTitle>Productos</span>
          </a>
          <a mat-list-item routerLink="/categories" routerLinkActive="active">
            <mat-icon matListItemIcon>category</mat-icon>
            <span matListItemTitle>Categorías</span>
          </a>
          <a mat-list-item routerLink="/movements" routerLinkActive="active">
            <mat-icon matListItemIcon>swap_horiz</mat-icon>
            <span matListItemTitle>Movimientos</span>
          </a>
          <a mat-list-item routerLink="/reports" routerLinkActive="active">
            <mat-icon matListItemIcon>assessment</mat-icon>
            <span matListItemTitle>Reportes</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <mat-toolbar color="primary" class="toolbar">
          <span class="spacer"></span>
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="user-info">
              <strong>{{ keycloakService.user()?.username }}</strong>
              <small>{{ keycloakService.user()?.email }}</small>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100vh;
      }

      .sidenav {
        width: 250px;
        background: #f5f5f5;
      }

      .sidenav-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        font-size: 1.5rem;
        font-weight: bold;
        color: #1976d2;
      }

      .sidenav-header mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }

      .content {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .toolbar {
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .page-content {
        padding: 1.5rem;
        flex: 1;
        overflow: auto;
      }

      .user-info {
        padding: 1rem;
        display: flex;
        flex-direction: column;
      }

      .user-info small {
        color: #666;
      }

      .active {
        background: rgba(25, 118, 210, 0.1);
      }
    `,
  ],
})
export class LayoutComponent {
  keycloakService = inject(KeycloakService);

  logout(): void {
    this.keycloakService.logout();
  }
}
