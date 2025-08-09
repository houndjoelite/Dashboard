import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'apjv_admin'
    });

    console.log('✅ Connecté à la base de données MySQL');
    
    // Tester une requête simple
    const [rows] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('✅ Test de requête réussi:', rows);
    
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:');
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion fermée');
    }
    process.exit(0);
  }
}

testConnection();
