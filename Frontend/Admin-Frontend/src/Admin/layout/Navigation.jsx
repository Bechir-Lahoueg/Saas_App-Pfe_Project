// src/components/Navigation.jsx
import React, { useState, useEffect } from 'react';
import {
  Search, Bell, Calendar, Menu, ChevronDown, Moon, Sun,
  Users, Settings as SettingsIcon, ChevronRight,
  LogOut, ChevronLeft, X, Home, BarChart3, Clock,
  PieChart, FileText, Layers, Award, User
} from 'lucide-react';
import logoImage from '../../assets/LogoPlanifygoPNG.png';

// Page components
import DashboardContent from '../pages/DashboardContent';
import Analytics         from '../pages/Analytics';
import Invoice           from '../pages/Invoice';
import HR                from '../pages/HR';
import CalendarPage      from '../pages/Calendar';
import Catégorie         from '../pages/Category';
import Notifications     from '../pages/Notifications';
import SettingsPage      from '../pages/Settings';

const Navigation = () => {
  const [isDarkMode, setIsDarkMode]           = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen]   = useState(false);
  const [activePage, setActivePage]           = useState(() => localStorage.getItem('activePage') || 'dashboard');
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [sessionExpired, setSessionExpired]   = useState(false);

  // On mount: check token + schedule expiry
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/connexion';
      return;
    }

    const expMs = Number(localStorage.getItem('accessTokenExp')) * 1000;
    const delta = expMs - Date.now();
    if (delta <= 0) {
      triggerLogout();
    } else {
      const timer = setTimeout(triggerLogout, delta);
      return () => clearTimeout(timer);
    }
  }, []);

  // Responsive sidebar
  useEffect(() => {
    const onResize = () => setSidebarCollapsed(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const triggerLogout = () => {
    setSessionExpired(true);
    setTimeout(handleLogout, 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/connexion';
  };

  const navigateTo = (pageId) => {
    setActivePage(pageId);
    localStorage.setItem('activePage', pageId);
    setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('darkMode', next.toString());
  };

  const getPageTitle = () => ({
    dashboard:   'Tableau de bord',
    analytics:   'Analytique',
    invoice:     'Factures',
    hr:          'Équipe',
    calendar:    'Calendrier',
    Catégorie:   'Catégories',
    notifications: 'Notifications',
    settings:    'Paramètres'
  }[activePage] || 'Tableau de bord');

  const getUserName = () => localStorage.getItem('name') || 'Utilisateur';

  const mainMenuItems = [
    { id: 'dashboard', icon: Home,      label: 'Tableau de bord' },
    { id: 'analytics', icon: PieChart,  label: 'Analytique', badge: 'PRO' },
    { id: 'invoice',   icon: FileText,  label: 'Factures',   counter: 2 },
    { id: 'hr',        icon: Users,     label: 'Équipe' },
    { id: 'calendar',  icon: Calendar,  label: 'Calendrier' },
    { id: 'Catégorie', icon: Layers,    label: 'Catégories', counter: 5 }
  ];

  const secondaryMenuItems = [
    { id: 'notifications', icon: Bell,           label: 'Notifications', counter: notificationsCount },
    { id: 'settings',      icon: SettingsIcon,  label: 'Paramètres' }
  ];

  const renderActivePage = () => {
    switch (activePage) {
      case 'analytics':    return <Analytics />;
      case 'invoice':      return <Invoice />;
      case 'hr':           return <HR />;
      case 'calendar':     return <CalendarPage />;
      case 'Catégorie':    return <Catégorie />;
      case 'notifications':return <Notifications />;
      case 'settings':     return <SettingsPage />;
      default:             return <DashboardContent sidebarExpanded={!isSidebarCollapsed} />;
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      {/* Session Expired Alert */}
      {sessionExpired && (
        <div className="fixed top-4 inset-x-0 flex justify-center z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md w-11/12 max-w-md flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2a1 1 0 01-2 0zm0 4a1 1 0 112 0 1 1 0 01-2 0z"
                clipRule="evenodd" />
            </svg>
            <p className="font-semibold">Session expirée. Vous allez être déconnecté...</p>
          </div>
        </div>
      )}

      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col
          w-72 lg:w-auto ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
          bg-gradient-to-b from-violet-50 to-indigo-50 dark:from-indigo-950 dark:to-slate-900
          border-r border-violet-100 dark:border-indigo-900/40
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-xl lg:shadow-md
        `}>
          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-24 hidden lg:flex items-center justify-center h-7 w-7 rounded-full
                       bg-white dark:bg-indigo-900 text-violet-600 dark:text-violet-300
                       shadow-lg border border-violet-100 dark:border-indigo-800
                       hover:shadow-violet-200 dark:hover:shadow-indigo-900/50
                       transition-all duration-300 z-10">
            {isSidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>

          {/* Logo */}
          <div className="relative flex items-center justify-center p-4 border-b border-violet-100/80 dark:border-indigo-900/40">
            <div className={`${isSidebarCollapsed ? 'w-10' : 'w-full'} overflow-hidden transition-all duration-300`}>
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-indigo-900/30 p-1.5 rounded-lg shadow-sm">
                  <img src={logoImage} alt="PlanifyGo Logo" className="h-8 w-8 object-contain" />
                </div>
                {!isSidebarCollapsed && (
                  <span className="font-bold text-xl bg-clip-text text-transparent
                                   bg-gradient-to-r from-violet-800 to-indigo-600
                                   dark:from-violet-300 dark:to-indigo-400">
                    PlanifyGo
                  </span>
                )}
              </div>
            </div>  
            <button
              className="lg:hidden absolute right-4 top-4 text-violet-600 dark:text-violet-300 hover:text-violet-800 dark:hover:text-violet-200"
              onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Profile */}
          <div className="px-4 py-5 border-b border-violet-100/80 dark:border-indigo-900/40">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}
                               px-2.5 py-2.5 rounded-xl transition-all
                               hover:bg-white/60 dark:hover:bg-indigo-900/20
                               shadow-sm hover:shadow-md`}>
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100
                                dark:from-violet-900 dark:to-indigo-900 flex items-center justify-center shadow-inner">
                  <User className="w-5 h-5 text-violet-700 dark:text-violet-300" />
                </div>
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-violet-900 dark:text-violet-100 truncate">
                    {getUserName()}
                  </p>
                  <span className="text-xs text-violet-500 dark:text-violet-400">Administrateur</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5 overflow-y-auto">
            {!isSidebarCollapsed && (
              <h3 className="px-4 mb-3 text-xs font-semibold text-violet-600 dark:text-violet-300 uppercase tracking-wider">
                Navigation
              </h3>
            )}
            <div className="space-y-2">
              {mainMenuItems.map(item => {
                const isActive = activePage === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`
                      w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}
                      px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                      ${isActive
                        ? 'bg-white dark:bg-indigo-900/30 border border-violet-200 dark:border-indigo-700 shadow-md'
                        : 'border-transparent hover:bg-white/60 dark:hover:bg-indigo-900/20 hover:shadow-sm'}
                    `}>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`
                        flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg
                        ${isActive
                          ? 'bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-800/50 dark:to-indigo-800/50 shadow-sm'
                          : 'bg-white/60 dark:bg-indigo-900/30'}
                        ${isActive ? 'text-violet-700 dark:text-violet-300' : 'text-violet-600 dark:text-violet-400'}
                      `}>
                        <Icon size={isSidebarCollapsed ? 19 : 17} />
                      </div>
                      {!isSidebarCollapsed && <span className="truncate font-medium">{item.label}</span>}
                      {!isSidebarCollapsed && item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-md bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700">
                          {item.badge}
                        </span>
                      )}
                      {!isSidebarCollapsed && item.counter && (
                        <span className="ml-2 inline-flex items-center justify-center h-5 px-1.5 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-800/50 text-violet-800">
                          {item.counter}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {!isSidebarCollapsed && (
              <h3 className="px-4 mt-8 mb-3 text-xs font-semibold text-violet-600 dark:text-violet-300 uppercase tracking-wider">
                Paramètres
              </h3>
            )}
            <div className="space-y-2">
              {secondaryMenuItems.map(item => {
                const isActive = activePage === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`
                      w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}
                      px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                      ${isActive
                        ? 'bg-white dark:bg-indigo-900/30 border border-violet-200 dark:border-indigo-700 shadow-md'
                        : 'border-transparent hover:bg-white/60 dark:hover:bg-indigo-900/20 hover:shadow-sm'}
                    `}>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`
                        flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg
                        ${isActive ? 'bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-800/50 dark:to-indigo-800/50 shadow-sm' : 'bg-white/60 dark:bg-indigo-900/30'}
                        ${isActive ? 'text-violet-700 dark:text-violet-300' : 'text-violet-600 dark:text-violet-400'}
                      `}>
                        <Icon size={isSidebarCollapsed ? 19 : 17} />
                      </div>
                      {!isSidebarCollapsed && <span className="truncate font-medium">{item.label}</span>}
                      {!isSidebarCollapsed && item.counter && (
                        <span className="ml-2 inline-flex items-center justify-center h-5 px-1.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700">
                          {item.counter}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-violet-100/80 dark:border-indigo-900/40">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}
                px-3 py-2.5 rounded-xl text-rose-700 dark:text-rose-300
                bg-white/40 dark:bg-indigo-900/20 border-transparent hover:bg-white hover:shadow-md
                transition-all duration-200
              `}>
              <LogOut size={isSidebarCollapsed ? 19 : 17} />
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Déconnexion</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-30 flex items-center h-16 bg-white dark:bg-slate-800 shadow-sm">
            <div className="flex items-center justify-between w-full px-4 sm:px-6">
              {/* Left */}
              <div className="flex items-center space-x-4">
                <button className="lg:hidden p-2 rounded-lg text-violet-600 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-indigo-900/30"
                        onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu size={22} />
                </button>
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-violet-900 dark:text-violet-100">
                    {getPageTitle()}
                  </h1>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                </div>
              </div>
              {/* Right */}
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block w-60">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full h-9 py-2 pl-10 pr-4 rounded-xl bg-violet-50 dark:bg-indigo-900/20 border border-violet-100 dark:border-indigo-800/50 focus:outline-none focus:ring-2 focus:ring-violet-300/50"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={16} className="text-violet-500 dark:text-violet-400" />
                  </div>
                </div>

                {/* Date picker */}
                <button className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-violet-50 dark:bg-indigo-900/20 border border-violet-100 dark:border-indigo-800/50">
                  <Clock size={15} className="text-violet-600 dark:text-violet-400" />
                  <span className="text-sm">Aujourd'hui</span>
                  <ChevronDown size={14} className="text-violet-500 dark:text-violet-400" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-indigo-900/30">
                  <Bell size={19} />
                  {notificationsCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-medium bg-rose-500 text-white rounded-full transform translate-x-1/4 -translate-y-1/4 border border-white">
                      {notificationsCount}
                    </span>
                  )}
                </button>

                {/* Theme */}
                <button onClick={toggleDarkMode}
                        className="p-2 rounded-lg border-transparent hover:bg-violet-50 dark:hover:bg-indigo-900/30">
                  {isDarkMode ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} className="text-violet-600" />}
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900 p-4 sm:p-6 transition-colors duration-300">
            {renderActivePage()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
