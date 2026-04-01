import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

export const authGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (keycloakService.isAuthenticated()) {
    return true;
  }

  keycloakService.login();
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (keycloakService.isAuthenticated() && keycloakService.isAdmin()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};

export const roleGuard: CanActivateFn = (route) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  if (keycloakService.isAuthenticated()) {
    if (!requiredRole || keycloakService.hasRole(requiredRole)) {
      return true;
    }
  }

  router.navigate(['/dashboard']);
  return false;
};
