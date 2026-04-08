import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `
    <div class="callback-container">
      <div class="spinner"></div>
      <p>Procesando...</p>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      color: #1e293b;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class CallbackPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    console.log('🔄 Callback: Verificando autenticación...');
    
    await this.authService.init();
    
    if (this.authService.isAuthenticated()) {
      console.log('🔄 Callback: Usuario autenticado');
      this.router.navigate(['/app/dashboard']);
    } else {
      console.log('🔄 Callback: No autenticado');
      this.router.navigate(['/login']);
    }
  }
}
