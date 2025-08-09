import { Request, Response } from 'express';
import pool from '../config/database';
import { Alert, CreateAlertDto, UpdateAlertDto } from '../types/alert.types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Configuration du stockage des fichiers
const uploadDir = path.join(__dirname, '../../uploads/alert-attachments');

// Créer le répertoire s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Dossier alert-attachments créé à: ${uploadDir}`);
}

export const createAlert = async (req: Request, res: Response) => {
  console.log('=== NOUVELLE DEMANDE DE CRÉATION D\'ALERTE ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body keys:', Object.keys(req.body));
  console.log('Body values:', Object.entries(req.body).map(([k, v]) => `${k}: ${typeof v} (${v})`));
  console.log('Fichiers:', req.files ? `Nombre de fichiers: ${Array.isArray(req.files) ? req.files.length : Object.keys(req.files).length}` : 'Aucun fichier');
  
  if (req.files) {
    console.log('Détails des fichiers:', Array.isArray(req.files) 
      ? req.files.map((f: any) => ({
          fieldname: f.fieldname,
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size
        }))
      : Object.entries(req.files).map(([field, files]) => ({
          field,
          files: (files as any[]).map(f => ({
            originalname: f.originalname,
            mimetype: f.mimetype,
            size: f.size
          }))
        }))
    );
  }
  
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Validation des données
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
      const errorDetails = errors.array().map(err => ({
        param: 'param' in err ? err.param : undefined,
        msg: 'msg' in err ? err.msg : 'Erreur de validation',
        value: 'value' in err ? err.value : undefined,
        location: 'location' in err ? err.location : undefined
      }));
      
      console.error('Erreurs de validation:', errorDetails);
      
      return res.status(400).json({
        success: false,
        errors: errorDetails,
        message: 'Erreur de validation des données',
        validation: true
      });
    }
    
    // Récupérer les fichiers téléchargés
    const files = req.files as Express.Multer.File[] || [];

    // Récupération des données du formulaire
    const { 
      title, 
      description, 
      category, 
      urgency = 'medium',
      evidence,
      isAnonymous = true,
      name,
      contact
    } = req.body;

    // Vérification des champs obligatoires
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Le titre et la description sont obligatoires'
      });
    }

    // Récupération des informations de la requête
    const ipAddress = req.ip || (req.socket && req.socket.remoteAddress) || null;
    const userAgent = req.headers['user-agent'] || null;

    // Détection du type de contact (email ou téléphone)
    let reporterEmail = null;
    let reporterPhone = null;
    
    if (!isAnonymous && contact) {
      if (contact.includes('@')) {
        reporterEmail = contact;
      } else {
        // Nettoyer le numéro de téléphone (conserver uniquement les chiffres)
        reporterPhone = contact.replace(/\D/g, '');
      }
    }

    // Insertion de l'alerte dans la base de données
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO alerts 
       (title, content, description, category, urgency, evidence, 
        is_anonymous, reporter_name, reporter_email, reporter_phone, 
        ip_address, user_agent, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        title,
        description.substring(0, 500), // content est limité aux 500 premiers caractères
        description,
        category || null,
        urgency,
        evidence || null,
        isAnonymous,
        isAnonymous ? null : (name || null),
        reporterEmail,
        reporterPhone,
        ipAddress,
        userAgent
      ]
    );

    const alertId = result.insertId;
    const savedAttachments = [];

    // Gestion des pièces jointes si présentes
    if (files.length > 0) {
      for (const file of files) {
        // Le fichier a déjà été enregistré sur le disque par multer
        // Récupérer le chemin relatif du fichier
        const relativePath = path.relative(
          path.join(__dirname, '../../uploads'),
          file.path
        ).replace(/\\/g, '/'); // Remplacer les backslashes par des slashes pour la base de données
        
        // Enregistrer les métadonnées dans la base de données
        const [attachmentResult] = await connection.execute<ResultSetHeader>(
          `INSERT INTO alert_attachments 
           (alert_id, file_name, file_path, file_type, file_size) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            alertId,
            file.originalname,
            relativePath,
            file.mimetype,
            file.size
          ]
        );
        
        savedAttachments.push({
          id: attachmentResult.insertId,
          originalName: file.originalname,
          filePath: relativePath,
          fileType: file.mimetype,
          fileSize: file.size
        });
      }
    }

    // Récupération de l'alerte créée
    const [alerts] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM alerts WHERE id = ?`,
      [alertId]
    );

    const newAlert = alerts[0];
    
    // Ajouter les pièces jointes à la réponse
    newAlert.attachments = savedAttachments;
    
    await connection.commit();
    
    // Réponse de succès
    res.status(201).json({
      success: true,
      message: 'Votre alerte a été enregistrée avec succès',
      data: {
        id: newAlert.id,
        title: newAlert.title,
        status: newAlert.status,
        reference: `ALERT-${String(newAlert.id).padStart(6, '0')}`
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erreur lors de la création de l\'alerte:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ 
      success: false, 
      error: 'Une erreur est survenue lors de l\'enregistrement de l\'alerte',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  } finally {
    connection.release();
  }
};

export const getAlerts = async (req: Request, res: Response) => {
  console.log('Début de getAlerts');
  const connection = await pool.getConnection();
  
  try {
    console.log('Headers de la requête:', req.headers);
    console.log('Utilisateur authentifié:', (req as any).user);
    
    const { status } = req.query as { status?: string };
    console.log('Paramètres de requête:', { status });
    
    // Démarrer une transaction
    await connection.beginTransaction();
    
    try {
      // Récupérer les alertes
      let query = `
        SELECT a.*, ad.name as processed_by_name 
        FROM alerts a
        LEFT JOIN admins ad ON a.processed_by = ad.id
      `;
      const queryParams: (string | number)[] = [];

      // Valider le statut s'il est fourni
      if (status) {
        if (!['pending', 'published', 'rejected'].includes(status)) {
          console.log('Statut invalide fourni:', status);
          return res.status(400).json({
            success: false,
            error: 'Statut de filtre invalide. Doit être l\'un des suivants : pending, published, rejected'
          });
        }
        query += ' WHERE a.status = ?';
        queryParams.push(status);
      }

      query += ' ORDER BY a.created_at DESC';
      console.log('Requête SQL:', query);
      console.log('Paramètres de la requête:', queryParams);

      const [alerts] = await connection.query<RowDataPacket[]>(query, queryParams);
      console.log('Résultats bruts de la base de données:', alerts);
      
      // Pour chaque alerte, récupérer les pièces jointes
      const alertsWithAttachments = await Promise.all(
        (alerts as any[]).map(async (alert) => {
          const [attachments] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM alert_attachments WHERE alert_id = ?',
            [alert.id]
          );
          
          return {
            ...alert,
            attachments: attachments.map(attach => ({
              id: attach.id,
              file_path: attach.file_path,
              original_name: attach.file_name,
              mime_type: attach.file_type,
              created_at: attach.created_at ? new Date(attach.created_at).toISOString() : null
            })),
            created_at: alert.created_at ? new Date(alert.created_at).toISOString() : null,
            published_at: alert.published_at ? new Date(alert.published_at).toISOString() : null
          };
        })
      );
      
      console.log('Alertes avec pièces jointes:', alertsWithAttachments);
      
      // Valider la transaction
      await connection.commit();
      
      res.json({
        success: true,
        data: alertsWithAttachments
      });
    } catch (dbError: unknown) {
      // Annuler la transaction en cas d'erreur
      await connection.rollback();
      
      const errorMessage = dbError instanceof Error ? dbError.message : 'Erreur inconnue de base de données';
      console.error('Erreur lors de l\'exécution de la requête SQL:', errorMessage);
      
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    // Annuler la transaction en cas d'erreur
    if (connection) {
      await connection.rollback();
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'Error';
    
    console.error('Erreur dans getAlerts:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    
    res.status(500).json({ 
      success: false, 
      error: 'Une erreur est survenue lors de la récupération des alertes',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  } finally {
    // Toujours libérer la connexion
    if (connection) {
      connection.release();
    }
  }
};

export const updateAlertStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body as UpdateAlertDto;

    // Vérifier que le statut est défini et valide
    if (!status || !['pending', 'published', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Statut invalide. Doit être l\'un des suivants : pending, published, rejected' 
      });
    }

    const [result] = await pool.execute(
      `UPDATE alerts 
       SET status = ?, 
           published_at = IF(? = 'published', NOW(), published_at)
       WHERE id = ?`,
      [status, status, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Alerte non trouvée' 
      });
    }

    const updatedAlert = await getAlertById(parseInt(id));
    
    res.json({
      success: true,
      data: updatedAlert
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de l\'alerte:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Une erreur est survenue lors de la mise à jour du statut de l\'alerte' 
    });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM alerts WHERE id = ?',
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Alerte non trouvée' 
      });
    }
    
    res.json({
      success: true,
      message: 'Alerte supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'alerte:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Une erreur est survenue lors de la suppression de l\'alerte' 
    });
  }
};

// Fonction utilitaire pour récupérer une alerte par son ID
async function getAlertById(id: number): Promise<Alert | null> {
  try {
    if (isNaN(id) || id <= 0) {
      console.error('ID d\'alerte invalide:', id);
      return null;
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, ad.name as processed_by_name 
       FROM alerts a
       LEFT JOIN admins ad ON a.processed_by = ad.id
       WHERE a.id = ?`,
      [id]
    );
    
    if (!rows.length) {
      return null;
    }

    const alert = rows[0] as Alert;
    
    // Formater les dates pour le client
    const formattedAlert: Alert = {
      ...alert,
      created_at: new Date(alert.created_at).toISOString(),
      published_at: alert.published_at ? new Date(alert.published_at).toISOString() : undefined
    };
    
    return formattedAlert;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'alerte:', error);
    return null;
  }
}
