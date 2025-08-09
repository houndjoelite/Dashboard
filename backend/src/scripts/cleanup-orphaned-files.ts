import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import pool from '../config/database';
import { getUploadsDir } from '../utils/file.utils';
import { RowDataPacket } from 'mysql2';

/**
 * Script de nettoyage des fichiers orphelins dans le dossier d'upload
 * Ce script identifie et supprime les fichiers qui ne sont plus référencés dans la base de données
 */
async function cleanupOrphanedFiles() {
  console.log('=== DÉBUT DU NETTOYAGE DES FICHIERS ORPHELINS ===');
  
  try {
    // Récupérer tous les fichiers dans le dossier d'upload
    const uploadsDir = getUploadsDir();
    const files = await readdir(uploadsDir);
    console.log(`📁 ${files.length} fichiers trouvés dans le dossier d'upload`);

    // Récupérer tous les chemins d'images référencés dans la base de données
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT image_path FROM actions WHERE image_path IS NOT NULL'
    );
    
    const usedImagePaths = new Set<string>();
    
    for (const row of rows) {
      if (row && typeof row.image_path === 'string') {
        const parts = row.image_path.split('/');
        usedImagePaths.add(parts[parts.length - 1]);
      }
    }
    
    console.log(`🔍 ${usedImagePaths.size} fichiers référencés dans la base de données`);
    
    // Identifier les fichiers orphelins
    const orphanedFiles = files.filter(file => !usedImagePaths.has(file));
    
    console.log(`🗑️  ${orphanedFiles.length} fichiers orphelins identifiés`);
    
    // Supprimer les fichiers orphelins
    let deletedCount = 0;
    for (const file of orphanedFiles) {
      const filePath = join(uploadsDir, file);
      try {
        await unlink(filePath);
        console.log(`✅ Supprimé: ${file}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Erreur lors de la suppression de ${file}:`, (error as Error).message);
      }
    }
    
    console.log(`\n✅ Nettoyage terminé : ${deletedCount} fichiers orphelins supprimés`);
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des fichiers orphelins:', error);
    process.exit(1);
  }
}

// Exécuter le script
cleanupOrphanedFiles()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
