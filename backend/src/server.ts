import app from './app';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const PORT = process.env.PORT || 3000;

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🔄 Environnement: ${process.env.NODE_ENV || 'development'}\n`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err: Error) => {
  console.error('Erreur non gérée:', err);
  server.close(() => process.exit(1));
});

// Gestion des signaux de terminaison
process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté avec succès');
    process.exit(0);
  });
});
