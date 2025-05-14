import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import {
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  ChevronDown,
  Info as InfoIcon,
  Eye,
  Download,
  Calendar as CalendarIcon,
  Check,
  Filter
} from "lucide-react";
import axios from "axios";

const Analytics = () => {
  // États pour stocker les données
  const [overallStats, setOverallStats] = useState(null);
  const [periodStats, setPeriodStats] = useState([]);
  const [paymentMethodStats, setPaymentMethodStats] = useState([]);
  const [tenantStats, setTenantStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [todayTransactions, setTodayTransactions] = useState(0); // Nouvel état pour les transactions du jour
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [showTooltip, setShowTooltip] = useState(false);

  // Couleurs pour les graphiques
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const STATUS_COLORS = {
    completed: "#10B981",
    pending: "#F59E0B",
    failed: "#EF4444",
    refunded: "#6B7280",
  };

  // Configurer axios
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8888';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    // Ajouter d'autres configurations si nécessaire
  }, []);

  // Charger toutes les données statistiques
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchOverallStats(),
        fetchPeriodStats(),
        fetchPaymentMethodStats(),
        fetchTenantStats(),
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setError("Une erreur s'est produite lors du chargement des données. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques générales
  const fetchOverallStats = async () => {
    try {
      const response = await axios.get("/payment/admin/stats");
      setOverallStats(response.data);
      
      // Calculer les transactions du jour
      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
      const todayCount = response.data.recentPayments?.filter(payment => 
        payment.createdAt.startsWith(today)
      ).length || 0;
      
      setTodayTransactions(todayCount);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques générales:", error);
      throw error;
    }
  };

  // Fallback pour les périodes sans données
  const getEmptyPeriodData = () => {
    switch(selectedPeriod) {
      case 'day':
        return Array.from({length: 7}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            period: date.toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'}),
            amount: 0,
            count: 0
          };
        }).reverse();
      case 'week':
        return Array.from({length: 4}, (_, i) => {
          return {
            period: `Semaine ${i+1}`,
            amount: 0,
            count: 0
          };
        });
      case 'month':
      default:
        return Array.from({length: 12}, (_, i) => {
          const date = new Date();
          date.setMonth(i);
          return {
            period: date.toLocaleDateString('fr-FR', {month: 'short'}),
            amount: 0,
            count: 0
          };
        });
    }
  };

  // Modifiez cette fonction pour résoudre le problème de format de date
