import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Mail, Search, CheckCircle, Loader2, AlertCircle, Clock, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ContactMessage, ContactMessageStatus } from '@/types/contact.types';
import { useAuth } from '@/hooks/useAuth';

interface ContactMessagesProps {
  onUnreadCountChange?: (count: number) => void;
}

const statusIcons = {
  new: <AlertCircle className="h-4 w-4" />,
  in_progress: <Clock className="h-4 w-4" />,
  resolved: <CheckCheck className="h-4 w-4" />,
};

const statusLabels = {
  new: 'Nouveau',
  in_progress: 'En cours',
  resolved: 'Résolu',
};

export const ContactMessages = ({ onUnreadCountChange }: ContactMessagesProps) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      const response = await fetch('/api/contact-messages', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des messages');
      }
      
      const data = await response.json();
      setMessages(data.data);
      
      // Mettre à jour le compteur de messages non lus
      const unreadCount = data.data.filter((msg: ContactMessage) => !msg.is_read).length;
      onUnreadCountChange?.(unreadCount);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const toggleMessageRead = async (messageId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      const response = await fetch(`/api/contact-messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          isRead: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut de lecture");
      }

      // Mettre à jour la liste des messages
      const updatedMessages = messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: !currentStatus } : msg
      );
      setMessages(updatedMessages);
      
      // Mettre à jour le message sélectionné si nécessaire
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({
          ...selectedMessage,
          is_read: !currentStatus,
        });
      }

      // Mettre à jour le compteur de messages non lus
      const unreadCount = updatedMessages.filter(msg => !msg.is_read).length;
      onUnreadCountChange?.(unreadCount);

      toast.success(`Message marqué comme ${currentStatus ? 'non lu' : 'lu'}`);
    } catch (error) {
      console.error('Error toggling read status:', error);
      toast.error("Erreur lors de la mise à jour du statut de lecture");
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      const response = await fetch(`/api/contact-messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du message");
      }

      // Mettre à jour la liste des messages
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      setMessages(updatedMessages);
      
      // Si le message supprimé était sélectionné, on le désélectionne
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }

      // Mettre à jour le compteur de messages non lus
      const unreadCount = updatedMessages.filter(msg => !msg.is_read).length;
      onUnreadCountChange?.(unreadCount);

      toast.success('Message supprimé avec succès');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Erreur lors de la suppression du message");
    }
  };

  const handleStatusUpdate = async (newStatus: ContactMessageStatus) => {
    if (!selectedMessage) return;
    
    try {
      const response = await fetch(`/api/contact-messages/${selectedMessage.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      // Mettre à jour l'interface utilisateur
      const updatedMessages = messages.map(msg => 
        msg.id === selectedMessage.id ? { ...msg, status: newStatus } : msg
      );
      setMessages(updatedMessages);
      
      // Mettre à jour le compteur de messages non lus
      const unreadCount = updatedMessages.filter(msg => !msg.is_read).length;
      onUnreadCountChange?.(unreadCount);
      
      toast.success('Statut mis à jour avec succès');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages de contact</h2>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des messages..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des messages */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Messages reçus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucun message trouvé
                </p>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-accent'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      setSelectedMessage(message);
                      setAdminNotes(message.admin_notes || '');
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMessageRead(message.id, message.is_read);
                            }}
                            className="hover:bg-muted p-1 rounded"
                            title={message.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                          >
                            {message.is_read ? (
                              <CheckCheck className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </button>
                          {message.name}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {message.subject}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 ${
                          message.status === 'new'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : message.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}
                      >
                        {statusIcons[message.status]}
                        {statusLabels[message.status]}
                      </Badge>
                    </div>
                    <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                      {message.message.substring(0, 100)}
                      {message.message.length > 100 ? '...' : ''}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(message.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Détails du message */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{selectedMessage.name}</span>
                      <span>•</span>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-primary hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 ${
                        selectedMessage.status === 'new'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : selectedMessage.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}
                    >
                      {statusIcons[selectedMessage.status]}
                      {statusLabels[selectedMessage.status]}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      title="Supprimer le message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="whitespace-pre-line">{selectedMessage.message}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Notes internes</h3>
                  <textarea
                    className="w-full p-2 border rounded-md min-h-[100px] mb-4"
                    placeholder="Ajoutez des notes internes..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedMessage.status === 'new' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusUpdate('new')}
                    disabled={isUpdating}
                    className="gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Nouveau
                  </Button>
                  <Button
                    variant={selectedMessage.status === 'in_progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusUpdate('in_progress')}
                    disabled={isUpdating}
                    className="gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    En cours
                  </Button>
                  <Button
                    variant={selectedMessage.status === 'resolved' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusUpdate('resolved')}
                    disabled={isUpdating}
                    className="gap-2"
                  >
                    <CheckCheck className="h-4 w-4" />
                    Résolu
                  </Button>
                </div>

              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Mail className="h-12 w-12 mb-4" />
                <p>Sélectionnez un message pour afficher son contenu</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
