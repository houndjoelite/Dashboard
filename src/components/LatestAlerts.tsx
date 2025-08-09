
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Zap, Globe } from "lucide-react";

export const LatestAlerts = () => {
  const alerts = [
    {
      id: 1,
      title: "🏭 Pollution industrielle dissimulée dans le Nord",
      excerpt: "Des documents internes révèlent des déversements toxiques cachés aux autorités depuis 2 ans...",
      category: "Environnement",
      date: "Il y a 2 jours",
      urgency: "high",
      emoji: "🌊"
    },
    {
      id: 2,
      title: "💰 Détournements dans l'aide publique au développement",
      excerpt: "Millions d'euros destinés aux pays en crise détournés vers des comptes privés...",
      category: "Corruption",
      date: "Il y a 3 jours",
      urgency: "medium",
      emoji: "🌍"
    },
    {
      id: 3,
      title: "🏥 Négligences répétées dans un EHPAD parisien",
      excerpt: "Personnel insuffisant, soins dégradés : témoignages accablants de familles et soignants...",
      category: "Santé",
      date: "Il y a 5 jours",
      urgency: "high",
      emoji: "👴"
    },
    {
      id: 4,
      title: "🏛️ Marchés publics truqués en région PACA",
      excerpt: "Système d'attribution frauduleuse découvert dans plusieurs collectivités locales...",
      category: "Institutions",
      date: "Il y a 1 semaine",
      urgency: "medium",
      emoji: "⚖️"
    }
  ];

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

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {alerts.map((alert) => (
          <Card key={alert.id} className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight mb-2">
                    {alert.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={getUrgencyColor(alert.urgency)}>
                      {getCategoryIcon(alert.category)}
                      <span className="ml-1">{alert.category}</span>
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {alert.date}
                    </div>
                  </div>
                </div>
                <div className="text-2xl">{alert.emoji}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm leading-relaxed">
                {alert.excerpt}
              </p>
              <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Lire la suite →
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          Voir toutes nos alertes →
        </button>
      </div>
    </div>
  );
};
