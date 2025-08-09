import { exec } from 'child_process';
import { promisify } from 'util';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const execAsync = promisify(exec);

// Configuration de la connexion à la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
};

// Fonction pour exécuter une commande shell
const runCommand = async (command: string) => {
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) console.error('Erreur:', stderr);
    return stdout;
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande: ${command}`, error);
    throw error;
  }
};

// Fonction pour exécuter les migrations SQL
const runMigrations = async () => {
  let connection;
  try {
    console.log('\n🚀 Démarrage des migrations...');
    
    // Se connecter à MySQL sans spécifier de base de données
    connection = await mysql.createConnection({
      ...dbConfig,
      database: 'mysql', // Se connecter à la base mysql par défaut
    });

    // Lire le fichier de schéma
    const schema = (await import('fs')).readFileSync(
      `${__dirname}/001-initial-schema.sql`, 
      'utf-8'
    );

    // Exécuter le schéma
    console.log('\n📝 Application du schéma de base de données...');
    await connection.query(schema);
    console.log('✅ Schéma appliqué avec succès!');

    // Fermer la connexion
    await connection.end();

    // Exécuter le script pour ajouter l'admin par défaut
    console.log('\n👤 Création de l\'administrateur par défaut...');
    await import('./002-add-default-admin');

  } catch (error) {
    console.error('\n❌ Erreur lors de l\'exécution des migrations:', error);
    process.exit(1);
  }
};

// Démarrer les migrations
runMigrations();
