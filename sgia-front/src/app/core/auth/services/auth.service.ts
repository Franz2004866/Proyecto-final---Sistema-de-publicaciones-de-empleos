import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface UserInfo {
  id?: string;
  username: string;
  email: string;
  roles: string[];
  nombreEmpresa?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private initialized = false;
  
  readonly isReady = signal(false);
  readonly user = signal<UserInfo | null>(null);
  
  constructor(private http: HttpClient) {}

  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isAdmin = computed(() => this.user()?.roles.includes('admin'));
  readonly isEmpresa = computed(() => this.user()?.roles.includes('empresa') || this.user()?.roles.includes('company'));
  readonly isPostulante = computed(() => this.user()?.roles.includes('postulante'));

  isInitialized(): boolean {
    return this.initialized;
  }

  isLoggedIn(): boolean {
    return this.user() !== null;
  }

  async init(): Promise<void> {
    console.log('🔐 AuthService.init() started');
    
    if (this.initialized) {
      console.log('🔐 Auth ya inicializado, retornando');
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user.set(JSON.parse(storedUser));
        console.log('🔐 Usuario restaurado de localStorage:', this.user());
      }
      
      this.initialized = true;
      this.isReady.set(true);
      console.log('🔐 isReady = true');
    } catch (error) {
      console.error('🔐 ERROR en init():', error);
      this.initialized = true;
      this.isReady.set(true);
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      console.log('🔐 Intentando login con:', username);
      
      const response = await fetch(`${environment.keycloakUrl}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: environment.keycloakClientId,
          grant_type: 'password',
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('🔐 Error de login:', errorData);
        throw new Error(errorData.error_description || 'Credenciales inválidas');
      }

      const data = await response.json();
      console.log('🔐 Login exitoso, token recibido');
      
      const tokenPayload = this.decodeToken(data.access_token);
      console.log('🔐 Token payload:', tokenPayload);

      const roles = tokenPayload.realm_access?.roles || tokenPayload.roles || [];
      const userInfo: UserInfo = {
        id: tokenPayload.sub,
        username: username,
        email: tokenPayload.email || username,
        roles: roles,
      };

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      this.user.set(userInfo);
      console.log('🔐 Usuario configurado:', userInfo);

      await this.syncUserWithApi();
      
      return true;
    } catch (error) {
      console.error('🔐 ERROR en login():', error);
      throw error;
    }
  }

  private async syncUserWithApi(): Promise<void> {
    try {
      const token = this.getToken();
      if (!token) return;

      await fetch(`${environment.apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('🔐 Usuario sincronizado con API');
    } catch (error) {
      console.error('🔐 Error sincronizando usuario con API:', error);
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('🔐 Error decodificando token:', error);
      return {};
    }
  }

  async loadUserProfilePublic(): Promise<void> {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user.set(JSON.parse(storedUser));
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await fetch(`${environment.keycloakUrl}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: environment.keycloakClientId,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.user.set(null);
    window.location.href = '/';
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRoles(): string[] {
    return this.user()?.roles || [];
  }

  register(username: string, email: string, password: string, firstName: string, lastName: string): Promise<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, {
      username, email, password, firstName, lastName
    }).toPromise();
  }
}