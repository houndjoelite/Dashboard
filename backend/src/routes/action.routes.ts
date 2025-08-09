import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { 
  getActions, 
  getActionById, 
  createAction, 
  deleteAction 
} from '../controllers/simple-action.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configuration du stockage pour les images d'actions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/action-images');
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'action-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size
  }
});

// Interface pour étendre le type Request avec la propriété file de multer
interface MulterRequest extends Request {
  file?: Express.Multer.File & {
    path: string;
    filename: string;
  };
  [key: string]: any;
}

// Middleware pour logger les requêtes
const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log('=== NOUVELLE REQUÊTE ===');
  console.log('Méthode:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Content-Type:', req.get('content-type'));
  console.log('Content-Length:', req.get('content-length'));
  next();
};

// Middleware pour gérer les erreurs de multer
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error('Erreur lors du traitement du fichier:', err);
    
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'La taille du fichier dépasse la limite autorisée (20MB)'
        });
      }
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          error: 'Un seul fichier est autorisé à la fois'
        });
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          error: 'Fichier inattendu reçu'
        });
      }
    }
    
    return res.status(500).json({
      success: false,
      error: 'Une erreur est survenue lors du traitement du fichier',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  next();
};

// Routes publiques
router.get('/', getActions);
router.get('/:id', getActionById);

// Route de test multer simple
router.post('/test-multer', 
  upload.single('image'),
  (req: Request, res: Response) => {
    console.log('=== ROUTE TEST MULTER ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', (req as any).file);
    res.json({ 
      success: true, 
      message: 'Test multer OK',
      file: (req as any).file,
      body: req.body
    });
  }
);

// Route pour créer une nouvelle action avec upload d'image (publique)
router.post(
  '/',
  logRequest,
  upload.array('files'), // 'files' doit correspondre au nom du champ dans le formulaire
  (req: Request, res: Response, next: NextFunction) => {
    console.log('=== APRÈS MULTER ===');
    console.log('Fichiers reçus:', (req as any).files);
    console.log('Body après multer:', req.body);
    next();
  },
  createAction as unknown as RequestHandler
);

// Routes protégées (nécessitent une authentification)
router.use(authenticateToken);

// Route de suppression d'action (protégée)
router.delete('/:id', deleteAction);

export default router;
