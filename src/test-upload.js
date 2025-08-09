// Script de test pour vérifier la communication avec le backend

// Fonction pour tester l'upload de fichier
async function testFileUpload() {
  try {
    // Créer un fichier de test
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    // Créer un FormData et ajouter le fichier
    const formData = new FormData();
    formData.append('file', file);
    formData.append('test', 'test value');
    
    console.log('Envoi de la requête de test...');
    
    // Envoyer la requête
    const response = await fetch('/api/test-upload', {
      method: 'POST',
      body: formData,
      // Ne pas définir le Content-Type, laisser le navigateur le gérer
    });
    
    const result = await response.json();
    console.log('Réponse du serveur:', result);
    
  } catch (error) {
    console.error('Erreur lors du test d\'upload:', error);
  }
}

// Lancer le test
testFileUpload();
