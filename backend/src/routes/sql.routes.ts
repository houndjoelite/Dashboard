import { Router } from 'express';
import { executeSql } from '../controllers/sql.controller';

const router = Router();

// Route pour exécuter des requêtes SQL (POST avec corps ou GET avec paramètre de requête)
router.post('/', executeSql);
router.get('/', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ 
      success: false, 
      error: 'Paramètre de requête SQL manquant. Utilisez ?query=VOTRE_REQUETE_SQL' 
    });
  }
  
  // Simuler un corps de requête pour le contrôleur
  req.body = { sql: query };
  return executeSql(req, res);
});

export default router;
