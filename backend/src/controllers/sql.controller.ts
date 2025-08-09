import { Request, Response } from 'express';
import pool from '../config/database';

export const executeSql = async (req: Request, res: Response) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ 
      success: false, 
      error: 'Aucune requête SQL fournie' 
    });
  }

  try {
    // Exécuter la requête SQL
    const [result] = await pool.query(sql);
    
    res.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'exécution de la requête SQL',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};
