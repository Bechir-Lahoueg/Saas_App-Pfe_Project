import React, { useState } from 'react';
import { 
  LayoutGrid, 
  PieChart, 
  FileText, 
  Users, 
  Calendar, 
  MessageCircle, 
  Bell, 
  Settings, 
  ChevronRight,
  LogOut,
  ChevronLeft,
  User,
  CreditCard,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ activePage, navigateTo, isMobileOpen, setIsMobileOpen }) => {
  const [expanded, setExpanded] = useState(true);
  
  const menuItems = [
    { id: 'dashboard', icon: LayoutGrid, label: "Tableau de bord", badge: 'New' },
    { id: 'analytique', icon: PieChart, label: "Analytique" },
    { id: 'facture', icon: CreditCard, label: "Facture" },
    { id: 'rh', icon: Users, label: "Liste RH" },
    { id: 'calendrier', icon: Calendar, label: "Calendrier" },
    { id: 'messages', icon: MessageCircle, label: "Messages", notification: 3 },
    { id: 'notification', icon: Bell, label: "Notification" },
    { id: 'parametres', icon: Settings, label: "Paramètres" }
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex ${expanded ? 'w-72' : 'w-20'} flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out shadow-xl ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Bouton pour réduire/agrandir la sidebar sur desktop */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="absolute -right-3 top-20 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md border border-white cursor-pointer"
        >
          {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
        
        {/* En-tête du sidebar avec logo */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md">
              <Sparkles className="text-white" size={20} />
            </div>
            {expanded && (
              <span className="font-bold text-xl text-gray-900 tracking-tight">Dashify</span>
            )}
          </div>
          <button 
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100" 
            onClick={() => setIsMobileOpen(false)}
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        
        {/* Section principale du menu */}
        <div className="py-4 flex-1 overflow-y-auto scrollbar-hide">
          {expanded && (
            <div className="px-5 mb-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Menu principal</p>
            </div>
          )}
          
          <div className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`flex items-center w-full px-3 py-3 my-0.5 rounded-xl transition-all duration-200 group ${
                    activePage === item.id 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => navigateTo(item.id)}
                >
                  <div className={`flex items-center justify-center min-w-10 h-10 rounded-lg ${
                    activePage === item.id 
                      ? "bg-indigo-100 text-indigo-700" 
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}>
                    <Icon size={20} />
                  </div>
                  
                  {expanded && (
                    <>
                      <span className={`ml-3 ${activePage === item.id ? "font-medium" : ""}`}>
                        {item.label}
                      </span>
                      
                      {item.notification && (
                        <div className="ml-auto bg-red-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                          {item.notification}
                        </div>
                      )}
                      
                      {item.badge && (
                        <span className="ml-auto text-xs py-0.5 px-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="my-4 mx-4 border-t border-gray-100"></div>
          
          {/* Section "Autres" */}
          {expanded && (
            <div className="px-5 mb-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Autres</p>
            </div>
          )}
          
          <div className="px-3">
            <button className="flex items-center w-full px-3 py-3 my-0.5 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 group">
              <div className="flex items-center justify-center min-w-10 h-10 rounded-lg text-gray-500 group-hover:text-red-500">
                <LogOut size={20} />
              </div>
              {expanded && <span className="ml-3">Déconnexion</span>}
            </button>
          </div>
        </div>
        
        {/* Profil utilisateur */}
        <div className={`p-3 border-t border-gray-100 ${expanded ? 'mx-4 mb-4 mt-2 rounded-xl bg-gray-50' : 'mx-2 my-2 rounded-lg bg-gray-50'}`}>
          <div className="flex items-center p-2 rounded-lg cursor-pointer group hover:bg-white transition-all duration-200">
            <div className="relative">
              <img 
                src="/api/placeholder/40/40" 
                alt="User profile" 
                className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm group-hover:ring-indigo-100"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white"></span>
            </div>
            
            {expanded && (
              <div className="flex-1 min-w-0 ml-3">
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-700">Betty Lehman</p>
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                  En ligne
                </p>
              </div>
            )}
            
            {expanded && (
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50">
                <User size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;