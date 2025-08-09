export interface AlertReporter {
  name?: string;
  email?: string;
  phone?: string;
}

export interface Alert extends AlertReporter {
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
  processed_by_name?: string | null; // Pour l'affichage côté admin
}

export type CreateAlertDto = Omit<Alert, 'id' | 'created_at' | 'published_at' | 'processed_by'> & {
  reporter?: AlertReporter;
};

export type UpdateAlertDto = Partial<Pick<Alert, 'status' | 'processed_by'>>;
