import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  X,
  Trash2,
  Plus,
  Save,
  Loader2,
  Clock,
  CreditCard,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  Check,
  Search,
} from "lucide-react";

function getCookie(name) {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const nextTempId = useRef(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingAssign, setPendingAssign] = useState({});
  const [expandedServices, setExpandedServices] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState("TND"); // TND for Tunisian Dinar, EUR for Euro

  // ─── Setup axios + initial load ───────────────────────────────
  useEffect(() => {
    const token = getCookie("accessToken");
    const tenant = getCookie("subdomain");
    axios.defaults.baseURL = "http://localhost:8888";
    axios.defaults.withCredentials = true;
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (tenant) axios.defaults.headers.common["X-Tenant-ID"] = tenant;

    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [emps, svcs] = await Promise.all([
        axios.get("/schedule/employee/getall"),
        axios.get("/schedule/service/getall"),
      ]);
      setEmployees(emps.data);

      const servicesWithMeta = svcs.data.map((svc) => ({
        ...svc,
        tempId: null,
        employeeIds: svc.employees?.map((e) => e.id) || [],
      }));

      setServices(servicesWithMeta);

      // Set all existing services as expanded
      const expanded = {};
      servicesWithMeta.forEach((svc) => {
        expanded[svc.id ?? svc.tempId] = true;
      });
      setExpandedServices(expanded);
    } catch (e) {
      console.error(e);
      setError("Échec du chargement des données");
    } finally {
      setLoading(false);
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────
  const keyOf = (s) => s.id ?? s.tempId;

  const updateService = (key, fn) =>
    setServices((svcs) => svcs.map((s) => (keyOf(s) === key ? fn(s) : s)));

  function addService() {
    const tempId = nextTempId.current++;
    const newService = {
      id: null,
      tempId,
      name: "",
      description: "",
      duration: 30,
      price: 0,
      maxAttendees: 1,
      requiresEmployeeSelection: false,
      allowSimultaneous: false,
      capacity: 1,
      employeeIds: [],
    };

    setServices((s) => [...s, newService]);

    // Auto-expand the new service
    setExpandedServices((prev) => ({
      ...prev,
      [tempId]: true,
    }));

    // Scroll to the bottom after a short delay
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  }

  async function removeService(key) {
    const svc = services.find((s) => keyOf(s) === key);
    try {
      if (svc.id) await axios.delete(`/schedule/service/delete/${svc.id}`);
      setServices((svcs) => svcs.filter((s) => keyOf(s) !== key));
      showSuccessToast("Service supprimé avec succès");
    } catch (e) {
      setError(
        "Erreur lors de la suppression du service. Ce service contient des réservations."
      );
    }
  }

  function assignEmployee(key) {
    const empId = pendingAssign[key];
    if (!empId) return;
    updateService(key, (svc) => ({
      ...svc,
      employeeIds: Array.from(new Set([...(svc.employeeIds || []), empId])),
    }));
    setPendingAssign((pa) => ({ ...pa, [key]: "" }));
  }

  function unassignEmployee(key, empId) {
    updateService(key, (svc) => ({
      ...svc,
      employeeIds: svc.employeeIds.filter((id) => id !== empId),
    }));
  }

  function toggleExpand(key) {
    setExpandedServices((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function showSuccessToast(message) {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  }

  function formatPrice(price) {
    if (currency === "TND") {
      return `${price.toFixed(3)} DT`;
    } else {
      return `${price.toFixed(2)} €`;
    }
  }

  // Filtrer les services en fonction de la recherche
  const filteredServices = searchQuery
    ? services.filter(
        (svc) =>
          svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          svc.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : services;

  async function saveAll() {
    setLoading(true);
    setError(null);
    try {
      for (let svc of services) {
        if (!svc.name.trim())
          throw new Error("Nom requis pour tous les services");
        if (svc.duration < 1)
          throw new Error(`Durée invalide pour "${svc.name}"`);
        if (svc.price < 0) throw new Error(`Prix invalide pour "${svc.name}"`);
        if (svc.allowSimultaneous && svc.capacity < 1)
          throw new Error(`Capacité invalide pour "${svc.name}"`);
        if (svc.maxAttendees < 1)
          throw new Error(`Nombre maximum de participants invalide pour "${svc.name}"`);

        const payload = {
          ...svc,
          employeeIds: svc.employeeIds,
        };

        if (svc.id) {
          await axios.put(`/schedule/service/update/${svc.id}`, payload);
        } else {
          const { data } = await axios.post(
            `/schedule/service/create`,
            payload
          );
          // swap in the real ID
          setServices((svcs) =>
            svcs.map((x) => (x === svc ? { ...data, tempId: null } : x))
          );
        }
      }
      showSuccessToast("Services sauvegardés avec succès !");
      fetchAll();
    } catch (e) {
      console.error(e);
      setError(
        e.response?.data?.message || e.message || "Erreur lors de la sauvegarde"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading && services.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="p-8 bg-white rounded-lg shadow-lg flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-indigo-600 animate-spin mb-6" />
          <p className="text-xl text-gray-700">Chargement des services...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header without sticky positioning */}
      <div className="bg-white shadow-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                Gestion des Services
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Configurez les services à proposer à vos clients
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Success message with improved animation */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center rounded-lg shadow-sm animate-slide-in">
            <div className="bg-emerald-100 p-1 rounded-full mr-3">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="font-medium">{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-emerald-500 hover:text-emerald-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Error message with improved design */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 flex items-center rounded-lg shadow-sm animate-slide-in">
            <div className="bg-red-100 p-1 rounded-full mr-3">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="font-medium">Erreur</div>
              <div>{error}</div>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Action bar with improved design and spacing */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search with cleaner design */}
            <div className="relative flex-grow max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un service..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Action buttons with improved styling */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={addService}
                className="flex items-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 flex-grow md:flex-grow-0"
              >
                <Plus className="h-5 w-5 mr-2" />
                <span>Nouveau Service</span>
              </button>

              <button
                onClick={saveAll}
                disabled={loading}
                className={`flex items-center px-5 py-3 rounded-lg shadow-sm font-medium transition-all duration-200 flex-grow md:flex-grow-0 ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    <span>Enregistrer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* No services placeholder with improved illustration */}
        {services.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
            <div className="mb-6 p-6 bg-indigo-50 rounded-full">
              <Settings className="h-16 w-16 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-medium text-gray-800 mb-2">
              Aucun service disponible
            </h3>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Commencez par créer votre premier service pour votre entreprise.
              Les clients pourront ensuite réserver ces services.
            </p>
            <button
              onClick={addService}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition-all hover:-translate-y-1 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>Créer un service</span>
            </button>
          </div>
        )}

        {/* Search results info with improved messaging */}
        {searchQuery &&
          filteredServices.length === 0 &&
          services.length > 0 && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-2 font-medium">
                Aucun service ne correspond à votre recherche
              </p>
              <p className="text-gray-500">
                Essayez avec d'autres termes ou{" "}
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  effacez votre recherche
                </button>
              </p>
            </div>
          )}

        {/* Services list with cards design */}
        <div className="space-y-6">
          {filteredServices.map((svc, index) => {
            const k = keyOf(svc);
            const isExpanded = expandedServices[k];
            const available = employees.filter(
              (e) => !svc.employeeIds.includes(e.id)
            );
            const isNew = !svc.id;

            return (
              <div
                key={k}
                className={`
                  bg-white rounded-xl overflow-hidden border transition-all duration-300
                  ${
                    isNew
                      ? "border-indigo-300 shadow-md shadow-indigo-100"
                      : "border-gray-200 shadow-sm"
                  }
                  ${isExpanded ? "shadow-md" : "hover:shadow-md"}
                `}
              >
                {/* Service header (always visible) */}
                <div
                  className={`
                    flex justify-between items-center p-5 cursor-pointer group transition-colors
                    ${
                      isExpanded
                        ? "bg-gradient-to-r from-indigo-50 to-purple-50"
                        : "hover:bg-gray-50"
                    }
                  `}
                  onClick={() => toggleExpand(k)}
                >
                  <div className="flex items-center">
                    <div
                      className={`
                      mr-4 p-2 rounded-lg transition-colors flex items-center justify-center
                      ${
                        isExpanded
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                      }
                    `}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-medium ${
                          isNew ? "text-indigo-800" : "text-gray-800"
                        }`}
                      >
                        {svc.name || (
                          <span className="text-gray-400 italic">
                            Service sans nom
                          </span>
                        )}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {svc.duration} min
                        </span>
                        <span className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                          {formatPrice(svc.price)}
                        </span>
                        {svc.requiresEmployeeSelection && (
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            {svc.employeeIds.length} employé
                            {svc.employeeIds.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isNew
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {isNew ? "Nouveau" : `#${svc.id}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeService(k);
                      }}
                      className="ml-4 text-gray-400 hover:text-red-500 rounded-full p-2 hover:bg-red-50 transition-colors"
                      title="Supprimer ce service"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Expanded content with improved form layout */}
                {isExpanded && (
                  <div className="p-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom du service
                        </label>
                        <input
                          type="text"
                          value={svc.name}
                          onChange={(e) =>
                            updateService(k, (s) => ({
                              ...s,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Ex: Coupe homme"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Price with integrated currency dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prix
                        </label>
                        <div className="flex">
                          <div className="relative flex-grow">
                            <input
                              type="number"
                              min="0"
                              step="0.001"
                              value={svc.price}
                              onChange={(e) =>
                                updateService(k, (s) => ({
                                  ...s,
                                  price: +e.target.value,
                                }))
                              }
                              className="w-full border border-gray-300 rounded-l-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="border-l-0 border border-gray-300 bg-gray-50 rounded-r-lg text-gray-700 px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                          >
                            <option value="TND">DT</option>
                            <option value="EUR">€</option>
                          </select>
                        </div>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Durée (minutes)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={svc.duration}
                            onChange={(e) =>
                              updateService(k, (s) => ({
                                ...s,
                                duration: +e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      {/* max attendees  */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre maximum de participants 
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            // min="1"
                            value={svc.maxAttendees}
                            onChange={(e) =>
                              updateService(k, (s) => ({
                                ...s,
                                maxAttendees: +e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={svc.description}
                          onChange={(e) =>
                            updateService(k, (s) => ({
                              ...s,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Décrivez ce service en détail pour vos clients..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Options section with enhanced visuals */}
                      <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl space-y-6">
                        <h4 className="font-medium text-gray-800 flex items-center">
                          <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                          Options avancées
                        </h4>

                        {/* Requires employee selection */}
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <label className="flex items-center cursor-pointer flex-grow">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={svc.requiresEmployeeSelection}
                                onChange={(e) =>
                                  updateService(k, (s) => ({
                                    ...s,
                                    requiresEmployeeSelection: e.target.checked,
                                    ...(e.target.checked
                                      ? {}
                                      : { employeeIds: [] }),
                                  }))
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 rounded-full shadow-inner transition-colors" />
                              <div
                                className={`toggle-dot absolute w-5 h-5 bg-white rounded-full shadow top-[2px] left-[2px] transition ${
                                  svc.requiresEmployeeSelection
                                    ? "transform translate-x-5 bg-indigo-600"
                                    : ""
                                }`}
                              />
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">
                              Ce service nécessite le choix d'un employé
                              spécifique
                            </div>
                          </label>
                        </div>

                        {/* Allow simultaneous */}
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <label className="flex items-center cursor-pointer flex-grow">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={svc.allowSimultaneous}
                                onChange={(e) =>
                                  updateService(k, (s) => ({
                                    ...s,
                                    allowSimultaneous: e.target.checked,
                                  }))
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 rounded-full shadow-inner transition-colors" />
                              <div
                                className={`toggle-dot absolute w-5 h-5 bg-white rounded-full shadow top-[2px] left-[2px] transition ${
                                  svc.allowSimultaneous
                                    ? "transform translate-x-5 bg-indigo-600"
                                    : ""
                                }`}
                              />
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">
                              Permet les réservations simultanées
                            </div>
                          </label>
                        </div>

                        {/* Capacity */}
                        {svc.allowSimultaneous && (
                          <div className="pl-12 pt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Capacité maximum
                              <span className="ml-1 text-xs text-gray-500">
                                (nombre de clients en même temps)
                              </span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={svc.capacity}
                              onChange={(e) =>
                                updateService(k, (s) => ({
                                  ...s,
                                  capacity: +e.target.value,
                                }))
                              }
                              className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                          </div>
                        )}
                      </div>

                      {/* Employee assignment section with enhanced UI */}
                      {svc.requiresEmployeeSelection && (
                        <div className="md:col-span-2 border border-indigo-100 bg-indigo-50/50 p-6 rounded-xl">
                          <h4 className="font-medium text-indigo-900 flex items-center mb-4">
                            <Users className="h-5 w-5 mr-2 text-indigo-700" />
                            Employés qui peuvent fournir ce service
                          </h4>

                          {/* Assigned employees */}
                          <div className="mb-5">
                            {svc.employeeIds.length === 0 ? (
                              <div className="flex items-center p-4 bg-white rounded-lg border border-indigo-100">
                                <p className="text-sm text-indigo-600 italic">
                                  Aucun employé assigné pour le moment
                                </p>
                              </div>
                            ) : (
                              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                                <p className="text-sm text-gray-600 mb-3 font-medium">
                                  Employés assignés:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {svc.employeeIds.map((empId) => {
                                    const emp = employees.find(
                                      (e) => e.id === empId
                                    );
                                    return (
                                      emp && (
                                        <span
                                          key={empId}
                                          className="inline-flex items-center bg-indigo-100 text-indigo-800 rounded-full px-3 py-1.5 text-sm border border-indigo-200 hover:bg-indigo-200 transition-colors group"
                                        >
                                          {emp.firstName} {emp.lastName}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              unassignEmployee(k, empId);
                                            }}
                                            className="ml-1 rounded-full p-1 group-hover:bg-indigo-300 transition-colors"
                                          >
                                            <X
                                              size={14}
                                              className="text-indigo-600"
                                            />
                                          </button>
                                        </span>
                                      )
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Employee selection with improved selector */}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <select
                              value={pendingAssign[k] || ""}
                              onChange={(e) =>
                                setPendingAssign((pa) => ({
                                  ...pa,
                                  [k]: +e.target.value,
                                }))
                              }
                              className="flex-grow border border-indigo-200 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="">
                                — Sélectionner un employé à ajouter —
                              </option>
                              {available.length === 0 ? (
                                <option disabled>
                                  Tous les employés sont déjà assignés
                                </option>
                              ) : (
                                available.map((emp) => (
                                  <option key={emp.id} value={emp.id}>
                                    {emp.firstName} {emp.lastName}
                                  </option>
                                ))
                              )}
                            </select>
                            <button
                              onClick={() => assignEmployee(k)}
                              disabled={!pendingAssign[k]}
                              className={`px-4 py-2.5 rounded-lg flex items-center justify-center min-w-[120px] font-medium transition-colors ${
                                pendingAssign[k]
                                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save button (bottom) with improved floating design */}
        {services.length > 0 && (
          <div className="mt-8 sticky bottom-6 z-10">
            <div className="flex justify-center">
              <button
                onClick={saveAll}
                disabled={loading}
                className={`flex items-center px-8 py-3.5 rounded-xl shadow-lg font-medium text-lg transition-all ${
                  loading
                    ? "bg-gray-400 text-gray-200"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-6 w-6 mr-3" />
                    Enregistrer tous les services
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .toggle-dot {
          transition: all 0.3s ease-in-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
