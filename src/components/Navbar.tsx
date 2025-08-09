
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, AlertTriangle, Shield, Users, FileText, Calendar, MessageSquare, DollarSign, Newspaper, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Accueil", href: "/", icon: null },
    { label: "Lancer une alerte", href: "/lancer-alerte", icon: AlertTriangle },
    { label: "Nos actions", href: "/nos-actions", icon: Shield },
    { label: "Nos alertes", href: "/Alertes", icon: AlertTriangle, highlight: true },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-apvj-yellow-500 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/c705d505-27ac-4522-a5a6-7528b40e063b.png" 
              alt="APVJ Logo" 
              className="h-12 w-12"
            />
            <div>
              <div className="text-2xl font-bold text-apvj-blue-800">APVJ</div>
              <div className="text-sm text-gray-600">Alertes • Protection • Vérité • Justice</div>
            </div>
          </Link>

          {/* Menu desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.highlight
                    ? "gradient-alert text-white hover:shadow-lg"
                    : "text-gray-700 hover:bg-apvj-blue-50 hover:text-apvj-blue-800"
                }`}
              >
                {item.highlight && "🚨 "}{item.label}
              </Link>
            ))}
          </div>

          {/* Bouton alerte fixe */}
          <div className="hidden lg:block">
            <Button className="gradient-alert text-white font-semibold border-0 hover:shadow-lg" asChild>
              <Link to="/Alertes">
                🚨 Alerte
              </Link>
            </Button>
          </div>

          {/* Menu mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {isOpen && (
          <div className="lg:hidden pb-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
                    item.highlight
                      ? "gradient-alert text-white"
                      : "text-gray-700 hover:bg-apvj-blue-50 hover:text-apvj-blue-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4 mr-3" />}
                  {item.highlight && "🚨 "}{item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
