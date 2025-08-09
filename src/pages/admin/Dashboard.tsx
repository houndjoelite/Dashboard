import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, AlertTriangle, FileText, BellRing, ListTodo, Mail, BarChart, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from 'react';
import AlertList from "@/components/admin/AlertList";
import ActionList from "@/components/admin/ActionList";
import ActionForm from "@/components/admin/ActionForm";
import ContactMessages from "@/components/admin/ContactMessages";
import { StatsOverview } from "@/components/admin/StatsOverview";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

interface DashboardProps {
  defaultTab?: string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  trendColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendColor }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs ${trendColor} mt-1`}>{trend}</p>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ defaultTab = 'overview' }) => {
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'form' | 'view'>('list');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [stats, setStats] = useState([
    { 
      title: "Alertes en attente", 
      value: "0", 
      icon: AlertTriangle, 
      trend: "Aucune alerte", 
      trendColor: "text-gray-500" 
    },
    { 
      title: "Messages non lus", 
      value: "0", 
      icon: Mail, 
      trend: "À jour", 
      trendColor: "text-green-500"
    },
    { 
      title: "Actions en cours", 
      value: "0", 
      icon: ListTodo, 
      trend: "Aucune action", 
      trendColor: "text-gray-500" 
    },
    { 
      title: "Visiteurs ce mois", 
      value: "0", 
      icon: Users, 
      trend: "Aucune donnée", 
      trendColor: "text-gray-500" 
    },
  ]);
  
  // Fonction pour charger les statistiques
  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Récupérer les alertes en attente
      const alertsRes = await fetch('/api/alerts?status=pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const alertsData = await alertsRes.json();
      const pendingAlerts = alertsData.data?.length || 0;
      
      // Récupérer uniquement les nouveaux messages non lus (statut 'new' et non lus)
      const messagesRes = await fetch('/api/contact-messages?is_read=false&status=new', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const messagesData = await messagesRes.json();
      const unreadCount = messagesData.data?.length || 0;
      setUnreadMessages(unreadCount);
      
      // Récupérer les actions en cours
      const actionsRes = await fetch('/api/actions?status=in_progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const actionsData = await actionsRes.json();
      const inProgressActions = actionsData.data?.length || 0;
      
      // Récupérer les visiteurs du mois
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const visitorsRes = await fetch(`/api/stats?startDate=${firstDay}&endDate=${lastDay}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await visitorsRes.json();
      const monthlyVisitors = statsData.data?.totalVisitors || 0;
      
      // Mettre à jour les statistiques
      setStats([
        { 
          title: "Alertes en attente", 
          value: pendingAlerts.toString(), 
          icon: AlertTriangle, 
          trend: pendingAlerts > 0 ? `${pendingAlerts} en attente` : "Aucune alerte", 
          trendColor: pendingAlerts > 0 ? "text-amber-500" : "text-gray-500"
        },
        { 
          title: "Messages non lus", 
          value: unreadCount.toString(), 
          icon: Mail, 
          trend: unreadCount > 0 ? `${unreadCount} non lus` : "À jour", 
          trendColor: unreadCount > 0 ? "text-red-500" : "text-green-500"
        },
        { 
          title: "Actions en cours", 
          value: inProgressActions.toString(), 
          icon: ListTodo, 
          trend: inProgressActions > 0 ? `${inProgressActions} en cours` : "Aucune action", 
          trendColor: inProgressActions > 0 ? "text-blue-500" : "text-gray-500"
        },
        { 
          title: "Visiteurs ce mois", 
          value: monthlyVisitors.toString(), 
          icon: Users, 
          trend: monthlyVisitors > 0 ? `+${monthlyVisitors} ce mois` : "Aucune donnée", 
          trendColor: "text-green-500"
        },
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };
  
  // Charger les statistiques au montage et toutes les 30 secondes
  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Gérer le changement d'onglet via l'URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['overview', 'alerts', 'actions', 'messages'];
      
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
        // Forcer le rendu du composant d'onglet correspondant
        const tabElement = document.querySelector(`[data-tab="${hash}"]`);
        if (tabElement) {
          tabElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Si pas de hash valide, rediriger vers l'overview
        window.history.replaceState(null, '', '#overview');
        setActiveTab('overview');
      }
    };
    
    // Vérifier le hash au chargement initial
    handleHashChange();
    
    // Écouter les changements de hash (y compris depuis la barre latérale)
    window.addEventListener('hashchange', handleHashChange);
    // Écouter les changements de navigation (boutons précédent/suivant)
    window.addEventListener('popstate', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);
  
  // Fonction pour changer d'onglet
  const handleTabChange = (tab: string) => {
    window.location.hash = tab;
    // Forcer le rafraîchissement si on clique sur l'onglet actif
    if (activeTab === tab) {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };
  
  return (
    <div className="space-y-6 p-4 pt-6 md:p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        <p className="text-muted-foreground">
          Vue d'ensemble de l'activité et des statistiques
        </p>
      </div>

      <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger 
            value="overview"
            onClick={() => handleTabChange('overview')}
          >
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger 
            value="alerts" 
            className="flex items-center gap-2"
            onClick={() => handleTabChange('alerts')}
          >
            <BellRing className="h-4 w-4" />
            Alertes
          </TabsTrigger>
          <TabsTrigger 
            value="actions" 
            className="flex items-center gap-2"
            onClick={() => handleTabChange('actions')}
          >
            <ListTodo className="h-4 w-4" />
            Actions
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="flex items-center gap-2"
            onClick={() => handleTabChange('messages')}
          >
            <Mail className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex items-center gap-2"
            onClick={() => handleTabChange('settings')}
          >
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent data-tab="overview" value="overview" className="space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Tableau de bord</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat, i) => (
                <StatCard
                  key={i}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                  trendColor={stat.trendColor}
                />
              ))}
            </div>
            
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <BarChart className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Statistiques détaillées</h3>
              </div>
              <StatsOverview />
            </div>
          </div>
        </TabsContent>

        <TabsContent data-tab="alerts" value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des alertes</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent data-tab="actions" value="actions" className="space-y-4">
          {viewMode === 'list' && (
            <ActionList 
              onEdit={(action) => {
                setSelectedAction(action);
                setViewMode('form');
              }}
              onView={(action) => {
                setSelectedAction(action);
                setViewMode('view');
              }}
            />
          )}
          
          {(viewMode === 'form' || viewMode === 'view') && (
            <ActionForm 
              action={selectedAction}
              onSuccess={() => {
                setViewMode('list');
                setSelectedAction(null);
              }}
              onCancel={() => {
                setViewMode('list');
                setSelectedAction(null);
              }}
            />
          )}
        </TabsContent>

        <TabsContent data-tab="messages" value="messages" className="space-y-4">
          <ContactMessages onUnreadCountChange={setUnreadMessages} />
        </TabsContent>
        
        <TabsContent data-tab="settings" value="settings" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
