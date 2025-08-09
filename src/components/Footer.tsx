
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Shield, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-apvj-blue-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et mission */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/c705d505-27ac-4522-a5a6-7528b40e063b.png" 
                alt="APVJ Logo" 
                className="h-12 w-12 filter brightness-110"
              />
              <div>
                <div className="text-xl font-bold">APVJ</div>
                <div className="text-sm text-apvj-blue-200">Protection des lanceurs d'alerte</div>
              </div>
            </div>
            <p className="text-apvj-blue-200 text-sm leading-relaxed">
              Votre voix compte. Votre sécurité est notre priorité. 
              Ensemble pour la justice et la transparence.
            </p>
          </div>

          {/* Soutien */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-apvj-yellow-400">Agir avec nous</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/lancer-alerte" className="text-apvj-blue-200 hover:text-white transition-colors">🚨 Lancer une alerte</Link></li>
              <li><a href="https://alodons.fr" target="_blank" rel="noopener noreferrer" className="text-apvj-blue-200 hover:text-white transition-colors">Nous soutenir</a></li>
              <li><Link to="/contact" className="text-apvj-blue-200 hover:text-white transition-colors">Rejoins-nous</Link></li>
              <li><Link to="/newsletter" className="text-apvj-blue-200 hover:text-white transition-colors">Newsletter</Link></li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-apvj-yellow-400">Informations</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/alertes" className="text-apvj-blue-200 hover:text-white transition-colors">Nos alertes</Link></li>
              <li><Link to="/actions" className="text-apvj-blue-200 hover:text-white transition-colors">Nos actions</Link></li>
              <li><Link to="/evenements" className="text-apvj-blue-200 hover:text-white transition-colors">Événements</Link></li>
              <li><Link to="/articles" className="text-apvj-blue-200 hover:text-white transition-colors">Articles</Link></li>
            </ul>
          </div>

          {/* Contact et réseaux */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-apvj-yellow-400">Nous suivre</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-apvj-blue-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-apvj-blue-200 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-apvj-blue-200 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-apvj-blue-200 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <div className="text-sm text-apvj-blue-200">
              <p>Email: contact@apvj.fr</p>
              <p>Ligne d'urgence: 24h/24</p>
            </div>
          </div>
        </div>

        {/* Barre du bas */}
        <div className="border-t border-apvj-blue-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-apvj-blue-200">
              <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link to="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
              <Link to="/presse" className="hover:text-white transition-colors">Presse</Link>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-apvj-green-400">
                <Shield className="h-4 w-4" />
                <span>Site 100% sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-apvj-yellow-400">
                <Heart className="h-4 w-4" />
                <span>Fait avec engagement</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4 text-sm text-apvj-blue-300">
            <p>© 2024 APVJ - Association pour la Protection et la Vérité des Lanceurs d'Alerte</p>
            <p className="italic">"Chacun a le droit d'alerter en toute sécurité"</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
