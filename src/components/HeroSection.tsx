
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 text-white py-20 overflow-hidden">
      {/* Motifs de fond */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-green-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu principal */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold">
              <Shield className="h-4 w-4" />
              Plateforme sécurisée et confidentielle
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Votre voix pour la 
              <span className="text-yellow-400"> justice</span> et la 
              <span className="text-green-400"> vérité</span>
            </h1>
            
            <p className="text-xl leading-relaxed text-blue-100">
              L'APVJ offre un espace sécurisé aux lanceurs d'alerte, leurs familles et toute personne 
              souhaitant s'exprimer librement sur des faits sensibles, sans crainte de représailles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                asChild
              >
                <Link to="/lancer-alerte">
                  🚨 Lancer une alerte
                </Link>
              </Button>
              
              <Button 
                variant="default" 
                size="lg"
                className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold border-2 border-black"
                asChild
              >
                <Link to="/nos-actions">
                  <Users className="h-5 w-5 mr-2" />
                  Découvrir nos actions
                </Link>
              </Button>
            </div>

            {/* Statistiques rapides */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-blue-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-sm text-blue-200">Alertes traitées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">100%</div>
                <div className="text-sm text-blue-200">Confidentialité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">24/7</div>
                <div className="text-sm text-blue-200">Accompagnement</div>
              </div>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-20">
              <img 
                src="/lovable-uploads/c705d505-27ac-4522-a5a6-7528b40e063b.png" 
                alt="Logo APVJ - Protection des lanceurs d'alerte" 
                className="w-full max-w-md mx-auto filter brightness-110"
              />
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  <span className="font-medium">Protection garantie</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Shield className="h-6 w-6 text-green-400" />
                  <span className="font-medium">Anonymat respecté</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Users className="h-6 w-6 text-blue-400" />
                  <span className="font-medium">Accompagnement humain</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message d'engagement */}
        <div className="text-center pt-16">
          <blockquote className="text-2xl font-medium italic text-blue-100 max-w-4xl mx-auto">
            "Nous mettons l'humain au cœur de toutes nos actions, valorisant la bienveillance, 
            la justice et la liberté d'expression pour un monde plus transparent et équitable."
          </blockquote>
          <cite className="block mt-4 text-yellow-400 font-semibold">— Mission APVJ</cite>
        </div>
      </div>
    </section>
  );
};
