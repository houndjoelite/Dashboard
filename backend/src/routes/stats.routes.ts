import { Router } from 'express';
import { getStats } from '../controllers/stats.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Récupérer les statistiques du site
router.get('/', getStats);

export default router;
