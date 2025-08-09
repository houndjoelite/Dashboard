import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète_par_défaut';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  // Configurer les en-têtes CORS
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Laisser passer les requêtes OPTIONS (préflight CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ignorer l'authentification pour la création d'alerte (POST /api/alerts)
  if (req.path === '/api/alerts' && req.method === 'POST') {
    console.log('Route de création d\'alerte - accès public autorisé');
    return next();
  }

  // Vérifier si la route est publique (ne nécessite pas d'authentification)
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/refresh',
    '/api/actions' // Pour le débogage - à sécuriser plus tard
  ];
  
  if (publicRoutes.some(route => req.path.startsWith(route) && req.method === 'POST')) {
    console.log(`Route publique détectée: ${req.path} - accès autorisé`);
    return next();
  }

  // Récupérer le token du header Authorization
  console.log('Headers reçus:', JSON.stringify(req.headers, null, 2));
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && (authHeader as string).split(' ')[1];

  console.log('Authorization header:', authHeader);
  console.log('Token extrait:', token ? `${token.substring(0, 10)}...` : 'Aucun token');

  if (!token) {
    console.error('Erreur: Aucun token fourni dans la requête');
    return res.status(401).json({ 
      success: false, 
      error: 'Accès non autorisé. Token manquant.' 
    });
  }

  try {
    console.log('Tentative de vérification du token...');
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
    console.log('Token décodé avec succès:', { id: decoded.id, email: decoded.email, role: decoded.role });
    
    // Vérifier si l'utilisateur existe toujours dans la base de données
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, name, role FROM admins WHERE id = ?',
      [decoded.id]
    );

    const user = users[0] as { id: number; email: string; name: string; role: string } | undefined;
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Utilisateur non trouvé.' 
      });
    }

    // Ajouter les informations de l'utilisateur à l'objet request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false, 
        error: 'Session expirée. Veuillez vous reconnecter.' 
      });
    }
    
    console.error('Erreur de vérification du token:', error);
    return res.status(403).json({ 
      success: false, 
      error: 'Token invalide.' 
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Non autorisé.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Vous n\'êtes pas autorisé à accéder à cette ressource.' 
      });
    }

    next();
  };
};
