export interface Action {
  id: number;
  title: string;
  content: string;
  link?: string | null;
  image_path?: string | null;
  status: 'draft' | 'published' | 'archived';
  admin_id?: number | null;
  created_at: string;
  updated_at: string;
  // Ancien champ conservé pour la rétrocompatibilité
  created_by?: number | null;
}

export interface CreateActionDto {
  title: string;
  content: string;
  link?: string | null;
  image_path?: string | null;
  status?: 'draft' | 'published' | 'archived';
}

export interface UpdateActionDto extends Partial<CreateActionDto> {
  id: number;
}

export interface ActionFilters {
  status?: 'draft' | 'published' | 'archived';
  search?: string;
}
