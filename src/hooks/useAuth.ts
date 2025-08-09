import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Utilisation du chemin relatif pour profiter du proxy Vite
const API_BASE_URL = '/api/auth';

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  const navigate = useNavigate();

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAuthState({
            isAuthenticated: true,
            user: data.user,
            isLoading: false,
            error: null,
          });
        } else {
          // Token invalide ou expiré
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Erreur de connexion au serveur',
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Échec de la connexion');
      }

      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Appeler l'endpoint de déconnexion côté serveur si un token existe
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage local dans tous les cas
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      
      navigate('/admin/login');
    }
  }, [navigate]);

  const getAuthHeader = useCallback((options: { omitContentType?: boolean } = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token d\'authentification trouvé');
    }
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };
    
    // Ne pas ajouter le Content-Type si omitContentType est true
    if (!options.omitContentType) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }, []);

  return {
    ...authState,
    login,
    logout,
    getAuthHeader,
  };
};

// Export nommé pour la compatibilité avec les imports nommés
export { useAuth };

// Export par défaut pour la compatibilité avec les imports existants
export default useAuth;
