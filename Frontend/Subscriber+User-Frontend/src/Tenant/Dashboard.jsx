import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Bell,
  Calendar,
  Menu,
  Moon,
  Sun,
  ChevronRight,
  LogOut,
  ChevronLeft,
  Clock,
  HelpCircle,
  X,
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  PanelRight,
  Clock8,
  Image,
  Home,
  CreditCard,
} from "lucide-react";
import { UserCircle } from "lucide-react";

// Page components
import DashboardContent from "./components/DashboardContent";
import Aide from "./components/Help";
import Invoice from "./components/Invoice";
import Employees from "./components/Employees";
import CalendarPage from "./components/Calendar";
import Notifications from "./components/Notifications";
import SettingsPage from "./components/Settings";
import Media from "./components/Media";
import WorkingHours from "./components/WorkingHours";
import Services from "./components/Services";

// Constants and utilities
import {
  parseJwt,
  getCookie,
  setCookie,
  deleteCookie,
  getRootHost,
} from "./components/ConfigurationDashboard/authUtils";

import axios from "axios";

// Redefined menu items with improved icons
const MAIN_MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: <LayoutDashboard size={20} />,
  },
  { id: "calendar", label: "Calendrier", icon: <Calendar size={20} /> },
  { id: "workinghours", label: "Horaires", icon: <Clock8 size={20} /> },
  { id: "services", label: "Services", icon: <PanelRight size={20} /> },
  { id: "employees", label: "Employée", icon: <Users size={20} /> },
  { id: "media", label: "Media", icon: <Image size={20} /> },
  { id: "aide", label: "Aide", icon: <HelpCircle size={20} /> },
];

const SECONDARY_MENU_ITEMS = [
  { id: "invoice", label: "Facturation", icon: <CreditCard size={20} /> },
  { id: "settings", label: "Paramètres", icon: <Settings size={20} /> },
];

const PAGE_TITLES = {
  dashboard: "Tableau de bord",
  aide: "Aide",
  invoice: "Facturation",
  calendar: "Calendrier",
  employees: "Employée",
  notifications: "Notifications",
  settings: "Paramètres",
  media: "Media",
  workinghours: "Horaires",
  services: "Services",
};

