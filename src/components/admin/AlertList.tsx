import React, { useState, useEffect } from 'react';
import { AlertType } from '@/types/alert.types';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { config } from '@/config/env';


const AlertList: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'published' | 'rejected'>('all');
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const headers = await getAuthHeader();
        const response = await fetch(`/api/alerts`, { headers });
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des alertes');
        }
        
        const data = await response.json();
        setAlerts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [getAuthHeader]);

  const filteredAlerts = statusFilter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.status === statusFilter);

  const handleStatusChange = async (alertId: number, newStatus: 'published' | 'rejected') => {
    try {
      const response = await fetch(`/api/alerts/${alertId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Échec de la mise à jour du statut');
      }

      // Mettre à jour l'état local
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      ));
      
      // Afficher un message de succès
      toast.success(`Statut mis à jour avec succès (${newStatus})`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      console.error('Erreur lors de la mise à jour du statut:', errorMessage);
      toast.error(`Erreur: ${errorMessage}`);
    }
  };

  const handleDelete = async (alertId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      return;
    }

    try {
      const headers = await getAuthHeader();
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression');
      }

      // Mettre à jour l'état local
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      // Afficher une notification d'erreur à l'utilisateur
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des alertes...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
    );
  }

  const renderAlertDetails = (alert: AlertType) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setViewMode('list')}
          className="mb-4"
        >
          &larr; Retour à la liste
        </Button>
        <div className="flex space-x-2">
          {alert.status === 'pending' && (
            <>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusChange(alert.id, 'published')}
              >
                Publier
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleStatusChange(alert.id, 'rejected')}
              >
                Rejeter
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => handleDelete(alert.id)}
          >
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                {alert.is_anonymous ? 'Alerte anonyme' : `Alerte de ${alert.reporter_name || 'Anonyme'}`}
              </CardTitle>
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant={alert.status === 'published' ? 'default' : alert.status === 'rejected' ? 'destructive' : 'secondary'}>
                  {alert.status === 'pending' && 'En attente'}
                  {alert.status === 'published' && 'Publiée'}
                  {alert.status === 'rejected' && 'Rejetée'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Créée le {format(new Date(alert.created_at || ''), 'PPPpp', { locale: fr })}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Contenu de l'alerte</h3>
            <p className="text-justify whitespace-pre-line bg-muted/50 p-4 rounded-md">
              {alert.content}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Détails</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type d'alerte</span>
                  <span>{alert.alert_type || 'Non spécifié'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Localisation</span>
                  <span>{alert.location || 'Non spécifiée'}</span>
                </div>
                {(alert.reporter_phone || alert.reporter_email) && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact</span>
                    <div className="flex flex-col items-end">
                      {alert.reporter_phone && <span>{alert.reporter_phone}</span>}
                      {alert.reporter_email && <span>{alert.reporter_email}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Statut</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <span className="capitalize">{alert.status}</span>
                </div>
                {alert.processed_by_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Traité par</span>
                    <span>{alert.processed_by_name}</span>
                  </div>
                )}
                {alert.published_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publiée le</span>
                    <span>{format(new Date(alert.published_at), 'PPPpp', { locale: fr })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {alert.attachments && alert.attachments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Pièces jointes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {alert.attachments.map((file, index) => (
                    <a 
                      key={index} 
                      href={`${config.backendUrl}/uploads/${file.file_path}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="border rounded-md p-3 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm truncate">
                          {file.original_name || `Fichier ${index + 1}`}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (viewMode === 'detail' && selectedAlert) {
    return renderAlertDetails(selectedAlert);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des alertes</h1>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">Toutes les alertes</option>
            <option value="pending">En attente</option>
            <option value="published">Publiées</option>
            <option value="rejected">Rejetées</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredAlerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucune alerte à afficher
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <li key={alert.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div className="flex-1 min-w-0">
                  <div 
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedAlert(alert);
                      setViewMode('detail');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {alert.is_anonymous ? 'Alerte anonyme' : `De: ${alert.reporter_name || 'Anonyme'}`}
                        </p>
                        {alert.reporter_email && !alert.is_anonymous && (
                          <p className="text-xs text-gray-500 truncate">{alert.reporter_email}</p>
                        )}
                        {alert.reporter_phone && !alert.is_anonymous && (
                          <p className="text-xs text-gray-500">{alert.reporter_phone}</p>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(alert.status)}`}>
                          {alert.status === 'pending' && 'En attente'}
                          {alert.status === 'published' && 'Publiée'}
                          {alert.status === 'rejected' && 'Rejetée'}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-900 line-clamp-2">
                      {alert.content}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <div className="flex items-center space-x-4">
                        <span>Créée le {formatDate(alert.created_at)}</span>
                        {alert.published_at && (
                          <span>Publiée le {formatDate(alert.published_at)}</span>
                        )}
                      </div>
                      {(alert.location || alert.alert_type) && (
                        <div className="flex items-center space-x-4 mt-1">
                          {alert.location && <span>Lieu: {alert.location}</span>}
                          {alert.alert_type && <span>Type: {alert.alert_type}</span>}
                        </div>
                      )}
                      {alert.attachments && alert.attachments.length > 0 && (
                        <div className="mt-1">
                          <span className="font-medium">Pièces jointes:</span>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {alert.attachments.map((file) => (
                              <a
                                key={file.id}
                                href={`${config.backendUrl}/uploads/${file.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800 text-xs truncate"
                                title={file.original_name}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="truncate">{file.original_name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                  <div className="ml-4 flex-shrink-0 flex flex-col space-y-2">
                    {alert.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(alert.id, 'published')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Publier
                        </button>
                        <button
                          onClick={() => handleStatusChange(alert.id, 'rejected')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertList;
