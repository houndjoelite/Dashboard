import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
const { existsSync, mkdirSync, readdirSync } = fs;
import multer from 'multer';
import authRoutes from './routes/auth.routes';
import alertRoutes from './routes/alert.routes';
import actionRoutes from './routes/action.routes';
import contactRoutes from './routes/contact.routes';
import statsRoutes from './routes/stats.routes';
import sqlRoutes from './routes/sql.routes';
import uploadRoutes from './routes/upload.routes';

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json({ limit: '10mb' }));

// Middleware pour parser les données URL-encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuration des chemins
const projectRoot = path.join(__dirname, '..'); // Remonte d'un niveau par rapport à src
const uploadsDir = path.join(projectRoot, 'uploads');
const alertAttachmentsDir = path.join(uploadsDir, 'alert-attachments');

// Log pour le débogage
console.log('\n=== Configuration du serveur de fichiers statiques ===');
console.log('- Chemin du projet:', __dirname);
console.log('- Racine du projet:', projectRoot);
console.log('- Dossier uploads:', uploadsDir);
console.log('- Chemin complet vers alert-attachments:', alertAttachmentsDir);

// Créer les répertoires s'ils n'existent pas
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
  console.log(`Dossier uploads créé à: ${uploadsDir}`);
}
if (!existsSync(alertAttachmentsDir)) {
  mkdirSync(alertAttachmentsDir, { recursive: true });
  console.log(`Dossier alert-attachments créé à: ${alertAttachmentsDir}`);
}

// Vérifier l'existence du fichier de test
const testFilePath = path.join(alertAttachmentsDir, 'alert-1754597483901-535716299.pdf');
console.log('\n=== Vérification du fichier de test ===');
console.log('- Chemin du fichier de test:', testFilePath);
console.log('- Le fichier existe:', existsSync(testFilePath) ? 'OUI' : 'NON');

// Configuration du stockage pour les pièces jointes d'alerte
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, alertAttachmentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'alert-' + uniqueSuffix + ext);
  }
});

// Configuration simple et directe du serveur de fichiers statiques
console.log('\n=== Configuration du middleware static ===');
console.log(`- Montage de /uploads sur ${uploadsDir}`);
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  }
}));

// Route de test pour vérifier l'accès aux fichiers
app.get('/test-file', (req, res) => {
  try {
    const filePath = path.join(alertAttachmentsDir, 'alert-1754597483901-535716299.pdf');
    
    if (!existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Fichier non trouvé',
        path: filePath,
        currentDir: process.cwd(),
        filesInDir: readdirSync(alertAttachmentsDir)
      });
    }
    
    res.sendFile(filePath);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Erreur dans la route /test-file:', error);
    res.status(500).json({
      success: false,
      error: errorMessage,
      stack: errorStack
    });
  }
});

// Route pour lister les fichiers dans le dossier alert-attachments
app.get('/list-files', (req, res) => {
  try {
    const files = readdirSync(alertAttachmentsDir);
    res.json({
      success: true,
      path: alertAttachmentsDir,
      files: files
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({
      success: false,
      error: errorMessage,
      path: alertAttachmentsDir
    });
  }
});

// Configuration de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accepter tous les types de fichiers
    cb(null, true);
  }
});

