import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    @if (!authService.isReady()) {
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #0f172a; color: white;">
        <p>Cargando...</p>
      </div>
    } @else {
      <router-outlet />
    }
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `],
})
export class App {
  authService = inject(AuthService);
}