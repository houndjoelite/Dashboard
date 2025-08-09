import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète_par_défaut';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  role: string;
}

// Vérifie les informations d'identification de l'utilisateur et renvoie un token JWT
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation des entrées
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Veuillez fournir un email et un mot de passe.' 
      });
    }

    // Récupération de l'utilisateur dans la base de données
    console.log('Tentative de connexion avec email:', email);
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM admins WHERE email = ?', 
      [email]
    );

    const user = rows[0] as AdminUser;
    console.log('Utilisateur trouvé dans la base de données:', user ? 'Oui' : 'Non');

    // Vérification si l'utilisateur existe
    if (!user) {
      console.log('Aucun utilisateur trouvé avec cet email');
      return res.status(401).json({ 
        success: false, 
        error: 'Identifiants invalides.' 
      });
    }

    // Vérification du mot de passe
    console.log('Vérification du mot de passe...');
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Résultat de la comparaison des mots de passe:', isMatch);
    
    if (!isMatch) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({ 
        success: false, 
        error: 'Identifiants invalides.' 
      });
    }

    // Création du token JWT
    try {
      const payload = { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      };
      
      console.log('JWT_SECRET:', JWT_SECRET ? '*** (présent)' : 'NON DÉFINI');
      console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN || '24h (par défaut)');
      
      // Configuration des options pour le token JWT
      const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
      
      // Création d'un objet d'options avec un typage partiel pour éviter les problèmes
      const signOptions: jwt.SignOptions = {
        algorithm: 'HS256'
      };
      
      // Ajout de expiresIn avec une assertion de type plus précise
      Object.assign(signOptions, { expiresIn });
      
      // Génération du token JWT avec les options typées
      const token = jwt.sign(
        payload,
        JWT_SECRET,
        signOptions
      );
      
      console.log('Token JWT généré avec succès');

      // Mise à jour de la dernière connexion
      await pool.query(
        'UPDATE admins SET last_login_at = NOW() WHERE id = ?',
        [user.id]
      );

      // Réponse avec le token et les informations utilisateur
      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
      
    } catch (jwtError) {
      console.error('Erreur lors de la génération du token JWT:', jwtError);
      return res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la génération du token d\'authentification.' 
      });
    }

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Une erreur est survenue lors de la connexion.' 
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    console.log('=== getCurrentUser ===');
    console.log('Headers de la requête:', JSON.stringify(req.headers, null, 2));
    
    // L'utilisateur est ajouté à la requête par le middleware d'authentification
    if (!req.user) {
      console.log('Aucun utilisateur trouvé dans la requête');
      return res.status(401).json({
        success: false,
        error: 'Non authentifié.'
      });
    }

    console.log('Utilisateur authentifié:', req.user);
    
    // Renvoyer les informations de l'utilisateur (sans le mot de passe)
    const { password_hash, ...userWithoutPassword } = req.user as any;
    
    const response = {
      success: true,
      user: userWithoutPassword
    };
    
    console.log('Réponse getCurrentUser:', JSON.stringify(response, null, 2));
    
    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des informations utilisateur.',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    console.log('=== checkAuth ===');
    console.log('Headers de la requête:', JSON.stringify(req.headers, null, 2));
    
    // Si on arrive ici, c'est que le middleware d'authentification a validé le token
    if (!req.user) {
      console.log('Aucun utilisateur trouvé dans la requête (checkAuth)');
      return res.status(401).json({
        success: false,
        error: 'Non authentifié.'
      });
    }
    
    console.log('Utilisateur authentifié (checkAuth):', req.user);
    
    // Renvoyer une réponse de succès simple
    res.json({
      success: true,
      message: 'Authentification valide',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la vérification de l\'authentification',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

export const logout = (req: Request, res: Response) => {
  // Sur le client, le token sera supprimé du stockage local
  res.status(200).json({ 
    success: true, 
    message: 'Déconnexion réussie.' 
  });
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = (req as any).user?.id;

    // Validation des entrées
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir tous les champs requis.'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Les nouveaux mots de passe ne correspondent pas.'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Le mot de passe doit contenir au moins 8 caractères.'
      });
    }

    // Récupérer l'utilisateur
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM admins WHERE id = ?',
      [userId]
    );

    const user = users[0] as AdminUser;

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé.'
      });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Le mot de passe actuel est incorrect.'
      });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe
    await pool.query(
      'UPDATE admins SET password_hash = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès.'
    });

  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({
      success: false,
      error: 'Une erreur est survenue lors du changement de mot de passe.'
    });
  }
};
