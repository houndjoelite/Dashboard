export interface AlertReporter {
  name?: string;
  email?: string;
  phone?: string;
}

export interface AlertAttachment {
  id: number;
  alert_id: number;
  file_path: string;
  original_name: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface AlertType {
  id: number;
  content: string;
  is_anonymous: boolean;
  status: 'pending' | 'published' | 'rejected';
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  published_at?: string | null;
  reporter_name?: string | null;
  reporter_email?: string | null;
  reporter_phone?: string | null;
  processed_by?: number | null;
  processed_by_name?: string | null;
  attachments?: AlertAttachment[];
  // Champs supplémentaires pour l'affichage
  location?: string;
  alert_type?: string;
}
