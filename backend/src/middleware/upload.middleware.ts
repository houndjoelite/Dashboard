import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { mkdirSync, existsSync } from 'fs';

// Créer le dossier d'upload s'il n'existe pas
const uploadDir = path.join(process.cwd(), 'uploads', 'actions');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
  console.log(`Dossier upload créé: ${uploadDir}`);
}

// Configuration simplifiée de multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Middleware d'upload simplifié
export const uploadActionImage: RequestHandler = (req, res, next) => {
  console.log('=== MIDDLEWARE UPLOAD ===');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Méthode:', req.method);
  console.log('URL:', req.originalUrl);
  
  // Vérifier si c'est une requête multipart
  const isMultipart = req.headers['content-type']?.includes('multipart/form-data');
  console.log('Is multipart:', isMultipart);
  
  if (!isMultipart) {
    console.log('Pas de fichier à uploader, passage au middleware suivant');
    return next();
  }
  
  // Utiliser multer pour gérer l'upload
  upload.single('image')(req as any, res as any, (err: any) => {
    if (err) {
      console.error('Erreur lors de l\'upload:', err);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'La taille du fichier dépasse 5 Mo',
        });
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          error: 'Trop de fichiers envoyés',
        });
      }
      
      return res.status(400).json({
        success: false,
        error: err.message || 'Erreur lors du téléchargement du fichier',
      });
    }
    
    console.log('Fichier uploadé avec succès:', req.file);
    next();
  });
};
