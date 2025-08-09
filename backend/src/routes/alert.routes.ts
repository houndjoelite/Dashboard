import { Router } from 'express';
import { createAlert, getAlerts, updateAlertStatus, deleteAlert } from '../controllers/alert.controller';
import { createAlertValidation } from '../validators/alert.validator';
import multer from 'multer';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

const router = Router();

// Configuration du stockage pour les pièces jointes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/alert-attachments');
    // Créer le répertoire s'il n'existe pas
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'alert-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

// Toutes les routes d'alerte sont publiques
router.post('/', 
  upload.array('files'), // 'files' doit correspondre au nom du champ dans le formulaire
  createAlertValidation, 
  createAlert
);

router.get('/', getAlerts);
router.patch('/:id/status', updateAlertStatus);
router.delete('/:id', deleteAlert);

export default router;
