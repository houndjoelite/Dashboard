
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, Heart, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  const actions = [
    {
      title: "Lancer une alerte",
      description: "Signalez des faits sensibles en toute confidentialité",
      icon: AlertTriangle,
      color: "bg-gradient-to-r from-apvj-red-500 to-apvj-orange-500 hover:from-apvj-red-600 hover:to-apvj-orange-600",
      link: "/lancer-alerte",
      emoji: "🚨"
    },
    {
      title: "Rejoindre la communauté",
      description: "Devenez membre et participez à nos actions",
      icon: Users,
      color: "bg-gradient-to-r from-apvj-blue-500 to-apvj-blue-600 hover:from-apvj-blue-600 hover:to-apvj-blue-700",
      link: "/contact",
      emoji: "🤝"
    },
    {
      title: "Nous soutenir",
      description: "Soutenez notre mission par un don",
      icon: DollarSign,
      color: "bg-gradient-to-r from-apvj-yellow-500 to-apvj-yellow-600 hover:from-apvj-yellow-600 hover:to-apvj-yellow-700",
      link: "https://alodons.fr",
      emoji: "💛",
      external: true
    },
    {
      title: "Témoignages",
      description: "Découvrez les histoires de courage",
      icon: Heart,
      color: "bg-gradient-to-r from-apvj-pink-500 to-apvj-pink-600 hover:from-apvj-pink-600 hover:to-apvj-pink-700",
      link: "/espace-lanceurs",
      emoji: "💪"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-apvj-blue-800 mb-4">Comment agir ?</h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Plusieurs façons de rejoindre notre mouvement pour la transparence et la justice
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-apvj-blue-100 hover:border-apvj-blue-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 text-4xl">
                {action.emoji}
              </div>
              <CardTitle className="text-xl text-apvj-blue-800">
                {action.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600 leading-relaxed">
                {action.description}
              </p>
              {action.external ? (
                <Button 
                  className={`w-full ${action.color} text-white font-semibold border-0`}
                  asChild
                >
                  <a href={action.link} target="_blank" rel="noopener noreferrer">
                    <action.icon className="h-4 w-4 mr-2" />
                    Découvrir
                  </a>
                </Button>
              ) : (
                <Button 
                  className={`w-full ${action.color} text-white font-semibold border-0`}
                  asChild
                >
                  <Link to={action.link}>
                    <action.icon className="h-4 w-4 mr-2" />
                    Découvrir
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section d'urgence */}
      <div className="gradient-alert rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">🚨 Situation d'urgence ?</h3>
        <p className="text-lg mb-6 opacity-90">
          Si vous êtes en danger immédiat ou avez besoin d'une aide urgente, contactez-nous immédiatement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-apvj-red-600">
            📞 Ligne d'urgence 24h/24
          </Button>
          <Button size="lg" className="bg-white text-apvj-red-600 hover:bg-apvj-cream-50" asChild>
            <Link to="/contact">
              ✉️ Contact d'urgence
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
