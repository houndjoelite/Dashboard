import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import path from 'path';
import fs from 'fs';

// Interface pour étendre le type Request avec la propriété file
interface MulterRequest extends Request {
  file?: Express.Multer.File & {
    path: string;
    filename: string;
  };
  [key: string]: any;
}

// Fonction utilitaire pour gérer les erreurs
const handleError = (res: Response, error: any, message: string) => {
  console.error(`${message}:`, error);
  res.status(500).json({
    success: false,
    error: message,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Créer une nouvelle action avec upload d'image
export const createAction = async (req: Request, res: Response) => {
  console.log('=== DÉBUT createAction ===');
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.get('content-type'));
  console.log('Body:', req.body);
  
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    // Récupérer les données du formulaire
    const { title, content, link, status = 'draft' } = req.body;
    const files = (req as any).files || []; // Fichiers traités par multer
    
    console.log('=== DONNÉES REÇUES ===');
    console.log('Titre:', title);
    console.log('Contenu:', content);
    console.log('Lien:', link);
    console.log('Statut:', status);
    
    // Vérification des champs obligatoires
    if (!title || !content) {
      throw new Error('Le titre et le contenu sont obligatoires');
    }
    
    let imagePath = null;
    
    // Traitement du premier fichier s'il existe
    if (files.length > 0) {
      const file = files[0]; // On prend le premier fichier
      console.log('=== FICHIER REÇU ===');
      console.log('Nom original:', file.originalname);
      console.log('Nom du fichier:', file.filename);
      console.log('Chemin du fichier:', file.path);
      console.log('Taille du fichier:', file.size, 'octets');
      console.log('Type MIME:', file.mimetype);
      
      // Vérifier que le fichier a bien été enregistré
      if (!fs.existsSync(file.path)) {
        console.error('Le fichier n\'a pas été correctement enregistré sur le serveur');
        throw new Error('Erreur lors de l\'enregistrement du fichier');
      }
      
      // Construire le chemin d'accès relatif pour le stockage en base
      imagePath = `/uploads/action-images/${file.filename}`;
      console.log('Chemin de l\'image pour la base de données:', imagePath);
    }
    
    console.log('Exécution de la requête SQL...');
    
    // Insérer l'action dans la base de données
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO actions 
       (title, content, link, status, image_path, admin_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [title, content, link || null, status, imagePath]
    );
    
    console.log('Résultat de l\'insertion:', result);
    
    // Récupérer l'action créée
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM actions WHERE id = ?',
      [result.insertId]
    );
    
    const createdAction = rows[0];
    
    console.log('Action créée avec succès:', createdAction);
    
    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: 'Action créée avec succès',
      data: createdAction
    });
    
  } catch (error: unknown) {
    await connection.rollback();
    
    console.error('Erreur lors de la création de l\'action:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Une erreur inconnue est survenue';
    
    // Supprimer le fichier téléchargé en cas d'erreur
    const file = (req as any).file;
    if (file && file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
        console.log('Fichier temporaire supprimé après erreur:', file.path);
      } catch (unlinkError) {
        console.error('Erreur lors de la suppression du fichier temporaire:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    });
  } finally {
    connection.release();
  }
};

// Récupérer toutes les actions
export const getActions = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM actions ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    handleError(res, error, 'Erreur lors de la récupération des actions');
  }
};

// Récupérer une action par son ID
export const getActionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      'SELECT * FROM actions WHERE id = ?',
      [id]
    );
    
    const actions = rows as any[];
    
    if (actions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Action non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: actions[0]
    });
    
  } catch (error) {
    handleError(res, error, 'Erreur lors de la récupération de l\'action');
  }
};

// Supprimer une action
export const deleteAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Récupérer l'action pour avoir le chemin de l'image
    const [actions] = await pool.query(
      'SELECT * FROM actions WHERE id = ?',
      [id]
    );
    
    if ((actions as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Action non trouvée'
      });
    }
    
    const action = (actions as any[])[0];
    
    // Supprimer l'action de la base de données
    await pool.query(
      'DELETE FROM actions WHERE id = ?',
      [id]
    );
    
    // Supprimer le fichier image s'il existe
    if (action.image_path) {
      const imagePath = path.join(__dirname, '..', '..', action.image_path);
      
      if (fs.existsSync(imagePath)) {
        try {
          await fs.promises.unlink(imagePath);
        } catch (error) {
          console.error('Erreur lors de la suppression du fichier image:', error);
          // On ne renvoie pas d'erreur car l'action a bien été supprimée de la base
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Action supprimée avec succès'
    });
    
  } catch (error) {
    handleError(res, error, 'Erreur lors de la suppression de l\'action');
  }
};
