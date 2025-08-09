import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Fonction pour hasher le mot de passe
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@apvj.fr';
    const adminPassword = 'Admin123!';
    
    // Vérifier si l'admin existe déjà
    const [existingAdmins] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM admins WHERE email = ?', 
      [adminEmail]
    );

    if (existingAdmins && existingAdmins.length > 0) {
      console.log('\n🔍 Un administrateur avec cet email existe déjà.');
      process.exit(0);
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(adminPassword);

    // Insérer l'administrateur par défaut
    await pool.query<ResultSetHeader>(
      `INSERT INTO admins (name, email, password_hash, role, is_active) 
       VALUES (?, ?, ?, 'admin', TRUE)`,
      ['Administrateur', adminEmail, hashedPassword]
    );

    console.log('\n✅ Administrateur créé avec succès!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Mot de passe:', adminPassword);
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion!\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la création de l\'administrateur par défaut:');
    console.error(error);
    process.exit(1);
  } finally {
    // Fermer la connexion à la base de données
    await pool.end();
    process.exit(0);
  }
};

// Exécuter la fonction
createDefaultAdmin();
