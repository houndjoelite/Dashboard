// Test simple pour l'upload d'image
// Utilise fetch directement dans le navigateur

async function testUpload() {
  try {
    // Créer un fichier de test simple
    const testContent = 'Test image content';
    const blob = new Blob([testContent], { type: 'text/plain' });
    const file = new File([blob], 'test-image.txt', { type: 'text/plain' });
    
    // Créer le FormData
    const formData = new FormData();
    formData.append('title', 'Test Action Simple');
    formData.append('content', 'Test content simple');
    formData.append('status', 'draft');
    formData.append('image', file);
    
    console.log('Envoi de la requête de test...');
    
    const response = await fetch('http://localhost:3000/api/actions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhcHZqLmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU0NTcxOTQyLCJleHAiOjE3NTQ2NTgzNDJ9.vKzcs6jq9G28Sh5RbUIxNp1MdBbuJF5fzTKxwDPNZFI'
      },
      body: formData
    });
    
    console.log('Status:', response.status);
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (response.ok) {
      console.log('✅ SUCCÈS: Upload réussi !');
    } else {
      console.log('❌ ERREUR: Upload échoué');
    }
    
  } catch (error) {
    console.error('❌ ERREUR:', error);
  }
}

// Exporter pour utilisation dans la console du navigateur
window.testUpload = testUpload;
console.log('Test upload disponible. Tapez: testUpload()'); 