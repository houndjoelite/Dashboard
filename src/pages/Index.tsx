
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Users, FileText, Calendar, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Stats } from "@/components/Stats";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-apvj-blue-50 to-apvj-green-50">
      <Navbar />
      
      <HeroSection />
      
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Section Dernières actualités */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-apvj-blue-800 mb-4">Dernières actualités</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Restez informé des dernières alertes et actions de l'APVJ
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-apvj-yellow-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <AlertTriangle className="h-6 w-6 text-apvj-yellow-600" />
                </div>
                <CardTitle className="text-2xl">Alertes récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Découvrez les dernières alertes signalées à notre association et suivez leur évolution.
                </p>
                <Button asChild variant="outline" className="group">
                  <Link to="/alertes">
                    Voir toutes les alertes
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-apvj-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <Shield className="h-6 w-6 text-apvj-blue-600" />
                </div>
                <CardTitle className="text-2xl">Nos actions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Découvrez comment nous agissons concrètement pour défendre la vérité et la justice.
                </p>
                <Button asChild variant="outline" className="group">
                  <Link to="/nos-actions">
                    Découvrir nos actions
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Statistiques d'impact */}
        <Stats />

        {/* Section Mission */}
        <section className="gradient-green-blue rounded-2xl p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Notre Mission</h2>
              <p className="text-xl leading-relaxed mb-6">
                L'APVJ place l'humain au cœur de toutes ses actions. Nous valorisons la bienveillance, 
                la justice et la liberté d'expression pour offrir un espace sécurisé aux lanceurs d'alerte.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-apvj-yellow-400" />
                  <span>Protection garantie</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-apvj-yellow-400" />
                  <span>Accompagnement humain</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-apvj-yellow-400" />
                  <span>Ressources juridiques</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-apvj-yellow-400" />
                  <span>Approche bienveillante</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/lovable-uploads/c705d505-27ac-4522-a5a6-7528b40e063b.png" 
                alt="Logo APVJ" 
                className="w-64 h-64 mx-auto filter brightness-110"
              />
            </div>
          </div>
        </section>

        {/* Call to action final */}
        <section className="text-center bg-apvj-yellow-50 rounded-2xl p-12 border-2 border-apvj-yellow-400">
          <h2 className="text-3xl font-bold text-apvj-blue-800 mb-4">
            Chacun a le droit d'alerter en toute sécurité
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Rejoignez notre communauté de citoyens engagés pour la justice et la transparence. 
            Votre voix compte, votre sécurité est notre priorité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-alert text-white px-8 py-4 text-lg border-0 hover:shadow-lg" asChild>
              <Link to="/lancer-alerte">
                🚨 Lancer une alerte
              </Link>
            </Button>
            <Button size="lg" className="bg-apvj-blue-600 text-white hover:bg-apvj-blue-700 px-8 py-4 text-lg border-0" asChild>
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
