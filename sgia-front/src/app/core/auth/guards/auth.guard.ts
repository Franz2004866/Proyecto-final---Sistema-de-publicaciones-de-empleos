import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);

  if (!auth.isInitialized()) {
    await auth.init();
  }

  if (auth.isLoggedIn()) {
    return true;
  }

  return false;
};