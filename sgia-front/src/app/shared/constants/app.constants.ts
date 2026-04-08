export const APP_CONFIG = {
  apiUrl: '/api',
  keycloak: {
    url: 'http://localhost:8088',
    realm: 'tuempleo-realm',
    clientId: 'frontend-app',
    redirectUri: window.location.origin + '/callback',
  },
};

export const API_ENDPOINTS = {
  empleados: '/Empleos',
  postulaciones: '/Postulaciones',
  categorias: '/Categorias',
  dashboard: '/Dashboard',
  usuarios: '/Usuarios',
  movimientos: '/Movimientos',
};

export const ROLES = {
  ADMIN: 'admin',
  EMPRESA: 'empresa',
  POSTULANTE: 'postulante',
};
