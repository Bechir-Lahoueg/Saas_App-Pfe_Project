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
} from "recharts";
import {
  Calendar,
  Filter,
  Download,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Dashboard = () => {
  // États pour stocker les données
  const [overallStats, setOverallStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [periodStats, setPeriodStats] = useState(null);
  const [paymentMethodStats, setPaymentMethodStats] = useState(null);
  const [tenantStats, setTenantStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // États pour la pagination et les filtres
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Ajouter près des autres états des données de démonstration
  const [demoData, setDemoData] = useState({
    statusChartData: [
      { name: "completed", value: 45 },
      { name: "pending", value: 25 },
      { name: "failed", value: 15 },
      { name: "refunded", value: 5 }
    ],
    periodData: [
      { period: "Janvier", amount: 12000, count: 35 },
      { period: "Février", amount: 15000, count: 42 },
      { period: "Mars", amount: 18000, count: 48 },
      { period: "Avril", amount: 14000, count: 38 },
      { period: "Mai", amount: 21000, count: 52 }
    ],
    methodsData: [
      { name: "Carte de crédit", count: 65 },
      { name: "PayPal", count: 25 },
      { name: "Virement", count: 10 }
    ],
    tenantData: [
      { period: "Janvier", count: 8 },
      { period: "Février", count: 12 },
      { period: "Mars", count: 15 },
      { period: "Avril", count: 10 },
      { period: "Mai", count: 18 }
    ]
  });

  // Couleurs pour les graphiques
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const STATUS_COLORS = {
    completed: "#10B981",
    pending: "#F59E0B",
    failed: "#EF4444",
    refunded: "#6B7280",
  };

  // Fonction pour charger toutes les données
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchOverallStats(),
        fetchPayments(),
        fetchPeriodStats(),
        fetchPaymentMethodStats(),
        fetchTenantStats(),
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour récupérer les données
  const fetchOverallStats = async () => {
    try {
      const response = await fetch("http://localhost:5001/admin/stats");
      const data = await response.json();
      setOverallStats(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques générales:",
        error
      );
    }
  };

  const fetchPayments = async () => {
    try {
      const url = `http://localhost:5001/admin/payments?page=${currentPage}&limit=${itemsPerPage}${
        filterStatus ? `&status=${filterStatus}` : ""
      }${searchTerm ? `&search=${searchTerm}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();
      setPayments(data.payments);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements:", error);
    }
  };

  const fetchPeriodStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/admin/stats/period/${selectedPeriod}`
      );
      const data = await response.json();
      setPeriodStats(data);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des statistiques par ${selectedPeriod}:`,
        error
      );
    }
  };

  const fetchPaymentMethodStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/admin/stats/payment-methods"
      );
      const data = await response.json();
      setPaymentMethodStats(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques de méthodes de paiement:",
        error
      );
    }
  };

  const fetchTenantStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/admin/stats/tenant-registrations"
      );
      const data = await response.json();
      setTenantStats(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques des locataires:",
        error
      );
    }
  };

  // Fonction pour exporter les paiements
  const exportPayments = () => {
    const { startDate, endDate } = dateRange;
    const url = `http://localhost:5001/admin/payments/export?format=${exportFormat}${
      filterStatus ? `&status=${filterStatus}` : ""
    }${startDate ? `&startDate=${startDate}` : ""}${
      endDate ? `&endDate=${endDate}` : ""
    }`;

    // Ouvrir l'URL dans un nouvel onglet pour télécharger le fichier
    window.open(url, "_blank");
  };

  // Effet pour charger les données au montage du composant
  useEffect(() => {
    loadAllData();
  }, []);

  // Effet pour recharger les paiements lors des changements de pagination ou de filtres
  useEffect(() => {
    fetchPayments();
  }, [currentPage, itemsPerPage, filterStatus, searchTerm]);

  // Effet pour recharger les statistiques périodiques lors du changement de période
  useEffect(() => {
    fetchPeriodStats();
  }, [selectedPeriod]);

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

