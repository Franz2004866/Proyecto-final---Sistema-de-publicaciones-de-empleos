import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="sidebarOpen()">
        <div class="sidebar-header">
          <mat-icon class="brand-icon">work</mat-icon>
          <span class="brand-text">TuEmpleo</span>
        </div>

        <div class="user-info">
          <div class="user-name">{{ authService.user()?.username }}</div>
          <div class="user-role">{{ getRoleLabel() }}</div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/app/dashboard" routerLinkActive="active" class="nav-item">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          
          @if (authService.isAdmin()) {
            <a routerLink="/app/categorias" routerLinkActive="active" class="nav-item">
              <mat-icon>category</mat-icon>
              <span>Categorías</span>
            </a>
            <a routerLink="/app/usuarios" routerLinkActive="active" class="nav-item">
              <mat-icon>people</mat-icon>
              <span>Usuarios</span>
            </a>
            <a routerLink="/app/reportes" routerLinkActive="active" class="nav-item">
              <mat-icon>assessment</mat-icon>
              <span>Reportes</span>
            </a>
          }

          @if (authService.isEmpresa()) {
            <a routerLink="/app/empleos" routerLinkActive="active" class="nav-item">
              <mat-icon>work</mat-icon>
              <span>Mis Empleos</span>
            </a>
            <a routerLink="/app/postulaciones" routerLinkActive="active" class="nav-item">
              <mat-icon>people</mat-icon>
              <span>Postulaciones</span>
            </a>
          }

          @if (authService.isPostulante()) {
            <a routerLink="/app/mis-postulaciones" routerLinkActive="active" class="nav-item">
              <mat-icon>assignment</mat-icon>
              <span>Mis Postulaciones</span>
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="nav-item">
            <mat-icon>home</mat-icon>
            <span>Inicio</span>
          </a>
          <button class="nav-item logout-btn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="topbar">
          <button class="menu-btn" (click)="toggleSidebar()">
            <mat-icon>menu</mat-icon>
          </button>
          <div class="topbar-title">{{ getPageTitle() }}</div>
          <div class="topbar-user">
            <span>{{ authService.user()?.username }}</span>
          </div>
        </header>

        <div class="page-content">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      z-index: 100;
      transition: transform 0.3s;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .brand-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #3b82f6;
    }

    .brand-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
    }

    .user-info {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .user-name {
      color: #1e293b;
      font-weight: 600;
    }

    .user-role {
      color: #3b82f6;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: #64748b;
      text-decoration: none;
      transition: all 0.2s;
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
      font-size: 1rem;
    }

    .nav-item:hover {
      color: #1e293b;
      background: #f1f5f9;
    }

    .nav-item.active {
      color: #3b82f6;
      background: #eff6ff;
    }

    .nav-item mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .sidebar-footer {
      border-top: 1px solid #e2e8f0;
      padding: 1rem 0;
    }

    .logout-btn {
      color: #ef4444;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
    }

    .topbar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .menu-btn {
      display: none;
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 0.5rem;
    }

    .topbar-title {
      flex: 1;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .topbar-user {
      color: #64748b;
    }

    .page-content {
      padding: 2rem;
      flex: 1;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .main-content {
        margin-left: 0;
      }

      .menu-btn {
        display: block;
      }
    }
  `],
})
export class AppLayoutComponent {
  authService = inject(AuthService);
  sidebarOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  getRoleLabel(): string {
    if (this.authService.isAdmin()) return 'Administrador';
    if (this.authService.isEmpresa()) return 'Empresa';
    if (this.authService.isPostulante()) return 'Postulante';
    return 'Usuario';
  }

  getPageTitle(): string {
    return 'Panel de Control';
  }

  logout(): void {
    this.authService.logout();
  }
}