// Configuration CORS pour le développement
const allowedOrigins: string[] = [
  'http://localhost:8080', // Frontend Vite
  'http://localhost:3000', // Backend (au cas où)
  'http://127.0.0.1:8080',
  'http://127.0.0.1:3000',
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:8082',
  'http://127.0.0.1:8082',
  'http://localhost:8083',
  'http://127.0.0.1:8083',
  'http://localhost:8084',
  'http://127.0.0.1:8084',
  'http://localhost:8085',
  'http://127.0.0.1:8085',
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) {
    // En mode développement, accepter toutes les origines
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // En production, vérifier l'origine
    if (!origin) {
      // Autoriser les requêtes sans origine (comme les applications mobiles ou Postman)
      return callback(null, true);
    }
    
    // Vérifier si l'origine est dans la liste des origines autorisées
    if (allowedOrigins.includes(origin) || origin.endsWith('vercel.app')) {
      return callback(null, true);
    }
    
    console.error(`CORS bloqué pour l'origine: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'Content-Disposition',
    'X-File-Name',
    'X-File-Size',
    'X-File-Type'
  ],
  exposedHeaders: [
    'Content-Range', 
    'X-Total-Count', 
    'Authorization',
    'Content-Disposition',
    'X-File-Name'
  ],
  maxAge: 86400, // 24 heures
  preflightContinue: false,
  optionsSuccessStatus: 200, // Pour les navigateurs plus anciens (IE11, divers SmartTVs)
  optionsPreflight: true
};

app.use(cors(corsOptions));

// Gérer les requêtes OPTIONS (preflight)
app.options('*', cors(corsOptions));

// Middleware pour enregistrer le corps brut des requêtes
app.use((req, res, next) => {
  const chunks: Buffer[] = [];
  const originalWrite = res.write;
  const originalEnd = res.end;
  
  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  
  req.on('end', () => {
    if (chunks.length > 0) {
      const rawBody = Buffer.concat(chunks).toString('utf8');
      console.log('\n=== CORPS BRUT DE LA REQUÊTE ===');
      console.log(rawBody.substring(0, 1000) + (rawBody.length > 1000 ? '...' : ''));
    }
  });
  
  next();
});

// Middleware de débogage pour les requêtes entrantes
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(2, 9);
  
  console.log(`\n=== NOUVELLE REQUÊTE [${requestId}] ===`);
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  
  // Sauvegarder la méthode originale de réponse
  const originalSend = res.send;
  
  // Intercepter la réponse
  res.send = function(body) {
    const duration = Date.now() - start;
    console.log(`\n=== RÉPONSE [${requestId}] (${duration}ms) ===`);
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.getHeaders());
    
    if (body && typeof body === 'string') {
      try {
        const json = JSON.parse(body);
        console.log('Body:', json);
      } catch (e) {
        console.log('Body:', body);
      }
    }
    
    // Appeler la méthode originale
    return originalSend.call(this, body);
  };
  
  next();
});

// Middleware de logging pour les requêtes
app.use((req, res, next) => {
  console.log('\n=== NOUVELLE REQUÊTE ===');
  console.log('Méthode:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('En-têtes:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Fichiers:', JSON.stringify(req.files || {}, null, 2));
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Content-Length:', req.get('Content-Length'));
  console.log('========================\n');
  next();
});

// Appliquer CORS à toutes les routes
app.use(cors(corsOptions));

// Gestion des requêtes OPTIONS (pré-vol)
app.options('*', cors(corsOptions));

// Désactiver le middleware express.json() pour les requêtes multipart
app.use((req, res, next) => {
  console.log('\n=== MIDDLEWARE UPLOAD ===');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Méthode:', req.method);
  console.log('URL:', req.originalUrl);
  
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    console.log('Détection d\'une requête multipart, passage au middleware suivant...');
    next();
  } else {
    console.log('Requête non-multipart, application de express.json()');
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// Configuration du dossier uploads


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/contact-messages', contactRoutes);
app.use('/api/stats', statsRoutes);
// Route SQL directe pour l'exécution de requêtes SQL
app.use('/api/execute-sql', sqlRoutes);
app.use('/api/uploads', uploadRoutes);

// Route de test simple
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});



// Configuration de multer pour l'upload de fichiers

// Route de test pour vérifier que le serveur répond
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Le serveur répond correctement' });
});

// Gestion des erreurs 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trouvé',
    path: req.path,
    method: req.method
  });
});

// Middleware de gestion d'erreurs global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('=== ERREUR GLOBALE ===');
  console.error('Erreur:', err);
  
  // Si l'en-tête de la réponse a déjà été envoyé, passer au gestionnaire d'erreurs par défaut d'Express
  if (res.headersSent) {
    return next(err);
  }

  // Envoyer une réponse d'erreur
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Une erreur est survenue sur le serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Gestion des erreurs globales
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erreur:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Une erreur est survenue sur le serveur.';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