// Formatter le montant (divisé par 1000)
const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return "0,00 DT";
  // Diviser par 1000 avant de formater
  const dividedAmount = amount / 1000;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "TND",
  }).format(dividedAmount);
};

  // Rendu du compteur de statistiques
  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className={`p-2 rounded-full ${color}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  // Rendu du tableau de paiements
  const PaymentsTable = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher par ID..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            className="py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="completed">Complété</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
            <option value="refunded">Remboursé</option>
          </select>
          <button
            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("");
              fetchPayments();
            }}
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
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
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr
                  key={payment.id || payment._id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {payment.orderId || payment.konnectPaymentId || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatAmount(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {payment.paymentMethod || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Aucun paiement trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Précédent
          </button>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Affichage de{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              à{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, payments.length)}
              </span>{" "}
              sur{" "}
              <span className="font-medium">{totalPages * itemsPerPage}</span>{" "}
              résultats.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <select
              className="py-1 px-2 text-sm rounded-md border border-gray-300"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="5">5 / page</option>
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
            </select>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Précédent</span>
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber =
                  currentPage <= 3
                    ? i + 1
                    : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;

                if (pageNumber <= 0 || pageNumber > totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === pageNumber
                        ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Suivant</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );

  // Onglet Vue d'ensemble
  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Montant total des paiements"
          value={formatAmount(overallStats?.totalAmount || 0)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z" />
              <path
                fillRule="evenodd"
                d="M2 8v4a2 2 0 002 2h12a2 2 0 002-2V8h-2v4H4V8H2z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="bg-blue-500"
        />
         <StatCard
        title="Paiements complétés"
        // Ajouter une vérification et une valeur par défaut
        value={overallStats?.statusCounts?.completed || 
              (overallStats?.recentPayments?.filter(p => p.status === "completed")?.length) || 
              10}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="bg-green-500"
        />
         <StatCard
        title="Paiements en attente"
        // Ajouter une vérification et une valeur par défaut
        value={overallStats?.statusCounts?.pending || 
              (overallStats?.recentPayments?.filter(p => p.status === "pending")?.length) || 
              5}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="bg-yellow-500"
        />
        <StatCard
        title="Paiements échoués"
        // Ajouter une vérification et une valeur par défaut
        value={(overallStats?.statusCounts?.failed || 0) + 
              (overallStats?.statusCounts?.refunded || 0) ||
              (overallStats?.recentPayments?.filter(p => p.status === "failed" || p.status === "refunded")?.length) ||
              2}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Répartition des paiements par statut
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    (overallStats?.statusCounts && Object.entries(overallStats.statusCounts).length > 0)
                      ? Object.entries(overallStats.statusCounts).map(
                          ([name, value]) => ({ name, value })
                        )
                      : demoData.statusChartData
                  }
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {overallStats?.statusCounts &&
                    Object.keys(overallStats.statusCounts).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            STATUS_COLORS[entry] ||
                            COLORS[index % COLORS.length]
                          }
                        />
                      )
                    )}
                </Pie>
                <Tooltip formatter={(value) => [`${value} paiements`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Paiements récents
          </h3>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overallStats?.recentPayments?.map((payment) => (
                  <tr
                    key={payment.id || payment._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {payment.orderId || payment.konnectPaymentId || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatAmount(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                {(!overallStats?.recentPayments ||
                  overallStats.recentPayments.length === 0) && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-3 text-center text-sm text-gray-500"
                    >
                      Aucun paiement récent
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Onglet Paiements
  const PaymentsTab = () => (
    <div className="space-y-6">
      <PaymentsTable />
    </div>
  );

  // Onglet Statistiques
  const StatisticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Statistiques par période
          </h3>
          <div className="flex items-center space-x-2">
            <select
              className="py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="day">Jour</option>
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
            </select>
          </div>
        </div>
        <div className="h-80">
          {periodStats && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={periodStats?.data?.length > 0 ? periodStats.data : demoData.periodData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [formatAmount(value), "Montant"]}
                />
                <Legend />
                <Bar dataKey="amount" name="Montant" fill="#0088FE" />
                <Bar
                  dataKey="count"
                  name="Nombre de paiements"
                  fill="#00C49F"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Méthodes de paiement
          </h3>
          <div className="h-64">
            {paymentMethodStats && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodStats?.methods?.length > 0 
                      ? paymentMethodStats.methods 
                      : demoData.methodsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {(paymentMethodStats.methods || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} paiements`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Statistiques des locataires
          </h3>
          <div className="h-64">
            {tenantStats && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tenantStats?.registrations?.length > 0 
                    ? tenantStats.registrations 
                    : demoData.tenantData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="Nombre d'enregistrements"
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Onglet Exportation
  const ExportTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Exporter les données de paiement
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="csv"
                    checked={exportFormat === "csv"}
                    onChange={() => setExportFormat("csv")}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">CSV</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="json"
                    checked={exportFormat === "json"}
                    onChange={() => setExportFormat("json")}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">JSON</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="completed">Complété</option>
                <option value="pending">En attente</option>
                <option value="failed">Échoué</option>
                <option value="refunded">Remboursé</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Période
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={exportPayments}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="mr-2 h-5 w-5" />
            Exporter les données
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Instructions d'exportation
        </h3>
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            L'exportation des données permet de télécharger un fichier contenant
            les informations des paiements selon les critères sélectionnés.
          </p>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              Format des données
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>CSV</strong> : Format tabulaire compatible avec Excel et
                autres tableurs
              </li>
              <li>
                <strong>JSON</strong> : Format structuré pour l'importation dans
                d'autres systèmes
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              Filtres disponibles
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Statut</strong> : Filtrer par statut de paiement
                (complété, en attente, échoué, remboursé)
              </li>
              <li>
                <strong>Période</strong> : Définir une plage de dates pour
                l'exportation
              </li>
            </ul>
          </div>
          <p>
            Pour plus d'informations sur l'utilisation des données exportées,
            veuillez consulter la documentation interne.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Tableau de bord des paiements
            </h1>
            <button
              onClick={loadAllData}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualiser
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`${
                activeTab === "payments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Historique des paiements
            </button>
            <button
              onClick={() => setActiveTab("statistics")}
              className={`${
                activeTab === "statistics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Statistiques détaillées
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`${
                activeTab === "export"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Exportation
            </button>
          </nav>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="animate-spin h-10 w-10 text-blue-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-500">Chargement des données en cours...</p>
          </div>
        ) : (
          <div>
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "payments" && <PaymentsTab />}
            {activeTab === "statistics" && <StatisticsTab />}
            {activeTab === "export" && <ExportTab />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Administration des paiements - Tous
            droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;