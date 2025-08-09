import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/alert-attachments');
    // Créer le dossier s'il n'existe pas
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Filtre des types de fichiers autorisés
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'));
  }
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Aucun fichier téléchargé' 
      });
    }

    const { alertId } = req.params;
    const file = req.file;

    // Enregistrer la référence du fichier en base de données
    const [result] = await pool.execute(
      `INSERT INTO alert_attachments 
       (alert_id, file_name, file_path, file_type, file_size) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        alertId,
        file.originalname,
        file.path,
        file.mimetype,
        file.size
      ]
    );

    res.status(201).json({
      success: true,
      data: {
        id: (result as any).insertId,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        type: file.mimetype
      }
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors du téléchargement du fichier',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

export const getAlertAttachments = async (req: Request, res: Response) => {
  try {
    const { alertId } = req.params;
    
    const [attachments] = await pool.query(
      'SELECT * FROM alert_attachments WHERE alert_id = ?',
      [alertId]
    );

    res.json({
      success: true,
      data: attachments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des pièces jointes:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des pièces jointes' 
    });
  }
};

export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Récupérer les informations du fichier avant suppression
    const [files] = await pool.query(
      'SELECT * FROM alert_attachments WHERE id = ?',
      [id]
    );

    if ((files as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Fichier non trouvé'
      });
    }

    const file = (files as any[])[0];
    
    // Supprimer le fichier physique
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../../', file.file_path);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer l'entrée en base de données
    await pool.execute(
      'DELETE FROM alert_attachments WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la suppression du fichier' 
    });
  }
};
