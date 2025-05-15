import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Calendar,
  Menu,
  ChevronDown,
  Moon,
  Sun,
  Filter,
  LayoutGrid,
  FileText,
  Users,
  MessageCircle,
  Settings as SettingsIcon,
  ChevronRight,
  LogOut,
  ChevronLeft,
  User,
  CreditCard,
  X,
  Building,
  ChevronsRight,
  Home,
  LineChart,
  BarChart3,
  Clock,
  Star,
  Shield,
} from "lucide-react";
import { UserCircle } from "lucide-react"; // Import icon
// Import logo
import logoImage from "../../assets/LogoPlanifygoPNG.png"; // Adjust the path as needed
// Import page components
import DashboardContent from "../pages/DashboardContent";
import Analytics from "../pages/Analytics";
import Invoice from "../pages/Invoice";
import CalendarPage from "../pages/Calendar";
import Catégorie from "../pages/Category";

const Navigation = () => {
  // States for various features
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Initialiser activePage depuis localStorage ou avec valeur par défaut
  const [activePage, setActivePage] = useState(() => {
    const savedPage = localStorage.getItem("activePage");
    return savedPage || "dashboard";
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [adminData, setadminData] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    // Check if user is logged in by looking for the access token
    const accessToken = localStorage.getItem("accessToken");
    const stringAdminData = localStorage.getItem("admin");

    if (!accessToken) {
      // Redirect to login if no token found
      window.location.href = "/connexion";
      return;
    }

    if (stringAdminData) {
      try {
        const parsedAdminData = JSON.parse(stringAdminData);
        setadminData(parsedAdminData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        handleLogout(); // Logout if data is corrupted
      }
    }
  }, []);

  // Handle logout function
  const handleLogout = () => {
    // Remove tokens and user data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("activePage"); // Also clear active page

    // Redirect to login page
    window.location.href = "/connexion";
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
    const logo = document.getElementById("logo");
    if (logo.classList.contains("scale-150")) {
      logo.classList.replace("scale-150", "scale-175");
    } else if (logo.classList.contains("scale-175")) {
      logo.classList.replace("scale-175", "scale-200");
    } else if (logo.classList.contains("scale-200")) {
      logo.classList.replace("scale-200", "scale-150");
    }
  };

  // Navigation - Mise à jour pour stocker la page dans localStorage
  const navigateTo = (pageId) => {
    setActivePage(pageId);
    localStorage.setItem("activePage", pageId); // Sauvegarder dans localStorage

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
        return adminData.email.split("@")[0];
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
    { id: "invoice", icon: CreditCard, label: "Factures" },
    { id: "calendar", icon: Calendar, label: "Calendrier" },
    {
      id: "Catégorie",
      icon: MessageCircle,
      label: "Catégorie",
    },
  ];

  const secondaryMenuItems = [];

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

      default:
        return <DashboardContent sidebarExpanded={isSidebarExpanded} />;
    }
  };

  return (
    <div
      className={`flex h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-br from-gray-50 to-gray-100"
      } transition-all duration-500`}
    >
      {/* Mobile overlay avec flou amélioré */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col 
  ${isSidebarExpanded ? "w-72" : "w-24"} 
  ${
    isDarkMode
      ? "bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-200"
      : "bg-gradient-to-b from-white via-gray-50 to-white text-gray-800"
  } transition-all duration-500 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } overflow-hidden`}
      >
        {/* Nouveau bouton d'expansion avec animation */}
        <div className="absolute -right-3 top-32 hidden md:block">
          <button
            onClick={() => setSidebarExpanded(!isSidebarExpanded)}
            className={`flex items-center justify-center h-6 w-6 rounded-full 
      ${
        isDarkMode
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
          : "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
      } hover:scale-110 transition-all duration-300 z-50`}
          >
            {isSidebarExpanded ? (
              <ChevronLeft size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        </div>

        {/* Nouvelle section logo avec effet de profondeur */}
        <div
          className={`relative ${
            isSidebarExpanded ? "pt-8 pb-6" : "pt-8 pb-6"
          } px-4`}
        >
          <div
            className={`relative flex justify-center ${
              isSidebarExpanded ? "" : ""
            } transition-all duration-300`}
          >
            <img
              src={logoImage}
              alt="PlanifyGo Logo"
              className={`${
                isSidebarExpanded
                  ? "w-40 max-h-16 object-contain"
                  : "w-16 max-h-12 object-contain"
              } transition-all duration-300 cursor-pointer filter drop-shadow-xl hover:drop-shadow-2xl scale-125`}
              id="logo"
              onClick={handleLogoClick}
            />
          </div>

          {/* Bouton mobile fermeture amélioré */}
          <button
            className={`md:hidden absolute top-4 right-4 p-1.5 rounded-full 
      ${
        isDarkMode
          ? "bg-gray-800/80 text-gray-300 hover:bg-gray-700"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      } transition-all duration-300`}
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={16} />
          </button>

          {/* Indicateur de version redessiné */}
          {isSidebarExpanded && (
            <div
              className={`absolute bottom-0 right-4 px-2 py-1 rounded-t-md text-xs font-medium
        ${
          isDarkMode
            ? "bg-gray-800/60 text-gray-400"
            : "bg-gray-100/70 text-gray-500"
        }`}
            ></div>
          )}
        </div>

        {/* Nouveau séparateur subtilement animé */}
        <div className="px-3 mb-8 mt-2">
          <div
            className={`h-px w-full ${
              isDarkMode
                ? "bg-gradient-to-r from-transparent via-gray-700 to-transparent"
                : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
            }`}
          ></div>
        </div>

        {/* Conteneur de navigation principale refait */}
        <div
          className={`flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide px-3 ${
            isSidebarExpanded ? "py-2" : "py-2"
          }`}
        >
          {/* Libellé de section */}
          {isSidebarExpanded && (
            <div className="mb-2 px-4">
              <p
                className={`text-xs uppercase font-semibold tracking-wider ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Menu principal
              </p>
            </div>
          )}

          {/* Menu principal complètement redessiné */}
          <div className="space-y-1.5 mb-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const isHovered = hoveredMenu === item.id;

              return (
                <button
                  key={item.id}
                  className={`group relative w-full flex ${
                    isSidebarExpanded
                      ? "flex-row items-center"
                      : "flex-col items-center"
                  } ${
                    isActive
                      ? isDarkMode
                        ? "bg-gradient-to-r from-indigo-600/80 to-indigo-500/80 text-white shadow-md shadow-indigo-700/20"
                        : "bg-gradient-to-r from-indigo-500/90 to-indigo-400/90 text-white shadow-md shadow-indigo-300/30"
                      : isDarkMode
                      ? "hover:bg-gray-800/60 text-gray-300"
                      : "hover:bg-gray-100/80 text-gray-600"
                  } ${
                    isSidebarExpanded ? "px-4 py-2.5" : "px-2 py-3"
                  } rounded-xl transition-all duration-300`}
                  onClick={() => navigateTo(item.id)}
                  onMouseEnter={() => setHoveredMenu(item.id)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  {/* Indicateur de bordure active */}
                  {isActive && (
                    <span
                      className={`absolute ${
                        isSidebarExpanded
                          ? "left-0 top-1/2 -translate-y-1/2 h-4/5 w-1"
                          : "top-0 left-1/2 -translate-x-1/2 h-1 w-4/5"
                      } rounded-full bg-white/80`}
                    ></span>
                  )}

                  <div
                    className={`flex items-center justify-center ${
                      isSidebarExpanded ? "min-w-[28px]" : "h-8"
                    } transition-all duration-300 ${isActive ? "" : ""}`}
                  >
                    <Icon
                      size={isSidebarExpanded ? 20 : 22}
                      className={`transition-transform ${
                        isHovered || isActive ? "scale-110" : "scale-100"
                      } ${isActive ? "" : ""}`}
                    />
                  </div>

                  {isSidebarExpanded && (
                    <span
                      className={`ml-3 text-sm ${
                        isActive ? "font-medium" : "font-normal"
                      } transition-all duration-300 whitespace-nowrap`}
                    >
                      {item.label}
                    </span>
                  )}

                  {isSidebarExpanded && (
                    <div className="ml-auto flex items-center space-x-1">
                      {item.notification && (
                        <div
                          className={`px-1.5 min-w-[22px] h-[22px] flex items-center justify-center rounded-md text-xs font-medium ${
                            isActive
                              ? "bg-white/20 text-white"
                              : isDarkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-200 text-gray-700"
                          } transition-all duration-300`}
                        >
                          {item.notification}
                        </div>
                      )}

                      {item.enterprise && (
                        <span
                          className={`text-[10px] py-0.5 px-1.5 rounded-md uppercase font-medium ${
                            isActive
                              ? "bg-white/20 text-white"
                              : isDarkMode
                              ? "bg-gray-800 text-gray-400"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          PRO
                        </span>
                      )}
                    </div>
                  )}

                  {/* Version compacte */}
                  {!isSidebarExpanded && (
                    <>
                      <span
                        className={`text-xs mt-1 font-medium ${
                          isActive
                            ? "text-white"
                            : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        } transition-all duration-300`}
                      >
                        {item.label.slice(0, 3)}
                      </span>

                      {item.notification && (
                        <div
                          className={`absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-medium ${
                            isDarkMode
                              ? "bg-indigo-500 text-white"
                              : "bg-indigo-500 text-white"
                          }`}
                        >
                          {item.notification}
                        </div>
                      )}
                    </>
                  )}

                  {/* Tooltip pour le mode réduit */}
                  {!isSidebarExpanded && (
                    <div
                      className="absolute left-20 z-50 origin-left scale-0 px-3 py-2 rounded-lg 
                bg-gray-800 text-gray-200 text-sm shadow-xl 
                transition-all duration-200 group-hover:scale-100 whitespace-nowrap"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{item.label}</span>
                        {item.notification && (
                          <span className="px-1.5 min-w-[22px] h-[22px] flex items-center justify-center rounded-md text-xs font-medium bg-gray-700 text-gray-300">
                            {item.notification}
                          </span>
                        )}
                        {item.enterprise && (
                          <span className="text-[10px] py-0.5 px-1.5 rounded-md uppercase font-medium bg-gray-700 text-gray-400">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Menu des paramètres */}
          <div className="space-y-1.5">
            {secondaryMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const isHovered = hoveredMenu === item.id;

              return (
                <button
                  key={item.id}
                  className={`group relative w-full flex ${
                    isSidebarExpanded
                      ? "flex-row items-center"
                      : "flex-col items-center"
                  } ${
                    isActive
                      ? isDarkMode
                        ? "bg-gradient-to-r from-indigo-600/80 to-indigo-500/80 text-white shadow-md shadow-indigo-700/20"
                        : "bg-gradient-to-r from-indigo-500/90 to-indigo-400/90 text-white shadow-md shadow-indigo-300/30"
                      : isDarkMode
                      ? "hover:bg-gray-800/60 text-gray-300"
                      : "hover:bg-gray-100/80 text-gray-600"
                  } ${
                    isSidebarExpanded ? "px-4 py-2.5" : "px-2 py-3"
                  } rounded-xl transition-all duration-300`}
                  onClick={() => navigateTo(item.id)}
                  onMouseEnter={() => setHoveredMenu(item.id)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  {/* Indicateur de bordure active */}
                  {isActive && (
                    <span
                      className={`absolute ${
                        isSidebarExpanded
                          ? "left-0 top-1/2 -translate-y-1/2 h-4/5 w-1"
                          : "top-0 left-1/2 -translate-x-1/2 h-1 w-4/5"
                      } rounded-full bg-white/80`}
                    ></span>
                  )}

                  <div
                    className={`flex items-center justify-center ${
                      isSidebarExpanded ? "min-w-[28px]" : "h-8"
                    } transition-all duration-300`}
                  >
                    <Icon
                      size={isSidebarExpanded ? 20 : 22}
                      className={`transition-transform ${
                        isHovered || isActive ? "scale-110" : "scale-100"
                      }`}
                    />
                  </div>

                  {isSidebarExpanded && (
                    <span
                      className={`ml-3 text-sm ${
                        isActive ? "font-medium" : "font-normal"
                      } transition-all duration-300 whitespace-nowrap`}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Version compacte */}
                  {!isSidebarExpanded && (
                    <span
                      className={`text-xs mt-1 font-medium ${
                        isActive
                          ? "text-white"
                          : isDarkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      } transition-all duration-300`}
                    >
                      {item.label.slice(0, 3)}
                    </span>
                  )}

                  {/* Tooltip pour le mode réduit */}
                  {!isSidebarExpanded && (
                    <div
                      className="absolute left-20 z-50 origin-left scale-0 px-3 py-2 rounded-lg 
                bg-gray-800 text-gray-200 text-sm shadow-xl 
                transition-all duration-200 group-hover:scale-100 whitespace-nowrap"
                    >
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bouton de déconnexion entièrement redessiné */}
        <div className="p-5">
          <button
            onClick={handleLogout}
            className={`group w-full flex ${
              isSidebarExpanded
                ? "items-center justify-start"
                : "flex-col items-center"
            } ${
              isDarkMode
                ? "bg-gradient-to-r from-red-900/30 to-red-700/30 text-red-300 hover:from-red-800/40 hover:to-red-600/40"
                : "bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200"
            } ${
              isSidebarExpanded ? "px-4 py-2.5" : "px-2 py-3"
            } rounded-xl transition-all duration-300`}
            onMouseEnter={() => setHoveredMenu("logout")}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div
              className={`${
                isSidebarExpanded ? "" : "mb-1"
              } flex items-center justify-center ${
                isSidebarExpanded ? "min-w-[28px]" : "h-8"
              } transition-all duration-300`}
            >
              <LogOut
                size={isSidebarExpanded ? 20 : 20}
                className={`transition-transform group-hover:scale-110`}
              />
            </div>

            {isSidebarExpanded ? (
              <span className="ml-3 text-sm font-medium">Déconnexion</span>
            ) : (
              <span className="text-xs font-medium">Exit</span>
            )}

            {/* Tooltip pour le mode réduit */}
            {!isSidebarExpanded && (
              <div
                className="absolute left-20 z-50 origin-left scale-0 px-3 py-2 rounded-lg 
          bg-gray-800 text-gray-200 text-sm shadow-xl 
          transition-all duration-200 group-hover:scale-100 whitespace-nowrap"
              >
                Déconnexion
                <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
              </div>
            )}
          </button>
        </div>

        {/* Styles d'animation pour l'effet de "shine" */}
        <style jsx global>{`
          @keyframes shine {
            0% {
              transform: translateX(-100%);
            }
            50%,
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </aside>
      {/* Main content area - Redesigned */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarExpanded ? "md:ml-72" : "md:ml-24"
        } transition-all duration-300`}
      >
        <header
          className={`sticky top-0 z-20 ${
            isDarkMode
              ? "bg-slate-900/90 border-slate-800/40"
              : "bg-white/90 border-slate-200/60"
          } border-b backdrop-blur-sm`}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex h-14 items-center justify-between px-4 md:px-6">
              {/* Partie gauche */}
              <div className="flex items-center space-x-4">
                {/* Bouton menu mobile */}
                <button
                  className={`md:hidden p-1.5 rounded-md ${
                    isDarkMode
                      ? "bg-slate-800/80 text-slate-400 hover:text-slate-300"
                      : "bg-slate-100/80 text-slate-500 hover:text-slate-700"
                  } transition-all duration-200`}
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                  <Menu size={18} />
                </button>

                {/* Titre de la page simplifié */}
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h1
                      className={`text-base font-semibold ${
                        isDarkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {getTitle()}
                    </h1>

                    {/* Badges intégrés */}
                    {activePage === "analytics" && (
                      <div
                        className={`flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium ${
                          isDarkMode
                            ? "bg-indigo-900/30 text-indigo-300"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        <Star size={10} className="mr-0.5" />
                        PRO
                      </div>
                    )}

                    {adminData && !adminData.tenant && (
                      <div
                        className={`flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium ${
                          isDarkMode
                            ? "bg-emerald-900/20 text-emerald-400"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <Shield size={10} className="mr-0.5" />
                        ADMIN
                      </div>
                    )}
                  </div>

                  {/* Fil d'Ariane discret */}
                  <div className="flex items-center text-[10px] mt-0.5">
                    <span
                      className={
                        isDarkMode ? "text-slate-500" : "text-slate-400"
                      }
                    >
                      PlanifyGo
                    </span>
                    <ChevronsRight
                      size={10}
                      className={
                        isDarkMode
                          ? "mx-1 text-slate-600"
                          : "mx-1 text-slate-400"
                      }
                    />
                    <span
                      className={
                        isDarkMode ? "text-indigo-400" : "text-indigo-600"
                      }
                    >
                      {getTitle()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Partie droite */}
              <div className="flex items-center space-x-1.5 md:space-x-3">
                {/* Barre de recherche */}
                <div className="relative hidden md:block">
                  <div
                    className={`flex items-center ${
                      isDarkMode
                        ? "bg-slate-800/70 border-slate-700/50"
                        : "bg-slate-50 border-slate-200/70"
                    } border rounded-md px-2.5 py-1.5 transition-all duration-200 focus-within:ring-1 ${
                      isDarkMode
                        ? "focus-within:ring-indigo-500/40"
                        : "focus-within:ring-indigo-500/20"
                    }`}
                  >
                    <Search
                      size={14}
                      className={`${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    />

                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className={`ml-1.5 bg-transparent border-none outline-none text-xs w-40 placeholder-slate-400 ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      } focus:ring-0 focus:outline-none`}
                    />
                  </div>
                </div>

                {/* Date compacte */}
                <div className="hidden sm:block">
                  <div
                    className={`flex items-center px-2 py-1.5 rounded-md ${
                      isDarkMode
                        ? "bg-slate-800/70 text-slate-300"
                        : "bg-slate-50 text-slate-600"
                    } text-xs`}
                  >
                    <Calendar
                      size={13}
                      className={`mr-1.5 ${
                        isDarkMode ? "text-indigo-400" : "text-indigo-500"
                      }`}
                    />
                    <span className="font-medium">Mai 14</span>
                  </div>
                </div>

                {/* Actions épurées */}
                <div className="flex items-center space-x-0 md:space-x-1">
                  {/* Bouton thème */}
                  <button
                    onClick={toggleDarkMode}
                    className={`p-1.5 rounded-md ${
                      isDarkMode
                        ? "bg-slate-800/70 text-amber-400 hover:bg-slate-800"
                        : "bg-slate-50 text-indigo-500 hover:bg-slate-100"
                    } transition-all duration-200`}
                    aria-label={isDarkMode ? "Mode jour" : "Mode nuit"}
                  >
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>

                  {/* Notifications */}
                  <div className="relative">
                    <button
                      className={`p-1.5 rounded-md ${
                        isDarkMode
                          ? "bg-slate-800/70 text-slate-300 hover:bg-slate-800"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      } transition-all duration-200`}
                    >
                      <Bell size={16} />
                    </button>

                    {/* Indicateur notification */}
                    <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </div>

                  {/* Bouton de déconnexion rapide */}
                  <button
                    onClick={handleLogout}
                    className={`p-1.5 rounded-md ${
                      isDarkMode
                        ? "bg-slate-800/70 text-red-400 hover:bg-slate-800"
                        : "bg-slate-50 text-red-500 hover:bg-slate-100"
                    } transition-all duration-200`}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
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
      <style jsx global>
        {`
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
           /* Masquer la scrollbar tout en préservant la fonctionnalité */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Effet de brillance pour les boutons et les cartes */
  @keyframes shine {
    0% { transform: translateX(-100%); }
    50%, 100% { transform: translateX(100%); }
  }
  
  /* Nouveaux effets pour le theme toggle */
  @keyframes rotate-sun {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes glow {
    0%, 100% { filter: drop-shadow(0 0 0.5rem rgba(253, 224, 71, 0.3)); }
    50% { filter: drop-shadow(0 0 1rem rgba(253, 224, 71, 0.6)); }
  }
`}
      </style>
    </div>
  );
};

export default Navigation;
