import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Route de connexion
router.post('/login', authController.login);

// Route de déconnexion
router.post('/logout', authController.logout);

// Route de vérification d'authentification (protégée par authentification)
router.get('/check-auth', authenticateToken, authController.checkAuth);

// Route pour récupérer l'utilisateur courant (protégée par authentification)
router.get('/me', authenticateToken, authController.getCurrentUser);

// Route pour changer le mot de passe (protégée par authentification)
router.post('/change-password', authenticateToken, authController.changePassword);

export default router;