const Dashboard = () => {
  // States with initial values from localStorage or defaults
  const [isDarkMode, setIsDarkMode] = useState(
    () => getCookie("darkMode") === "true"
  );

  // Améliorations pour la sidebar
  const [isSidebarExpanded, setSidebarExpanded] = useState(() => {
    // Récupérer la préférence utilisateur du localStorage si elle existe
    const savedPreference = localStorage.getItem("sidebarExpanded");
    if (savedPreference !== null) {
      return JSON.parse(savedPreference);
    }
    // Sinon, définir en fonction de la taille de l'écran
    return window.innerWidth >= 1024;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState(
    () => localStorage.getItem("activePage") || "dashboard"
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userData, setUserData] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [notificationCount, setNotificationCount] = useState(3);
  const [isResizing, setIsResizing] = useState(false); // Pour éviter les animations pendant le redimensionnement
  const [tenantData, setTenantData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const port = window.location.port ? `:${window.location.port}` : "";
  const rootUrl = `${window.location.protocol}//${getRootHost()}${port}/`;

  const handleLogout = useCallback(() => {
    localStorage.removeItem("activePage");
    ["accessToken", "username", "subdomain", "userEmail"].forEach(deleteCookie);
    const rootHost = getRootHost();
    const port = window.location.port ? `:${window.location.port}` : "";
    window.location.href = `${window.location.protocol}//${rootHost}${port}/connexion`;
  }, []);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      handleLogout();
      return;
    }
    try {
      const payload = parseJwt(accessToken);
      if (!payload) {
        throw new Error("Invalid token payload");
      }
      // Extract user data first
      const { subdomain, id, email, sub } = payload;
      const username = sub || "";

      // Configure axios defaults
      axios.defaults.baseURL = "http://localhost:8888";
      axios.defaults.withCredentials = true;
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      axios.defaults.headers.common["X-Tenant-ID"] = subdomain;

      // Set userData state
      setUserData({
        id,
        email,
        username,
        subdomain,
        businessName: subdomain,
      });

      // Store in cookies for other components
      setCookie("username", username);
      setCookie("subdomain", subdomain);
      setCookie("tenantId", id);

      // Now schedule auto‑expire
      const expiryMs = payload.exp * 1000 - Date.now();
      const minutes = Math.floor(expiryMs / 60000);
      const seconds = Math.round((expiryMs % 60000) / 1000);
      console.log(`JWT expires in ${minutes}m ${seconds}s`);
      if (expiryMs > 0) {
        const timer = setTimeout(() => setSessionExpired(true), expiryMs);
        return () => clearTimeout(timer);
      } else {
        setSessionExpired(true);
      }
    } catch (error) {
      console.error("Error parsing JWT token:", error);
      handleLogout();
    }
  }, [handleLogout]);

  // Authentication & token expiry effect
  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      handleLogout();
      return;
    }
    try {
      const payload = parseJwt(accessToken);
      if (!payload) throw new Error("Invalid token payload");
      // schedule auto‑expire
      const expiryMs = payload.exp * 1000 - Date.now();
      if (expiryMs <= 0) {
        setSessionExpired(true);
      } else {
        const t = setTimeout(() => setSessionExpired(true), expiryMs);
        return () => clearTimeout(t);
      }
      // set axios defaults, userData, cookies…
      /* existing user setup */
    } catch (error) {
      console.error("Error parsing JWT token:", error);
      handleLogout();
    }
  }, []);

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Effect for updating time
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Save active page to localStorage
  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  // Sauvegarder l'état de la sidebar dans localStorage
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", JSON.stringify(isSidebarExpanded));
  }, [isSidebarExpanded]);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Update color theme in meta tag for mobile status bar
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        isDarkMode ? "#0f172a" : "#ffffff"
      );
    }
  }, [isDarkMode]);

  // Handle window resize - amélioration avec debounce et meilleure réactivité
  useEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      const width = window.innerWidth;
      setIsResizing(true);
      setWindowWidth(width);

      // Fermer automatiquement le menu mobile quand l'écran s'agrandit
      if (width >= 1024 && isMobileOpen) {
        setIsMobileOpen(false);
      }

      // Ajustements du sidebar en fonction de la taille de l'écran
      if (width < 768) {
        setSidebarExpanded(false);
      } else if (width >= 1280) {
        setSidebarExpanded(true);
      }

      // Réactiver les transitions après le redimensionnement
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsResizing(false);
      }, 300);
    };

    window.addEventListener("resize", handleResize);

    // Exécuter une fois au chargement pour s'assurer que tout est bien configuré
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isMobileOpen]);

  const fetchTenantData = useCallback(async () => {
    try {
      const tenantId = getCookie("tenantId");
      if (!tenantId) return;

      const API_URL = "http://localhost:8888/auth";
      const response = await axios.get(`${API_URL}/tenant/get/${tenantId}`);

      setTenantData(response.data);
      if (response.data?.profileImageUrl) {
        setProfileImage(response.data.profileImageUrl);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données du tenant:", error);
    }
  }, []);

  useEffect(() => {
    if (userData?.id) {
      fetchTenantData();
    }
  }, [userData, fetchTenantData]);

  // Event handlers using useCallback
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    const cookieOpts = [
      "Domain=.127.0.0.1.nip.io",
      "Path=/",
      "SameSite=Lax",
    ].join("; ");

    document.cookie = `darkMode=${newDarkMode.toString()}; ${cookieOpts}`;
  }, [isDarkMode]);

  const navigateTo = useCallback(
    (pageId) => {
      setActivePage(pageId);
      if (windowWidth < 1024) {
        setIsMobileOpen(false);
      }
    },
    [windowWidth]
  );

  // Memoized getters
  const getTitle = useMemo(
    () => PAGE_TITLES[activePage] || "Tableau de bord",
    [activePage]
  );

  const getUserName = useMemo(() => {
    if (userData?.username) {
      return `${userData.username} ${userData.lastName || ""}`;
    }
    const username = decodeURIComponent(getCookie("username") || "");
    return username || "Utilisateur";
  }, [userData]);

  const getBusinessName = useMemo(() => {
    if (userData?.subdomain) {
      return (
        userData.subdomain.charAt(0).toUpperCase() + userData.subdomain.slice(1)
      );
    }
    const subdomain = getCookie("subdomain");
    if (subdomain) {
      return subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
    }
    return "Entreprise";
  }, [userData]);

  // Memoized page renderer
  const renderPage = useMemo(() => {
    const components = {
      dashboard: (
        <DashboardContent
          sidebarExpanded={isSidebarExpanded}
          userData={userData}
        />
      ),
      aide: <Aide userData={userData} />,
      invoice: <Invoice userData={userData} />,
      employees: <Employees userData={userData} />,
      calendar: <CalendarPage userData={userData} />,
      notifications: <Notifications userData={userData} />,
      settings: <SettingsPage userData={userData} />,
      media: <Media userData={userData} />,
      workinghours: <WorkingHours userData={userData} />,
      services: <Services userData={userData} />,
    };

    return components[activePage] || components.dashboard;
  }, [activePage, isSidebarExpanded, userData]);

  // MenuItem component with enhanced design
  const MenuItem = ({ item, isActive, onClick }) => {
    const isMainItem = MAIN_MENU_ITEMS.some(
      (menuItem) => menuItem.id === item.id
    );

    return (
      <li>
        <button
          onClick={onClick}
          className={`w-full flex items-center px-3.5 py-3 rounded-xl gap-3.5 transition-all duration-300 ${
            isActive
              ? isDarkMode
                ? "bg-gradient-to-r from-blue-600/90 to-indigo-600 text-white font-medium shadow-lg shadow-blue-900/30"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/30"
              : isDarkMode
              ? "text-slate-300 hover:bg-slate-700/70 hover:text-white"
              : "text-slate-600 hover:bg-blue-50/80 hover:text-blue-700"
          }`}
        >
          <span
            className={`${
              isActive
                ? "text-white"
                : isDarkMode
                ? "text-blue-400"
                : "text-blue-600"
            } transition-all duration-300 ${
              isActive ? "transform scale-110" : "group-hover:scale-110"
            }`}
          >
            {item.icon}
          </span>
          {isSidebarExpanded && (
            <span
              className={`flex-1 text-left font-medium transition-all duration-300 ${
                isActive ? "transform translate-x-0.5" : ""
              }`}
            >
              {item.label}
            </span>
          )}
          {isSidebarExpanded && item.badge && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-white/20 text-white"
                  : isDarkMode
                  ? "bg-slate-700 text-slate-300"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {item.badge}
            </span>
          )}
        </button>
      </li>
    );
  };

  // Gestion améliorée du toggle de la sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarExpanded((prev) => !prev);
  }, []);

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div
        className={`flex h-screen bg-gradient-to-br ${
          isDarkMode
            ? "from-slate-900 via-slate-800/95 to-indigo-950"
            : "from-blue-50/70 via-white to-indigo-50/60"
        } transition-colors duration-500`}
      >
        {/* Mobile overlay avec amélioration de l'animation */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 animate-fadeIn"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar avec réactivité améliorée */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex flex-col ${
            isSidebarExpanded ? "w-72" : "w-16"
          } ${
            isDarkMode
              ? "bg-slate-800/95 border-r border-slate-700/50"
              : "bg-white/95 border-r border-slate-200/50"
          } ${isResizing ? "" : "transition-all duration-300 ease-in-out"} ${
            isMobileOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full lg:translate-x-0 shadow-xl"
          } backdrop-blur-md`}
        >
          {/* Amélioration du toggle - meilleur positionnement et visibilité */}
          <div className="absolute -right-3 top-12 hidden lg:block">
            <button
              onClick={toggleSidebar}
              className={`flex items-center justify-center h-6 w-6 rounded-full 
              ${
                isDarkMode
                  ? "bg-slate-700 text-blue-400 hover:text-blue-300 hover:bg-slate-600"
                  : "bg-white text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              } shadow-lg ring-1 ${
                isDarkMode ? "ring-slate-600" : "ring-slate-200"
              } cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95`}
              aria-label={
                isSidebarExpanded ? "Réduire le menu" : "Étendre le menu"
              }
            >
              {isSidebarExpanded ? (
                <ChevronLeft size={14} strokeWidth={2.5} />
              ) : (
                <ChevronRight size={14} strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* Header with business name instead of logo */}
          <div
            className={`p-4 flex items-center justify-center ${
              isDarkMode ? "border-slate-700/50" : "border-slate-200/70"
            } border-b`}
          >
            <div
              className={`font-bold text-base ${
                isDarkMode
                  ? "bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text"
                  : "bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text"
              }`}
            >
              {isSidebarExpanded ? getBusinessName : getBusinessName.charAt(0)}
            </div>
            <button
              className={`lg:hidden absolute top-4 right-4 p-1.5 rounded-lg ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-slate-700"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              } transition-all duration-200`}
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Reste de la sidebar - améliorations pour l'affichage en mode compact */}
          {/* User profile section avec affichage adaptatif */}
          <div
            className={`p-4 ${
              isDarkMode ? "border-slate-700/50" : "border-slate-200/70"
            } border-b`}
          >
            <div
              className={`flex items-center ${
                !isSidebarExpanded ? "justify-center" : ""
              } p-2.5 rounded-xl ${
                isDarkMode
                  ? "bg-slate-700/50 hover:bg-slate-700/80"
                  : "bg-slate-100/70 hover:bg-slate-100"
              } transition-all duration-200 cursor-pointer`}
            >
              <div className="relative">
                {profileImage ? (
                  <div
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 ${
                      isDarkMode ? "border-slate-600" : "border-white"
                    }`}
                  >
                    <img
                      src={profileImage}
                      alt={getBusinessName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gradient-to-br from-blue-500/30 to-indigo-600/30 text-blue-400"
                        : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"
                    } transition-colors duration-300`}
                  >
                    <UserCircle size={24} />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-800 animate-pulse"></span>
              </div>

              {isSidebarExpanded && (
                <div className="flex-1 min-w-0 ml-3">
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    } truncate`}
                  >
                    {getUserName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      En ligne
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Menu sections avec meilleure adaptation au mode compact */}
          <div className="flex-1 overflow-hidden hover:overflow-y-auto py-5 px-3.5">
            {/* Home button - amélioration pour le mode compact */}

            {/* <div className="mb-5">
              <a
                href={rootUrl}
                className={`flex items-center ${
                  !isSidebarExpanded ? "justify-center" : ""
                } px-3.5 py-3 rounded-xl gap-3 transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-indigo-900/30 to-blue-900/30 text-blue-300 hover:from-indigo-900/40 hover:to-blue-900/40"
                    : "bg-gradient-to-r from-indigo-50 to-blue-50 text-blue-600 hover:from-indigo-100 hover:to-blue-100"
                } hover:shadow-md`}
              >
                <div
                  className={`flex items-center justify-center ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  <Home size={20} />
                </div>
                {isSidebarExpanded && (
                  <span className="font-medium">Page d'accueil</span>
                )}
              </a>
            </div> */}

            {/* Les titres de section s'affichent uniquement en mode étendu */}
            {isSidebarExpanded && (
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-4 px-4 
                bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text"
              >
                Menu principal
              </h3>
            )}

            {/* MenuItem component amélioré pour mieux s'adapter au mode compact */}
            <ul className="space-y-2.5 mb-6">
              {MAIN_MENU_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigateTo(item.id)}
                    className={`w-full flex items-center ${
                      !isSidebarExpanded ? "justify-center" : ""
                    } px-3.5 py-3 rounded-xl ${
                      isSidebarExpanded ? "gap-3.5" : ""
                    } transition-all duration-300 ${
                      activePage === item.id
                        ? isDarkMode
                          ? "bg-gradient-to-r from-blue-600/90 to-indigo-600 text-white font-medium shadow-lg shadow-blue-900/30"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/30"
                        : isDarkMode
                        ? "text-slate-300 hover:bg-slate-700/70 hover:text-white"
                        : "text-slate-600 hover:bg-blue-50/80 hover:text-blue-700"
                    } hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <span
                      className={`${
                        activePage === item.id
                          ? "text-white"
                          : isDarkMode
                          ? "text-blue-400"
                          : "text-blue-600"
                      } transition-all duration-300 ${
                        activePage === item.id ? "transform scale-110" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    {isSidebarExpanded && (
                      <span
                        className={`flex-1 text-left font-medium transition-all duration-300 ${
                          activePage === item.id
                            ? "transform translate-x-0.5"
                            : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                    {/* Si non étendu, ajouter des tooltips */}
                    {!isSidebarExpanded && (
                      <span className="sr-only">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {isSidebarExpanded && (
              <h3
                className="text-xs font-semibold uppercase tracking-wider mt-8 mb-4 px-4
                bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text"
              >
                Paramètres
              </h3>
            )}
            {/* Ligne de séparation visuelle quand la sidebar est réduite */}
            {!isSidebarExpanded && (
              <div
                className={`h-0.5 w-5 mx-auto my-6 rounded-full ${
                  isDarkMode ? "bg-slate-700" : "bg-slate-200"
                }`}
              ></div>
            )}

            <ul className="space-y-2.5">
              {SECONDARY_MENU_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigateTo(item.id)}
                    className={`w-full flex items-center ${
                      !isSidebarExpanded ? "justify-center" : ""
                    } px-3.5 py-3 rounded-xl ${
                      isSidebarExpanded ? "gap-3.5" : ""
                    } transition-all duration-300 ${
                      activePage === item.id
                        ? isDarkMode
                          ? "bg-gradient-to-r from-blue-600/90 to-indigo-600 text-white font-medium shadow-lg shadow-blue-900/30"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/30"
                        : isDarkMode
                        ? "text-slate-300 hover:bg-slate-700/70 hover:text-white"
                        : "text-slate-600 hover:bg-blue-50/80 hover:text-blue-700"
                    } hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <span
                      className={`${
                        activePage === item.id
                          ? "text-white"
                          : isDarkMode
                          ? "text-blue-400"
                          : "text-blue-600"
                      } transition-all duration-300 ${
                        activePage === item.id ? "transform scale-110" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    {isSidebarExpanded && (
                      <span
                        className={`flex-1 text-left font-medium transition-all duration-300 ${
                          activePage === item.id
                            ? "transform translate-x-0.5"
                            : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                    {/* Si non étendu, ajouter des tooltips */}
                    {!isSidebarExpanded && (
                      <span className="sr-only">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Improved logout button */}
          <div
            className={`p-4 ${
              isDarkMode ? "border-slate-700/50" : "border-slate-200/70"
            } border-t mt-auto`}
          >
            <button
              onClick={handleLogout}
              className={`flex items-center w-full ${
                !isSidebarExpanded ? "justify-center" : ""
              } px-3.5 py-2.5 rounded-xl gap-3 transition-all duration-300 
                ${
                  isDarkMode
                    ? "bg-gradient-to-r from-red-900/30 to-red-800/20 text-red-300 hover:from-red-900/40 hover:to-red-800/30"
                    : "bg-gradient-to-r from-red-50 to-red-100/50 text-red-600 hover:from-red-100 hover:to-red-50"
                } hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`}
            >
              <LogOut size={20} className="transition-transform duration-300" />
              {isSidebarExpanded && (
                <span className="font-medium">Déconnexion</span>
              )}
              {!isSidebarExpanded && (
                <span className="sr-only">Déconnexion</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main content area - adjust spacing based on sidebar state */}
        <div
          className={`flex-1 flex flex-col ${
            isSidebarExpanded ? "lg:ml-72" : "lg:ml-16"
          } transition-all ${isResizing ? "" : "duration-300"}`}
        >
          {/* Navbar with enhanced styling */}
          <header
            className={`${
              isDarkMode
                ? "bg-gradient-to-r from-slate-800/95 to-slate-800/90 border-slate-700/40"
                : "bg-gradient-to-r from-white/95 to-white/90 border-slate-200/40"
            } 
            h-16 px-4 md:px-6 flex items-center justify-between border-b sticky top-0 z-20 
            shadow-sm backdrop-blur-md transition-all duration-300`}
          >
            <div className="flex items-center gap-4">
              <button
                className={`lg:hidden p-2 rounded-lg ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-slate-700 active:bg-slate-600"
                    : "text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                } transition-colors duration-200`}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                <Menu size={20} />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <h1
                    className={`text-xl font-semibold ${
                      isDarkMode
                        ? "bg-gradient-to-r from-blue-300 to-indigo-200 text-transparent bg-clip-text"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text"
                    }`}
                  >
                    {getTitle}
                  </h1>
                  <div className="h-0.5 w-12 mt-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80"></div>
                </div>

                {activePage === "aide" && (
                  <div
                    className={`hidden sm:flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                    ${
                      isDarkMode
                        ? "bg-blue-900/20 text-blue-300 border border-blue-800/30"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                    } transition-all duration-300`}
                  >
                    <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Pro
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              {/* Bouton "Voir ma page client" en taille légèrement réduite */}
              <div className="relative hidden md:block">
                <a
                  href={`${window.location.origin}/reservation`}
                  className={`group flex items-center gap-1.5 py-1.5 px-4 rounded-full text-sm
      ${
        isDarkMode
          ? "bg-gradient-to-r from-blue-600/90 via-indigo-600 to-violet-600/90 text-white"
          : "bg-gradient-to-r from-blue-500/90 via-indigo-500 to-violet-500/90 text-white"
      }
      font-medium overflow-hidden relative z-10 transition-all duration-300
      shadow-md hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-indigo-700/20
      hover:translate-y-[-1px] active:translate-y-[1px]
      border border-white/20`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* Effet particule/brillance */}
                  <span className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>

                  {/* Animation lumineuse */}
                  <span className="absolute -inset-x-10 top-0 h-full w-20 bg-white/20 skew-x-[-30deg] transform -translate-x-full group-hover:translate-x-[28rem] transition-transform duration-1000 ease-in-out"></span>

                  {/* Icône externe avec animation - taille réduite */}
                  <svg
                    className="transition-transform duration-300 transform group-hover:scale-110 group-hover:rotate-[-10deg] text-white/80 group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14L21 3"></path>
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                  </svg>

                  {/* Texte avec effet */}
                  <span className="relative transform group-hover:translate-x-1 transition-transform duration-300">
                    Voir ma page client
                  </span>

                  {/* Petit indicateur ping - position ajustée */}
                  <span className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-white/70 animate-ping"></span>
                  <span className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-white/90"></span>
                </a>
              </div>

              {/* Enhanced time display */}
              <div
                className={`hidden sm:flex items-center gap-2 rounded-full py-2 px-4 
                ${
                  isDarkMode
                    ? "bg-slate-700/50 text-slate-200"
                    : "bg-slate-100/70 text-slate-700"
                } 
                shadow-sm transition-all duration-200`}
              >
                <Clock
                  size={16}
                  className={isDarkMode ? "text-blue-400" : "text-blue-500"}
                />
                <span className="text-sm font-medium">
                  {formatTime(currentDateTime)}
                </span>
              </div>

              {/* Redesigned control buttons - sans le bouton de profil */}
              <div className="flex items-center gap-2">
                {/* Theme toggle button */}
                <button
                  className={`p-2.5 rounded-full ${
                    isDarkMode
                      ? "bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white"
                      : "bg-slate-100/70 hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                  } shadow-sm transition-all duration-200 hover:shadow`}
                  onClick={toggleDarkMode}
                  aria-label={
                    isDarkMode ? "Activer le mode jour" : "Activer le mode nuit"
                  }
                >
                  {isDarkMode ? (
                    <Sun size={18} className="text-amber-300" />
                  ) : (
                    <Moon size={18} className="text-indigo-600" />
                  )}
                </button>

                {/* Notification button */}
                <button
                  className={`p-2.5 rounded-full ${
                    isDarkMode
                      ? "bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white"
                      : "bg-slate-100/70 hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                  } shadow-sm relative transition-all duration-200 hover:shadow`}
                  onClick={() => navigateTo("notifications")}
                >
                  <Bell size={18} />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-medium shadow-lg border-2 border-white dark:border-slate-800 -translate-y-1 translate-x-1">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Keep the main content area as is */}
          <main
            className={`flex-1 p-6 ${
              isDarkMode ? "text-slate-200" : "text-slate-800"
            } overflow-auto transition-colors duration-500`}
          >
            {renderPage}
          </main>
        </div>
      </div>
      {/* Session expired modal */}
      {sessionExpired && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-600 p-6 rounded-lg shadow-lg max-w-sm text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Session expirée
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Votre session a expiré. Vous allez être redirigé vers la page de
              connexion.
            </p>
            <button
              onClick={handleLogout}
              className="mt-2 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Reconnexion
            </button>
          </div>
        </div>
      )}

      {/* Expanded global style */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        html {
          font-family: "Inter", sans-serif;
          scroll-behavior: smooth;
        }

        /* Enhanced scrollbar styling */
        .hover\\:overflow-y-auto::-webkit-scrollbar {
          width: 5px;
        }

        .hover\\:overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .hover\\:overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
          transition: background-color 0.3s ease;
        }

        .hover\\:overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }

        .dark .hover\\:overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(100, 116, 139, 0.3);
        }

        .dark .hover\\:overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 116, 139, 0.5);
        }

        /* Add fade-in animation for mobile overlay */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        /* Add smooth transitions for all elements */
        * {
          transition-property: background-color, border-color, color, fill,
            stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhance focus styles */
        button:focus,
        input:focus {
          outline: 2px solid rgba(59, 130, 246, 0.5);
          outline-offset: 2px;
        }

        .dark button:focus,
        .dark input:focus {
          outline-color: rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
