import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Action } from '../../types/action.types';

interface ActionListProps {
  onEdit: (action: Action) => void;
  onView: (action: Action) => void;
}

export const ActionList: React.FC<ActionListProps> = ({ onEdit, onView }) => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch('/api/actions', { headers });
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des actions');
        }
        
        const data = await response.json();
        setActions(data.data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        toast.error('Impossible de charger les actions');
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [getAuthHeader]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette action ?')) {
      return;
    }

    try {
      const headers = await getAuthHeader();
      const response = await fetch(`/api/actions/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setActions(actions.filter(action => action.id !== id));
      toast.success('Action supprimée avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression de l\'action');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des actions...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Actions</h2>
        <Button onClick={() => onEdit({} as Action)}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle action
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Aucune action trouvée
                </TableCell>
              </TableRow>
            ) : (
              actions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="font-medium">{action.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      action.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : action.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {action.status === 'published' ? 'Publié' : 
                       action.status === 'draft' ? 'Brouillon' : 'Archivé'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(action.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onView(action)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(action)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(action.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActionList;
