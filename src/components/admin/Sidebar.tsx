import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, LayoutDashboard, Bell, ListTodo, Mail, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export const Sidebar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const [currentHash, setCurrentHash] = useState('');

  // Mettre à jour le hash actuel quand l'emplacement change
  useEffect(() => {
    const hash = location.hash || '#overview';
    setCurrentHash(hash);
    
    // Forcer le défilement vers le haut et déclencher l'événement hashchange
    if (location.hash) {
      window.scrollTo(0, 0);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  }, [location]);
  
  // Gérer le clic sur un élément de la barre latérale
  const handleNavigation = (targetTab: string) => {
    setIsOpen(false);
    window.location.hash = targetTab;
    // Forcer le rafraîchissement si on clique sur l'onglet actif
    if (currentHash === `#${targetTab}`) {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  const navigation = [
    { 
      name: 'Tableau de bord', 
      href: '/admin#overview', 
      icon: LayoutDashboard,
      targetTab: 'overview',
      badge: null
    },
    { 
      name: 'Alertes', 
      href: '/admin#alerts', 
      icon: Bell,
      targetTab: 'alerts',
      badge: null
    },
    { 
      name: 'Actions', 
      href: '/admin#actions', 
      icon: ListTodo,
      targetTab: 'actions',
      badge: null
    },
    { 
      name: 'Messages', 
      href: '/admin#messages', 
      icon: Mail,
      targetTab: 'messages',
      badge: null
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-blue-700">
            <h1 className="text-xl font-bold">APVJ Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                  currentHash === `#${item.targetTab}`
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:bg-opacity-50'
                }`}
                onClick={() => handleNavigation(item.targetTab)}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
                {item.badge && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium rounded-full bg-blue-600 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium">A</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Admin</p>
                  <p className="text-xs text-blue-200">Administrateur</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-blue-200 hover:text-white hover:bg-blue-700 rounded-md"
                title="Déconnexion"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
