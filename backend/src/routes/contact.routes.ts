import { Router } from 'express';
import { body } from 'express-validator';
import * as contactController from '../controllers/contact.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Route publique pour soumettre un message de contact
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Veuillez fournir un email valide'),
    body('message').trim().notEmpty().withMessage('Le message est requis'),
  ],
  validate,
  contactController.createMessage
);

// Routes publiques
router.get('/', contactController.getMessages);
router.get('/:id', contactController.getMessage);

// Mettre à jour le statut d'un message (accès public)
router.put('/:id/status', contactController.updateMessageStatus);

// Les routes suivantes sont maintenant publiques
router.use((req, res, next) => {
  console.log('Accès public autorisé');
  next();
});

// Marquer un message comme lu/non lu
router.put(
  '/:id/read',
  [
    body('isRead').isBoolean().withMessage('Le statut de lecture doit être un booléen')
  ],
  validate,
  contactController.toggleReadStatus
);

// Supprimer un message
router.delete('/:id', contactController.deleteMessage);

export default router;
