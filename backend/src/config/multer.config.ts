import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('\n=== MULTER STORAGE ===');
    console.log('Traitement du fichier:', file.originalname);
    console.log('Type MIME:', file.mimetype);
    
    const uploadDir = path.join(process.cwd(), 'uploads', 'actions');
    console.log('Dossier de destination:', uploadDir);
    
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Dossier de destination créé');
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    console.log('Nom du fichier généré:', filename);
    cb(null, filename);
  }
});

// Filtrage des types de fichiers
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('\n=== MULTER FILE FILTER ===');
  console.log('Vérification du type de fichier:', file.mimetype);
  
  // Autoriser uniquement les images
  if (file.mimetype.startsWith('image/')) {
    console.log('Type de fichier accepté');
    cb(null, true);
  } else {
    console.log('Type de fichier rejeté:', file.mimetype);
    cb(new Error('Seules les images sont autorisées'));
  }
};

// Configuration de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1
  }
});

// Middleware pour gérer les erreurs de Multer
const handleMulterError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    console.error('Erreur Multer:', err);
    return res.status(400).json({ 
      success: false, 
      error: `Erreur lors de l'upload du fichier: ${err.message}` 
    });
  } else if (err) {
    console.error('Erreur inconnue lors de l\'upload:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Une erreur est survenue lors du traitement du fichier' 
    });
  }
  next();
};

export const uploadActionImage = [
  upload.single('image'),
  (req: any, res: any, next: any) => {
    console.log('\n=== MIDDLEWARE UPLOAD FINAL ===');
    console.log('Fichier traité:', req.file);
    console.log('Corps de la requête:', req.body);
    next();
  },
  handleMulterError
];
