import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles: string[];
}

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
    MatTooltipModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="over" [opened]="sidenavOpen()" (closed)="closeSidenav()" class="sidenav">
        <div class="sidenav-header">
          <mat-icon>work</mat-icon>
          <span>TuEmpleo</span>
        </div>
        
        <div class="role-badge" [class]="'role-' + getUserRole()">
          {{ getRoleLabel() }}
        </div>
        
        <mat-divider></mat-divider>
        <mat-nav-list>
          @for (item of getMenuItems(); track item.route) {
            <a mat-list-item [routerLink]="item.route" routerLinkActive="active" (click)="closeSidenav()">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="toggleSidenav()" class="menu-button">
            <mat-icon>menu</mat-icon>
          </button>
          
          <span class="spacer"></span>
          
          <button mat-icon-button (click)="toggleTheme()" [matTooltip]="themeService.isDarkMode() ? 'Modo Claro' : 'Modo Oscuro'">
            <mat-icon>{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
          
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="user-info">
              <strong>{{ authService.user()?.username }}</strong>
              <small>{{ authService.user()?.email }}</small>
              <div class="user-role" [class]="'role-' + getUserRole()">{{ getRoleLabel() }}</div>
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
  styles: [`
    .sidenav-container { height: 100vh; }
    .sidenav { width: 260px; }
    .menu-button { display: none; }
    @media (max-width: 768px) { .menu-button { display: inline-flex; } }
    .sidenav-header { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem; font-size: 1.4rem; font-weight: bold; color: white; }
    .sidenav-header mat-icon { font-size: 2rem; width: 2rem; height: 2rem; }
    .role-badge { margin: 0.75rem 1rem; padding: 0.4rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; }
    .role-badge.role-admin { background: rgba(239, 68, 68, 0.2); color: #ff6b6b; border: 1px solid rgba(239, 68, 68, 0.3); }
    .role-badge.role-empresa { background: rgba(102, 126, 234, 0.2); color: #a8b5ff; border: 1px solid rgba(102, 126, 234, 0.3); }
    .role-badge.role-postulante { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.3); }
    .content { display: flex; flex-direction: column; height: 100%; }
    .toolbar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .spacer { flex: 1 1 auto; }
    .page-content { padding: 1.5rem; flex: 1; overflow: auto; }
    @media (max-width: 768px) { .page-content { padding: 1rem; } }
    .user-info { padding: 1rem; display: flex; flex-direction: column; }
    .user-info small { color: #888; margin-top: 0.25rem; }
    .user-role { margin-top: 0.5rem; padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.7rem; text-align: center; text-transform: uppercase; }
    .user-role.role-admin { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .user-role.role-empresa { background: rgba(102, 126, 234, 0.15); color: #667eea; }
    .user-role.role-postulante { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .active { background: rgba(255, 255, 255, 0.2) !important; }
    ::ng-deep .mat-mdc-nav-list .mdc-list-item { color: white !important; }
    ::ng-deep .mat-mdc-nav-list .mdc-list-item__primary-text { color: white !important; }
    ::ng-deep .mat-mdc-nav-list .mat-icon { color: white !important; }
  `],
})
export class LayoutComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  sidenavOpen = signal(false);

  private menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', roles: ['admin'] },
    { icon: 'people', label: 'Gestionar Usuarios', route: '/usuarios', roles: ['admin'] },
    { icon: 'category', label: 'Categorías', route: '/categorias', roles: ['admin'] },
    { icon: 'work', label: 'Gestionar Empleos', route: '/empleos-gestionar', roles: ['admin', 'empresa'] },
    { icon: 'people_outline', label: 'Ver Postulaciones', route: '/postulaciones', roles: ['admin', 'empresa'] },
    { icon: 'assignment', label: 'Mis Postulaciones', route: '/mis-postulaciones', roles: ['admin', 'postulante'] },
    { icon: 'search', label: 'Buscar Empleos', route: '/empleos', roles: ['admin', 'empresa', 'postulante'] },
  ];

  getMenuItems(): MenuItem[] {
    const userRoles = this.authService.getRoles();
    return this.menuItems.filter(item => 
      item.roles.some(role => userRoles.includes(role))
    );
  }

  getUserRole(): string {
    const roles = this.authService.getRoles();
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('empresa') || roles.includes('company')) return 'empresa';
    return 'postulante';
  }

  getRoleLabel(): string {
    const role = this.getUserRole();
    switch (role) {
      case 'admin': return 'Administrador';
      case 'empresa': return 'Empresa';
      case 'postulante': return 'Postulante';
      default: return 'Usuario';
    }
  }

  toggleSidenav(): void { this.sidenavOpen.update(v => !v); }
  closeSidenav(): void { this.sidenavOpen.set(false); }
  toggleTheme(): void { this.themeService.toggleTheme(); }
  logout(): void { this.authService.logout(); }
}