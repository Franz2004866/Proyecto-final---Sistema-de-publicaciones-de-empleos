import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../../../../core/authentication/services/keycloak.service';

@Component({
  selector: 'app-callback-page',
  standalone: true,
  template: `
    <div class="callback-container">
      <p>Procesando autenticación...</p>
    </div>
  `,
  styles: [
    `
      .callback-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
    `,
  ],
})
export class CallbackPage {
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);

  ngOnInit(): void {
    this.keycloakService.handleCallback();
    setTimeout(() => {
      if (this.keycloakService.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    }, 2000);
  }
}
