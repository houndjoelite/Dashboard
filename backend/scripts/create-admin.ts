import bcrypt from 'bcryptjs';
import pool from '../src/config/database';

async function createAdminUser() {
  const name = 'Administrateur';
  const email = 'admin@example.com';
  const password = 'Admin123!';
  const role = 'admin';

  try {
    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insérer l'utilisateur dans la base de données
    const [result] = await pool.execute(
      'INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    console.log('Utilisateur administrateur créé avec succès !');
    console.log('Email:', email);
    console.log('Mot de passe:', password);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
  } finally {
    // Fermer la connexion à la base de données
    await pool.end();
    process.exit(0);
  }
}

createAdminUser();
