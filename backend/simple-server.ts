import express from 'express';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de base
app.use(express.json());

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Le serveur fonctionne !' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur de test démarré sur http://localhost:${PORT}`);
  console.log(`🔄 Testez avec: curl http://localhost:${PORT}/api/test\n`);
});
