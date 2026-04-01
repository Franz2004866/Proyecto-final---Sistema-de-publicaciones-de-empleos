import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { APP_CONFIG } from '../../../shared/constants/app.constants';
import { User } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak: Keycloak;
  private _isAuthenticated = signal(false);
  private _user = signal<User | null>(null);
  private _roles = signal<string[]>([]);
  private router = inject(Router);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly user = this._user.asReadonly();
  readonly roles = this._roles.asReadonly();

  readonly isAdmin = computed(() => this._roles().includes('admin'));

  constructor() {
    this.keycloak = new Keycloak({
      url: APP_CONFIG.keycloak.url + '/realms',
      realm: APP_CONFIG.keycloak.realm,
      clientId: APP_CONFIG.keycloak.clientId,
    });
  }

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: 'S256',
        redirectUri: APP_CONFIG.keycloak.redirectUri,
        enableLogging: true,
      });

      this._isAuthenticated.set(authenticated);

      if (authenticated) {
        await this.loadUserProfile();
      }

      return authenticated;
    } catch (error) {
      console.error('Keycloak init error:', error);
      return false;
    }
  }

  async login(): Promise<void> {
    try {
      await this.keycloak.login({
        redirectUri: APP_CONFIG.keycloak.redirectUri,
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.keycloak.logout({
        redirectUri: window.location.origin,
      });
      this._isAuthenticated.set(false);
      this._user.set(null);
      this._roles.set([]);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async loadUserProfile(): Promise<void> {
    try {
      const keycloakUser: KeycloakProfile = await this.keycloak.loadUserProfile();
      const token = this.keycloak.token;

      const user: User = {
        id: keycloakUser.id || '',
        username: keycloakUser.username || '',
        email: keycloakUser.email || '',
        keycloakId: keycloakUser.id || '',
        roles: this.keycloak.realmAccess?.roles || [],
      };

      this._user.set(user);
      this._roles.set(this.keycloak.realmAccess?.roles || []);

      if (token) {
        localStorage.setItem('sgia_token', token);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  async getToken(): Promise<string> {
    try {
      if (this.keycloak.isTokenExpired()) {
        const refreshed = await this.keycloak.updateToken(30);
        if (refreshed) {
          const token = this.keycloak.token;
          if (token) {
            localStorage.setItem('sgia_token', token);
          }
        }
      }
      return this.keycloak.token || '';
    } catch (error) {
      console.error('Error getting token:', error);
      await this.logout();
      return '';
    }
  }

  hasRole(role: string): boolean {
    return this._roles().includes(role);
  }

  handleCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code') || urlParams.has('state')) {
      window.location.href = '/dashboard';
    }
  }
}
