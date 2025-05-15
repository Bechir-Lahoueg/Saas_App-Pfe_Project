// StaticDashboard.jsx
import React from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, AreaChart, Area, ComposedChart, Line
} from 'recharts';
import { 
  Calendar, Clock, Users, BarChart2, PieChart as PieChartIcon,
  TrendingUp, Award, FileSpreadsheet, ChevronRight, ArrowUp, 
  Zap, UserCheck, Download, ChevronDown
} from 'lucide-react';

const StaticDashboard = () => {
  // Couleurs personnalisées pour les graphiques
  const COLORS = {
    primary: '#4f46e5',
    primaryLight: '#818cf8',
    primaryDark: '#4338ca',
    secondary: '#8b5cf6', 
    secondaryLight: '#a78bfa',
    secondaryDark: '#7c3aed',
    tertiary: '#06b6d4',
    tertiaryLight: '#22d3ee',
    tertiaryDark: '#0891b2',
    quaternary: '#10b981',
    quaternaryLight: '#34d399',
    quaternaryDark: '#059669',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    warningDark: '#d97706',
    danger: '#ef4444',
    dangerLight: '#f87171',
    dangerDark: '#dc2626',
    gray: '#6b7280',
    grayLight: '#9ca3af',
    grayDark: '#4b5563'
  };

  // Données statiques simulées
  const serviceData = [
    { name: 'Coupe Homme', price: 25, duration: 30 },
    { name: 'Coupe Femme', price: 35, duration: 45 },
    { name: 'Coloration', price: 65, duration: 120 },
    { name: 'Brushing', price: 30, duration: 30 },
    { name: 'Barbe', price: 15, duration: 15 },
    { name: 'Soins', price: 50, duration: 60 }
  ];

  const dayData = [
    { day: 'Lundi', count: 12 },
    { day: 'Mardi', count: 8 },
    { day: 'Mercredi', count: 16 },
    { day: 'Jeudi', count: 10 },
    { day: 'Vendredi', count: 18 },
    { day: 'Samedi', count: 24 },
    { day: 'Dimanche', count: 4 }
  ];

  const statusData = [
    { status: 'CONFIRMED', count: 42, color: COLORS.quaternary },
    { status: 'PENDING', count: 15, color: COLORS.warning },
    { status: 'CANCELLED', count: 8, color: COLORS.gray }
  ];

  const workingDaysData = [
    { day: 'Lundi', hours: 8, active: 'Active' },
    { day: 'Mardi', hours: 8, active: 'Active' },
    { day: 'Mercredi', hours: 6, active: 'Active' },
    { day: 'Jeudi', hours: 8, active: 'Active' },
    { day: 'Vendredi', hours: 8, active: 'Active' },
    { day: 'Samedi', hours: 4, active: 'Active' },
    { day: 'Dimanche', hours: 0, active: 'Inactive' }
  ];

  const employeeWorkloadData = [
    { name: 'Sophie Martin', reservations: 28 },
    { name: 'Thomas Dubois', reservations: 22 },
    { name: 'Emma Leroy', reservations: 18 },
    { name: 'Lucas Moreau', reservations: 12 }
  ];

  const timeDistribution = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: i >= 9 && i <= 18 
      ? Math.floor(Math.random() * 10 + (i >= 11 && i <= 14 ? 5 : 0)) 
      : 0,
    label: `${i}:00`
  }));

  const reservationsByService = [
    { name: 'Coupe Homme', count: 28 },
    { name: 'Coupe Femme', count: 22 },
    { name: 'Coloration', count: 16 },
    { name: 'Brushing', count: 12 },
    { name: 'Barbe', count: 10 },
    { name: 'Soins', count: 6 }
  ];

  // Calcul des statistiques
  const stats = {
    totalReservations: 65,
    confirmedCount: 42,
    pendingCount: 15,
    uniqueClientCount: 38,
    confirmationRate: 65,
    mostBookedService: {
      name: 'Coupe Homme',
      bookings: 28
    }
  };

  const reservationStats = {
    total: 65,
    confirmed: 42,
    pending: 15
  };

  const potentialRevenue = 1850;

  const upcomingReservations = [
    {
      id: 1,
      clientFirstName: 'Marie',
      clientLastName: 'Dupont',
      clientEmail: 'marie.d@example.com',
      serviceName: 'Coloration',
      employeeName: 'Sophie Martin',
      formattedStartTime: '24/05/2025 14:30',
      timeRemaining: '2j 4h',
      status: 'CONFIRMED'
    },
    {
      id: 2,
      clientFirstName: 'Thomas',
      clientLastName: 'Leroy',
      clientEmail: 'thomas.l@example.com',
      serviceName: 'Coupe Homme',
      employeeName: 'Lucas Moreau',
      formattedStartTime: '25/05/2025 10:15',
      timeRemaining: '3j 8h',
      status: 'PENDING'
    },
    {
      id: 3,
      clientFirstName: 'Emma',
      clientLastName: 'Martin',
      clientEmail: 'emma.m@example.com',
      serviceName: 'Brushing',
      employeeName: 'Sophie Martin',
      formattedStartTime: '26/05/2025 16:45',
      timeRemaining: '4j 10h',
      status: 'CONFIRMED'
    }
  ];

  // Composant pour le taux de confirmation
  const ConfirmationRateCard = () => (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 transform transition-transform hover:scale-[1.01]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <div className="bg-indigo-100 p-2 sm:p-2.5 rounded-xl">
            <UserCheck className="text-indigo-600" size={20} />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Taux de confirmation</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.confirmationRate}%</p>
          </div>
        </div>
        
        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Confirmées', value: reservationStats.confirmed },
                  { name: 'En attente', value: reservationStats.pending }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={18}
                outerRadius={35}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill={COLORS.quaternary} />
                <Cell fill={COLORS.warning} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mt-2">
        <div className="bg-indigo-50 p-2 sm:p-3 rounded-xl">
          <p className="text-xs text-indigo-600 font-medium">Réservations confirmées</p>
          <p className="text-base sm:text-lg font-semibold text-indigo-900">{reservationStats.confirmed}</p>
        </div>
        <div className="bg-amber-50 p-2 sm:p-3 rounded-xl">
          <p className="text-xs text-amber-600 font-medium">Réservations en attente</p>
          <p className="text-base sm:text-lg font-semibold text-amber-900">{reservationStats.pending}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-10">
      {/* En-tête du tableau de bord avec onglets améliorés */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white p-6 -m-4 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord Analytique</h1>
            <p className="text-indigo-100">
              Analysez les performances et les tendances de votre service de réservation
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            {/* Date Range Selector */}
            <div className="relative">
              <button 
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 transition-colors text-white group"
              >
                <Calendar size={16} className="group-hover:animate-pulse" />
                <span>30 derniers jours</span>
                <ChevronDown size={14} />
              </button>
            </div>
            
            {/* Export Button */}
            <button 
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <Download size={16} />
              <span>Exporter</span>
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide mt-4 gap-1">
            <button 
              className="px-4 py-2 rounded-t-lg transition-all bg-indigo-100 text-indigo-700 font-medium border-b-2 border-indigo-500"
            >
              Vue d'ensemble
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8 animate-fadeIn">
          {/* Carte revenue totale */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-md text-white col-span-2 transform transition-transform hover:scale-[1.01]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Revenu Potentiel</p>
                <h3 className="text-4xl font-bold mt-1">{potentialRevenue.toLocaleString()} DT</h3>
                <div className="flex gap-6 mt-4">
                  <div className="bg-white/20 rounded-lg p-2 px-3">
                    <p className="text-xs text-blue-100">Confirmées</p>
                    <p className="text-xl font-semibold">{stats.confirmedCount}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2 px-3">
                    <p className="text-xs text-blue-100">Clients Uniques</p>
                    <p className="text-xl font-semibold">{stats.uniqueClientCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Zap size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col transform transition-transform hover:scale-[1.02]">
            <div className="flex justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <ArrowUp size={12} className="mr-1" />
                  100%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              6
            </h3>
            <p className="text-sm text-gray-500 mt-1">Jours de travail actifs</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col transform transition-transform hover:scale-[1.02]">
            <div className="flex justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Clock className="text-purple-600" size={24} />
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Actifs
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              6
            </h3>
            <p className="text-sm text-gray-500 mt-1">Services offerts</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col transform transition-transform hover:scale-[1.02]">
            <div className="flex justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Personnel
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              4
            </h3>
            <p className="text-sm text-gray-500 mt-1">Employés actifs</p>
          </div>
        </div>

        {/* Taux de confirmation et Service le plus populaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Taux de confirmation */}
          <ConfirmationRateCard />

          {/* Service le plus populaire */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 transform transition-transform hover:scale-[1.01]">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
              <div className="bg-amber-100 p-2 sm:p-3 rounded-xl mx-auto sm:mx-0">
                <Award className="text-amber-600" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 mb-1 text-center sm:text-left">Service le plus réservé</p>
                <p className="text-lg sm:text-xl font-bold text-center sm:text-left">{stats.mostBookedService.name}</p>
                
                <div className="mt-4 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, stats.mostBookedService.bookings / stats.totalReservations * 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Popularité</span>
                  <span className="text-xs sm:text-sm font-semibold">{Math.round(stats.mostBookedService.bookings / stats.totalReservations * 100)}%</span>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-2 sm:gap-0">
                  <p className="text-xs sm:text-sm text-gray-600">Réservations totales</p>
                  <p className="text-xs sm:text-sm font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                    {stats.mostBookedService.bookings} réservations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques principaux - Layout principal à 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          {/* Réservations par Service */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transform transition hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">Réservations par Service</h2>
                <p className="text-xs text-gray-500 mt-1">Distribution des réservations par type de service</p>
              </div>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <BarChart2 className="text-indigo-600" size={20} />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reservationsByService}>
                  <defs>
                    <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.98)", 
                      borderRadius: "12px", 
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                    }}
                    formatter={(value, name) => [`${value} réservations`, name]}
                  />
                  <Bar 
                    dataKey="count" 
                    name="Réservations" 
                    fill="url(#colorReservations)" 
                    radius={[6, 6, 0, 0]} 
                    animationBegin={300}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Répartition des réservations par jour */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transform transition hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">Réservations par Jour</h2>
                <p className="text-xs text-gray-500 mt-1">Analyse des jours les plus populaires pour les réservations</p>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg">
                <BarChart2 className="text-purple-600" size={20} />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayData}>
                  <defs>
                    <linearGradient id="colorDayReservations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.98)", 
                      borderRadius: "12px", 
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                    }}
                    formatter={(value, name) => [`${value} réservations`, name]}
                  />
                  <Bar 
                    dataKey="count" 
                    name="Réservations" 
                    fill="url(#colorDayReservations)" 
                    radius={[6, 6, 0, 0]} 
                    animationBegin={300}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Deuxième rangée de graphiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Statut des réservations */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">Statut des Réservations</h2>
                <p className="text-xs text-gray-500 mt-1">Distribution par statut</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <PieChartIcon className="text-gray-600" size={20} />
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="w-full max-w-xs">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      dataKey="count"
                      nameKey="status"
                      labelLine={false}
                      label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                      animationBegin={300}
                      animationDuration={1500}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.98)", 
                        borderRadius: "12px", 
                        border: "none",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                      }}
                      formatter={(value, name, props) => [`${value} réservation(s)`, props.payload.status]} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {statusData.map((status, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                    <span className="text-sm font-medium text-gray-800">{status.status}</span>
                  </div>
                  <span className="text-xs text-gray-600">{status.count} réservations</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Heures par jour de travail */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">Heures de Travail</h2>
                <p className="text-xs text-gray-500 mt-1">Heures disponibles par jour</p>
              </div>
              <div className="bg-teal-50 p-2 rounded-lg">
                <Clock className="text-teal-600" size={20} />
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workingDaysData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.tertiary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.tertiary} stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.98)", 
                      borderRadius: "12px", 
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                    }}
                    formatter={(value, name) => [`${value} heures`, name]} 
                  />
                  <Bar 
                    dataKey="hours" 
                    name="Heures" 
                    fill="url(#colorHours)" 
                    radius={[6, 6, 0, 0]} 
                    animationBegin={300}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution horaire des réservations */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">Réservations par Heure</h2>
                <p className="text-xs text-gray-500 mt-1">Distribution horaire des réservations</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Clock className="text-blue-600" size={20} />
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeDistribution}>
                  <defs>
                    <linearGradient id="colorTimeDistribution" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{fontSize: 10}} interval={2} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.98)", 
                      borderRadius: "12px", 
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                    }}
                    formatter={(value, name) => [`${value} réservations`, `${name} h`]} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Réservations" 
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                    fill="url(#colorTimeDistribution)"
                    animationBegin={300}
                    animationDuration={1500} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Troisième rangée - Graphiques spécifiques */}          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Prix et durée des services */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">Prix et Durée des Services</h2>
                <p className="text-xs text-gray-500 mt-1">Comparaison des prix et durées par service</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <FileSpreadsheet className="text-green-600" size={20} />
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={serviceData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis yAxisId="left" tick={{fontSize: 12}} />
                  <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.98)", 
                      borderRadius: "12px", 
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="price" 
                    name="Prix (DT)" 
                    fill="url(#colorPrice)" 
                    radius={[6, 6, 0, 0]} 
                    animationBegin={300}
                    animationDuration={1500}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="duration" 
                    stroke={COLORS.quaternary} 
                    name="Durée (min)" 
                    strokeWidth={3}
                    dot={{ r: 6, strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                    animationBegin={300}
                    animationDuration={1500}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charge de travail des employés */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">Charge de Travail des Employés</h2>
                <p className="text-xs text-gray-500 mt-1">Nombre de réservations par employé</p>
              </div>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <Users className="text-indigo-600" size={20} />
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={employeeWorkloadData}
                  margin={{ left: 100 }}
                >
                  <defs>
                    <linearGradient id="colorWorkload" x1="1" y1="0" x2="0" y2="0">
                      <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{fontSize: 12}} />
                  <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.98)", 
                      borderRadius: "12px", 
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                    }}
                    formatter={(value, name) => [`${value} réservations`, name]} 
                  />
                  <Bar 
                    dataKey="reservations" 
                    name="Réservations" 
                    fill="url(#colorWorkload)" 
                    radius={[0, 6, 6, 0]} 
                    barSize={24}
                    animationBegin={300}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Section Réservations à venir */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-gray-800 text-xl">Réservations à Venir</h2>
              <p className="text-sm text-gray-500 mt-1">Prochaines réservations planifiées</p>
            </div>
            <button className="flex items-center gap-1 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-lg text-indigo-600 font-medium">
              Voir tout <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-l-lg">Client</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Service</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Employé</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Date & Heure</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Délai</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcomingReservations.map((reservation, index) => (
                  <tr 
                    key={reservation.id} 
                    className={`hover:bg-indigo-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xs mr-3 shadow-sm">
                          {`${reservation.clientFirstName[0]}${reservation.clientLastName[0]}`}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{`${reservation.clientFirstName} ${reservation.clientLastName}`}</p>
                          <p className="text-gray-500 text-xs">{reservation.clientEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        {reservation.serviceName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{reservation.employeeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reservation.formattedStartTime}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {reservation.timeRemaining}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                        reservation.status === 'CONFIRMED' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CSS pour les animations */}
        <style jsx="true">{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default StaticDashboard;