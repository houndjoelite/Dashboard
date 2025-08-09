
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Shield, Lock, Eye, EyeOff, Upload, File, X, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const LancerAlerte = () => {
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "medium",
    evidence: "",
    contact: "",
    name: "",
    anonymous: true
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isUploading) return;
    
    setIsUploading(true);
    
    try {
      // Créer un FormData pour envoyer les fichiers et les données du formulaire
      const formDataToSend = new FormData();
      
      // Ajouter les champs du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, String(value));
        }
      });
      
      // Ajouter les fichiers
      files.forEach((file) => {
        formDataToSend.append('files', file);
      });
      
      // Envoyer la requête avec FormData
      console.log('Envoi de la requête à:', `${API_BASE_URL}/api/alerts`);
      console.log('Données du formulaire:', Object.fromEntries(formDataToSend.entries()));
      
      const response = await fetch(`${API_BASE_URL}/api/alerts`, {
        method: 'POST',
        body: formDataToSend,
        // Ne pas définir le header Content-Type, il sera défini automatiquement avec la boundary
        credentials: 'include',
        mode: 'cors',
      });
      
      console.log('Réponse du serveur - Status:', response.status, response.statusText);
      
      let data;
      try {
        data = await response.json();
        console.log('Réponse du serveur - Données:', data);
      } catch (jsonError) {
        console.error('Erreur lors de l\'analyse de la réponse JSON:', jsonError);
        const textResponse = await response.text();
        console.error('Réponse brute du serveur:', textResponse);
        throw new Error(`Erreur serveur (${response.status}): ${textResponse}`);
      }

      if (!response.ok) {
        console.error('Erreur détaillée du serveur:', data);
        throw new Error(data.message || data.error || 'Erreur lors de l\'envoi de l\'alerte');
      }
      
      // Afficher le message de succès
      toast.success("Votre alerte a été transmise de manière sécurisée. Numéro de référence: " + data.data.reference, {
        duration: 10000
      });
      
      // Réinitialiser le formulaire
      setFormData({
        title: "",
        description: "",
        category: "",
        urgency: "medium",
        evidence: "",
        contact: "",
        name: "",
        anonymous: true
      });
      
      // Réinitialiser les fichiers
      setFiles([]);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'alerte:', error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de l'alerte";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const categories = [
    "Corruption",
    "Environnement", 
    "Santé publique",
    "Sécurité",
    "Droits humains",
    "Finances publiques",
    "Justice",
    "Autre"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* En-tête sécurisé */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Shield className="h-4 w-4" />
            Formulaire 100% sécurisé et confidentiel
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            🚨 Lancer une alerte
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Votre sécurité est notre priorité absolue. Ce formulaire est crypté et vos informations 
            sont protégées selon les plus hauts standards de confidentialité.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Lock className="h-5 w-5" />
                  Formulaire sécurisé
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Toutes vos données sont chiffrées de bout en bout
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Anonymat */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="anonymous"
                        checked={true}
                        disabled
                      />
                      <Label htmlFor="anonymous" className="font-semibold text-blue-900">
                        Votre signalement est anonyme
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Votre identité ne sera jamais révélée sans votre accord explicite
                    </p>
                  </div>

                  {/* Informations personnelles (optionnelles) */}
                  {false && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                          className="flex items-center gap-2 text-blue-700 hover:text-blue-900"
                        >
                          {showPersonalInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          Informations de contact (optionnel)
                        </button>
                      </div>
                      
                      {showPersonalInfo && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nom / Pseudo</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact">Email ou téléphone</Label>
                            <Input
                              id="contact"
                              value={formData.contact}
                              onChange={(e) => setFormData({...formData, contact: e.target.value})}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Titre de l'alerte */}
                  <div>
                    <Label htmlFor="title" className="text-lg font-semibold text-blue-900">
                      Titre de votre alerte *
                    </Label>
                    <Input
                      id="title"
                      required
                      placeholder="Résumez en quelques mots la situation..."
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="mt-2"
                    />
                  </div>

                  {/* Catégorie et urgence */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="font-semibold text-blue-900">Catégorie *</Label>
                      <select
                        id="category"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="urgency" className="font-semibold text-blue-900">Niveau d'urgence</Label>
                      <select
                        id="urgency"
                        value={formData.urgency}
                        onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyen</option>
                        <option value="high">Élevé</option>
                        <option value="critical">Critique</option>
                      </select>
                    </div>
                  </div>

                  {/* Description détaillée */}
                  <div>
                    <Label htmlFor="description" className="text-lg font-semibold text-blue-900">
                      Description détaillée *
                    </Label>
                    <Textarea
                      id="description"
                      required
                      placeholder="Décrivez les faits de manière précise : qui, quoi, quand, où, comment... Plus vous êtes précis, mieux nous pourrons vous aider."
                      rows={8}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="mt-2"
                    />
                  </div>

                  {/* Preuves */}
                  <div>
                    <Label htmlFor="evidence" className="font-semibold text-blue-900">
                      Éléments de preuve (optionnel)
                    </Label>
                    <Textarea
                      id="evidence"
                      placeholder="Décrivez les documents, témoignages ou autres éléments que vous possédez..."
                      rows={4}
                      value={formData.evidence}
                      onChange={(e) => setFormData({...formData, evidence: e.target.value})}
                      className="mt-2"
                    />
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        />
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Formats acceptés : images, PDF, documents (max 10MB)
                          </p>
                        </div>
                      </label>
                      
                      {/* Liste des fichiers sélectionnés */}
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</p>
                          <ul className="space-y-2">
                            {files.map((file, index) => (
                              <li key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                                <div className="flex items-center space-x-2">
                                  <File className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-700 truncate max-w-xs">
                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bouton d'envoi */}
                  <div className="pt-6 border-t border-gray-200">
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isUploading}
                        className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 text-lg ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isUploading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Envoi en cours...</span>
                          </div>
                        ) : (
                          <span>🚨 Transmettre l'alerte de manière sécurisée</span>
                        )}
                      </Button>
                    <p className="text-sm text-center text-gray-600 mt-2">
                      Transmission cryptée • Accusé de réception automatique • Réponse sous 24h
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informations de sécurité */}
          <div className="space-y-6">
            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Shield className="h-5 w-5" />
                  Votre sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p>Chiffrement bout-à-bout de toutes vos données</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p>Aucune trace conservée sur nos serveurs</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p>Anonymat garanti juridiquement</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p>Accompagnement par des experts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">Que se passe-t-il ensuite ?</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <p>Réception immédiate et sécurisée de votre alerte</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <p>Analyse par notre équipe d'experts sous 24h</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <p>Contact pour définir la stratégie d'accompagnement</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <p>Soutien juridique et médiatique si nécessaire</p>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader className="bg-yellow-50">
                <CardTitle className="text-yellow-800">Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Button variant="outline" className="w-full border-yellow-300 text-yellow-800 hover:bg-yellow-50">
                  📞 Ligne d'écoute 24h/24
                </Button>
                <Button variant="outline" className="w-full border-blue-300 text-blue-800 hover:bg-blue-50">
                  💬 Chat confidentiel
                </Button>
                <Button variant="outline" className="w-full border-green-300 text-green-800 hover:bg-green-50">
                  📧 Contact d'urgence
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LancerAlerte;
