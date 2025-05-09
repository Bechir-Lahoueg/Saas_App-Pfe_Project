import React, { useState, useEffect, useRef } from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, ZAxis,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart
} from 'recharts';
import { 
  Calendar, Clock, Users, ActivitySquare, BarChart2, PieChart as PieChartIcon,
  Calendar as CalendarIcon, Clock as ClockIcon, Calendar as CalendarEvent, 
  TrendingUp, Award, Download, FileSpreadsheet, RefreshCw, Filter, ThumbsUp,
  ChevronRight, ArrowUp, ArrowDown, Settings, Zap, Info, Smile, UserCheck,
  FileText, ChevronDown, X, CheckCircle
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const DashboardContent = ({ sidebarExpanded }) => {
  // State for analytics
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // New state for date range & export
  const [dateRange, setDateRange] = useState({ 
    start: subMonths(new Date(), 1), 
    end: new Date() 
  });
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [selectedRange, setSelectedRange] = useState('last30');
  const exportMenuRef = useRef(null);

  // Couleurs personnalisées pour les graphiques - palette étendue
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
    grayDark: '#4b5563',
    text: '#1f2937',
    textLight: '#374151',
    background: '#ffffff',
    backgroundAlt: '#f9fafb',
    lightBackground: '#f3f4f6'
  };

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      setAnimate(false);
      const response = await axios.get('http://localhost:8888/booking/client/reservation/getAvailability');
      setAnalyticsData(response.data);
      setIsRefreshing(false);
      setLoading(false);
      // Déclencher les animations après le chargement
      setTimeout(() => setAnimate(true), 100);
    } catch (err) {
      setError('Failed to load analytics data');
      setIsRefreshing(false);
      setLoading(false);
      console.error('Error fetching analytics data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Les fonctions existantes pour les graphiques restent les mêmes...
  const prepareWorkingDaysData = () => {
    if (!analyticsData || !analyticsData.workingDays) return [];
    
    return analyticsData.workingDays.map(day => {
      const hours = day.timeSlots.reduce((total, slot) => {
        const start = new Date(`1970-01-01T${slot.startTime}`);
        const end = new Date(`1970-01-01T${slot.endTime}`);
        const diff = (end - start) / (1000 * 60 * 60); // hours
        return total + diff;
      }, 0);
      
      return {
        day: day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase(),
        hours: hours,
        active: day.active ? 'Active' : 'Inactive'
      };
    });
  };

  const prepareServiceData = () => {
    if (!analyticsData || !analyticsData.services) return [];
    
    return analyticsData.services.map(service => ({
      name: service.name,
      duration: service.duration,
      price: service.price,
      capacity: service.capacity,
      employeesCount: service.employees ? service.employees.length : 0
    }));
  };

  const prepareEmployeeWorkloadData = () => {
    if (!analyticsData || !analyticsData.reservations || !analyticsData.employees) return [];
    
    const workloadCounts = {};
    analyticsData.reservations.forEach(reservation => {
      workloadCounts[reservation.employeeId] = (workloadCounts[reservation.employeeId] || 0) + 1;
    });
    
    return analyticsData.employees.map(employee => ({
      name: `${employee.firstName} ${employee.lastName}`,
      reservations: workloadCounts[employee.id] || 0,
      id: employee.id,
      imageUrl: employee.imageUrl
    })).sort((a, b) => b.reservations - a.reservations);
  };

  const prepareReservationStatusData = () => {
    if (!analyticsData || !analyticsData.reservations) return [];
    
    const statusCounts = {};
    analyticsData.reservations.forEach(reservation => {
      statusCounts[reservation.status] = (statusCounts[reservation.status] || 0) + 1;
    });
    
    return Object.keys(statusCounts).map(status => ({
      status: status,
      count: statusCounts[status],
      color: status === 'CONFIRMED' ? COLORS.quaternary : status === 'PENDING' ? COLORS.warning : COLORS.gray
    }));
  };

  const prepareReservationsByServiceData = () => {
    if (!analyticsData || !analyticsData.reservations || !analyticsData.services) return [];
    
    const serviceCounts = {};
    analyticsData.reservations.forEach(reservation => {
      serviceCounts[reservation.serviceId] = (serviceCounts[reservation.serviceId] || 0) + 1;
    });
    
    return analyticsData.services.map(service => ({
      name: service.name,
      count: serviceCounts[service.id] || 0,
      price: service.price,
      duration: service.duration
    })).sort((a, b) => b.count - a.count);
  };

  const prepareReservationsByDayData = () => {
    if (!analyticsData || !analyticsData.reservations) return [];
    
    const dayCounts = {
      'Lundi': 0,
      'Mardi': 0,
      'Mercredi': 0,
      'Jeudi ': 0,
      'Vendredi': 0,
      'Samedi': 0,
      'Dimanche': 0
    };

    analyticsData.reservations.forEach(reservation => {
      const date = new Date(reservation.startTime);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    
    return Object.entries(dayCounts).map(([day, count]) => ({
      day,
      count
    }));
  };

  const prepareReservationTimeDistribution = () => {
    if (!analyticsData || !analyticsData.reservations) return [];
    
    const hourCounts = {};
    analyticsData.reservations.forEach(reservation => {
      const date = new Date(reservation.startTime);
      const hour = date.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: hourCounts[i] || 0,
      label: `${i}:00`
    }));
  };

  const getServiceNameById = (id) => {
    if (!analyticsData || !analyticsData.services) return "Unknown Service";
    const service = analyticsData.services.find(s => s.id === id);
    return service ? service.name : "Unknown Service";
  };
  
  const getEmployeeNameById = (id) => {
    if (!analyticsData || !analyticsData.employees) return "Unknown Employee";
    const employee = analyticsData.employees.find(e => e.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown Employee";
  };

  const getUpcomingReservations = () => {
    if (!analyticsData || !analyticsData.reservations) return [];
    
    const now = new Date();
    return analyticsData.reservations
      .filter(res => new Date(res.startTime) > now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5)
      .map(res => ({
        ...res,
        serviceName: getServiceNameById(res.serviceId),
        employeeName: getEmployeeNameById(res.employeeId),
        formattedStartTime: new Date(res.startTime).toLocaleString(),
        timeRemaining: getTimeRemaining(res.startTime)
      }));
  };

  // Nouvelle fonction pour calculer le temps restant
  const getTimeRemaining = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = date - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}j ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${minutes}min`;
    }
  };

  const getActiveTabClass = (tab) => {
    return activeTab === tab 
      ? "bg-indigo-100 text-indigo-700 font-medium border-b-2 border-indigo-500" 
      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-500 transition-all";
  };

  // Nouvelles fonction pour les stats générales
  const getGeneralStats = () => {
    if (!analyticsData) return {};

    const totalReservations = analyticsData.reservations?.length || 0;
    const confirmedCount = analyticsData.reservations?.filter(r => r.status === 'CONFIRMED').length || 0;
    const pendingCount = analyticsData.reservations?.filter(r => r.status === 'PENDING').length || 0;

    const uniqueClients = new Set();
    analyticsData.reservations?.forEach(r => uniqueClients.add(r.clientEmail));

    // Déterminer le service le plus réservé
    const serviceCounts = {};
    analyticsData.reservations?.forEach(r => {
      serviceCounts[r.serviceId] = (serviceCounts[r.serviceId] || 0) + 1;
    });
    
    let mostBookedServiceId = null;
    let maxBookings = 0;
    for (const [serviceId, count] of Object.entries(serviceCounts)) {
      if (count > maxBookings) {
        mostBookedServiceId = Number(serviceId);
        maxBookings = count;
      }
    }

    const mostBookedService = analyticsData.services?.find(s => s.id === mostBookedServiceId);
    
    return {
      totalReservations,
      confirmedCount, 
      pendingCount,
      uniqueClientCount: uniqueClients.size,
      confirmationRate: totalReservations ? Math.round((confirmedCount / totalReservations) * 100) : 0,
      mostBookedService: mostBookedService ? {
        name: mostBookedService.name,
        bookings: maxBookings
      } : null
    };
  };

  const stats = getGeneralStats();
  
  // Calculer le total des revenus potentiels
  const calculatePotentialRevenue = () => {
    if (!analyticsData || !analyticsData.reservations || !analyticsData.services) return 0;
    
    return analyticsData.reservations
      .filter(r => r.status === 'CONFIRMED')
      .reduce((total, reservation) => {
        const service = analyticsData.services.find(s => s.id === reservation.serviceId);
        return total + (service ? service.price : 0);
      }, 0);
  };

  const potentialRevenue = calculatePotentialRevenue();

  const getConfirmationRate = () => {
    if (!analyticsData || !analyticsData.reservations || analyticsData.reservations.length === 0) return 0;
    
    const totalReservations = analyticsData.reservations.length;
    const confirmedReservations = analyticsData.reservations.filter(r => r.status === 'CONFIRMED').length;
    
    return Math.round((confirmedReservations / totalReservations) * 100);
  };

  const getReservationStats = () => {
    if (!analyticsData || !analyticsData.reservations) {
      return { total: 0, confirmed: 0, pending: 0 };
    }
    
    const total = analyticsData.reservations.length;
    const confirmed = analyticsData.reservations.filter(r => r.status === 'CONFIRMED').length;
    const pending = analyticsData.reservations.filter(r => r.status === 'PENDING').length;
    
    return { total, confirmed, pending };
  };

  const reservationStats = getReservationStats();

  const ConfirmationRateCard = () => (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 transform transition-transform hover:scale-[1.01]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <div className="bg-indigo-100 p-2 sm:p-2.5 rounded-xl">
            <UserCheck className="text-indigo-600" size={20} />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Taux de confirmation</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{getConfirmationRate()}%</p>
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

  // Handle outside click for export menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setIsExportMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exportMenuRef]);
  
  // Show success message briefly when export completes
  useEffect(() => {
    if (exportSuccess) {
      const timer = setTimeout(() => setExportSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [exportSuccess]);

  const fetchDataWithFilters = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      setAnimate(false);
      
      // Include date range in the request
      const startDate = format(dateRange.start, 'yyyy-MM-dd');
      const endDate = format(dateRange.end, 'yyyy-MM-dd');
      
      const response = await axios.get(`http://localhost:8888/booking/client/reservation/getAvailability?startDate=${startDate}&endDate=${endDate}`);
      setAnalyticsData(response.data);
      
      setIsRefreshing(false);
      setLoading(false);
      setTimeout(() => setAnimate(true), 100);
    } catch (err) {
      setError('Failed to load analytics data');
      setIsRefreshing(false);
      setLoading(false);
      console.error('Error fetching analytics data:', err);
    }
  };
  
  // Handle date range selection
  const handleDateRangeChange = (rangeType) => {
    let start, end = new Date();
    
    switch(rangeType) {
      case 'today':
        start = new Date();
        break;
      case 'last7':
        start = subMonths(new Date(), 0.25); // Approx 7 days
        break;
      case 'last30':
        start = subMonths(new Date(), 1);
        break;
      case 'thisMonth':
        start = startOfMonth(new Date());
        break;
      case 'lastMonth':
        start = startOfMonth(subMonths(new Date(), 1));
        end = endOfMonth(subMonths(new Date(), 1));
        break;
      case 'thisYear':
        start = startOfYear(new Date());
        break;
      case 'allTime':
        start = new Date(2020, 0, 1); // Set a reasonable "all time" start date
        break;
      default:
        start = subMonths(new Date(), 1);
    }
    
    setDateRange({ start, end });
    setSelectedRange(rangeType);
    setIsDatePickerOpen(false);
    
    // Refetch data with new date range
    fetchDataWithFilters();
  };
  
  // Format date for display
  const formatDateDisplay = () => {
    if (selectedRange === 'custom') {
      return `${format(dateRange.start, 'dd/MM/yyyy')} - ${format(dateRange.end, 'dd/MM/yyyy')}`;
    }
    
    switch(selectedRange) {
      case 'today': return "Aujourd'hui";
      case 'last7': return "7 derniers jours";
      case 'last30': return "30 derniers jours";
      case 'thisMonth': return "Ce mois";
      case 'lastMonth': return "Mois dernier";
      case 'thisYear': return "Cette année";
      case 'allTime': return "Tout l'historique";
      default: return "30 derniers jours";
    }
  };
  
  // Export functions
  const generateCSV = () => {
    try {
      setExporting(true);
      
      // Helper to create worksheet data
      const prepareData = () => {
        if (!analyticsData || !analyticsData.reservations) return [["Aucune donnée"]];
        
        // Header row
        const header = ["ID", "Client", "Email", "Service", "Employé", "Date", "Heure", "Status", "Prix"];
        
        // Data rows
        const dataRows = analyticsData.reservations.map(res => {
          const service = analyticsData.services.find(s => s.id === res.serviceId) || {};
          const date = new Date(res.startTime);
          
          return [
            res.id,
            `${res.clientFirstName} ${res.clientLastName}`,
            res.clientEmail,
            service.name || "N/A",
            getEmployeeNameById(res.employeeId),
            format(date, 'dd/MM/yyyy'),
            format(date, 'HH:mm'),
            res.status,
            `${service.price || 0} DT`
          ];
        });
        
        return [header, ...dataRows];
      };
      
      const data = prepareData();
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Réservations");
      
      // Generate filename with date range
      const filename = `Reservations_${format(dateRange.start, 'yyyyMMdd')}_${format(dateRange.end, 'yyyyMMdd')}.xlsx`;
      
      // Export file
      XLSX.writeFile(wb, filename);
      
      setExporting(false);
      setExportSuccess(true);
      setIsExportMenuOpen(false);
    } catch (err) {
      console.error('Export error:', err);
      setExporting(false);
    }
  };
  
  const generatePDF = () => {
    try {
      setExporting(true);
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text("Rapport de Réservations", 105, 15, { align: "center" });
      
      // Add date range
      doc.setFontSize(12);
      doc.text(`Période: ${format(dateRange.start, 'dd/MM/yyyy')} - ${format(dateRange.end, 'dd/MM/yyyy')}`, 105, 25, { align: "center" });
      
      // Add stats summary
      doc.setFontSize(14);
      doc.text("Résumé", 14, 40);
      
      const stats = [
        ["Réservations totales", analyticsData?.reservations?.length || 0],
        ["Confirmées", stats.confirmedCount || 0],
        ["En attente", stats.pendingCount || 0],
        ["Clients uniques", stats.uniqueClientCount || 0],
        ["Taux de confirmation", `${stats.confirmationRate || 0}%`],
        ["Revenu potentiel", `${potentialRevenue} DT`]
      ];
      
      doc.autoTable({
        startY: 45,
        head: [["Métrique", "Valeur"]],
        body: stats,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }
      });
      
      // Add reservations table
      if (analyticsData?.reservations?.length > 0) {
        doc.setFontSize(14);
        doc.text("Détails des Réservations", 14, doc.previousAutoTable.finalY + 20);
        
        const reservationsData = analyticsData.reservations.map(res => {
          const date = new Date(res.startTime);
          return [
            `${res.clientFirstName} ${res.clientLastName}`,
            getServiceNameById(res.serviceId),
            format(date, 'dd/MM/yyyy HH:mm'),
            res.status
          ];
        });
        
        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 25,
          head: [["Client", "Service", "Date & Heure", "Statut"]],
          body: reservationsData,
          theme: 'striped',
          headStyles: { fillColor: [79, 70, 229] }
        });
      }
      
      // Generate filename with date range
      const filename = `Rapport_${format(dateRange.start, 'yyyyMMdd')}_${format(dateRange.end, 'yyyyMMdd')}.pdf`;
      
      // Save file
      doc.save(filename);
      
      setExporting(false);
      setExportSuccess(true);
      setIsExportMenuOpen(false);
    } catch (err) {
      console.error('Export error:', err);
      setExporting(false);
    }
  };
  
  const generateServiceReport = () => {
    try {
      setExporting(true);
      
      // Prepare service report data
      const serviceData = prepareReservationsByServiceData();
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Service summary sheet
      const summaryData = [
        ["Service", "Réservations", "Prix (DT)", "Durée (min)", "Revenu estimé (DT)"]
      ];
      
      serviceData.forEach(service => {
        summaryData.push([
          service.name,
          service.count,
          service.price,
          service.duration,
          service.price * service.count
        ]);
      });
      
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, "Résumé Services");
      
      // Generate filename with date range
      const filename = `Services_${format(dateRange.start, 'yyyyMMdd')}_${format(dateRange.end, 'yyyyMMdd')}.xlsx`;
      
      // Export file
      XLSX.writeFile(wb, filename);
      
      setExporting(false);
      setExportSuccess(true);
      setIsExportMenuOpen(false);
    } catch (err) {
      console.error('Export error:', err);
      setExporting(false);
    }
  };
  
  // Update initial data fetch to use the date filtering
  useEffect(() => {
    fetchDataWithFilters();
  }, []);

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
          
          {/* Controls - Enhanced with date range and export */}
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            {/* Date Range Selector */}
            <div className="relative">
  <button 
    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 transition-colors text-white group"
    aria-expanded={isDatePickerOpen}
    aria-haspopup="true"
  >
    <Calendar size={16} className="group-hover:animate-pulse" />
    <span>{formatDateDisplay()}</span>
    <ChevronDown size={14} className={`transition-transform duration-300 ${isDatePickerOpen ? 'rotate-180' : ''}`} />
  </button>
  
  {isDatePickerOpen && (
  <div 
    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl z-30 border border-gray-200 overflow-hidden animate-fadeIn"
    style={{transform: 'translateY(0)', opacity: 1, transition: 'all 0.2s ease-out'}}
  >
    <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
      <h3 className="font-medium text-gray-700">Sélectionner une période</h3>
      <button 
        onClick={() => setIsDatePickerOpen(false)} 
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
      >
        <X size={16} />
      </button>
    </div>
    
    <div className="p-2 max-h-80 overflow-y-auto text-gray-800">
      <div className="mb-2 px-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Périodes rapides</p>
      </div>
      
      <button 
        onClick={() => handleDateRangeChange('today')}
        className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center ${selectedRange === 'today' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
      >
        <span className="mr-3 p-1.5 bg-blue-100 rounded-md">
          <Calendar size={15} className="text-blue-600" />
        </span>
        Aujourd'hui
      </button>
      
      <button 
        onClick={() => handleDateRangeChange('last7')}
        className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center ${selectedRange === 'last7' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
      >
        <span className="mr-3 p-1.5 bg-indigo-100 rounded-md">
          <Calendar size={15} className="text-indigo-600" />
        </span>
        7 derniers jours
      </button>
        
        <button 
          onClick={() => handleDateRangeChange('last30')}
          className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center ${selectedRange === 'last30' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
        >
          <span className="mr-3 p-1.5 bg-violet-100 rounded-md">
            <Calendar size={15} className="text-violet-600" />
          </span>
          30 derniers jours
        </button>
        
        <div className="my-2 border-t border-gray-100"></div>
        <div className="mb-2 px-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Périodes courantes</p>
        </div>
        
        <button 
          onClick={() => handleDateRangeChange('thisMonth')}
          className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center ${selectedRange === 'thisMonth' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
        >
          <span className="mr-3 p-1.5 bg-green-100 rounded-md">
            <Calendar size={15} className="text-green-600" />
          </span>
          Ce mois-ci
        </button>
        
        <button 
          onClick={() => handleDateRangeChange('lastMonth')}
          className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center ${selectedRange === 'lastMonth' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
        >
          <span className="mr-3 p-1.5 bg-emerald-100 rounded-md">
            <Calendar size={15} className="text-emerald-600" />
          </span>
          Mois dernier
        </button>
        
        <button 
          onClick={() => handleDateRangeChange('thisYear')}
          className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center ${selectedRange === 'thisYear' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
        >
          <span className="mr-3 p-1.5 bg-amber-100 rounded-md">
            <Calendar size={15} className="text-amber-600" />
          </span>
          Cette année
        </button>
        
        <button 
          onClick={() => handleDateRangeChange('allTime')}
          className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center ${selectedRange === 'allTime' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
        >
          <span className="mr-3 p-1.5 bg-rose-100 rounded-md">
            <Calendar size={15} className="text-rose-600" />
          </span>
          Tout l'historique
        </button>
        
        {/* Ajouter une section de date personnalisée si nécessaire */}
        <div className="my-2 border-t border-gray-100"></div>
        <div className="p-3">
          <div className="bg-gray-50 p-2 rounded-lg text-xs text-gray-500 flex items-center">
            <Info size={14} className="mr-1.5 text-gray-400 flex-shrink-0" /> 
            <span>Période actuelle: {format(dateRange.start, 'dd MMMM yyyy', { locale: fr })} - {format(dateRange.end, 'dd MMMM yyyy', { locale: fr })}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button 
          onClick={() => {
            setIsDatePickerOpen(false);
            fetchDataWithFilters();
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          <RefreshCw size={14} className="mr-1.5" />
          Appliquer
        </button>
      </div>
    </div>
  )}
</div>
            
            {/* Refresh Button */}
            <button 
              onClick={fetchDataWithFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              <span>Actualiser</span>
            </button>
            
            {/* Export Button with Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button 
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 transition-colors text-white"
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white/80 rounded-full border-t-transparent mr-1"></div>
                    <span>Export en cours...</span>
                  </>
                ) : exportSuccess ? (
                  <>
                    <CheckCircle size={16} className="text-green-400" />
                    <span>Exporté avec succès</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Exporter</span>
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
              
              {isExportMenuOpen && !exporting && !exportSuccess && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl z-30 border border-gray-200 overflow-hidden">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-700">Exporter les données</h3>
                    <p className="text-xs text-gray-500 mt-1">Choisissez un format</p>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={generateCSV}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm rounded-lg flex items-center gap-2"
                    >
                      <FileSpreadsheet size={16} className="text-green-600" />
                      <div>
                        <p className="font-medium">Excel / CSV</p>
                        <p className="text-xs text-gray-500">Données complètes des réservations</p>
                      </div>
                    </button>
                    <button 
                      onClick={generatePDF}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm rounded-lg flex items-center gap-2"
                    >
<FileText size={16} className="text-red-600" />                      <div>
                        <p className="font-medium">PDF</p>
                        <p className="text-xs text-gray-500">Rapport statistique avec graphiques</p>
                      </div>
                    </button>
                    <button 
                      onClick={generateServiceReport}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm rounded-lg flex items-center gap-2"
                    >
                      <FileText size={16} className="text-indigo-600" />
                      <div>
                        <p className="font-medium">Rapport des services</p>
                        <p className="text-xs text-gray-500">Analyse détaillée par service</p>
                      </div>
                    </button>
                    <div className="border-t border-gray-100 my-1 px-4 py-2">
                      <p className="text-xs text-gray-500">
                        Période: {format(dateRange.start, 'dd/MM/yyyy')} - {format(dateRange.end, 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide mt-4 gap-1">
            <button 
              className={`px-4 py-2 rounded-t-lg transition-all ${getActiveTabClass('overview')}`}
              onClick={() => setActiveTab('overview')}
            >
              Vue d'ensemble
            </button>
            <button 
              className={`px-4 py-2 rounded-t-lg transition-all ${getActiveTabClass('services')}`}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
            <button 
              className={`px-4 py-2 rounded-t-lg transition-all ${getActiveTabClass('employees')}`}
              onClick={() => setActiveTab('employees')}
            >
              Employés
            </button>
            <button 
              className={`px-4 py-2 rounded-t-lg transition-all ${getActiveTabClass('reservations')}`}
              onClick={() => setActiveTab('reservations')}
            >
              <div className="flex items-center gap-1.5">
                Réservations
                {stats.pendingCount > 0 && (
                  <span className="bg-amber-400 text-amber-900 text-xs font-medium px-2 py-0.5 rounded-full">
                    {stats.pendingCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 bg-white rounded-2xl shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Chargement des données analytiques...</p>
            <p className="text-gray-400 text-sm mt-2">Veuillez patienter quelques instants</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-8 rounded-2xl text-red-600 flex flex-col items-center justify-center shadow-md">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="font-medium text-xl mb-2">Une erreur est survenue</p>
            <p className="text-center mb-6">{error}</p>
            <button 
              onClick={fetchData} 
              className="px-5 py-2.5 bg-red-100 hover:bg-red-200 border border-red-300 rounded-xl text-red-700 hover:text-red-800 font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Réessayer
            </button>
          </div>
        ) : (
          <>
            {/* Cartes de statistiques principales améliorées */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8 ${animate ? 'animate-fadeIn' : ''}`}>
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
                  {analyticsData?.workingDays?.filter(d => d.active).length || 0}
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
                  {analyticsData?.services?.length || 0}
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
                  {analyticsData?.employees?.length || 0}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Employés actifs</p>
              </div>
            </div>

            {/* Taux de confirmation et Service le plus populaire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Taux de confirmation */}
              <ConfirmationRateCard />

              {/* Service le plus populaire */}
              {stats.mostBookedService && (
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
              )}
            </div>

            {/* Graphiques principaux - Layout principal à 2 colonnes avec design amélioré */}
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
                    <BarChart data={prepareReservationsByServiceData()}>
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
                    <BarChart data={prepareReservationsByDayData()}>
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

            {/* Deuxième rangée de graphiques avec design amélioré */}
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
                          data={prepareReservationStatusData()}
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
                          {prepareReservationStatusData().map((entry, index) => (
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
                  {prepareReservationStatusData().map((status, index) => (
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
                    <BarChart data={prepareWorkingDaysData()}>
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
                    <AreaChart data={prepareReservationTimeDistribution()}>
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

            {/* Troisième rangée - Graphiques spécifiques avec design amélioré */}          
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
                    <ComposedChart data={prepareServiceData()}>
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
                      data={prepareEmployeeWorkloadData()}
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

            {/* Section Réservations à venir avec un design encore plus amélioré */}
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
                {getUpcomingReservations().length > 0 ? (
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
                      {getUpcomingReservations().map((reservation, index) => (
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
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <Calendar className="text-indigo-600 h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Aucune réservation à venir</h3>
                    <p className="text-gray-500 text-sm max-w-md text-center">
                      Il n'y a pas de réservations planifiées pour le moment. Les nouvelles réservations apparaîtront ici.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;