import { RowDataPacket } from 'mysql2';
import pool from '../config/database';

export interface ContactMessage extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: Date;
  is_read: boolean;
  admin_notes: string | null;
  status: 'new' | 'in_progress' | 'resolved';
}

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const [rows] = await pool.query<ContactMessage[]>(
    'SELECT * FROM apjv_admin.contact_messages ORDER BY created_at DESC'
  );
  return rows;
};

export const getContactMessageById = async (id: number): Promise<ContactMessage | null> => {
  const [rows] = await pool.query<ContactMessage[]>(
    'SELECT * FROM apjv_admin.contact_messages WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

export const updateContactMessageStatus = async (
  id: number, 
  status: 'new' | 'in_progress' | 'resolved',
  adminNotes?: string
): Promise<boolean> => {
  const [result] = await pool.query(
    'UPDATE apjv_admin.contact_messages SET status = ?, admin_notes = ? WHERE id = ?',
    [status, adminNotes || null, id]
  );
  return (result as any).affectedRows > 0;
};

export const deleteContactMessage = async (id: number): Promise<boolean> => {
  const [result] = await pool.query(
    'DELETE FROM apjv_admin.contact_messages WHERE id = ?',
    [id]
  );
  return (result as any).affectedRows > 0;
};

export const createContactMessage = async (
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<number> => {
  const [result] = await pool.query(
    `INSERT INTO apjv_admin.contact_messages 
     (name, email, subject, message, is_read, status)
     VALUES (?, ?, ?, ?, 0, 'new')`,
    [name, email, subject, message]
  );
  return (result as any).insertId;
};