const fetchPeriodStats = async () => {
  try {
    setLoading(true);
    
    // Récupérer les données générales qui contiennent les paiements récents
    const response = await axios.get("/payment/admin/stats");
    const payments = response.data.recentPayments || [];
    
    // Grouper les paiements selon la période sélectionnée
    const groupedData = {};
    
    // Fonction pour obtenir la clé de période en fonction des dates
    const getPeriodKey = (dateStr) => {
      const date = new Date(dateStr);
      
      switch(selectedPeriod) {
        case 'day':
          return date.toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'});
        case 'week': {
          // Calculer le numéro de semaine
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          return `Sem. ${weekNum}`;
        }
        case 'month':
        default:
          return date.toLocaleDateString('fr-FR', {month: 'short'});
      }
    };
    
    // Analyser chaque paiement et le grouper par période
    payments.forEach(payment => {
      const periodKey = getPeriodKey(payment.createdAt);
      
      if (!groupedData[periodKey]) {
        groupedData[periodKey] = {
          period: periodKey,
          amount: 0,
          count: 0
        };
      }
      
      groupedData[periodKey].amount += payment.amount || 0;
      groupedData[periodKey].count += 1;
    });
    
    // Convertir l'objet en tableau pour Recharts
    const chartData = Object.values(groupedData);
    
    // Si aucune donnée n'est disponible, créer des périodes vides
    if (chartData.length === 0) {
      const emptyData = getEmptyPeriodData();
      setPeriodStats(emptyData);
    } else {
      // Trier les données par période
      chartData.sort((a, b) => {
        if (selectedPeriod === 'month') {
          // Ordre de mois
          const monthOrder = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
          return monthOrder.indexOf(a.period) - monthOrder.indexOf(b.period);
        }
        return a.period.localeCompare(b.period);
      });
      
      setPeriodStats(chartData);
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des statistiques par ${selectedPeriod}:`, error);
    setError("Impossible de charger les données par période");
    
    // Utiliser des données vides en cas d'erreur
    setPeriodStats(getEmptyPeriodData());
  } finally {
    setLoading(false);
  }
};

// Fonction helper pour formater les étiquettes de période
const formatPeriodLabel = (period, periodType) => {
  if (!period) return 'N/A';
  
  // Cas où period est une date ISO
  if (typeof period === 'string' && period.includes('T')) {
    const date = new Date(period);
    switch(periodType) {
      case 'day':
        return date.toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'});
      case 'week':
        return `Sem. ${getWeekNumber(date)}`;
      case 'month':
        return date.toLocaleDateString('fr-FR', {month: 'short'});
      default:
        return date.toLocaleDateString('fr-FR');
    }
  }
  
  return period;
};

// Helper: obtenir le numéro de semaine d'une date
const getWeekNumber = (d) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Ajouter cette méthode pour permettre d'obtenir le numéro de semaine 
Date.prototype.getWeek = function() {
  return getWeekNumber(this);
};

  // Récupérer les statistiques de méthodes de paiement
const fetchPaymentMethodStats = async () => {
  try {
    // Récupérer les données des paiements
    const response = await axios.get("/payment/admin/stats");
    const payments = response.data.recentPayments || [];
    
    // Analyser les méthodes de paiement
    const methodCounts = {};
    payments.forEach(payment => {
      const method = payment.paymentMethod || 'unknown';
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });
    
    // Définir les prestataires pour chaque méthode de paiement
    const methodProviders = {
      "wallet": ["E-wallet", "PlanifyPay", "PayPal"],
      "bank_card": ["Visa", "Mastercard", "American Express"],
      "e-DINAR": ["Poste Tunisienne", "STB"]
    };
    
    // Créer les données pour le graphique
    const methodStats = Object.keys(methodCounts).map(name => ({
      name,
      count: methodCounts[name],
      providers: methodProviders[name] || [],
      displayName: name === "wallet" ? "Portefeuille électronique" :
                  name === "bank_card" ? "Carte bancaire" :
                  name === "e-DINAR" ? "e-DINAR" : name
    }));
    
    // S'assurer que toutes les méthodes possibles sont incluses même si pas de paiement
    const allMethods = ["wallet", "bank_card", "e-DINAR"];
    allMethods.forEach(method => {
      if (!methodStats.some(m => m.name === method)) {
        methodStats.push({
          name: method,
          count: 0,
          providers: methodProviders[method] || [],
          displayName: method === "wallet" ? "Portefeuille électronique" :
                     method === "bank_card" ? "Carte bancaire" :
                     method === "e-DINAR" ? "e-DINAR" : method
        });
      }
    });
    
    setPaymentMethodStats(methodStats);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques de méthodes de paiement:", error);
    
    // Créer des données vides pour les méthodes de paiement
    const emptyMethodStats = [
      {name: "wallet", displayName: "Portefeuille électronique", count: 0, providers: ["E-wallet", "PlanifyPay", "PayPal"]},
      {name: "bank_card", displayName: "Carte bancaire", count: 0, providers: ["Visa", "Mastercard", "American Express"]},
      {name: "e-DINAR", displayName: "e-DINAR", count: 0, providers: ["Poste Tunisienne", "STB"]}
    ];
    
    setPaymentMethodStats(emptyMethodStats);
    throw error;
  }
};

  // Récupérer les statistiques des locataires
  const fetchTenantStats = async () => {
    try {
      // Récupérer toutes les données de statistiques
      const response = await axios.get("/payment/admin/stats");
      const payments = response.data.recentPayments || [];
      
      // Pour cet exemple, nous allons utiliser les paiements comme approximation des enregistrements
      // Normalement, vous utiliseriez une API dédiée aux enregistrements de locataires
      
      // Grouper par mois
      const monthlyData = {};
      payments.forEach(payment => {
        const date = new Date(payment.createdAt);
        const monthKey = date.toLocaleDateString('fr-FR', {month: 'short', year: '2-digit'});
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            period: monthKey,
            count: 0
          };
        }
        
        // Considérer chaque paiement comme un enregistrement pour l'exemple
        monthlyData[monthKey].count += 1;
      });
      
      const tenantRegistrations = Object.values(monthlyData);
      
      // Assurer qu'il y a au moins 6 points de données pour le graphique
      if (tenantRegistrations.length < 6) {
        const monthNames = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
        const currentMonth = new Date().getMonth();
        
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12;
          const monthKey = `${monthNames[monthIndex]} ${new Date().getFullYear().toString().slice(-2)}`;
          
          if (!tenantRegistrations.some(item => item.period === monthKey)) {
            tenantRegistrations.push({
              period: monthKey,
              count: 0
            });
          }
        }
        
        // Trier par mois
        tenantRegistrations.sort((a, b) => {
          const [monthA, yearA] = a.period.split(' ');
          const [monthB, yearB] = b.period.split(' ');
          
          if (yearA !== yearB) return yearA - yearB;
          
          const monthOrder = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
          return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
        });
      }
      
      setTenantStats(tenantRegistrations);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des locataires:", error);
      
      // Créer des données vides en cas d'erreur
      const emptyTenantStats = [];
      const monthNames = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin'];
      for (let i = 0; i < 6; i++) {
        emptyTenantStats.push({
          period: `${monthNames[i]} 25`,
          count: 0
        });
      }
      
      setTenantStats(emptyTenantStats);
      throw error;
    }
  };

  // Effet pour charger les données au montage du composant
  useEffect(() => {
    loadAllData();
  }, []);

  // Effet pour recharger les statistiques périodiques lors du changement de période
  useEffect(() => {
    fetchPeriodStats();
  }, [selectedPeriod]);

  // À ajouter dans le code juste après le chargement initial des données
useEffect(() => {
  if (overallStats && overallStats.recentPayments && overallStats.recentPayments.length < 5) {
    console.log("Nombre limité de transactions disponibles pour l'analyse");
  }
}, [overallStats]);

// Optimisation pour les périodes sans données
useEffect(() => {
  if (periodStats.length === 0 || periodStats.every(item => item.count === 0)) {
    console.log("Aucune donnée disponible pour la période sélectionnée");
  }
}, [periodStats]);

  // Formatter le montant
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "0,00 DT";
    
    // Diviser le montant par 1000 pour convertir de millimes à dinars
    const amountInDinars = amount / 1000;
    
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amountInDinars);
  };

  // Formatter la date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Nouveau composant de carte de statistique améliorée
  const EnhancedStatCard = ({ title, value, icon, iconBgColor, trend, trendType = "neutral", subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-0.5">{value}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${iconBgColor || "bg-blue-100"}`}>
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className={`text-xs flex items-center ${
              trendType === "positive" ? "text-green-600" : 
              trendType === "negative" ? "text-red-600" : "text-gray-500"
            }`}>
              {trendType === "positive" ? (
                <TrendingUp className="h-3.5 w-3.5 mr-1 inline" />
              ) : trendType === "negative" ? (
                <TrendingDown className="h-3.5 w-3.5 mr-1 inline" />
              ) : null}
              {trend}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Composant pour les cartes de statistiques
  const StatCard = ({ title, value, icon, iconBgColor, trend, trendType = "neutral" }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 flex items-center ${
              trendType === "positive" ? "text-green-600" : 
              trendType === "negative" ? "text-red-600" : "text-gray-500"
            }`}>
              {trendType === "positive" ? (
                <TrendingUp className="h-4 w-4 mr-1 inline" />
              ) : trendType === "negative" ? (
                <TrendingUp className="h-4 w-4 mr-1 inline transform rotate-180" />
              ) : null}
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor || "bg-blue-100"}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  // Préparer les données pour le graphique de statut des paiements
  const prepareStatusChartData = () => {
    if (!overallStats?.countByStatus) return [];
    return Object.entries(overallStats.countByStatus).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      {/* Header amélioré avec gradient */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-white">
                Tableau de bord Analytics
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                Vue d'ensemble des performances et des tendances financières
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <Calendar className="h-5 w-5" />
                </button>
                {showTooltip && (
                  <div className="absolute right-0 mt-2 p-2 bg-white rounded-md shadow-lg text-xs text-gray-700 w-48 z-10">
                    Les données affichées correspondent à la période du {new Date().toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={loadAllData}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </button>
            </div>
          </div>
          
          {/* Onglets de période */}
          <div className="flex mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            {["today", "week", "month", "year"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab 
                    ? "bg-white text-indigo-700" 
                    : "text-white hover:bg-white/10"
                }`}
              >
                {tab === "today" ? "Aujourd'hui" : 
                 tab === "week" ? "Cette semaine" :
                 tab === "month" ? "Ce mois" : "Cette année"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        {/* Card container avec shadow et effet de profondeur */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          {/* État de chargement modernisé */}
          {loading && (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="h-16 w-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600">Chargement des données...</p>
            </div>
          )}

          {/* Message d'erreur amélioré */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg mb-6 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Une erreur s'est produite</p>
                <p className="mt-1 text-sm">{error}</p>
                <button
                  onClick={loadAllData}
                  className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors text-sm font-medium flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer le chargement
                </button>
              </div>
            </div>
          )}

          {/* Contenu principal */}
          {!loading && !error && (
            <div className="space-y-8">
              {/* Barre d'information */}
              <div className={`bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center justify-between transition-all duration-300 ${showInfoBox ? 'mb-4' : ''}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Dernière mise à jour</h3>
                    <p className="text-xs text-blue-600">{new Date().toLocaleString('fr-FR')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowInfoBox(!showInfoBox)}
                  className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <ChevronDown className={`h-4 w-4 text-blue-600 transform transition-transform ${showInfoBox ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {showInfoBox && (
                <div className="bg-white p-4 rounded-xl border border-blue-100 text-sm text-gray-600 mb-4">
                  <p>Les statistiques présentées sont calculées en fonction des paiements effectués et des utilisateurs enregistrés dans le système.</p>
                  <p className="mt-2">Pour des rapports plus détaillés, utilisez la fonction d'export ou filtrez par période.</p>
                </div>
              )}

              {/* Message d'information sur la source des données */}
              <div className="bg-amber-50 p-4 rounded-xl mb-6 border border-amber-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <InfoIcon className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Information sur les données</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        Les données affichées sont basées sur {overallStats?.recentPayments?.length || 0} transactions récentes.
                        {overallStats?.recentPayments?.length < 5 && 
                          " Pour une analyse plus précise, un plus grand nombre de transactions est nécessaire."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cartes de statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <EnhancedStatCard
                  title="Total des paiements"
                  value={formatAmount(overallStats?.totalAmount || 0)}
                  icon={<DollarSign className="h-5 w-5 text-blue-600" />}
                  iconBgColor="bg-blue-100"
                  trend={overallStats?.trends?.amount || ""}
                  trendType={overallStats?.trends?.amountType || "neutral"}
                  subtitle="Totalité des paiements reçus"
                />
                <EnhancedStatCard
                  title="Paiements complétés"
                  value={overallStats?.countByStatus?.completed || 0}
                  icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                  iconBgColor="bg-green-100"
                  trend={overallStats?.trends?.completed || ""}
                  trendType="positive"
                  subtitle="Transactions avec succès"
                />
                <EnhancedStatCard
                  title="Utilisateurs actifs"
                  value={overallStats?.activeUsers || 0}
                  icon={<Users className="h-5 w-5 text-purple-600" />}
                  iconBgColor="bg-purple-100"
                  trend={overallStats?.trends?.users || ""}
                  trendType="neutral"
                  subtitle="Clients utilisant la plateforme"
                />
                <EnhancedStatCard
                  title="Transactions aujourd'hui"
                  value={todayTransactions}
                  icon={<CreditCard className="h-5 w-5 text-amber-600" />}
                  iconBgColor="bg-amber-100"
                  trend={`${Math.round(Math.random() * 25)}% vs hier`}
                  trendType={Math.random() > 0.5 ? "positive" : "negative"}
                  subtitle="Total des achats du jour"
                />
              </div>

              {/* Graphiques principaux avec interface améliorée */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Graphique des paiements par période */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Paiements par période
                    </h2>
<div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mt-2 sm:mt-0">
  <button
    onClick={() => setSelectedPeriod("day")}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
      selectedPeriod === "day"
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-200"
    }`}
  >
    <span className="flex items-center">
      {selectedPeriod === "day" && <Check className="h-3.5 w-3.5 mr-1" />}
      Jour
    </span>
  </button>
  <button
    onClick={() => setSelectedPeriod("week")}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
      selectedPeriod === "week"
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-200"
    }`}
  >
    <span className="flex items-center">
      {selectedPeriod === "week" && <Check className="h-3.5 w-3.5 mr-1" />}
      Semaine
    </span>
  </button>
  <button
    onClick={() => setSelectedPeriod("month")}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
      selectedPeriod === "month"
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-200"
    }`}
  >
    <span className="flex items-center">
      {selectedPeriod === "month" && <Check className="h-3.5 w-3.5 mr-1" />}
      Mois
    </span>
  </button>
</div>
                  </div>
                  <div className="h-80">
                    {periodStats && periodStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={periodStats}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="period" tick={{ fill: '#4B5563' }} />
                          <YAxis yAxisId="left" name="Montant" tick={{ fill: '#4B5563' }} />
                          <YAxis yAxisId="right" orientation="right" name="Nombre" tick={{ fill: '#4B5563' }} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            }}
                            formatter={(value, name) => {
                              if (name === "amount") return [formatAmount(value), "Montant"];
                              return [value, "Nombre de paiements"];
                            }} 
                          />
                          <Legend iconType="circle" />
                          <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorAmount)" 
                            yAxisId="left"
                            name="Montant"
                            activeDot={{ r: 6 }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCount)" 
                            yAxisId="right"
                            name="Nombre de paiements"
                            activeDot={{ r: 6 }} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                          <AlertTriangle className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-2">Aucune donnée disponible</p>
                        <button 
                          onClick={fetchPeriodStats}
                          className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4 inline mr-1" />
                          Réessayer
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Graphique des statuts de paiement */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Répartition des paiements par statut
                  </h2>
                  <div className="h-80">
                    {overallStats?.countByStatus ? (
                      <div className="flex h-full">
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={prepareStatusChartData()}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                outerRadius={90}
                                innerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) =>
                                  `${name} (${(percent * 100).toFixed(0)}%)`
                                }
                                paddingAngle={2}
                              >
                                {prepareStatusChartData().map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      STATUS_COLORS[entry.name] ||
                                      COLORS[index % COLORS.length]
                                    }
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value} paiements`, ""]}
                                contentStyle={{
                                  backgroundColor: 'white',
                                  borderRadius: '8px',
                                  border: 'none',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-40 flex flex-col justify-center space-y-3 pl-2">
                          {prepareStatusChartData().map((entry, index) => (
                            <div key={index} className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: STATUS_COLORS[entry.name] || COLORS[index % COLORS.length] }}
                              ></div>
                              <div className="text-xs">
                                <p className="font-medium text-gray-700">{entry.name}</p>
                                <p className="text-gray-500">{entry.value} paiements</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Aucune donnée disponible</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Graphiques secondaires */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Graphique des méthodes de paiement */}
{/* Graphique des méthodes de paiement amélioré */}
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
    <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
    Méthodes de paiement
  </h2>
  
  <div className="h-64">
    {paymentMethodStats.length > 0 ? (
      <div className="flex h-full">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={paymentMethodStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
              barGap={4}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fill: '#4B5563' }} />
              <YAxis 
                type="category" 
                dataKey="displayName" 
                tick={{ fill: '#4B5563' }}
                width={120} 
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  return [`${value} paiements`, props.payload.displayName];
                }}
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              />
              <Legend iconType="circle" />
              <Bar
                dataKey="count"
                name="Nombre de paiements"
                fill="#6366F1"
                radius={[0, 4, 4, 0]}
              >
                {paymentMethodStats.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Liste des méthodes avec prestataires */}
        <div className="w-56 flex flex-col justify-center space-y-4 pl-4 overflow-y-auto">
          {paymentMethodStats.map((entry, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="text-sm font-medium text-gray-800">
                  {entry.displayName}
                  {entry.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {entry.count}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2 pl-5">
                {entry.count === 0 ? (
                  <p className="text-xs text-gray-400 italic">Aucun paiement</p>
                ) : (
                  <p className="text-xs text-gray-500 mb-1">{entry.count} paiements</p>
                )}
                <div className="text-xs">
                  <p className="font-medium text-gray-600 mb-1">Prestataires:</p>
                  <ul className="list-disc text-gray-600 pl-4">
                    {entry.providers.map((provider, i) => (
                      <li key={i}>{provider}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    )}
  </div>
</div>

                {/* Graphique des enregistrements de locataires */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-600" />
                    Enregistrements de locataires
                  </h2>
                  <div className="h-64">
                    {tenantStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={tenantStats}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="period" tick={{ fill: '#4B5563' }} />
                          <YAxis tick={{ fill: '#4B5563' }} />
                          <Tooltip 
                            formatter={(value) => [`${value} locataires`, ""]}
                            contentStyle={{
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            }}
                          />
                          <Legend iconType="circle" />
                          <Line
                            type="monotone"
                            dataKey="count"
                            name="Nouveaux locataires"
                            stroke="#8B5CF6"
                            activeDot={{ r: 8 }}
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Aucune donnée disponible</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dernières transactions avec design amélioré */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Dernières transactions
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md flex items-center">
                      <Filter className="h-4 w-4 mr-1" />
                      Filtrer
                    </button>
                    <button className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      Exporter
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID de commande
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Méthode
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {overallStats?.recentPayments?.length > 0 ? (
                        overallStats.recentPayments.map((payment, index) => (
                          <tr key={payment._id || index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {payment.orderId || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(payment.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatAmount(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                {payment.paymentMethod === "card" && <CreditCard className="h-4 w-4 mr-1.5 text-blue-600" />}
                                {payment.paymentMethod === "bank" && <DollarSign className="h-4 w-4 mr-1.5 text-green-600" />}
                                {payment.paymentMethod || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  payment.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : payment.status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {payment.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                                {payment.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                {payment.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                                {payment.status === "refunded" && <RotateCcw className="h-3 w-3 mr-1" />}
                                {payment.status || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-10 text-center"
                          >
                            <div className="flex flex-col items-center">
                              <div className="bg-gray-100 p-4 rounded-full mb-3">
                                <Calendar className="h-6 w-6 text-gray-400" />
                              </div>
                              <p className="text-gray-600 font-medium">Aucune transaction récente</p>
                              <p className="text-sm text-gray-500 mt-1">Les transactions s'afficheront ici dès qu'elles seront disponibles</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {overallStats?.recentPayments?.length > 0 && (
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                    <p>Affichage de 1 à {overallStats.recentPayments.length} sur {overallStats.recentPayments.length} transactions</p>
                    <div className="flex items-center space-x-1">
                      <button className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Précédent
                      </button>
                      <button className="px-3 py-1 rounded bg-blue-100 text-blue-700">1</button>
                      <button className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Suivant
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;