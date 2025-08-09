
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

interface Action {
  id: number;
  title: string;
  content: string;
  link?: string;
  status: 'draft' | 'published' | 'archived';
  image_path?: string;
  created_at: string;
  updated_at: string;
}

interface ActionButton {
  title: string;
  description: string;
  action: string;
  link: string;
  color: string;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'published':
      return 'Publié';
    case 'draft':
      return 'Brouillon';
    case 'archived':
      return 'Archivé';
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const getRandomGradient = () => {
  const gradients = [
    'bg-gradient-to-r from-apvj-red-500 to-apvj-orange-500',
    'bg-gradient-to-r from-apvj-blue-500 to-apvj-purple-500',
    'bg-gradient-to-r from-apvj-green-500 to-apvj-teal-500',
    'bg-gradient-to-r from-purple-500 to-pink-500',
    'bg-gradient-to-r from-blue-500 to-cyan-500',
    'bg-gradient-to-r from-green-500 to-lime-500'
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const NosActions = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        // Utiliser une URL relative pour profiter du proxy Vite
        const response = await fetch('/api/actions');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des actions');
        }
        const data = await response.json();
        // Ne garder que les actions publiées
        const publishedActions = data.data.filter((action: Action) => action.status === 'published');
        setActions(publishedActions);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les actions. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActions();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-apvj-blue-50 to-apvj-green-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-apvj-blue-50 to-apvj-green-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur ! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const actionButtons: ActionButton[] = [
    {
      title: "Signaler une corruption",
      description: "Vous avez des informations sur des détournements de fonds publics ?",
      action: "Faire un signalement",
      link: "/lancer-alerte",
      color: "gradient-alert"
    },
    {
      title: "Partager des documents",
      description: "Vous disposez de preuves ou documents compromettants ?",
      action: "Envoyer des preuves",
      link: "/lancer-alerte",
      color: "bg-gradient-to-r from-apvj-blue-500 to-apvj-blue-600"
    },
    {
      title: "Nous contacter",
      description: "Vous souhaitez nous aider dans nos enquêtes ?",
      action: "Prendre contact",
      link: "/contact",
      color: "bg-gradient-to-r from-apvj-green-500 to-apvj-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-apvj-blue-50 to-apvj-green-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-apvj-blue-800 to-apvj-purple-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Nos Actions</h1>
          <p className="text-xl max-w-4xl mx-auto leading-relaxed">
            L'APVJ mène des enquêtes approfondies sur l'utilisation de l'argent public et lutte contre 
            la corruption dans tous les secteurs. Nous mettons en lumière les détournements de fonds 
            qui nuisent à l'intérêt général.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16 space-y-16">
        {/* Nos enquêtes en cours */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-apvj-blue-800 mb-4">Nos Actions</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Découvrez les actions que nous menons actuellement pour protéger l'argent public 
              et dénoncer les pratiques frauduleuses.
            </p>
          </div>

          {actions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Aucune action n'est disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {actions.map((action) => {
                const gradient = getRandomGradient();
                const icon = [FileText, Scale, Eye][Math.floor(Math.random() * 3)];
                
                return (
                  <Card key={action.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-apvj-blue-100 flex flex-col h-full">
                    {action.image_path && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={`http://localhost:3000${action.image_path}`} 
                          alt={action.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="flex-grow">
                      <div className={`w-16 h-16 ${gradient} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                        {React.createElement(icon, { className: "h-8 w-8 text-white" })}
                      </div>
                      <CardTitle className="text-xl text-apvj-blue-800 text-center">
                        {action.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4 flex flex-col flex-grow">
                      <p className="text-gray-600 leading-relaxed flex-grow">
                        {action.content.length > 150 
                          ? `${action.content.substring(0, 150)}...` 
                          : action.content}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-apvj-blue-600 font-medium text-sm">
                          📅 {new Date(action.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(action.status)}`}>
                          {getStatusLabel(action.status)}
                        </span>
                      </div>
                      {action.link && (
                        <Button 
                          asChild 
                          variant="outline" 
                          className="mt-4 w-full border-apvj-blue-500 text-apvj-blue-600 hover:bg-apvj-blue-50"
                        >
                          <a href={action.link} target="_blank" rel="noopener noreferrer">
                            En savoir plus
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Section impact */}
        <section className="bg-gradient-to-r from-apvj-red-500 to-apvj-orange-500 rounded-2xl p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">L'Impact de Nos Actions</h2>
            <p className="text-xl opacity-90 max-w-4xl mx-auto">
              Nos investigations révèlent comment l'argent public est détourné et contribuent à 
              l'instabilité géopolitique. Il est temps que l'Europe prenne conscience de sa responsabilité 
              dans le financement indirect de conflits au Moyen-Orient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">💰</div>
              <h3 className="text-xl font-semibold mb-2">Fonds Détournés</h3>
              <p className="opacity-90">Millions d'euros d'argent public détournés de leur usage initial</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">🏥</div>
              <h3 className="text-xl font-semibold mb-2">Secteur Santé</h3>
              <p className="opacity-90">Corruption révélée dans le système hospitalier français</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Impact International</h3>
              <p className="opacity-90">Liens établis avec l'instabilité géopolitique mondiale</p>
            </div>
          </div>
        </section>

        {/* Comment agir */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-apvj-blue-800 mb-4">Comment Vous Pouvez Agir</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Votre aide est précieuse pour nos enquêtes. Ensemble, nous pouvons faire la lumière 
              sur ces pratiques et protéger l'intérêt général.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {actionButtons.map((btn, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-apvj-blue-100">
                <CardHeader>
                  <CardTitle className="text-xl text-apvj-blue-800">
                    {btn.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    {btn.description}
                  </p>
                  <Button 
                    size="lg" 
                    className={`w-full ${btn.color} text-white font-semibold border-0 hover:shadow-lg`}
                    asChild
                  >
                    <Link to={btn.link}>
                      {btn.action}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to action final */}
        <section className="gradient-green-blue rounded-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">
            🚨 L'Urgence d'Agir
          </h2>
          <p className="text-xl mb-8 max-w-4xl mx-auto opacity-90">
            Chaque jour qui passe, des millions d'euros d'argent public sont détournés. 
            Il est temps de dire STOP et d'exiger la transparence totale de nos institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-alert text-white px-8 py-4 text-lg border-0 hover:shadow-lg" asChild>
              <Link to="/lancer-alerte">
                🚨 Signaler maintenant
              </Link>
            </Button>
            <Button size="lg" className="bg-white text-apvj-blue-800 hover:bg-apvj-cream-50 px-8 py-4 text-lg border-0" asChild>
              <Link to="/contact">
                ✉️ Nous rejoindre
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NosActions;
