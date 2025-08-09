// Définition du type Action
export interface Action {
  id?: number;
  title: string;
  content: string;
  link?: string;
  status: 'draft' | 'published' | 'archived';
  image_path?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  admin_id?: number;
}
