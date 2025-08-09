// Configuration globale pour les tests
import dotenv from 'dotenv';

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' });

// Configuration des mocks globaux
jest.setTimeout(10000); // Augmenter le timeout des tests si nécessaire

// Mock de la base de données
global.console = {
  ...console,
  // Désactiver les logs de débogage pendant les tests
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  // Garder les erreurs et avertissements visibles
  error: console.error,
  warn: console.warn,
};
