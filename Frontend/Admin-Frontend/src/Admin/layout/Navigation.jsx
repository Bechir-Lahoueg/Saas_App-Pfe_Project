import React, { useState, useEffect } from "react";
import { Search, Bell, Calendar, Menu, ChevronDown, Moon, Sun, Filter, LayoutGrid, FileText, Users, MessageCircle, Settings as SettingsIcon, ChevronRight, LogOut, ChevronLeft, User, CreditCard, X, Building, ChevronsRight, Home, LineChart, BarChart3, Clock, Star, Shield } from 'lucide-react';
import { UserCircle } from 'lucide-react'; // Import icon
// Import logo
import logoImage from "../../assets/LogoPlanifygoPNG.png"; // Adjust the path as needed
// Import page components
import DashboardContent from "../pages/DashboardContent";
import Analytics from "../pages/Analytics";
import Invoice from "../pages/Invoice";
import CalendarPage from "../pages/Calendar";
import Catégorie from "../pages/Category";
import SettingsPage from "../pages/Settings";

const Navigation = () => {
  // States for various features
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Initialiser activePage depuis localStorage ou avec valeur par défaut
  const [activePage, setActivePage] = useState(() => {
    const savedPage = localStorage.getItem('activePage');
    return savedPage || "dashboard";
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [adminData, setadminData] = useState(null);

// Fetch user data on component mount
useEffect(() => {
  // Check if user is logged in by looking for the access token
  const accessToken = localStorage.getItem('accessToken');
  const stringAdminData = localStorage.getItem('admin');
  
  if (!accessToken) {
    // Redirect to login if no token found
    window.location.href = '/connexion';
    return;
  }
  
  if (stringAdminData) {
    try {
      const parsedAdminData = JSON.parse(stringAdminData);
      setadminData(parsedAdminData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      handleLogout(); // Logout if data is corrupted
    }
  }
}, []);

  // Handle logout function
  const handleLogout = () => {
    // Remove tokens and user data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('activePage'); // Also clear active page
    
    // Redirect to login page
    window.location.href = '/connexion';
  };

  // Monitor window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Theme management - initialize with light mode
  useEffect(() => {
    setIsDarkMode(false);
    document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }, []);

// Mise à jour de la fonction handleLogoClick
const handleLogoClick = () => {
  const logo = document.getElementById('logo');
  if (logo.classList.contains('scale-150')) {
    logo.classList.replace('scale-150', 'scale-175');
  } else if (logo.classList.contains('scale-175')) {
    logo.classList.replace('scale-175', 'scale-200');
  } else if (logo.classList.contains('scale-200')) {
    logo.classList.replace('scale-200', 'scale-150');
  }
};

  // Navigation - Mise à jour pour stocker la page dans localStorage
  const navigateTo = (pageId) => {
    setActivePage(pageId);
    localStorage.setItem('activePage', pageId); // Sauvegarder dans localStorage
    
    if (windowWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Get title based on active page
  const getTitle = () => {
    switch (activePage) {
      case "dashboard":
        return "Tableau de bord";
      case "analytics":
        return "Analytique";
      case "invoice":
        return "Factures";
      case "calendar":
        return "Calendrier";
      case "Catégorie":
        return "Catégorie";
      case "settings":
        return "Paramètres";
      default:
        return "Tableau de bord";
    }
  };

// Get user's name - Updated to handle admin without tenant
const getUserName = () => {
  if (adminData) {
    if (adminData.name) {
      return adminData.name;
    } else if (adminData.email) {
      // Extraire le nom à partir de l'email si name n'est pas disponible
      return adminData.email.split('@')[0];
    }
  }
  return "Utilisateur";
};

// Get user role - For admin without tenant
const getUserRole = () => {
  if (adminData) {
    if (!adminData.tenant) {
      return "Administrateur";
    }
    return "Utilisateur";
  }
  return "";
};

  // Menu items definition
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Tableau de bord" },
    { id: "analytics", icon: BarChart3, label: "Analytique", enterprise: true },
    { id: "invoice", icon: CreditCard, label: "Factures", notification: 2 },
    { id: "calendar", icon: Calendar, label: "Calendrier" },
    { id: "Catégorie", icon: MessageCircle, label: "Catégorie", notification: 5 },
  ];

  const secondaryMenuItems = [
    { id: "settings", icon: SettingsIcon, label: "Paramètres" },
  ];

  // Conditional page rendering
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent sidebarExpanded={isSidebarExpanded} />;
      case "analytics":
        return <Analytics />;
      case "invoice":
        return <Invoice />;
      case "calendar":
        return <CalendarPage />;
      case "Catégorie":
        return <Catégorie />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardContent sidebarExpanded={isSidebarExpanded} />;
    }
  };

  return (
    <div
      className={`flex h-screen ${
        isDarkMode ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-gray-50 to-gray-100"
      } transition-all duration-500`}
    >
      {/* Mobile overlay avec flou amélioré */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar avec style moderne */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col ${
          isSidebarExpanded ? "w-72" : "w-24"
        } ${
          isDarkMode
            ? "bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border-r border-slate-700/50 text-white"
            : "bg-white border-r border-gray-200/80 shadow-lg"
        } transition-all duration-300 ease-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } rounded-r-xl`}
      >
        {/* Bouton d'expansion redessiné */}
        <button
          onClick={() => setSidebarExpanded(!isSidebarExpanded)}
          className={`absolute -right-3.5 top-28 hidden md:flex h-8 w-8 items-center justify-center rounded-full 
          ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20"
          } border-none cursor-pointer hover:scale-110 transition-all duration-200`}
        >
          {isSidebarExpanded ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        {/* Logo Section - Design modernisé */}
        <div
          className={`p-5 flex items-center justify-center ${
            isDarkMode ? "border-b border-slate-700/50" : "border-b border-slate-200/50"
          } relative overflow-visible`}
        >
          <div className="flex items-center justify-center w-full relative">
            <img 
              src={logoImage} 
              alt="PlanifyGo Logo" 
              className={`${isSidebarExpanded ? 'w-full max-h-28 object-contain' : 'w-full max-h-20 object-contain'} 
              transition-all duration-300 cursor-pointer hover:opacity-90 hover:scale-[1.02] filter drop-shadow-md scale-150`} 
              id="logo"
              onClick={handleLogoClick}
            />
          </div>
          <button
            className={`md:hidden absolute top-4 right-4 p-1.5 rounded-full ${
              isDarkMode
                ? "bg-slate-700 text-slate-300 hover:text-white"
                : "bg-gray-100 text-gray-500 hover:text-gray-700"
            } transition-all duration-200`}
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Section profil utilisateur redessinée */}
        <div
          className={`px-4 py-5 ${
            isDarkMode ? "border-b border-slate-700/50" : "border-b border-slate-200/50"
          }`}
        >
          <div
            className={`flex items-center ${!isSidebarExpanded && "justify-center"} p-3 rounded-xl 
            ${
              isDarkMode 
                ? "bg-gradient-to-r from-slate-800 to-slate-700 hover:from-blue-900/20 hover:to-indigo-900/20" 
                : "bg-gradient-to-r from-slate-100/80 to-gray-50 hover:from-blue-50 hover:to-indigo-50"
            } transition-all duration-300 cursor-pointer group relative`}
          >
            <div className="relative">
              <div className={`rounded-full p-0.5 ${
                isDarkMode 
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600" 
                  : "bg-gradient-to-br from-blue-400 to-indigo-500"
                }`}
              >
                <UserCircle 
                  className={`w-10 h-10 ${
                    isDarkMode ? "text-slate-200" : "text-white"
                  } rounded-full p-1 ${
                    isDarkMode ? "bg-slate-800" : "bg-white"
                  }`}
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            </div>

            {isSidebarExpanded && (
              <div className="flex-1 min-w-0 ml-3">
                <p
                  className={`text-sm font-semibold ${
                    isDarkMode
                      ? "text-white group-hover:text-blue-300"
                      : "text-slate-800 group-hover:text-blue-600"
                  } truncate`}
                >
                  {getUserName()}
                </p>
                <p className="text-xs flex items-center mt-0.5">
                  {/* Afficher le rôle d'administrateur si pas de tenant */}
                  {adminData && !adminData.tenant ? (
                    <span className={`${isDarkMode ? "text-orange-400" : "text-orange-500"} font-medium`}>{getUserRole()}</span>
                  ) : (
                    <div className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span>
                      <span className={isDarkMode ? "text-slate-300" : "text-slate-500"}>En ligne</span>
                    </div>
                  )}
                </p>
              </div>
            )}
            
            {/* Tooltip amélioré pour la sidebar réduite */}
            {!isSidebarExpanded && (
              <div className="absolute left-20 z-50 origin-left scale-0 px-3 py-2 rounded-lg bg-slate-800 text-white text-sm shadow-xl transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
                <div className="font-medium">{getUserName()}</div>
                <div className="text-xs flex items-center mt-1">
                  {adminData && !adminData.tenant ? (
                    <span className="text-orange-400">{getUserRole()}</span>
                  ) : (
                    <div className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1"></span>
                      <span className="text-slate-300">En ligne</span>
                    </div>
                  )}
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
              </div>
            )}
          </div>
        </div>

        {/* Menu principal redessiné */}
        <div className="py-4 flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
          {isSidebarExpanded && (
            <div className="px-7 mb-3">
              <p className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"} uppercase tracking-wider`}>
                Menu
              </p>
            </div>
          )}

          <div className="px-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const isHovered = hoveredMenu === item.id;

              return (
                <button
                  key={item.id}
                  className={`flex items-center w-full px-3 py-3 rounded-xl transition-all duration-300 group relative
                  ${
                    isActive
                      ? isDarkMode
                        ? "bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-300"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600"
                      : isDarkMode
                      ? "text-slate-300 hover:bg-slate-700/40"
                      : "text-slate-600 hover:bg-slate-100/70"
                  }`}
                  onClick={() => navigateTo(item.id)}
                  onMouseEnter={() => setHoveredMenu(item.id)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <div
                    className={`flex items-center justify-center min-w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      isActive
                        ? isDarkMode
                          ? "bg-gradient-to-br from-blue-800/40 to-indigo-800/40 text-blue-300"
                          : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"
                        : isDarkMode
                        ? `text-slate-400 ${
                            isHovered ? "bg-slate-700/50 text-slate-200" : ""
                          }`
                        : `text-slate-500 ${
                            isHovered ? "bg-slate-200/70 text-slate-700" : ""
                          }`
                    }`}
                  >
                    <Icon size={20} className={isActive ? "animate-pulse-slow" : ""} />
                  </div>

                  {isSidebarExpanded && (
                    <>
                      <span
                        className={`ml-3 ${
                          isActive ? "font-medium" : ""
                        } transition-all duration-300`}
                      >
                        {item.label}
                      </span>

                      {item.notification && (
                        <div
                          className={`ml-auto ${isDarkMode ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gradient-to-r from-blue-500 to-indigo-500"} 
                          text-white text-xs font-medium rounded-full h-6 w-6 flex items-center justify-center shadow-md ${
                            isActive || isHovered ? "scale-110" : ""
                          } transition-all duration-300`}
                        >
                          {item.notification}
                        </div>
                      )}

                      {item.enterprise && (
                        <span
                          className={`ml-auto text-xs py-0.5 px-2 rounded-lg ${
                            isDarkMode
                              ? "bg-slate-800/70 text-slate-400"
                              : "bg-slate-100 text-slate-500"
                          } ${
                            isActive || isHovered ? "scale-110" : ""
                          } transition-all duration-300`}
                        >
                          ENT
                        </span>
                      )}
                    </>
                  )}
                  
                  {/* Tooltip pour les éléments en mode réduit */}
                  {!isSidebarExpanded && (
                    <div className="absolute left-20 z-50 origin-left scale-0 px-3 py-2 rounded-lg bg-slate-800 text-white text-sm shadow-xl transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
                      {item.label}
                      {item.notification && (
                        <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                          {item.notification}
                        </span>
                      )}
                      <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {isSidebarExpanded && (
            <div className="px-7 mt-6 mb-3">
              <p className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"} uppercase tracking-wider`}>
                Préférences
              </p>
            </div>
          )}

          <div className="px-4 space-y-1.5">
            {secondaryMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const isHovered = hoveredMenu === item.id;

              return (
                <button
                  key={item.id}
                  className={`flex items-center w-full px-3 py-3 rounded-xl transition-all duration-300 group relative
                  ${
                    isActive
                      ? isDarkMode
                        ? "bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-300"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600"
                      : isDarkMode
                      ? "text-slate-300 hover:bg-slate-700/40"
                      : "text-slate-600 hover:bg-slate-100/70"
                  }`}
                  onClick={() => navigateTo(item.id)}
                  onMouseEnter={() => setHoveredMenu(item.id)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <div
                    className={`flex items-center justify-center min-w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      isActive
                        ? isDarkMode
                          ? "bg-gradient-to-br from-blue-800/40 to-indigo-800/40 text-blue-300"
                          : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"
                        : isDarkMode
                        ? `text-slate-400 ${
                            isHovered ? "bg-slate-700/50 text-slate-200" : ""
                          }`
                        : `text-slate-500 ${
                            isHovered ? "bg-slate-200/70 text-slate-700" : ""
                          }`
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {isSidebarExpanded && (
                    <span
                      className={`ml-3 ${
                        isActive ? "font-medium" : ""
                      } transition-all duration-300`}
                    >
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip pour les éléments en mode réduit */}
                  {!isSidebarExpanded && (
                    <div className="absolute left-20 z-50 origin-left scale-0 px-3 py-2 rounded-lg bg-slate-800 text-white text-sm shadow-xl transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bouton de déconnexion redessiné */}
        <div
          className={`p-4 ${
            isDarkMode ? "border-t border-slate-700/50" : "border-t border-slate-200/50"
          }`}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-3 rounded-xl transition-all duration-300 relative group
              ${
                isDarkMode
                  ? "text-slate-300 hover:bg-gradient-to-r from-red-900/20 to-orange-900/20 hover:text-red-400"
                  : "text-slate-600 hover:bg-gradient-to-r from-red-50 to-orange-50 hover:text-red-600"
              }`}
            onMouseEnter={() => setHoveredMenu("logout")}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div
              className={`flex items-center justify-center min-w-10 h-10 rounded-lg transition-all duration-300
              ${
                isDarkMode
                  ? `text-slate-400 ${
                      hoveredMenu === "logout"
                        ? "bg-gradient-to-br from-red-900/30 to-orange-900/30 text-red-400"
                        : ""
                    }`
                  : `text-slate-500 ${
                      hoveredMenu === "logout" ? "bg-gradient-to-br from-red-100 to-orange-100 text-red-500" : ""
                    }`
              }`}
            >
              <LogOut size={20} />
            </div>
            {isSidebarExpanded && <span className="ml-3 font-medium">Déconnexion</span>}
            
            {/* Tooltip pour le bouton de déconnexion */}
            {!isSidebarExpanded && (
              <div className="absolute left-20 z-50 origin-left scale-0 px-3 py-2 rounded-lg bg-slate-800 text-white text-sm shadow-xl transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
                Déconnexion
                <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main content area - Redesigned */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarExpanded ? "md:ml-72" : "md:ml-24"
        } transition-all duration-300`}
      >
        {/* Navbar améliorée */}
        <header
          className={`${
            isDarkMode
              ? "bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700/50"
              : "bg-white border-slate-200/70"
          } 
          h-16 px-4 md:px-6 flex items-center justify-between border-b sticky top-0 z-20 shadow-sm backdrop-blur-sm bg-opacity-90`}
        >
          <div className="flex items-center gap-4">
            <button
              className={`md:hidden p-2 rounded-lg ${
                isDarkMode
                  ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200"
              } transition-all duration-200`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3">
              <h1
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-slate-800"
                } tracking-tight`}
              >
                {getTitle()}
              </h1>
              {activePage === "analytics" && (
                <div
                  className={`hidden sm:flex px-2 py-0.5 rounded-lg text-xs font-medium items-center
                  ${isDarkMode 
                    ? 'bg-slate-700/50 text-slate-300 border border-slate-600/50' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200/80'}`}
                >
                  <Star size={10} className={isDarkMode ? "text-amber-400 mr-1" : "text-amber-500 mr-1"} />
                  Enterprise
                </div>
              )}
              
              {/* Badge Admin pour les utilisateurs sans tenant */}
              {adminData && !adminData.tenant && (
                <div
                  className={`hidden sm:flex px-2 py-0.5 rounded-lg text-xs font-medium items-center
                  ${isDarkMode 
                    ? 'bg-orange-900/20 text-orange-400 border border-orange-800/30' 
                    : 'bg-orange-50 text-orange-800 border border-orange-200/60'}`}
                >
                  <Shield size={10} className="mr-1" />
                  Admin
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Rechercher..."
                className={`py-2 pl-10 pr-4 rounded-lg ${
                  isDarkMode
                    ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:ring-blue-500/30"
                    : "bg-slate-100/70 border-slate-200/50 text-slate-800 focus:ring-blue-500/30"
                } 
                  border focus:outline-none focus:ring-2 focus:border-transparent transition-all w-64 text-sm`}
              />
              <Search
                className={`absolute left-3 top-2.5 ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
                size={18}
              />
            </div>

            <div
              className={`hidden sm:flex items-center gap-2 rounded-lg py-2 px-3.5 
              ${
                isDarkMode
                  ? "bg-slate-700/50 border-slate-600/50 hover:bg-slate-700"
                  : "bg-slate-100/70 border-slate-200/50 hover:bg-slate-200/70"
              } 
              border cursor-pointer transition-all duration-200`}
            >
              <Clock size={16} className={isDarkMode ? "text-blue-400" : "text-blue-500"} />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Aujourd'hui
              </span>
              <ChevronDown size={14} className={isDarkMode ? "text-slate-400" : "text-slate-500"} />
            </div>

            <div className="flex gap-1 md:gap-2">
              <button
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? "bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-amber-400"
                    : "bg-slate-100/70 hover:bg-slate-200/70 text-slate-600 hover:text-amber-500"
                } transition-all duration-200`}
                onClick={toggleDarkMode}
                aria-label={
                  isDarkMode ? "Activer le mode jour" : "Activer le mode nuit"
                }
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? "bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-blue-400"
                    : "bg-slate-100/70 hover:bg-slate-200/70 text-slate-600 hover:text-blue-600"
                } relative transition-all duration-200`}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-700 animate-pulse"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Contenu principal amélioré */}
        <main
          className={`flex-1 p-6 ${
            isDarkMode 
              ? "bg-gradient-to-br from-slate-900 to-slate-800" 
              : "bg-gradient-to-br from-gray-50 to-gray-100"
          } transition-all duration-300`}
        >
          {renderPage()}
        </main>
      </div>

      {/* Styles globaux améliorés */}
      <style jsx global>{`
        /* Hide scrollbar while maintaining functionality */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Animation lente pour les icônes actives */
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Navigation;