export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
  admin_notes?: string;
  status: 'new' | 'in_progress' | 'resolved';
}

export type ContactMessageStatus = 'new' | 'in_progress' | 'resolved';
