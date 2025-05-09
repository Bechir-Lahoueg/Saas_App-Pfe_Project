import React, { useState, useEffect } from "react";
import { Search, Bell, Calendar, Menu, ChevronDown, Moon, Sun,
  Users, MessageSquare, Settings as SettingsIcon, ChevronRight,
  LogOut, ChevronLeft, CreditCard, X, Home, BarChart3, Clock,
  ArrowRight, Sliders, Layout, Globe, Gauge, HelpCircle, User, Activity,
  PieChart, Layers, FileText, Award, Bookmark, Mail } from 'lucide-react';
import logoImage from "../../assets/LogoPlanifygoPNG.png";

// Import page components
import DashboardContent from "../pages/DashboardContent";
import Analytics from "../pages/Analytics";
import Invoice from "../pages/Invoice";
import HR from "../pages/HR";
import CalendarPage from "../pages/Calendar";
import Catégorie from "../pages/Category";
import Notifications from "../pages/Notifications";
import SettingsPage from "../pages/Settings";

const Navigation = () => {
  // États
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activePage') || "dashboard";
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [adminData, setAdminData] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);

  // Même logique pour les effets et fonctions...
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const stringAdminData = localStorage.getItem('admin');
    
    if (!accessToken) {
      window.location.href = '/connexion';
      return;
    }
    
    if (stringAdminData) {
      try {
        setAdminData(JSON.parse(stringAdminData));
      } catch (error) {
        console.error('Erreur lors de l\'analyse des données:', error);
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('activePage');
    window.location.href = '/connexion';
  };

  const navigateTo = (pageId) => {
    setActivePage(pageId);
    localStorage.setItem('activePage', pageId);
    setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const getPageTitle = () => {
    switch (activePage) {
      case "dashboard": return "Tableau de bord";
      case "analytics": return "Analytique";
      case "invoice": return "Factures";
      case "hr": return "Équipe";
      case "calendar": return "Calendrier";
      case "Catégorie": return "Catégories";
      case "notifications": return "Notifications";
      case "settings": return "Paramètres";
      default: return "Tableau de bord";
    }
  };

  const getUserName = () => {
    if (!adminData) return "Utilisateur";
    return adminData.name || adminData.email?.split('@')[0] || "Utilisateur";
  };

  const getUserRole = () => {
    if (!adminData) return "";
    return !adminData.tenant ? "Administrateur" : "Utilisateur";
  };

  // Nouveaux éléments du menu avec icônes mises à jour
  const mainMenuItems = [
    { id: "dashboard", icon: Home, label: "Tableau de bord", description: "Vue générale et statistiques" },
    { id: "analytics", icon: PieChart, label: "Analytique", description: "Analyse des données", badge: "PRO" },
    { id: "invoice", icon: FileText, label: "Factures", description: "Gestion des paiements", counter: 2 },
    { id: "hr", icon: Users, label: "Équipe", description: "Gestion des utilisateurs" },
    { id: "calendar", icon: Calendar, label: "Calendrier", description: "Organisation & planning" },
    { id: "Catégorie", icon: Layers, label: "Catégories", description: "Gestion des catégories", counter: 5 },
  ];

  const secondaryMenuItems = [
    { id: "notifications", icon: Bell, label: "Notifications", description: "Centre de notifications", counter: notificationsCount },
    { id: "settings", icon: SettingsIcon, label: "Paramètres", description: "Configuration système" },
  ];

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardContent sidebarExpanded={!isSidebarCollapsed} />;
      case "analytics": return <Analytics />;
      case "invoice": return <Invoice />;
      case "hr": return <HR />;
      case "calendar": return <CalendarPage />;
      case "Catégorie": return <Catégorie />;
      case "notifications": return <Notifications />;
      case "settings": return <SettingsPage />;
      default: return <DashboardContent sidebarExpanded={!isSidebarCollapsed} />;
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Overlay pour mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Nouvelle Sidebar redesignée */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            flex flex-col
            w-72 lg:w-auto ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
            bg-gradient-to-b from-violet-50 to-indigo-50 dark:from-indigo-950 dark:to-slate-900
            border-r border-violet-100 dark:border-indigo-900/40
            transform transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            shadow-xl lg:shadow-md
          `}
        >
          {/* Bouton toggle sidebar avec nouveau design */}
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-24 hidden lg:flex items-center justify-center h-7 w-7 rounded-full
              bg-white dark:bg-indigo-900 text-violet-600 dark:text-violet-300
              shadow-lg border border-violet-100 dark:border-indigo-800
              hover:shadow-violet-200 dark:hover:shadow-indigo-900/50
              transition-all duration-300 z-10"
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={15} />
            ) : (
              <ChevronLeft size={15} />
            )}
          </button>

          {/* Logo avec nouveau design */}
          <div className="relative flex items-center justify-center p-4 border-b border-violet-100/80 dark:border-indigo-900/40">
            <div className={`overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-10' : 'w-full'}`}>
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-indigo-900/30 p-1.5 rounded-lg shadow-sm">
                  <img 
                    src={logoImage} 
                    alt="PlanifyGo Logo" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
                {!isSidebarCollapsed && (
                  <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-800 to-indigo-600 dark:from-violet-300 dark:to-indigo-400">
                    PlanifyGo
                  </span>
                )}
              </div>
            </div>
            
            <button
              className="lg:hidden absolute right-4 top-4 text-violet-600 dark:text-violet-300 hover:text-violet-800 dark:hover:text-violet-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Profil utilisateur avec nouveau design */}
          <div className="px-4 py-5 border-b border-violet-100/80 dark:border-indigo-900/40">
            <div className={`
              flex items-center gap-3 
              ${isSidebarCollapsed ? 'justify-center' : ''}
              px-2.5 py-2.5 rounded-xl 
              transition-all 
              hover:bg-white/60 dark:hover:bg-indigo-900/20
              shadow-sm hover:shadow-md hover:shadow-violet-100 dark:hover:shadow-indigo-900/20
              border border-transparent hover:border-violet-100/80 dark:hover:border-indigo-900/40
            `}>
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 flex items-center justify-center shadow-inner">
                  <User className="w-5 h-5 text-violet-700 dark:text-violet-300" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-800"></div>
              </div>
              
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-violet-900 dark:text-violet-100 truncate">
                    {getUserName()}
                  </p>
                  <div className="flex items-center">
                    {adminData && !adminData.tenant ? (
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-500">
                        {getUserRole()}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span className="text-xs text-violet-600 dark:text-violet-300">En ligne</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Menu principal avec nouveau design */}
          <nav className="flex-1 px-3 py-5 overflow-y-auto">
            {!isSidebarCollapsed && (
              <h3 className="px-4 mb-3 text-xs font-semibold text-violet-600 dark:text-violet-300 uppercase tracking-wider">
                Navigation
              </h3>
            )}
            
            <div className="space-y-2">
              {mainMenuItems.map((item) => {
                const isActive = activePage === item.id;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`
                      w-full flex items-center 
                      ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}
                      px-3 py-2.5 rounded-xl text-sm
                      transition-all duration-200
                      border ${isActive ? 'border-violet-200 dark:border-indigo-700' : 'border-transparent'} 
                      ${isActive 
                        ? 'bg-white dark:bg-indigo-900/30 shadow-md shadow-violet-100/50 dark:shadow-indigo-900/20' 
                        : 'hover:bg-white/60 dark:hover:bg-indigo-900/20 hover:shadow-sm'}
                    `}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`
                        flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg
                        ${isActive 
                          ? 'bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-800/50 dark:to-indigo-800/50 shadow-sm' 
                          : 'bg-white/60 dark:bg-indigo-900/30'}
                        ${isActive 
                          ? 'text-violet-700 dark:text-violet-300' 
                          : 'text-violet-600 dark:text-violet-400'}
                      `}>
                        <Icon size={isSidebarCollapsed ? 19 : 17} />
                      </div>
                      
                      {!isSidebarCollapsed && (
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-center">
                            <span className={`truncate font-medium ${isActive ? 'text-violet-900 dark:text-violet-100' : 'text-violet-700 dark:text-violet-300'}`}>
                              {item.label}
                            </span>
                            {item.counter && (
                              <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 text-xs font-medium rounded-full
                                bg-violet-100 dark:bg-violet-800/50 text-violet-800 dark:text-violet-200">
                                {item.counter}
                              </span>
                            )}
                            {item.badge && (
                              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-md
                                bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200/50 dark:border-fuchsia-800/50">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-violet-500 dark:text-violet-400 truncate mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Indicateurs pour vue collapse */}
                    {isSidebarCollapsed && item.counter && (
                      <span className="absolute top-1 right-1 h-5 min-w-[1.25rem] px-1 flex items-center justify-center text-xs font-medium
                        bg-violet-100 dark:bg-violet-800/50 text-violet-700 dark:text-violet-200 rounded-full shadow-sm border border-violet-200/50 dark:border-violet-700/50">
                        {item.counter}
                      </span>
                    )}
                    {isSidebarCollapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 flex items-center justify-center
                        bg-fuchsia-100 dark:bg-fuchsia-900/50 border border-fuchsia-200 dark:border-fuchsia-800/50 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {!isSidebarCollapsed && (
              <h3 className="px-4 mt-8 mb-3 text-xs font-semibold text-violet-600 dark:text-violet-300 uppercase tracking-wider">
                Paramètres
              </h3>
            )}
            {isSidebarCollapsed && (
              <div className="my-6 mx-auto h-px w-6 bg-violet-200/70 dark:bg-indigo-800/50 rounded-full"></div>
            )}
            
            <div className="space-y-2">
              {secondaryMenuItems.map((item) => {
                const isActive = activePage === item.id;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`
                      w-full flex items-center 
                      ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}
                      px-3 py-2.5 rounded-xl text-sm
                      transition-all duration-200
                      border ${isActive ? 'border-violet-200 dark:border-indigo-700' : 'border-transparent'} 
                      ${isActive 
                        ? 'bg-white dark:bg-indigo-900/30 shadow-md shadow-violet-100/50 dark:shadow-indigo-900/20' 
                        : 'hover:bg-white/60 dark:hover:bg-indigo-900/20 hover:shadow-sm'}
                    `}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`
                        flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg
                        ${isActive 
                          ? 'bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-800/50 dark:to-indigo-800/50 shadow-sm' 
                          : 'bg-white/60 dark:bg-indigo-900/30'}
                        ${isActive 
                          ? 'text-violet-700 dark:text-violet-300' 
                          : item.id === 'notifications' && notificationsCount > 0 && !isActive
                            ? 'text-amber-500 dark:text-amber-400'
                            : 'text-violet-600 dark:text-violet-400'}
                      `}>
                        <Icon size={isSidebarCollapsed ? 19 : 17} />
                      </div>
                      
                      {!isSidebarCollapsed && (
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-center">
                            <span className={`truncate font-medium ${isActive ? 'text-violet-900 dark:text-violet-100' : 'text-violet-700 dark:text-violet-300'}`}>
                              {item.label}
                            </span>
                            {item.counter && (
                              <span className={`
                                ml-2 inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 text-xs font-medium rounded-full
                                ${isActive
                                  ? 'bg-violet-100 dark:bg-violet-800/50 text-violet-800 dark:text-violet-200' 
                                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}
                                  border ${isActive ? 'border-violet-200/50 dark:border-violet-700/50' : 'border-amber-200/50 dark:border-amber-800/50'}
                              `}>
                                {item.counter}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-violet-500 dark:text-violet-400 truncate mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Indicateur pour vue collapse */}
                    {isSidebarCollapsed && item.counter && (
                      <span className={`
                        absolute top-1 right-1 h-5 min-w-[1.25rem] px-1 flex items-center justify-center text-xs font-medium rounded-full
                        ${isActive 
                          ? 'bg-violet-100 dark:bg-violet-800/50 text-violet-700 dark:text-violet-200 border border-violet-200/50 dark:border-violet-700/50'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50'}
                      `}>
                        {item.counter}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
          
          {/* Déconnexion avec nouveau design */}
          <div className="px-4 py-4 border-t border-violet-100/80 dark:border-indigo-900/40">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center
                ${isSidebarCollapsed ? 'justify-center' : ''}
                px-3 py-2.5 rounded-xl
                text-rose-700 dark:text-rose-300
                bg-white/40 dark:bg-indigo-900/20
                border border-transparent
                hover:bg-white hover:shadow-md hover:border-rose-100 dark:hover:border-rose-900/30
                transition-all duration-200
              `}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg
                  bg-rose-50 dark:bg-rose-900/20
                  text-rose-600 dark:text-rose-400
                  border border-rose-100/80 dark:border-rose-900/30">
                  <LogOut size={isSidebarCollapsed ? 19 : 17} />
                </div>
                
                {!isSidebarCollapsed && (
                  <span className="font-medium">Déconnexion</span>
                )}
              </div>
            </button>
          </div>
        </aside>

        {/* Contenu principal */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header avec nouveau design */}
          <header className="sticky top-0 z-30 flex items-center h-16 bg-white dark:bg-slate-800 shadow-sm">
            <div className="flex items-center justify-between w-full px-4 sm:px-6">
              {/* Gauche - Titre et navigation mobile */}
              <div className="flex items-center space-x-4">
                {/* Menu mobile */}
                <button
                  className="lg:hidden p-2 rounded-lg text-violet-600 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-indigo-900/30"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu size={22} />
                </button>

                {/* Titre de la page */}
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-violet-900 dark:text-violet-100">
                    {getPageTitle()}
                  </h1>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-violet-500 to-indigo-500 dark:from-violet-400 dark:to-indigo-400 rounded-full"></div>
                </div>
                
                {/* Badge page spéciale */}
                {activePage === "analytics" && (
                  <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/20 dark:text-fuchsia-300 border border-fuchsia-100 dark:border-fuchsia-800/30">
                    <span className="mr-1 w-1.5 h-1.5 rounded-full bg-fuchsia-500"></span>
                    Premium
                  </span>
                )}
                
                {/* Badge admin */}
                {adminData && !adminData.tenant && (
                  <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-100 dark:border-amber-800/30">
                    <Award size={12} className="mr-1" />
                    {getUserRole()}
                  </span>
                )}
              </div>
              
              {/* Droite - Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Recherche avec nouveau design */}
                <div className={`
                  relative hidden md:block
                  ${searchFocused ? 'w-80' : 'w-60'}
                  transition-all duration-300 ease-in-out
                `}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className={`
                        w-full h-9 py-2 pl-10 pr-4 rounded-xl
                        bg-violet-50 dark:bg-indigo-900/20
                        border border-violet-100 dark:border-indigo-800/50
                        text-violet-900 dark:text-violet-100
                        placeholder-violet-400 dark:placeholder-violet-400
                        focus:outline-none focus:ring-2 focus:ring-violet-300/50 dark:focus:ring-violet-500/30 focus:border-transparent
                        transition-all duration-200
                      `}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search size={16} className="text-violet-500 dark:text-violet-400" />
                    </div>
                    
                    {searchFocused && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-violet-500 dark:text-violet-400">
                        Ctrl+K
                      </div>
                    )}
                  </div>
                </div>

                {/* Sélecteur de date */}
                <button className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-violet-50 dark:bg-indigo-900/20 text-violet-700 dark:text-violet-300 hover:bg-violet-100/70 dark:hover:bg-indigo-900/40 border border-violet-100 dark:border-indigo-800/50 transition-all duration-200">
                  <Clock size={15} className="text-violet-600 dark:text-violet-400" />
                  <span className="text-sm">Aujourd'hui</span>
                  <ChevronDown size={14} className="text-violet-500 dark:text-violet-400" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-indigo-900/30 border border-transparent hover:border-violet-100 dark:hover:border-indigo-800/50 transition-colors duration-200">
                  <Bell size={19} />
                  {notificationsCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-xs font-medium bg-rose-500 text-white rounded-full transform -translate-y-1/4 translate-x-1/4 border border-white dark:border-indigo-900">
                      {notificationsCount}
                    </span>
                  )}
                </button>

                {/* Theme toggle */}
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-indigo-900/30 border border-transparent hover:border-violet-100 dark:hover:border-indigo-800/50 transition-colors duration-200"
                  aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                >
                  {isDarkMode ? (
                    <Sun size={19} className="text-amber-400" />
                  ) : (
                    <Moon size={19} className="text-violet-600" />
                  )}
                </button>

                {/* Séparateur */}
                <div className="hidden sm:block h-6 w-px bg-violet-100 dark:bg-indigo-800/50"></div>

                {/* Profil utilisateur (version mobile) */}
                <button className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-violet-50 dark:hover:bg-indigo-900/30 border border-transparent hover:border-violet-100 dark:hover:border-indigo-800/50 transition-colors duration-200">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 flex items-center justify-center">
                      <User className="w-4 h-4 text-violet-700 dark:text-violet-400" />
                    </div>
                  </div>
                  <span className="hidden sm:inline-block text-sm font-medium text-violet-700 dark:text-violet-300">
                    {getUserName()}
                  </span>
                  <ChevronDown size={14} className="hidden sm:block text-violet-400" />
                </button>
              </div>
            </div>
          </header>

          {/* Zone de contenu principale */}
          <main className={`flex-1 overflow-auto bg-gray-50 dark:bg-slate-900 transition-colors duration-300 p-4 sm:p-6`}>
            {renderActivePage()}
          </main>
        </div>
      </div>
      
      {/* Styles globaux */}
      <style jsx global>{`
        /* Masquer la barre de défilement tout en conservant la fonctionnalité */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background-color: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(124, 58, 237, 0.2);
          border-radius: 2rem;
        }
        
        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(124, 58, 237, 0.2);
        }
        
        @media (max-width: 1024px) {
          .overflow-y-auto::-webkit-scrollbar {
            width: 0px;
          }
        }
      `}</style>
    </div>
  );
};

export default Navigation;