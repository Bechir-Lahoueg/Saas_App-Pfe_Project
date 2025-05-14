import React, { useState, useEffect, useRef } from "react";
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
  Line
} from "recharts";
import {
  Calendar,
  RefreshCw,
  Download,
  FileText,
  Filter,
  Printer,
  ChevronDown,
  AlertTriangle,
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Users
} from "lucide-react";
import axios from "axios";
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Invoice = () => {
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
  const [exportType, setExportType] = useState("financial"); // financial, payments, users
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const printRef = useRef();

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
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques générales:", error);
      // Utiliser des données mockées en cas d'erreur
      setOverallStats({
        totalAmount: 12500000, // 12,500 DT en millimes
        countByStatus: {
          completed: 85,
          pending: 12,
          failed: 5,
          refunded: 3
        },
        recentPayments: generateMockPayments(10)
      });
      throw error;
    }
  };

  // Générer des paiements mockés pour des tests
  const generateMockPayments = (count) => {
    const statuses = ["completed", "pending", "failed", "refunded"];
    const methods = ["card", "bank", "e-DINAR", "wallet"];
    
    return Array.from({ length: count }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      return {
        _id: `mock-payment-${i}`,
        orderId: `ORD-${1000 + i}`,
        createdAt: date.toISOString(),
        amount: Math.floor(Math.random() * 500000) + 50000, // 50-550 DT en millimes
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentMethod: methods[Math.floor(Math.random() * methods.length)],
        customer: `Client ${i + 1}`,
        service: `Service ${Math.floor(Math.random() * 3) + 1}`
      };
    });
  };

  const fetchPeriodStats = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get("/payment/admin/stats");
      const payments = response.data.recentPayments || [];
      
      // Grouper les paiements selon la période sélectionnée
      const groupedData = groupPaymentsByPeriod(payments);
      setPeriodStats(groupedData);
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques par ${selectedPeriod}:`, error);
      // Utiliser des données mockées
      setPeriodStats(generateMockPeriodStats());
    } finally {
      setLoading(false);
    }
  };

  // Grouper les paiements par période
  const groupPaymentsByPeriod = (payments) => {
    const groupedData = {};
    
    payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      let periodKey;
      
      switch(selectedPeriod) {
        case 'day':
          periodKey = date.toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'});
          break;
        case 'week': {
          const weekNum = getWeekNumber(date);
          periodKey = `Sem. ${weekNum}`;
          break;
        }
        case 'month':
        default:
          periodKey = date.toLocaleDateString('fr-FR', {month: 'short'});
          break;
      }
      
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
    
    return Object.values(groupedData);
  };

  // Générer des statistiques mockées par période
  const generateMockPeriodStats = () => {
    switch(selectedPeriod) {
      case 'day':
        return Array.from({length: 7}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            period: date.toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'}),
            amount: Math.floor(Math.random() * 1000000) + 100000,
            count: Math.floor(Math.random() * 10) + 1
          };
        }).reverse();
      case 'week':
        return Array.from({length: 4}, (_, i) => {
          return {
            period: `Sem. ${i+1}`,
            amount: Math.floor(Math.random() * 2000000) + 500000,
            count: Math.floor(Math.random() * 20) + 5
          };
        });
      case 'month':
      default:
        return Array.from({length: 12}, (_, i) => {
          const date = new Date();
          date.setMonth(i);
          return {
            period: date.toLocaleDateString('fr-FR', {month: 'short'}),
            amount: Math.floor(Math.random() * 5000000) + 1000000,
            count: Math.floor(Math.random() * 50) + 10
          };
        });
    }
  };

  // Helper: obtenir le numéro de semaine d'une date
  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Récupérer les statistiques de méthodes de paiement
  const fetchPaymentMethodStats = async () => {
    try {
      const response = await axios.get("/payment/admin/stats");
      const payments = response.data.recentPayments || [];
      
      const methodStats = analyzePaymentMethods(payments);
      setPaymentMethodStats(methodStats);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques de méthodes de paiement:", error);
      setPaymentMethodStats(generateMockPaymentMethodStats());
    }
  };

  // Analyser les méthodes de paiement à partir des paiements
  const analyzePaymentMethods = (payments) => {
    const methodCounts = {};
    payments.forEach(payment => {
      const method = payment.paymentMethod || 'unknown';
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });
    
    const methodProviders = {
      "wallet": ["E-wallet", "PlanifyPay", "PayPal"],
      "card": ["Visa", "Mastercard", "American Express"],
      "e-DINAR": ["Poste Tunisienne", "STB"]
    };
    
    return Object.keys(methodCounts).map(name => ({
      name,
      count: methodCounts[name],
      providers: methodProviders[name] || [],
      displayName: name === "wallet" ? "Portefeuille électronique" :
                  name === "card" ? "Carte bancaire" :
                  name === "e-DINAR" ? "e-DINAR" : name
    }));
  };

  // Générer des statistiques mockées pour les méthodes de paiement
  const generateMockPaymentMethodStats = () => {
    return [
      {name: "wallet", displayName: "Portefeuille électronique", count: 45, providers: ["E-wallet", "PlanifyPay", "PayPal"]},
      {name: "card", displayName: "Carte bancaire", count: 78, providers: ["Visa", "Mastercard", "American Express"]},
      {name: "e-DINAR", displayName: "e-DINAR", count: 23, providers: ["Poste Tunisienne", "STB"]}
    ];
  };

  // Récupérer les statistiques des locataires
  const fetchTenantStats = async () => {
    try {
      const response = await axios.get("/payment/admin/stats");
      const payments = response.data.recentPayments || [];
      
      const monthlyData = groupTenantsByMonth(payments);
      setTenantStats(monthlyData);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des locataires:", error);
      setTenantStats(generateMockTenantStats());
    }
  };

  // Grouper les locataires par mois
  const groupTenantsByMonth = (payments) => {
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
    
    return Object.values(monthlyData);
  };

  // Générer des statistiques mockées pour les locataires
  const generateMockTenantStats = () => {
    const monthNames = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin'];
    return monthNames.map((month, i) => ({
      period: `${month} ${new Date().getFullYear().toString().slice(-2)}`,
      count: Math.floor(Math.random() * 20) + 5
    }));
  };

  // Effet pour charger les données au montage du composant
  useEffect(() => {
    loadAllData();
  }, []);

  // Effet pour recharger les statistiques périodiques lors du changement de période
  useEffect(() => {
    fetchPeriodStats();
  }, [selectedPeriod]);

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

  // Formatter la date pour les exports (sans heure)
  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  };

  // Préparer les données pour le graphique de statut des paiements
  const prepareStatusChartData = () => {
    if (!overallStats?.countByStatus) return [];
    return Object.entries(overallStats.countByStatus).map(([name, value]) => ({ name, value }));
  };

  // Gérer l'impression du rapport
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Rapport-${exportType}-${new Date().toLocaleDateString('fr-FR')}`,
    onAfterPrint: () => console.log('Impression terminée')
  });

  // Générer le nom du fichier pour l'export
  const getExportFileName = () => {
    const today = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
    let periodStr = '';
    
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate).toLocaleDateString('fr-FR');
      const end = new Date(dateRange.endDate).toLocaleDateString('fr-FR');
      periodStr = `_${start}_a_${end}`;
    }
    
    return `Rapport_${exportType}${periodStr}_${today}`;
  };

  // Exporter les données en CSV
  const exportToCSV = () => {
    let csvContent = "";
    let filename = getExportFileName();
    
    switch(exportType) {
      case 'financial':
        csvContent = "Période,Montant Total,Nombre de Transactions\n";
        csvContent += periodStats.map(stat => 
          `"${stat.period}","${formatAmount(stat.amount).replace(/\s/g, '')}","${stat.count}"`
        ).join("\n");
        filename += "_finances.csv";
        break;
        
      case 'payments':
        if (!overallStats?.recentPayments) {
          alert("Aucune donnée de paiement disponible.");
          return;
        }
        
        csvContent = "ID,Date,Montant,Méthode,Statut\n";
        csvContent += overallStats.recentPayments.map(payment => 
          `"${payment.orderId || 'N/A'}","${formatDate(payment.createdAt)}","${formatAmount(payment.amount).replace(/\s/g, '')}","${payment.paymentMethod || 'N/A'}","${payment.status || 'N/A'}"`
        ).join("\n");
        filename += "_paiements.csv";
        break;
        
      case 'users':
        csvContent = "Période,Nombre d'Utilisateurs\n";
        csvContent += tenantStats.map(stat => 
          `"${stat.period}","${stat.count}"`
        ).join("\n");
        filename += "_utilisateurs.csv";
        break;
        
      default:
        alert("Type d'export non reconnu.");
        return;
    }
    
    // Créer et télécharger le fichier CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exporter les données en PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const filename = getExportFileName() + '.pdf';
    
    // Ajouter le titre
    doc.setFontSize(18);
    doc.text('PlanifyGo - Rapport Financier', 105, 15, { align: 'center' });
    
    // Ajouter la date d'export
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 105, 22, { align: 'center' });
    
    // Ajouter la période si spécifiée
    if (dateRange.startDate && dateRange.endDate) {
      doc.text(`Période: du ${formatDateShort(dateRange.startDate)} au ${formatDateShort(dateRange.endDate)}`, 105, 28, { align: 'center' });
    }
    
    doc.line(20, 30, 190, 30);
    
    switch(exportType) {
      case 'financial':
        // Résumé financier
        if (overallStats) {
          doc.setFontSize(14);
          doc.text('Résumé Financier', 20, 40);
          
          doc.setFontSize(10);
          doc.text(`Total des paiements: ${formatAmount(overallStats.totalAmount || 0)}`, 20, 50);
          doc.text(`Paiements complétés: ${overallStats.countByStatus?.completed || 0}`, 20, 56);
          doc.text(`Paiements en attente: ${overallStats.countByStatus?.pending || 0}`, 20, 62);
          doc.text(`Paiements échoués: ${overallStats.countByStatus?.failed || 0}`, 20, 68);
          
          // Tableau des statistiques par période
          doc.setFontSize(14);
          doc.text('Statistiques par Période', 20, 80);
          
          const periodData = periodStats.map(stat => [
            stat.period, 
            formatAmount(stat.amount), 
            stat.count.toString()
          ]);
          
          doc.autoTable({
            startY: 85,
            head: [['Période', 'Montant Total', 'Nombre de Transactions']],
            body: periodData,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [63, 81, 181], textColor: 255 }
          });
        }
        break;
        
      case 'payments':
        if (overallStats?.recentPayments) {
          doc.setFontSize(14);
          doc.text('Détail des Paiements Récents', 20, 40);
          
          const paymentData = overallStats.recentPayments.map(payment => [
            payment.orderId || 'N/A',
            formatDate(payment.createdAt),
            formatAmount(payment.amount),
            payment.paymentMethod || 'N/A',
            payment.status || 'N/A'
          ]);
          
          doc.autoTable({
            startY: 45,
            head: [['ID', 'Date', 'Montant', 'Méthode', 'Statut']],
            body: paymentData,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [63, 81, 181], textColor: 255 }
          });
          
          // Résumé des méthodes de paiement
          const methodY = doc.autoTable.previous.finalY + 10;
          doc.setFontSize(14);
          doc.text('Répartition par Méthode de Paiement', 20, methodY);
          
          const methodData = paymentMethodStats.map(method => [
            method.displayName,
            method.count.toString(),
            ((method.count / overallStats.recentPayments.length) * 100).toFixed(1) + '%'
          ]);
          
          doc.autoTable({
            startY: methodY + 5,
            head: [['Méthode', 'Nombre', 'Pourcentage']],
            body: methodData,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [76, 175, 80], textColor: 255 }
          });
        }
        break;
        
      case 'users':
        doc.setFontSize(14);
        doc.text('Évolution des Utilisateurs', 20, 40);
        
        const userData = tenantStats.map(stat => [
          stat.period,
          stat.count.toString()
        ]);
        
        doc.autoTable({
          startY: 45,
          head: [['Période', 'Nombre d\'Utilisateurs']],
          body: userData,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [156, 39, 176], textColor: 255 }
        });
        break;
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} sur ${pageCount} - PlanifyGo - Confidentiel`, 105, 290, { align: 'center' });
    }
    
    // Sauvegarder le PDF
    doc.save(filename);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-tight text-white">
                Exportation de Rapports
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                Générez et téléchargez les rapports financiers et statistiques
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button
                onClick={loadAllData}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* États: chargement, erreur */}
        {loading && (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-md">
            <div className="h-16 w-16 relative">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Chargement des données...</p>
          </div>
        )}

        {error && !loading && (
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

        {!loading && !error && (
          <div className="space-y-6">
            {/* Options d'export */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Options d'exportation</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center font-medium text-sm transition-colors"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer par date
                    <ChevronDown className={`h-4 w-4 ml-1 transform transition-transform ${showDateFilter ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* Filtre par date */}
              {showDateFilter && (
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setDateRange({ startDate: "", endDate: "" })}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-2"
                    >
                      Réinitialiser
                    </button>
                    <button
                      onClick={() => setShowDateFilter(false)}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              )}
              
              {/* Types de rapports */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setExportType('financial')}
                  className={`p-4 rounded-lg flex flex-col items-center transition-colors ${
                    exportType === 'financial' 
                      ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700' 
                      : 'bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <DollarSign className={`h-8 w-8 mb-2 ${exportType === 'financial' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <span className="font-medium">Rapport Financier</span>
                  <span className="text-xs text-center mt-1">Analyse des revenus et transactions</span>
                </button>
                
                <button
                  onClick={() => setExportType('payments')}
                  className={`p-4 rounded-lg flex flex-col items-center transition-colors ${
                    exportType === 'payments' 
                      ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700' 
                      : 'bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <CreditCard className={`h-8 w-8 mb-2 ${exportType === 'payments' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <span className="font-medium">Détail des Paiements</span>
                  <span className="text-xs text-center mt-1">Liste des transactions et statuts</span>
                </button>
                
                <button
                  onClick={() => setExportType('users')}
                  className={`p-4 rounded-lg flex flex-col items-center transition-colors ${
                    exportType === 'users' 
                      ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700' 
                      : 'bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Users className={`h-8 w-8 mb-2 ${exportType === 'users' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <span className="font-medium">Statistiques Utilisateurs</span>
                  <span className="text-xs text-center mt-1">Évolution et analyse des locataires</span>
                </button>
              </div>
              
              {/* Actions d'export */}
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-medium transition-colors"
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Imprimer le rapport
                </button>
                
                <button
                  onClick={exportToCSV}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center font-medium transition-colors"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Exporter en CSV
                </button>
                
                <button
                  onClick={exportToPDF}
                  className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center font-medium transition-colors"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Exporter en PDF
                </button>
              </div>
            </div>
            
            {/* Aperçu du rapport */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Aperçu du rapport</h2>
              
              <div ref={printRef} className="print:p-8">
                {/* Contenu à imprimer */}
                <div className="mb-6 print:mb-8 print:border-b print:pb-6">
                  <h1 className="text-2xl font-bold text-gray-900 print:text-center">
                    {exportType === 'financial' && 'Rapport Financier'}
                    {exportType === 'payments' && 'Détail des Paiements'}
                    {exportType === 'users' && 'Statistiques Utilisateurs'}
                  </h1>
                  <div className="text-sm text-gray-500 mt-1 print:text-center">
                    <p>Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
                    {dateRange.startDate && dateRange.endDate && (
                      <p className="mt-1">
                        Période: du {formatDateShort(dateRange.startDate)} au {formatDateShort(dateRange.endDate)}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Contenu du rapport selon le type */}
                {exportType === 'financial' && (
                  <>
                    {/* Résumé financier */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:border">
                        <p className="text-sm text-gray-500">Total des paiements</p>
                        <p className="text-xl font-bold text-gray-900">{formatAmount(overallStats?.totalAmount || 0)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:border">
                        <p className="text-sm text-gray-500">Paiements complétés</p>
                        <p className="text-xl font-bold text-green-600">{overallStats?.countByStatus?.completed || 0}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:border">
                        <p className="text-sm text-gray-500">Paiements en attente</p>
                        <p className="text-xl font-bold text-amber-600">{overallStats?.countByStatus?.pending || 0}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:border">
                        <p className="text-sm text-gray-500">Paiements échoués</p>
                        <p className="text-xl font-bold text-red-600">{overallStats?.countByStatus?.failed || 0}</p>
                      </div>
                    </div>
                    
                    {/* Graphique d'évolution */}
                    <div className="mb-8 print:mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des paiements par {selectedPeriod}</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:border h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={periodStats}
                            margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                              dataKey="period" 
                              tick={{ fill: '#4B5563' }}
                              angle={-45} 
                              textAnchor="end"
                              height={70}
                            />
                            <YAxis tick={{ fill: '#4B5563' }} />
                            <Tooltip
                              formatter={(value, name) => {
                                if (name === "amount") return [formatAmount(value), "Montant"];
                                return [value, "Nombre de paiements"];
                              }}
                            />
                            <Legend wrapperStyle={{ paddingTop: 10 }} />
                            <Bar 
                              dataKey="amount" 
                              name="Montant" 
                              fill="#4F46E5"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Tableau des données */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Détail par période</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Période
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Montant Total
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre de Transactions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {periodStats.map((period, index) => (
                              <tr key={index}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {period.period}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {formatAmount(period.amount)}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {period.count}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
                
                {exportType === 'payments' && (
                  <>
                    {/* Répartition par statut */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par statut</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:border h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={prepareStatusChartData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {prepareStatusChartData().map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value} paiements`, ""]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par méthode</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:border h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={paymentMethodStats}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              layout="vertical"
                              barSize={20}
                            >
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                              <XAxis type="number" />
                              <YAxis type="category" dataKey="displayName" width={80} />
                              <Tooltip formatter={(value) => [`${value} paiements`, ""]} />
                              <Legend />
                              <Bar
                                dataKey="count"
                                name="Paiements"
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
                      </div>
                    </div>
                    
                    {/* Liste des transactions */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Liste des transactions récentes</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Montant
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Méthode
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {overallStats?.recentPayments?.slice(0, 10).map((payment, index) => (
                              <tr key={payment._id || index}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {payment.orderId || "N/A"}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(payment.createdAt)}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {formatAmount(payment.amount)}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {payment.paymentMethod || "N/A"}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      payment.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : payment.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : payment.status === "failed"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {payment.status || "N/A"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
                
                {exportType === 'users' && (
                  <>
                    {/* Évolution des utilisateurs */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des utilisateurs</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:border h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={tenantStats}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value} utilisateurs`, ""]} />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="count"
                              name="Utilisateurs"
                              stroke="#8B5CF6"
                              activeDot={{ r: 8 }}
                              strokeWidth={3}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Tableau des utilisateurs par période */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Détail par période</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Période
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre d'Utilisateurs
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {tenantStats.map((stat, index) => (
                              <tr key={index}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {stat.period}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {stat.count}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Pied de page pour impression */}
                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500 hidden print:block">
                  <p>Confidentiel - PlanifyGo - {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Invoice;