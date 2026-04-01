export const APP_CONFIG = {
  apiUrl: 'http://localhost:5150/api',
  keycloak: {
    url: 'http://localhost:8088',
    realm: 'sgia-realm',
    clientId: 'sgia-frontend',
    redirectUri: 'http://localhost:42000/callback',
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
