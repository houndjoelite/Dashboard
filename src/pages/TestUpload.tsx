import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    const formData = new FormData();
    formData.append('title', 'Test Upload');
    formData.append('content', 'Ceci est un test');
    formData.append('status', 'draft');
    formData.append('image', file);

    setIsUploading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/test-upload', {
        method: 'POST',
        body: formData,
        // Ne pas définir le Content-Type, laisser le navigateur le gérer avec la boundary
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'upload');
      }
      
      setResult(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Test d'Upload de Fichier</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sélectionnez une image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          {file && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Fichier sélectionné: <span className="font-medium">{file.name}</span>
              </p>
              <p className="text-xs text-gray-500">
                Taille: {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
          
          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Envoi en cours...' : 'Tester l\'upload'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Retour
            </button>
          </div>
        </form>
        
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">Réponse du serveur :</h3>
            <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-60">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestUpload;
