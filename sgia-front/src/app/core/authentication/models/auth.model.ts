export interface User {
  id: string;
  username: string;
  email: string;
  keycloakId: string;
  roles: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}
