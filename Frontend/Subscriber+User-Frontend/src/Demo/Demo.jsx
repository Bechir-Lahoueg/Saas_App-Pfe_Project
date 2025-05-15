import React, { useState } from "react";
import {
  Search,
  Bell,
  Calendar,
  Menu,
  Moon,
  Sun,
  ChevronRight,
  Gamepad2,
  LogOut,
  ChevronLeft,
  Clock,
  HelpCircle,
  X,
  LayoutDashboard,
  Settings,
  Users,
  PanelRight,
  Clock8,
  Image,
  UserCircle,
} from "lucide-react";

// Import des composants de page pour la démo
import Games from "./components/PlanifyGoGames";
import WorkingHours from "./components/WorkingHours";
import EmployeesComponent from "./components/Employees";
import ServicesComponent from "./components/Services";
import MediaManager from "./components/Media";
import CalendarComponent from "./components/Calendar";
import HelpComponent from "./components/Help";
import SettingsComponent from "./components/Settings";
import DashboardContent from "./components/DashboardContent";

const AUTH_EMAIL = "demo@exemple.com";
const AUTH_PASSWORD = "demo123";

const AuthForm = ({ onAuth }) => {
  const [email, setEmail] = useState("demo@exemple.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === AUTH_EMAIL && password === AUTH_PASSWORD) {
      onAuth();
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-blue-100">
      <div className="w-full max-w-md mx-auto bg-white/90 shadow-2xl rounded-3xl p-8 border border-indigo-100 relative overflow-hidden">
        {/* Decorative gradient circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-400/30 to-blue-300/20 rounded-full blur-2xl z-0"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-indigo-300/10 rounded-full blur-2xl z-0"></div>
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-3 rounded-full shadow-lg mb-2">
              <UserCircle size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-1 text-center drop-shadow">
              Connexion Démo
            </h2>
            <p className="text-sm text-gray-500 text-center mb-2">
              Veuillez vous authentifier pour accéder au tableau de bord.<br />
              <span className="text-indigo-600 font-semibold">Vous pouvez utiliser l'email et le mot de passe ci-dessous pour vous connecter.</span>
            </p>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2 mt-2 text-xs text-indigo-700 text-center shadow-sm">
              <span className="font-semibold">Accès démo :</span><br />
              <span className="font-mono">Email : demo@exemple.com</span><br />
              <span className="font-mono">Mot de passe : demo123</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@exemple.com"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo123"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center font-medium">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all text-lg"
            >
              Se connecter
            </button>
            <a
              href="/"
              className="w-full mt-2 inline-block text-center bg-gray-100 hover:bg-gray-200 text-indigo-700 font-medium py-2 rounded-lg transition-all border border-indigo-100"
            >
              Revenir à l'accueil
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

// Page titles
const PAGE_TITLES = {
  dashboard: "Tableau de bord",
  aide: "Aide",
  games: "PlanifyGo Games",
  calendar: "Calendrier",
  employees: "Employés",
  settings: "Paramètres",
  media: "Media",
  workinghours: "Horaires",
  services: "Services",
};

// Main menu items
const MAIN_MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: <LayoutDashboard size={20} />,
  },
  { id: "calendar", label: "Calendrier", icon: <Calendar size={20} /> },
  { id: "workinghours", label: "Horaires", icon: <Clock8 size={20} /> },
  { id: "services", label: "Services", icon: <PanelRight size={20} /> },
  { id: "employees", label: "Employés", icon: <Users size={20} /> },
  { id: "media", label: "Media", icon: <Image size={20} /> },
  { id: "aide", label: "Aide", icon: <HelpCircle size={20} /> },
  { id: "games", label: "PlanifyGo Games", icon: <Gamepad2 size={20} /> },
];

// Secondary menu items
const SECONDARY_MENU_ITEMS = [
  { id: "settings", label: "Paramètres", icon: <Settings size={20} /> },
];

const PlanifyGoDemo = () => {
  // Static state for UI demonstration
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Current time for display (static)
  const currentTime = "14:30";
  const businessName = "Entreprise";
  const userName = "DEMO";
  const notificationCount = 3;

  // Toggle functions for the demo
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setSidebarExpanded(!isSidebarExpanded);
  const navigateTo = (pageId) => {
    setActivePage(pageId);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  // Rendu conditionnel en fonction de la page active
  const renderContent = () => {
    switch (activePage) {
      case "games":
        return <Games />;
      case "workinghours":
        return <WorkingHours />;
      case "employees":
        return <EmployeesComponent />;
      case "services":
        return <ServicesComponent />;
      case "media":
        return <MediaManager />;
      case "calendar":
        return <CalendarComponent />;
      case "aide":
        return <HelpComponent />;
      case "settings":
        return <SettingsComponent />;
      case "dashboard":
        return <DashboardContent sidebarExpanded={isSidebarExpanded} />;
      default:
        return <DashboardContent sidebarExpanded={isSidebarExpanded} />;
    }
  };

  if (!isAuthenticated) {
    return <AuthForm onAuth={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div
        className={`flex h-screen bg-gradient-to-br ${
          isDarkMode
            ? "from-slate-900 via-slate-800/95 to-indigo-950"
            : "from-blue-50/70 via-white to-indigo-50/60"
        } transition-colors duration-500`}
      >
        {/* Mobile overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 animate-fadeIn"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex flex-col ${
            isSidebarExpanded ? "w-72" : "w-16"
          } ${
            isDarkMode
              ? "bg-slate-800/95 border-r border-slate-700/50"
              : "bg-white/95 border-r border-slate-200/50"
          } transition-all duration-300 ease-in-out ${
            isMobileOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full lg:translate-x-0 shadow-xl"
          } backdrop-blur-md`}
        >
          {/* Sidebar toggle button */}
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

          {/* Business name/logo */}
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
              {isSidebarExpanded ? businessName : businessName.charAt(0)}
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

          {/* User profile section */}
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
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDarkMode
                      ? "bg-gradient-to-br from-blue-500/30 to-indigo-600/30 text-blue-400"
                      : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"
                  } transition-colors duration-300`}
                >
                  <UserCircle size={24} />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-800 animate-pulse"></span>
              </div>

              {isSidebarExpanded && (
                <div className="flex-1 min-w-0 ml-3">
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    } truncate`}
                  >
                    {userName}
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

          {/* Menu sections */}
          <div className="flex-1 overflow-hidden hover:overflow-y-auto py-5 px-3.5">
            {/* Main menu heading */}
            {isSidebarExpanded && (
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-4 px-4 
                bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text"
              >
                Menu principal
              </h3>
            )}

            {/* Main menu items */}
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
                    {!isSidebarExpanded && (
                      <span className="sr-only">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Settings heading */}
            {isSidebarExpanded && (
              <h3
                className="text-xs font-semibold uppercase tracking-wider mt-8 mb-4 px-4
                bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text"
              >
                Paramètres
              </h3>
            )}

            {/* Divider for collapsed sidebar */}
            {!isSidebarExpanded && (
              <div
                className={`h-0.5 w-5 mx-auto my-6 rounded-full ${
                  isDarkMode ? "bg-slate-700" : "bg-slate-200"
                }`}
              ></div>
            )}

            {/* Settings menu items */}
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
                    {!isSidebarExpanded && (
                      <span className="sr-only">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Logout button */}
          <div
            className={`p-4 ${
              isDarkMode ? "border-slate-700/50" : "border-slate-200/70"
            } border-t mt-auto`}
          >
            <button
              onClick={() => setIsAuthenticated(false)}
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

        {/* Main content area */}
        <div
          className={`flex-1 flex flex-col ${
            isSidebarExpanded ? "lg:ml-72" : "lg:ml-16"
          } transition-all duration-300`}
        >
          {/* Header */}
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
                    {PAGE_TITLES[activePage]}
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
              {/* "See client page" button */}
              <div className="relative hidden md:block">
                <a
                  href="#"
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
                >
                  {/* Hover effect overlay */}
                  <span className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>

                  {/* Animation light effect */}
                  <span className="absolute -inset-x-10 top-0 h-full w-20 bg-white/20 skew-x-[-30deg] transform -translate-x-full group-hover:translate-x-[28rem] transition-transform duration-1000 ease-in-out"></span>

                  {/* Icon */}
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

                  {/* Text */}
                  <span className="relative transform group-hover:translate-x-1 transition-transform duration-300">
                    Voir ma page client
                  </span>

                  {/* Ping indicator */}
                  <span className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-white/70 animate-ping"></span>
                  <span className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-white/90"></span>
                </a>
              </div>

              {/* Time display */}
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
                <span className="text-sm font-medium">{currentTime}</span>
              </div>

              {/* Control buttons */}
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

          {/* Main content */}
          <main
            className={`flex-1 p-6 ${
              isDarkMode ? "text-slate-200" : "text-slate-800"
            } overflow-auto transition-colors duration-500`}
          >
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Global styles */}
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

export default PlanifyGoDemo;
