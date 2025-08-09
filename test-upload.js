import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';

async function testUpload() {
  try {
    // Créer un fichier de test
    const testContent = 'Test image content';
    fs.writeFileSync('test-image.txt', testContent);
    
    // Créer le FormData
    const formData = new FormData();
    formData.append('title', 'Test Action');
    formData.append('content', 'Test content');
    formData.append('status', 'draft');
    formData.append('image', fs.createReadStream('test-image.txt'), {
      filename: 'test-image.txt',
      contentType: 'text/plain'
    });
    
    console.log('Envoi de la requête de test...');
    
    const response = await fetch('http://localhost:3000/api/actions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhcHZqLmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU0NTcxOTQyLCJleHAiOjE3NTQ2NTgzNDJ9.vKzcs6jq9G28Sh5RbUIxNp1MdBbuJF5fzTKxwDPNZFI',
        ...formData.getHeaders()
      },
      body: formData
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    // Nettoyer
    fs.unlinkSync('test-image.txt');
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}

testUpload(); 