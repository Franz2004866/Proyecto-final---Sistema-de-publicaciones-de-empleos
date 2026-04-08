import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService } from '../../../core/api/services/usuario.service';
import { Usuario, TipoRol } from '../../../core/api/models/usuario.model';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestión de Usuarios</h1>
        <div class="filters">
          <select [(ngModel)]="filtroRol" (change)="filtrarUsuarios()" class="filter-select">
            <option value="0">Todos los roles</option>
            <option value="1">Postulantes</option>
            <option value="2">Empresas</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      } @else if (usuarios().length === 0) {
        <div class="empty-state">
          <mat-icon>people</mat-icon>
          <p>No hay usuarios disponibles</p>
        </div>
      } @else {
        <div class="users-table">
          <div class="table-header">
            <span class="col-name">Nombre</span>
            <span class="col-email">Email</span>
            <span class="col-role">Rol</span>
            <span class="col-date">Fecha Registro</span>
            <span class="col-actions">Acciones</span>
          </div>
          @for (usuario of usuarios(); track usuario.id) {
            <div class="table-row">
              <div class="col-name">
                <div class="user-avatar">{{ getInitials(usuario) }}</div>
                <div class="user-info">
                  <span class="name">{{ usuario.nombre }} {{ usuario.apellido }}</span>
                </div>
              </div>
              <span class="col-email">{{ usuario.email }}</span>
              <span class="col-role">
                <span class="badge" [class]="getRolClass(usuario.nombreRol)">
                  {{ getRolLabel(usuario.nombreRol) }}
                </span>
              </span>
              <span class="col-date">{{ usuario.fechaCreacion | date:'dd/MM/yyyy' }}</span>
              <div class="col-actions">
                <button class="btn-icon" title="Ver detalles">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button class="btn-icon delete" title="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; color: #1e293b; }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    h1 { font-size: 1.5rem; font-weight: 600; color: #1e293b; margin: 0; }
    
    .filter-select {
      padding: 0.5rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      color: #1e293b;
      cursor: pointer;
    }
    
    .loading, .empty-state {
      text-align: center;
      padding: 4rem;
      color: #64748b;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    
    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #94a3b8;
    }
    
    .users-table {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .table-header {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
      padding: 1rem 1.5rem;
      background: #f8fafc;
      font-weight: 600;
      font-size: 0.85rem;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .table-row {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
      padding: 1rem 1.5rem;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .table-row:last-child { border-bottom: none; }
    
    .table-row:hover { background: #f8fafc; }
    
    .col-name {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
    }
    
    .user-info .name {
      font-weight: 500;
      color: #1e293b;
    }
    
    .col-email { color: #64748b; font-size: 0.9rem; }
    .col-date { color: #64748b; font-size: 0.85rem; }
    
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .badge.postulante { background: #dbeafe; color: #1d4ed8; }
    .badge.empresa { background: #d1fae5; color: #059669; }
    .badge.admin { background: #fef3c7; color: #d97706; }
    
    .col-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-icon {
      background: #f1f5f9;
      border: none;
      color: #64748b;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-icon:hover { background: #e2e8f0; color: #1e293b; }
    .btn-icon.delete:hover { background: #fee2e2; color: #ef4444; }
  `]
})
export class UsersPage implements OnInit {
  private usuarioService = inject(UsuarioService);
  
  usuarios = signal<Usuario[]>([]);
  loading = signal(true);
  filtroRol = 0;
  todosLosUsuarios: Usuario[] = [];

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.todosLosUsuarios = data.filter(u => u.nombreRol !== 'Administrador');
        this.usuarios.set(this.todosLosUsuarios);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  filtrarUsuarios(): void {
    const rol = parseInt(this.filtroRol.toString());
    if (rol === 0) {
      this.usuarios.set(this.todosLosUsuarios);
    } else {
      this.usuarios.set(this.todosLosUsuarios.filter(u => u.nombreRol === TipoRol[rol]));
    }
  }

  getInitials(usuario: Usuario): string {
    return (usuario.nombre?.[0] || '') + (usuario.apellido?.[0] || '');
  }

  getRolLabel(rol: string): string {
    switch (rol) {
      case 'Postulante': return 'Postulante';
      case 'Empresa': return 'Empresa';
      case 'Administrador': return 'Admin';
      default: return rol;
    }
  }

  getRolClass(rol: string): string {
    return rol?.toLowerCase() || 'postulante';
  }
}