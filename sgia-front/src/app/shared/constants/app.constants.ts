export const APP_CONFIG = {
  apiUrl: 'http://localhost:8080/api',
  keycloak: {
    url: 'http://localhost:8180',
    realm: 'sgia-realm',
    clientId: 'sgia-frontend',
    redirectUri: 'http://localhost:4200/callback',
  },
};

export const API_ENDPOINTS = {
  products: '/products',
  categories: '/categories',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};
