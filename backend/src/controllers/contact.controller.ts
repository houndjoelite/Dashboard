import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database';

// Interface pour les messages de contact
interface ContactMessage extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
  admin_notes: string | null;
  status: 'new' | 'in_progress' | 'resolved';
}

// Interface pour le résultat des requêtes
interface QueryResult extends ResultSetHeader {}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { status, is_read } = req.query;
    let query = 'SELECT * FROM apjv_admin.contact_messages';
    const params: any[] = [];
    const conditions: string[] = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (is_read !== undefined) {
      conditions.push('is_read = ?');
      params.push(is_read === 'true');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [messages] = await pool.query<ContactMessage[]>(query, params);
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des messages',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.id);
    const [rows] = await pool.query<ContactMessage[]>(
      'SELECT * FROM apjv_admin.contact_messages WHERE id = ?',
      [messageId]
    );
    
    const message = rows[0];
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        error: 'Message non trouvé' 
      });
    }
    
    res.json({ 
      success: true, 
      data: message 
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération du message',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

export const updateMessageStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const messageId = parseInt(req.params.id);
    
    // Vérifier que le statut est valide
    if (!['new', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    // Mettre à jour le statut
    await pool.query(
      'UPDATE apjv_admin.contact_messages SET status = ? WHERE id = ?',
      [status, messageId]
    );
    
    // Récupérer le message mis à jour
    const [rows] = await pool.query<ContactMessage[]>(
      'SELECT * FROM apjv_admin.contact_messages WHERE id = ?',
      [messageId]
    );
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const toggleReadStatus = async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.id);
    const { isRead } = req.body;

    await pool.query<QueryResult>(
      'UPDATE apjv_admin.contact_messages SET is_read = ? WHERE id = ?',
      [isRead, messageId]
    );
    
    res.json({ 
      success: true, 
      message: 'Statut de lecture mis à jour',
      isRead
    });
  } catch (error) {
    console.error('Error toggling read status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la mise à jour du statut de lecture',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.id);
    
    const [result] = await pool.query<QueryResult>(
      'DELETE FROM apjv_admin.contact_messages WHERE id = ?',
      [messageId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message non trouvé'
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Message supprimé avec succès' 
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la suppression du message',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation simple
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Tous les champs obligatoires doivent être remplis' 
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Veuillez fournir une adresse email valide' 
      });
    }

    // Insérer le nouveau message dans la base de données
    const [result] = await pool.query<QueryResult>(
      `INSERT INTO apjv_admin.contact_messages 
       (name, email, subject, message, status, is_read, created_at)
       VALUES (?, ?, ?, ?, 'new', false, NOW())`,
      [name, email, subject || 'Nouveau message de contact', message]
    );

    // Vérifier que l'insertion a réussi
    if (!result.insertId) {
      throw new Error('Échec de l\'insertion du message');
    }

    res.status(201).json({ 
      success: true, 
      message: 'Message envoyé avec succès',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ 
      success: false, 
      error: "Une erreur est survenue lors de l'envoi du message",
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};
