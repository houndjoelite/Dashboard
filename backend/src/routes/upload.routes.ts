import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { upload, handleFileUpload, getAlertAttachments, deleteAttachment } from '../controllers/upload.controller';

const router = Router();

// Télécharger un fichier pour une alerte
router.post('/:alertId', 
  authenticateToken, // Sécuriser l'upload
  upload.single('file'),
  handleFileUpload
);

// Récupérer les pièces jointes d'une alerte
router.get('/:alertId', authenticateToken, getAlertAttachments);

// Supprimer une pièce jointe
router.delete('/:id', authenticateToken, deleteAttachment);

export default router;
