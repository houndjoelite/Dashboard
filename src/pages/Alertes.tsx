import { useEffect, useState } from 'react';
import path from 'path';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, Zap, Globe, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from 'sonner';
import { config } from '@/config/env';

interface AlertAttachment {
  id: number;
  file_path: string;
  original_name: string;
  mime_type: string;
  created_at: string;
}

interface Alert {
  id: number;
  title: string;
  description: string;
  category: string;
  created_at: string;
  status: 'pending' | 'published' | 'rejected';
  urgency: 'low' | 'medium' | 'high';
  emoji?: string;
  attachments?: AlertAttachment[];
}

const Alertes = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/alerts');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des alertes');
        }
        
        const data = await response.json();
        // Filtrer pour n'afficher que les alertes publiées
        const publishedAlerts = data.data.filter((alert: Alert) => alert.status === 'published');
        setAlerts(publishedAlerts);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        toast.error('Erreur lors du chargement des alertes');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Aujourd\'hui';
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaine${Math.floor(diffInDays / 7) > 1 ? 's' : ''}`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Environnement": return <Globe className="h-4 w-4" />;
      case "Corruption": return <AlertTriangle className="h-4 w-4" />;
      case "Santé": return <Zap className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-apvj-blue-50 to-apvj-green-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12 text-center">
          <div className="py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-apvj-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Chargement des alertes...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-apvj-blue-50 to-apvj-green-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-2xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Fonction pour afficher les détails d'une alerte
  const handleShowDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction pour revenir à la liste
  const handleBackToList = () => {
    setSelectedAlert(null);
  };

  // Vue détaillée d'une alerte
  const renderAlertDetail = () => {
    if (!selectedAlert) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-apvj-blue-50 to-apvj-green-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Button 
            onClick={handleBackToList}
            variant="ghost"
            className="mb-6 flex items-center gap-2 text-apvj-blue-600 hover:bg-apvj-blue-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour à la liste
          </Button>
          
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl">
                    {selectedAlert.emoji && <span className="mr-2">{selectedAlert.emoji}</span>}
                    {selectedAlert.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={getUrgencyColor(selectedAlert.urgency)}>
                      {selectedAlert.category}
                    </Badge>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(selectedAlert.created_at)}
                    </div>
                  </div>
                </div>
                <Badge className={`${getUrgencyColor(selectedAlert.urgency)} text-xs`}>
                  {selectedAlert.urgency === 'high' ? 'Haute priorité' : 
                   selectedAlert.urgency === 'medium' ? 'Moyenne priorité' : 'Basse priorité'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6">
                <p className="whitespace-pre-line">{selectedAlert.description}</p>
              </div>
              
              {/* Affichage des pièces jointes */}
              {selectedAlert.attachments && selectedAlert.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Pièces jointes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedAlert.attachments.map((file) => {
                      const isImage = file.mime_type.startsWith('image/');
                      // Construire l'URL complète du fichier
                      // Le file_path contient déjà le chemin relatif (ex: "alert-attachments/filename.pdf")
                      const fileUrl = `${config.backendUrl}/uploads/${file.file_path}`;
                      console.log('Tentative d\'accès au fichier:', fileUrl);
                      
                      return (
                        <div key={file.id} className="border rounded-lg overflow-hidden bg-white">
                          <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block hover:bg-gray-50 transition-colors"
                          >
                            {isImage ? (
                              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                <img 
                                  src={fileUrl} 
                                  alt={file.original_name}
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YzczN2QiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUtaW1hZ2UiPjxyZWN0IHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgeD0iMyIgeT0iMyIgcng9IjIiIHJ5PSIyIi8+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjIiLz48cGF0aCBkPSJNMjEgMTVhMiAyIDAgMCAxLTIgMkg1bDQtNGgxMGEyIDIgMCAwIDEgMiAyeiIvPjwvc3ZnPg==';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="p-4 flex items-center justify-center bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            )}
                            <div className="p-3 border-t">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.original_name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {file.mime_type}
                              </p>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button 
                  onClick={handleBackToList}
                  variant="outline" 
                  className="border-apvj-blue-600 text-apvj-blue-600 hover:bg-apvj-blue-50"
                >
                  Retour à la liste
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  };

  // Rendu principal
  if (selectedAlert) {
    return renderAlertDetail();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-apvj-blue-50 to-apvj-green-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-apvj-blue-800 mb-4">Nos Alertes</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Découvrez les dernières alertes signalées à notre association et suivez leur évolution
          </p>
        </div>

        {/* Liste des alertes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Aucune alerte publiée pour le moment.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-gray-100">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl flex items-center">
                      {alert.emoji && <span className="mr-2">{alert.emoji}</span>}
                      {alert.title}
                    </CardTitle>
                    <Badge className={`${getUrgencyColor(alert.urgency)} text-xs`}>
                      {alert.urgency === 'high' ? 'Haute priorité' : 
                       alert.urgency === 'medium' ? 'Moyenne priorité' : 'Basse priorité'}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    {getCategoryIcon(alert.category)}
                    <span className="ml-1">{alert.category}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4" />
                    <span className="ml-1">{formatDate(alert.created_at)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {alert.description.length > 150 
                      ? `${alert.description.substring(0, 150)}...` 
                      : alert.description}
                  </p>
                  <Button 
                    onClick={() => handleShowDetails(alert)}
                    variant="outline" 
                    className="w-full border-apvj-blue-600 text-apvj-blue-600 hover:bg-apvj-blue-50"
                  >
                    En savoir plus
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Alertes;
