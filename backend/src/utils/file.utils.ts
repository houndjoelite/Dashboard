import { unlink } from 'fs/promises';
import { join } from 'path';

export async function cleanupUploadedFile(filePath: string): Promise<void> {
  if (!filePath) return;
  
  try {
    // Ne pas essayer de supprimer si c'est un chemin relatif qui pointe en dehors du dossier d'upload
    if (filePath.includes('..')) {
      console.warn('Tentative de suppression d\'un fichier en dehors du dossier upload:', filePath);
      return;
    }
    
    const fullPath = join(process.cwd(), filePath.startsWith('/') ? filePath.substring(1) : filePath);
    await unlink(fullPath);
    console.log('Fichier temporaire supprimé avec succès:', fullPath);
  } catch (error) {
    // Ignorer les erreurs si le fichier n'existe pas ou est déjà supprimé
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Erreur lors de la suppression du fichier temporaire:', error);
    }
  }
}

export function getUploadsDir(): string {
  return join(process.cwd(), 'uploads', 'actions');
}
