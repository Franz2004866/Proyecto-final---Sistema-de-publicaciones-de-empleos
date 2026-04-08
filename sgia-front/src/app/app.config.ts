import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './core/auth/services/auth.service';
import { jwtInterceptor } from './core/auth/interceptors/jwt.interceptor';

function initAuth(auth: AuthService) {
  return () => {
    return auth.init().then(() => {
      console.log('Auth inicializado correctamente');
    }).catch(err => {
      console.error('Error al inicializar auth:', err);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};