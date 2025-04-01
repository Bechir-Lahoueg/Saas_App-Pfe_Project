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
// Import page components
import DashboardContent from "../pages/DashboardContent";
import Analytics from "../pages/Analytics";
import Invoice from "../pages/Invoice";
import HR from "../pages/HR";
import CalendarPage from "../pages/Calendar";
import Messages from "../pages/Messages";
import Notifications from "../pages/Notifications";
import SettingsPage from "../pages/Settings";

const Navigation = () => {
  // States for various features
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
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
      window.location.href = "/connexionadmin";
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

    // Redirect to login page
    window.location.href = "/connexionadmin";
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

  // Navigation
  const navigateTo = (pageId) => {
    setActivePage(pageId);
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
      case "hr":
        return "Équipe";
      case "calendar":
        return "Calendrier";
      case "messages":
        return "Messages";
      case "notifications":
        return "Notifications";
      case "settings":
        return "Paramètres";
      default:
        return "Tableau de bord";
    }
  };

  // Get user's name
  const getUserName = () => {
    if (adminData && adminData.name) {
      return adminData.name;
    }
    return "Utilisateur";
  };

  // Menu items definition
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Tableau de bord" },
    { id: "analytics", icon: BarChart3, label: "Analytique", enterprise: true },
    { id: "invoice", icon: CreditCard, label: "Factures", notification: 2 },
    { id: "hr", icon: Users, label: "Équipe" },
    { id: "calendar", icon: Calendar, label: "Calendrier" },
    { id: "messages", icon: MessageCircle, label: "Messages", notification: 5 },
  ];

  const secondaryMenuItems = [
    { id: "notifications", icon: Bell, label: "Notifications" },
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
      case "hr":
        return <HR />;
      case "calendar":
        return <CalendarPage />;
      case "messages":
        return <Messages />;
      case "notifications":
        return <Notifications />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardContent sidebarExpanded={isSidebarExpanded} />;
    }
  };

  return (
    <div
      className={`flex h-screen ${
        isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col ${
          isSidebarExpanded ? "w-64" : "w-20"
        } ${
          isDarkMode
            ? "bg-slate-800 border-r border-slate-700"
            : "bg-white border-r border-gray-200"
        } transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } shadow-lg`}
      >
        <button
          onClick={() => setSidebarExpanded(!isSidebarExpanded)}
          className={`absolute -right-3 top-28 hidden md:flex h-7 w-7 items-center justify-center rounded-full 
          ${
            isDarkMode
              ? "bg-blue-600 border-slate-800"
              : "bg-blue-600 border-white"
          } text-white shadow-lg border-2 cursor-pointer hover:bg-blue-700 transition-all`}
        >
          {isSidebarExpanded ? (
            <ChevronLeft size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
        </button>

        <div
          className={`p-5 flex items-center justify-between ${
            isDarkMode ? "border-slate-700" : "border-gray-200"
          } border-b`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
              <Shield className="text-white" size={20} />
            </div>
            {isSidebarExpanded && (
              <span
                className={`font-bold text-xl ${
                  isDarkMode ? "text-white" : "text-gray-800"
                } tracking-tight`}
              >
                PlanifyGo
              </span>
            )}
          </div>
          <button
            className={`md:hidden p-1.5 rounded-lg ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-slate-700"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div
          className={`p-4 ${
            isDarkMode ? "border-slate-700" : "border-gray-200"
          } border-b`}
        >
          <div
            className={`flex items-center p-2 rounded-lg cursor-pointer group 
            ${
              isDarkMode ? "hover:bg-blue-800/20" : "hover:bg-blue-50"
            } transition-all duration-200`}
          >
            <div className="relative">
              <UserCircle
                className={`w-10 h-10 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white"></span>
            </div>

            {isSidebarExpanded && (
              <div className="flex-1 min-w-0 ml-3">
                <p
                  className={`text-sm font-medium ${
                    isDarkMode
                      ? "text-white group-hover:text-blue-400"
                      : "text-gray-800 group-hover:text-blue-600"
                  } truncate`}
                >
                  {getUserName()}
                </p>
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                  En ligne
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="py-4 flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
          {isSidebarExpanded && (
            <div className="px-6 mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Menu
              </p>
            </div>
          )}

          <div className="px-3 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const isHovered = hoveredMenu === item.id;

              return (
                <button
                  key={item.id}
                  className={`flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? isDarkMode
                        ? "bg-blue-800/20 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-slate-700/40"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => navigateTo(item.id)}
                  onMouseEnter={() => setHoveredMenu(item.id)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <div
                    className={`flex items-center justify-center min-w-10 h-10 rounded-lg transition-all duration-200 ${
                      isActive
                        ? isDarkMode
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                        : isDarkMode
                        ? `text-gray-400 ${
                            isHovered ? "bg-slate-700/40 text-gray-200" : ""
                          }`
                        : `text-gray-500 ${
                            isHovered ? "bg-gray-100 text-gray-700" : ""
                          }`
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {isSidebarExpanded && (
                    <>
                      <span
                        className={`ml-3 ${
                          isActive ? "font-medium" : ""
                        } transition-all duration-200`}
                      >
                        {item.label}
                      </span>

                      {item.notification && (
                        <div
                          className={`ml-auto bg-blue-600 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-sm ${
                            isActive || isHovered ? "scale-110" : ""
                          } transition-all duration-200`}
                        >
                          {item.notification}
                        </div>
                      )}

                      {item.enterprise && (
                        <span
                          className={`ml-auto text-xs py-0.5 px-2 rounded-lg border ${
                            isDarkMode
                              ? "border-slate-600 text-slate-400"
                              : "border-gray-300 text-gray-500"
                          } ${
                            isActive || isHovered ? "scale-110" : ""
                          } transition-all duration-200`}
                        >
                          ENT
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {isSidebarExpanded && (
            <div className="px-6 mt-6 mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Préférences
              </p>
            </div>
          )}

          <div className="px-3 space-y-1.5">
            {secondaryMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const isHovered = hoveredMenu === item.id;

              return (
                <button
                  key={item.id}
                  className={`flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? isDarkMode
                        ? "bg-blue-800/20 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-slate-700/40"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => navigateTo(item.id)}
                  onMouseEnter={() => setHoveredMenu(item.id)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <div
                    className={`flex items-center justify-center min-w-10 h-10 rounded-lg transition-all duration-200 ${
                      isActive
                        ? isDarkMode
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                        : isDarkMode
                        ? `text-gray-400 ${
                            isHovered ? "bg-slate-700/40 text-gray-200" : ""
                          }`
                        : `text-gray-500 ${
                            isHovered ? "bg-gray-100 text-gray-700" : ""
                          }`
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {isSidebarExpanded && (
                    <span
                      className={`ml-3 ${
                        isActive ? "font-medium" : ""
                      } transition-all duration-200`}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`p-4 ${
            isDarkMode ? "border-slate-700" : "border-gray-200"
          } border-t`}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 
              ${
                isDarkMode
                  ? "text-gray-300 hover:bg-red-900/20 hover:text-red-400"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              } group`}
            onMouseEnter={() => setHoveredMenu("logout")}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div
              className={`flex items-center justify-center min-w-10 h-10 rounded-lg transition-all duration-200
              ${
                isDarkMode
                  ? `text-gray-400 ${
                      hoveredMenu === "logout"
                        ? "bg-red-900/20 text-red-400"
                        : ""
                    }`
                  : `text-gray-500 ${
                      hoveredMenu === "logout" ? "bg-red-100 text-red-500" : ""
                    }`
              }`}
            >
              <LogOut size={20} />
            </div>
            {isSidebarExpanded && <span className="ml-3">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarExpanded ? "md:ml-64" : "md:ml-20"
        } transition-all duration-300`}
      >
        {/* Navbar */}
        <header
          className={`${
            isDarkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          } 
          h-16 px-4 md:px-6 flex items-center justify-between border-b sticky top-0 z-20 shadow-sm`}
        >
          <div className="flex items-center gap-4">
            <button
              className={`md:hidden p-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-300 hover:bg-slate-700"
                  : "text-gray-600 hover:bg-gray-100"
              } transition-colors duration-200`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3">
              <h1
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                } tracking-tight`}
              >
                {getTitle()}
              </h1>
              {activePage === "analytics" && (
                <div
                  className={`hidden sm:block px-2 py-0.5 rounded-lg border text-xs font-medium
                  ${
                    isDarkMode
                      ? "border-slate-600 text-slate-400"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  Enterprise
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
                    ? "bg-slate-700 border-slate-600 text-gray-200 focus:ring-blue-500/50"
                    : "bg-gray-50 border-gray-200 text-gray-800 focus:ring-blue-500/50"
                } 
                  border focus:outline-none focus:ring-2 focus:border-transparent transition-all w-64 text-sm`}
              />
              <Search
                className={`absolute left-3 top-2.5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
                size={18}
              />
            </div>

            <div
              className={`hidden sm:flex items-center gap-2 rounded-lg py-1.5 px-3 
              ${
                isDarkMode
                  ? "bg-slate-700 border-slate-600 hover:bg-slate-600"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              } 
              border cursor-pointer transition-all duration-200`}
            >
              <Clock size={16} className="text-blue-500" />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Aujourd'hui
              </span>
              <ChevronDown size={14} className="text-gray-500" />
            </div>

            <div className="flex gap-1 md:gap-2">
              <button
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? "hover:bg-slate-700 text-gray-300 hover:text-amber-400"
                    : "hover:bg-gray-100 text-gray-600 hover:text-amber-500"
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
                    ? "hover:bg-blue-800/20 text-gray-300 hover:text-blue-400"
                    : "hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                } relative transition-all duration-200`}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className={`flex-1 p-6 ${
            isDarkMode ? "bg-slate-900" : "bg-gray-50"
          } transition-colors duration-300`}
        >
          {renderPage()}
        </main>
      </div>

      {/* Add global style to hide scrollbar */}
      <style jsx global>{`
        /* Hide scrollbar while maintaining functionality */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Navigation;