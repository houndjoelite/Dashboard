// Configuration de l'API
const isProduction = process.env.NODE_ENV === 'production';

// URL de base de l'API
export const API_BASE_URL = isProduction 
  ? 'https://votre-backend-url.com' 
  : 'http://localhost:3000';

// Autres configurations exportées si nécessaire
export const APP_CONFIG = {
  appName: 'APVJ Alerte',
  version: '1.0.0',
};
