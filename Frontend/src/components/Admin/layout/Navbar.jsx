import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Calendar, 
  Menu, 
  ChevronDown, 
  Sparkles, 
  Moon, 
  Sun,
  Filter
} from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Fonction pour déterminer le titre en fonction du chemin
  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Tableau de bord';
      case '/analytics': return 'Analytique';
      case '/invoice': return 'Facture';
      case '/hr': return 'Liste RH';
      case '/calendar': return 'Calendrier';
      case '/messages': return 'Messages';
      case '/notifications': return 'Notification';
      case '/settings': return 'Paramètres';
      default: return 'Tableau de bord';
    }
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <header className="bg-white h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20 shadow-md">
      <div className="flex items-center gap-4">
        {/* Button to toggle sidebar on mobile */}
        <button 
          className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-200" 
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{getTitle()}</h1>
          <div className="ml-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-medium shadow-sm">
            Pro
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-5">
        {/* Barre de recherche */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Rechercher..."
            className="py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64 bg-gray-50 text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        {/* Sélecteur de date */}
        <div className="hidden sm:flex items-center gap-2 rounded-full py-1.5 px-3 bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-all duration-200 hover:border-indigo-200">
          <Calendar size={16} className="text-indigo-600" />
          <span className="text-sm text-gray-700">10/06 - 10/10</span>
          <ChevronDown size={14} className="text-gray-500" />
        </div>
        
        {/* Bouton Filtre */}
        <button className="hidden sm:flex items-center gap-1.5 rounded-full py-1.5 px-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm transition-all duration-200 hover:border-indigo-200">
          <Filter size={14} className="text-indigo-600" />
          <span>Filtres</span>
        </button>
        
        {/* Boutons d'action avec effets améliorés */}
        <div className="flex gap-1 md:gap-2">
          {/* Toggle Dark/Light Mode */}
          <button 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors duration-200"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 relative transition-colors duration-200">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          {/* Pro features */}
          <button className="hidden sm:flex p-2 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors duration-200">
            <Sparkles size={20} />
          </button>
        </div>
        
        {/* Avatar de l'utilisateur avec effet de survol élégant */}
        <button className="hidden md:flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full hover:bg-indigo-50 transition-all duration-200 border border-transparent hover:border-indigo-200 group">
          <div className="relative">
            <img 
              src="/api/placeholder/32/32" 
              alt="User profile" 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm group-hover:border-indigo-100"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Betty L.</span>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-500" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;