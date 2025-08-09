
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Préparer la requête SQL
      const sql = `
        INSERT INTO contact_messages 
        (name, email, subject, message, is_read, status)
        VALUES 
        ('${formData.prenom} ${formData.nom}', 
         '${formData.email}', 
         'Nouveau message de contact', 
         '${formData.message.replace(/'/g, "''")}', 
         0, 
         'new')
      `;
      
      // Envoyer la requête au serveur
      const response = await fetch('http://localhost:3000/api/execute-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi du message');
      }
      
      // Afficher un message de succès
      toast.success("Votre message a été envoyé avec succès. Nous vous recontacterons rapidement.", {
        duration: 5000
      });
      
      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        message: ""
      });
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.", {
        duration: 5000
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-apvj-blue-50 to-apvj-green-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-apvj-blue-800 mb-4">
            🤝 Contactez-nous
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Rejoignez notre communauté ou posez-nous vos questions. Nous sommes là pour vous accompagner.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire de contact */}
          <Card className="border-2 border-apvj-blue-200">
            <CardHeader className="bg-apvj-blue-50">
              <CardTitle className="flex items-center gap-2 text-apvj-blue-800">
                <Users className="h-5 w-5" />
                Rejoignez-nous
              </CardTitle>
              <p className="text-sm text-gray-600">
                Remplissez ce formulaire pour nous contacter
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom" className="font-semibold text-apvj-blue-800">Nom *</Label>
                    <Input
                      id="nom"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="mt-2 focus:ring-apvj-blue-500 focus:border-apvj-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prenom" className="font-semibold text-apvj-blue-800">Prénom *</Label>
                    <Input
                      id="prenom"
                      required
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      className="mt-2 focus:ring-apvj-blue-500 focus:border-apvj-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="font-semibold text-apvj-blue-800">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-2 focus:ring-apvj-blue-500 focus:border-apvj-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="font-semibold text-apvj-blue-800">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    placeholder="Dites-nous comment vous souhaitez nous rejoindre ou posez-nous vos questions..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="mt-2 focus:ring-apvj-blue-500 focus:border-apvj-blue-500"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full gradient-blue-yellow text-white font-semibold py-4 text-lg border-0"
                >
                  🤝 Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-6">
            <Card className="border-2 border-apvj-green-200">
              <CardHeader className="bg-apvj-green-50">
                <CardTitle className="text-apvj-green-800">Nos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-apvj-green-600" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">contact@apvj.fr</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-apvj-green-600" />
                  <div>
                    <p className="font-semibold">Ligne d'urgence</p>
                    <p className="text-gray-600">Disponible 24h/24</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-apvj-green-600" />
                  <div>
                    <p className="font-semibold">Localisation</p>
                    <p className="text-gray-600">France</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-apvj-yellow-200">
              <CardHeader className="bg-apvj-yellow-50">
                <CardTitle className="text-apvj-yellow-800">Pourquoi nous rejoindre ?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-apvj-yellow-500 rounded-full mt-2"></div>
                    <p>Participer à la protection des lanceurs d'alerte</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-apvj-yellow-500 rounded-full mt-2"></div>
                    <p>Contribuer à la transparence et à la justice</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-apvj-yellow-500 rounded-full mt-2"></div>
                    <p>Rejoindre une communauté engagée</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-apvj-yellow-500 rounded-full mt-2"></div>
                    <p>Bénéficier de notre soutien et expertise</p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-apvj-red-200">
              <CardHeader className="bg-apvj-red-50">
                <CardTitle className="text-apvj-red-700">Engagement éthique</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Nous nous engageons à protéger votre vie privée et vos données personnelles. 
                  Toutes les communications sont sécurisées et confidentielles.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
