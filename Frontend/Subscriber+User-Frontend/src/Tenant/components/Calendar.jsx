// src/components/Calendar.jsx
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  X,
  Users,
  Star, // Pour les événements spéciaux
  AlertCircle,
  Check,
} from "lucide-react";
import axios from "axios";

// Jours fériés et fêtes tunisiennes (fêtes fixes uniquement)
const FIXED_TUNISIAN_HOLIDAYS = {
  // Fêtes fixes nationales
  "01-01": { name: "Nouvel An", type: "national" },
  "01-14": { name: "Fête de la Révolution", type: "national" },
  "03-20": { name: "Fête de l'Indépendance", type: "national" },
  "04-09": { name: "Jour des Martyrs", type: "national" },
  "05-01": { name: "Fête du Travail", type: "national" },
  "07-25": { name: "Fête de la République", type: "national" },
  "08-13": { name: "Fête de la Femme", type: "national" },
  "10-15": { name: "Fête de l'Évacuation", type: "national" },
};

// Fonction pour calculer les dates des fêtes islamiques pour une année donnée
const calculateIslamicHolidays = (gregorianYear) => {
  // Les dates approximatives pour les fêtes islamiques basées sur des calculs astronomiques
  // Ces formules sont des approximations et peuvent nécessiter des ajustements mineurs

  // Fonction pour convertir une date grégorienne (approx.) en format key pour notre calendrier
  const formatHolidayDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}`;
  };

  // Approximation de base pour Ramadan (peut nécessiter une correction de ±1-2 jours)
  // Cette formule simple estime le cycle lunaire et les décalages annuels
  const ramadanStartYear = gregorianYear;
  let ramadanStartDayApprox = new Date(ramadanStartYear, 2, 10); // Mars comme point de départ
  // Décalage approximatif de -11 jours par an pour le calendrier lunaire
  ramadanStartDayApprox.setDate(
    ramadanStartDayApprox.getDate() - (gregorianYear - 2023) * 11
  );

  // Ajuster selon le tableau connu des dates de Ramadan
  if (gregorianYear === 2023) ramadanStartDayApprox = new Date(2023, 2, 23);
  else if (gregorianYear === 2024)
    ramadanStartDayApprox = new Date(2024, 2, 11);
  else if (gregorianYear === 2025)
    ramadanStartDayApprox = new Date(2025, 1, 28);
  else if (gregorianYear === 2026)
    ramadanStartDayApprox = new Date(2026, 1, 17);
  else if (gregorianYear === 2027) ramadanStartDayApprox = new Date(2027, 1, 7);

  // Calculer les autres fêtes en fonction de Ramadan
  const eidAlFitrDate = new Date(ramadanStartDayApprox);
  eidAlFitrDate.setDate(eidAlFitrDate.getDate() + 30);

  const eidAlAdhaDate = new Date(eidAlFitrDate);
  eidAlAdhaDate.setDate(eidAlAdhaDate.getDate() + 70);

  const islamicNewYearDate = new Date(ramadanStartDayApprox);
  islamicNewYearDate.setDate(islamicNewYearDate.getDate() - 90);

  const mouledDate = new Date(islamicNewYearDate);
  mouledDate.setDate(mouledDate.getDate() + 70);

  // Générér les entrées pour le calendrier
  const islamicHolidays = {
    [formatHolidayDate(ramadanStartDayApprox)]: {
      name: `Début Ramadan ${gregorianYear}`,
      type: "religious",
    },
    [formatHolidayDate(eidAlFitrDate)]: {
      name: "Aïd al-Fitr (1er jour)",
      type: "religious",
    },
    [formatHolidayDate(
      new Date(eidAlFitrDate.setDate(eidAlFitrDate.getDate() + 1))
    )]: {
      name: "Aïd al-Fitr (2ème jour)",
      type: "religious",
    },
    [formatHolidayDate(eidAlAdhaDate)]: {
      name: "Aïd al-Adha (1er jour)",
      type: "religious",
    },
    [formatHolidayDate(
      new Date(eidAlAdhaDate.setDate(eidAlAdhaDate.getDate() + 1))
    )]: {
      name: "Aïd al-Adha (2ème jour)",
      type: "religious",
    },
    [formatHolidayDate(islamicNewYearDate)]: {
      name: "Nouvel An Hégire",
      type: "religious",
    },
    [formatHolidayDate(mouledDate)]: {
      name: "Mouled",
      type: "religious",
    },
  };

  return islamicHolidays;
};

const Calendar = () => {
  // ─── Calendar State ─────────────────────────────────────────────────
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedView, setSelectedView] = useState("Mois");
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeView, setTimeView] = useState("24h"); // Format d'heure par défaut
  const [tunisianHolidays, setTunisianHolidays] = useState({});
  const [hasClientEmail, setHasClientEmail] = useState(true);
  const [reservationDetail, setReservationDetail] = useState(null);

  // Mettre à jour les fêtes tunisiennes lorsque l'année change
  useEffect(() => {
    // Combiner les fêtes fixes et les fêtes islamiques pour l'année actuelle
    const islamicHolidays = calculateIslamicHolidays(currentYear);
    setTunisianHolidays({ ...FIXED_TUNISIAN_HOLIDAYS, ...islamicHolidays });

    // Aussi calculer pour l'année suivante (utile en fin d'année)
    const nextYearIslamicHolidays = calculateIslamicHolidays(currentYear + 1);
    Object.entries(nextYearIslamicHolidays).forEach(([key, value]) => {
      if (key.startsWith("01-") || key.startsWith("02-")) {
        // Ajouter seulement les événements de début d'année
        tunisianHolidays[key] = value;
      }
    });
  }, [currentYear]);

  // ─── Réservation State ──────────────────────────────────────────────
  const [allEvents, setAllEvents] = useState({}); // Contient uniquement les réservations
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    serviceId: null,
    employeeId: null,
    time: "09:00",
    numberOfAttendees: 1,
    startTime: "",
    clientFirstName: "",
    clientLastName: "",
    clientPhoneNumber: "",
    clientEmail: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── Backend Data ───────────────────────────────────────────────────
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  // ─── Configure Axios & Fetch Initial Data ──────────────────────────
  useEffect(() => {
    // axios defaults setup remains the same
    axios.defaults.baseURL = "http://localhost:8888";
    axios.defaults.withCredentials = true;
    const token = document.cookie.match(/accessToken=([^;]+)/)?.[1];
    const subdomain = document.cookie.match(/subdomain=([^;]+)/)?.[1];
    if (token)
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${decodeURIComponent(token)}`;
    if (subdomain)
      axios.defaults.headers.common["X-Tenant-ID"] =
        decodeURIComponent(subdomain);

    // Load initial data sequentially to ensure dependencies are met
    const loadInitialData = async () => {
      try {
        // First load employees
        await fetchEmployees();
        // Then load services, which will also load reservations
        await fetchServices();
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();

    // Set selected date
    setSelectedDate(new Date());
  }, []);

  // ─── Fetchers ──────────────────────────────────────────────────────
  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get("/schedule/employee/getall");
      setEmployees(data);
      return data; // Return data for use in other functions
    } catch (error) {
      console.error("Erreur lors du chargement des employés:", error);
      showToast(
        "Erreur lors du chargement des employés: " +
          (error.response?.data?.message || error.message),
        "error"
      );
      return []; // Return empty array on error
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await axios.get("/schedule/service/getall");
      setServices(data);
      // Now fetch reservations after both services and employees are loaded
      fetchReservations(data);
      return data; // Return data for use in other functions
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      showToast(
        "Erreur lors du chargement des services: " +
          (error.response?.data?.message || error.message),
        "error"
      );
      return []; // Return empty array on error
    }
  };

  const fetchReservations = async (svcList = services) => {
    try {
      const { data } = await axios.get("/schedule/reservation/getall");
      const byYearAndMonth = {};

      // Make sure we have employee data
      let currentEmployees = employees;
      if (currentEmployees.length === 0) {
        // If somehow employees aren't loaded yet, load them now
        currentEmployees = await fetchEmployees();
      }

      data.forEach((r) => {
        // Convertir la date UTC en date locale
        const dt = new Date(r.startTime);

        const y = dt.getFullYear();
        const m = dt.getMonth();
        const svc = svcList.find((s) => s.id === r.serviceId);
        const emp = currentEmployees.find((e) => e.id === r.employeeId);
        const title = svc ? svc.name : "Réservation";

        // Construire l'événement avec les formats de date/heure corrects pour l'affichage
        const evt = {
          id: r.id,
          title,
          date: dt.toISOString().split("T")[0],
          time: `${String(dt.getHours()).padStart(2, "0")}:${String(
            dt.getMinutes()
          ).padStart(2, "0")}`,
          color: "teal",
          employeeId: r.employeeId,
          employee: emp,
          numberOfAttendees: r.numberOfAttendees,
          // Ajoute les infos client
          clientFirstName: r.clientFirstName,
          clientLastName: r.clientLastName,
          clientPhoneNumber: r.clientPhoneNumber,
          clientEmail: r.clientEmail,
        };

        // Structure: byYearAndMonth[année][mois] = [événements]
        if (!byYearAndMonth[y]) byYearAndMonth[y] = {};
        byYearAndMonth[y][m] = [...(byYearAndMonth[y][m] || []), evt];
      });

      // Remplacer complètement les événements par les réservations
      setAllEvents(byYearAndMonth);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      showToast(
        "Erreur lors du chargement des réservations: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    }
  };

  // ─── Toast notification helper ──────────────────────────────────────
  const showToast = (message, type = "info") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slideIn ${
      type === "error"
        ? "bg-red-100 text-red-800 border-l-4 border-red-500"
        : type === "success"
        ? "bg-emerald-100 text-emerald-800 border-l-4 border-emerald-500"
        : "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
    }`;

    const icon = document.createElement("div");
    icon.innerHTML =
      type === "error"
        ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>'
        : type === "success"
        ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>';

    toast.appendChild(icon);

    const textDiv = document.createElement("div");
    textDiv.textContent = message;
    toast.appendChild(textDiv);

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("animate-slideOut");
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  };

  // ─── Helpers ───────────────────────────────────────────────────────
  // Obtenir les jours fériés pour une date donnée
  const getHolidayInfo = (year, month, day) => {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateKey = `${monthStr}-${dayStr}`;

    return tunisianHolidays[dateKey];
  };

  // Vérifier si une date est dans le passé
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer uniquement les dates
    return date < today;
  };

  // Formater l'heure en fonction du format sélectionné (12h ou 24h)
  const formatTime = (timeStr) => {
    if (timeView === "24h" || !timeStr) return timeStr;

    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    return `${h}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // Ajoute ces fonctions avec les autres helpers si elles n'existent pas déjà

  // Obtenir un dégradé de couleur basé sur l'ID
  const getAvatarColor = (id) => {
    const colors = [
      "from-blue-500 to-indigo-500",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-amber-500",
      "from-pink-500 to-rose-500",
      "from-violet-500 to-purple-500",
      "from-cyan-500 to-blue-500",
    ];
    return `bg-gradient-to-br ${colors[id % colors.length]}`;
  };

  // Obtenir les initiales
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  // ─── Réservation Handlers ─────────────────────────────────────────
  // Modifier la fonction openReservationModal pour accepter un paramètre d'heure
  const openReservationModal = (specificTime = "09:00") => {
    if (!selectedDate) {
      showToast("Veuillez sélectionner une date d'abord", "error");
      return;
    }

    // Vérifier uniquement si la date sélectionnée est dans le passé
    if (isPastDate(selectedDate)) {
      showToast("Impossible de réserver pour une date passée", "error");
      return;
    }

    // Supprimer la vérification des jours fériés
    // Le bloc de code vérifiant si holiday existe et bloquant la réservation doit être supprimé

    setReservationForm({
      serviceId: null,
      employeeId: null,
      time: specificTime, // Utiliser l'heure spécifique passée en paramètre
      numberOfAttendees: 1,
      startTime: "",
      clientFirstName: "",
      clientLastName: "",
      clientPhoneNumber: "",
      clientEmail: "",
    });
    setHasClientEmail(true); // reset checkbox
    setFormErrors({});
    setSubmitSuccess(false);
    setSubmitError("");
    setShowReservationModal(true);
  };

  const validateForm = () => {
    const e = {};
    if (!reservationForm.serviceId) {
      e.serviceId = "Service requis pour une réservation valide";
    } else {
      const svc = services.find((s) => s.id === +reservationForm.serviceId);
      if (svc?.requiresEmployeeSelection && !reservationForm.employeeId) {
        e.employeeId = "Ce service nécessite un employé désigné";
      }
    }
    if (!reservationForm.time)
      e.time = "Veuillez spécifier une heure pour la réservation";
    if (
      !reservationForm.numberOfAttendees ||
      reservationForm.numberOfAttendees < 1
    ) {
      e.numberOfAttendees = "Au moins 1 participant est requis";
    }
    if (!reservationForm.clientFirstName) e.clientFirstName = "Prénom requis";
    if (!reservationForm.clientLastName) e.clientLastName = "Nom requis";
    if (!reservationForm.clientPhoneNumber)
      e.clientPhoneNumber = "Téléphone requis";
    if (hasClientEmail && !reservationForm.clientEmail)
      e.clientEmail = "Email requis";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReservationInput = (e) => {
    const { name, value } = e.target;
    setReservationForm((f) => ({ ...f, [name]: value }));

    // Effacer l'erreur spécifique lorsque le champ est modifié
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const submitReservation = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Créer la date avec les heures et minutes sélectionnées
    const dt = new Date(selectedDate);
    const [hh, mm] = reservationForm.time.split(":");
    dt.setHours(+hh, +mm, 0, 0);

    setLoading(true);
    try {
      // Solution: Ajouter l'offset de timezone pour compenser la conversion UTC
      // Cela garantit que l'heure envoyée au backend correspond à l'heure locale choisie
      const localISOTime = new Date(
        dt.getTime() - dt.getTimezoneOffset() * 60000
      ).toISOString();

      const { data } = await axios.post("/schedule/reservation/create", {
        serviceId: +reservationForm.serviceId,
        employeeId: reservationForm.employeeId
          ? +reservationForm.employeeId
          : null,
        startTime: localISOTime, // Utiliser l'heure ISO avec compensation de timezone
        numberOfAttendees: reservationForm.numberOfAttendees,
        clientFirstName: reservationForm.clientFirstName,
        clientLastName: reservationForm.clientLastName,
        clientPhoneNumber: reservationForm.clientPhoneNumber,
        clientEmail: reservationForm.clientEmail,
      });

      setSubmitSuccess(true);
      showToast("Réservation créée avec succès", "success");
      // refresh events
      fetchReservations();
      // auto-close after a moment
      setTimeout(() => {
        setShowReservationModal(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Erreur lors de la création de la réservation";
      setSubmitError(errorMessage);
      showToast("Échec de la réservation: " + errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // ─── Reservation delete handler ───────────────────────────────────
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const deleteReservation = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/schedule/reservation/delete/${id}`);

      // Mise à jour immédiate de l'état local
      setAllEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };

        Object.keys(updatedEvents).forEach((year) => {
          Object.keys(updatedEvents[year] || {}).forEach((month) => {
            if (updatedEvents[year][month]) {
              updatedEvents[year][month] = updatedEvents[year][month].filter(
                (event) => event.id !== id
              );
            }
          });
        });

        return updatedEvents;
      });

      // Fermer le modal de confirmation
      setDeleteConfirmation(null);
      showToast("Réservation supprimée avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showToast(
        "Erreur lors de la suppression: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteReservation = (e, id, title, time) => {
    e?.stopPropagation();
    setDeleteConfirmation({ id, title, time });
  };

  // ─── Calendar Render Helpers ──────────────────────────────────────
  const renderCalendarGrid = (month) => {
    const firstDay = new Date(currentYear, month, 1).getDay();
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const monthEvents = allEvents[currentYear]?.[month] || [];

    // Ajustement pour commencer la semaine par Lundi (0: lundi, 6: dimanche)
    const blanks = firstDay === 0 ? 6 : firstDay - 1;
    const cells = [];

    // Cases vides au début
    for (let i = 0; i < blanks; i++)
      cells.push(<div key={`b${i}`} className="h-24 sm:h-28 md:h-32" />);

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dt = new Date(currentYear, month, day);
      const isSel =
        selectedDate && dt.toDateString() === selectedDate.toDateString();
      const isToday = new Date().toDateString() === dt.toDateString();
      const isPast = isPastDate(dt);
      const evts = monthEvents.filter(
        (e) => new Date(e.date).getDate() === day
      );

      // Vérifier s'il y a un jour férié
      const holiday = getHolidayInfo(currentYear, month, day);

      cells.push(
        <div
          key={day}
          onClick={() => !isPast && setSelectedDate(dt)}
          className={`
            p-2 h-24 sm:h-28 md:h-32 rounded-lg ${
              !isPast ? "cursor-pointer" : "cursor-not-allowed"
            } relative
            overflow-hidden group
            ${
              isSel
                ? "bg-blue-100 border-2 border-blue-400"
                : "border border-gray-200"
            }
            ${isToday ? "ring-2 ring-blue-500 ring-inset" : ""}
            ${isPast ? "bg-gray-100 opacity-70 text-gray-400" : ""}
            ${
              holiday
                ? holiday.type === "religious"
                  ? isPast
                    ? "bg-emerald-50/30"
                    : "bg-emerald-50"
                  : isPast
                  ? "bg-amber-50/30"
                  : "bg-amber-50"
                : isPast
                ? ""
                : "hover:bg-blue-50"
            }
            transition-all duration-200 ${!isPast && "hover:shadow-md"}
          `}
        >
          {/* Numéro du jour */}
          <div className="flex justify-between items-start mb-1">
            <span
              className={`
              inline-flex justify-center items-center w-7 h-7 rounded-full font-medium
              ${isPast ? "bg-gray-200 text-gray-500" : ""}
              ${isSel ? "bg-blue-500 text-white shadow-inner" : ""}
              ${isToday && !isSel ? "bg-blue-200 text-blue-800" : ""}
              ${
                holiday && !isSel && !isToday && !isPast
                  ? holiday.type === "religious"
                    ? "bg-emerald-200 text-emerald-800"
                    : "bg-amber-200 text-amber-800"
                  : ""
              }
              transition-transform ${!isPast && "group-hover:scale-105"}
            `}
            >
              {day}
            </span>

            {/* Icône pour jour férié */}
            {holiday && (
              <span
                className={`
                  text-xs px-1 py-0.5 rounded-md flex items-center
                  ${
                    holiday.type === "religious"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }
                  transform transition-transform group-hover:translate-x-0 translate-x-1
                `}
                title={holiday.name}
              >
                <Star size={10} className="mr-1" />
                <span className="hidden sm:inline truncate max-w-[120px]">
                  {holiday.name.length > 12
                    ? holiday.name.substring(0, 12) + "..."
                    : holiday.name}
                </span>
              </span>
            )}
          </div>

          {/* Liste des réservations */}
          <div className="mt-1 space-y-1 max-h-20 overflow-y-auto custom-scrollbar">
            {evts.slice(0, 3).map((e) => (
              <div
                key={e.id}
                title={`${e.title} - ${formatTime(e.time)}`}
                className={`text-xs ${
                  isPast
                    ? "text-white/80 bg-teal-400"
                    : "text-white bg-teal-500 hover:bg-teal-600"
                } px-1 py-0.5 rounded truncate flex items-center shadow-sm transition-all`}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <Clock size={10} className="mr-1 flex-shrink-0" />
                <span className="truncate">
                  {formatTime(e.time)} {e.title}
                </span>
              </div>
            ))}
            {evts.length > 3 && (
              <div className="text-xs text-gray-500 font-medium text-center bg-gray-100 rounded py-0.5 hover:bg-gray-200 cursor-pointer transition-colors">
                +{evts.length - 3} {evts.length - 3 > 1 ? "autres" : "autre"}
              </div>
            )}
          </div>

          {/* Bouton ajouter (visible au survol) */}
          {/* Bouton ajouter (visible au survol) */}
          <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isPast ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(dt);
                  openReservationModal();
                }}
                className="w-6 h-6 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full flex items-center justify-center"
              >
                +
              </button>
            ) : (
              <span
                title="Date passée - Réservation impossible"
                className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center cursor-not-allowed"
              >
                ×
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div
            key={d}
            className="text-center text-gray-500 font-medium py-2 border-b"
          >
            {d}
          </div>
        ))}
        {cells}
      </div>
    );
  };

  const renderYearView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(12)].map((_, month) => {
        // Vérifier s'il y a des événements pour ce mois dans l'année courante
        const hasEvents = Object.keys(allEvents[currentYear] || {}).includes(
          month.toString()
        );

        return (
          <div
            key={month}
            className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer hover:bg-blue-50 hover:border-blue-200 transform hover:-translate-y-1"
            onClick={() => {
              setSelectedMonth(month);
              setSelectedView("Mois");
            }}
          >
            <h3 className="text-center font-semibold mb-3 text-indigo-700">
              {new Date(currentYear, month).toLocaleString("fr-FR", {
                month: "long",
              })}
            </h3>

            {/* mini-month days */}
            <div className="grid grid-cols-7 gap-1 text-xs">
              {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                <div key={i} className="text-center text-gray-500">
                  {d}
                </div>
              ))}

              {/* Days of the month */}
              {(() => {
                const firstDay = new Date(currentYear, month, 1).getDay();
                const blanks = firstDay === 0 ? 6 : firstDay - 1;
                const cells = [];

                // Empty cells
                for (let i = 0; i < blanks; i++) {
                  cells.push(<div key={`blank-${i}`} />);
                }

                // Days
                for (
                  let day = 1;
                  day <= new Date(currentYear, month + 1, 0).getDate();
                  day++
                ) {
                  const hasEvt = (allEvents[currentYear]?.[month] || []).some(
                    (e) => new Date(e.date).getDate() === day
                  );
                  const holiday = getHolidayInfo(currentYear, month, day);
                  const isToday =
                    new Date().getDate() === day &&
                    new Date().getMonth() === month &&
                    new Date().getFullYear() === currentYear;

                  cells.push(
                    <div
                      key={day}
                      className={`
                      text-center text-xs p-1 rounded-full
                      ${hasEvt ? "bg-teal-100 ring-1 ring-teal-300" : ""}
                      ${holiday ? "bg-amber-100" : ""}
                      ${isToday ? "ring-1 ring-blue-500" : ""}
                      font-medium transition-all hover:scale-110
                    `}
                    >
                      {day}
                    </div>
                  );
                }

                return cells;
              })()}
            </div>

            {/* Fêtes du mois */}
            <div className="mt-3 text-xs">
              {Object.entries(tunisianHolidays)
                .filter(([key]) => {
                  const [monthStr] = key.split("-");
                  return parseInt(monthStr) === month + 1;
                })
                .slice(0, 2)
                .map(([key, holiday]) => (
                  <div
                    key={key}
                    className={`
                    px-2 py-1 my-1 rounded text-xs flex items-center
                    ${
                      holiday.type === "religious"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }
                  `}
                  >
                    <Star size={10} className="mr-1" />
                    <span className="truncate">
                      {key.split("-")[1]} - {holiday.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Vue journalière avec les heures (plage de 24h)
  const renderDayView = () => {
    if (!selectedDate) return null;

    // Récupérer les événements de la journée sélectionnée
    const dateEvents = (
      allEvents[selectedDate.getFullYear()]?.[selectedDate.getMonth()] || []
    )
      .filter((e) => new Date(e.date).getDate() === selectedDate.getDate())
      .sort((a, b) => a.time.localeCompare(b.time));

    // Si jour férié, l'afficher en haut
    const holiday = getHolidayInfo(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    return (
      <div className="space-y-4">
        {/* Affichage jour férié s'il existe */}
        {holiday && (
          <div
            className={`
            p-3 rounded-lg border flex items-center 
            ${
              holiday.type === "religious"
                ? "bg-emerald-100 border-emerald-200 text-emerald-800"
                : "bg-amber-100 border-amber-200 text-amber-800"
            }
            animate-fadeIn
          `}
          >
            <Star size={18} className="mr-2" />
            <div>
              <p className="font-medium">{holiday.name}</p>
              <p className="text-sm opacity-75">
                Jour férié{" "}
                {holiday.type === "religious" ? "religieux" : "national"}
              </p>
            </div>
          </div>
        )}

        {/* Vue par heure sur 24h */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-md">
          <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50 border-b px-4 py-3 font-medium text-indigo-800 flex items-center">
            <Clock size={18} className="mr-2 text-indigo-600" />
            Horaires -{" "}
            <span className="font-semibold ml-1">
              {selectedDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>

          <div className="overflow-y-auto max-h-[600px] overflow-x-hidden custom-scrollbar">
            {[...Array(24)].map((_, i) => {
              const hourStr = String(i).padStart(2, "0");
              const hourEvents = dateEvents.filter((e) =>
                e.time.startsWith(hourStr + ":")
              );
              const isCurrentHour =
                new Date().getHours() === i &&
                new Date().toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={i}
                  className={`flex ${
                    isCurrentHour ? "bg-blue-50" : ""
                  } hover:bg-gray-50 border-b last:border-b-0 group`}
                >
                  {/* Heure */}
                  <div
                    className={`w-20 py-3 flex-shrink-0 border-r text-right pr-2 
                    ${
                      isCurrentHour
                        ? "font-bold text-blue-700"
                        : "text-gray-500 font-medium"
                    }`}
                  >
                    {formatTime(`${hourStr}:00`)}
                  </div>

                  {/* Conteneur pour les événements */}
                  <div className="flex-1 p-1 min-h-[60px] relative">
                    {hourEvents.length === 0 ? (
                      <div className="flex items-center justify-center h-full w-full">
                        {!holiday && !isPastDate(selectedDate) ? (
                          <button
                            onClick={() =>
                              openReservationModal(`${hourStr}:00`)
                            }
                            className="text-xs text-gray-400 hover:text-teal-600 py-1 px-2 rounded-md hover:bg-teal-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Users size={12} className="inline mr-1" />
                            Ajouter une réservation
                          </button>
                        ) : isPastDate(selectedDate) ? (
                          <span className="text-xs text-red-400 py-1 px-2 opacity-0 group-hover:opacity-100">
                            <AlertCircle size={12} className="inline mr-1" />
                            Date passée - Réservation impossible
                          </span>
                        ) : (
                          <span className="text-xs text-red-400 py-1 px-2 opacity-0 group-hover:opacity-100">
                            <AlertCircle size={12} className="inline mr-1" />
                            Jour férié - Réservation impossible
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {hourEvents.map((e) => (
                          <div
                            key={e.id}
                            className="px-3 py-2 rounded-md text-white text-sm shadow-md
                              bg-teal-500 hover:bg-teal-600 cursor-pointer
                              transition-all hover:translate-x-1 flex justify-between items-center"
                          >
                            <div>
                              <div className="font-medium">{e.title}</div>
                              <div className="text-xs text-white/90">
                                {formatTime(e.time)}
                              </div>
                            </div>

                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                confirmDeleteReservation(
                                  event,
                                  e.id,
                                  e.title,
                                  e.time
                                );
                              }}
                              className="text-white/70 hover:text-white ml-2 p-1 hover:bg-red-500 rounded transition-colors"
                              title="Supprimer cette réservation"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-white p-6 border-r shadow-lg rounded-lg md:rounded-r-none m-2 md:m-0">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4 sm:mb-0 flex items-center">
            <CalendarIcon size={24} className="mr-2 text-indigo-600" />
            Calendrier
          </h2>
          <div className="flex gap-2">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg flex items-center shadow-md transition-all hover:translate-y-[-2px]"
              onClick={openReservationModal}
            >
              <Users size={18} className="mr-1" />
              Réservation
            </button>
          </div>
        </div>

        {selectedDate ? (
          <>
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg mb-4 shadow-inner">
              <h3 className="font-medium text-indigo-800">
                Date sélectionnée :
              </h3>
              <p className="text-lg text-indigo-900 font-semibold">
                {selectedDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              {/* Affichage des jours fériés ou dates passées */}
              {(() => {
                // Vérifier si c'est une date passée
                if (isPastDate(selectedDate)) {
                  return (
                    <div className="mt-2 p-2 rounded-md flex items-center bg-gray-100 text-gray-700">
                      <AlertCircle size={16} className="mr-2" />
                      Date passée
                      <span className="ml-1 text-sm font-medium px-2 py-0.5 rounded bg-red-100 text-red-700">
                        Réservation impossible
                      </span>
                    </div>
                  );
                }

                const holiday = getHolidayInfo(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate()
                );

                if (holiday) {
                  return (
                    <div
                      className={`
        mt-2 p-2 rounded-md flex items-center
        ${
          holiday.type === "religious"
            ? "bg-emerald-100 text-emerald-800"
            : "bg-amber-100 text-amber-800"
        }
      `}
                    >
                      <Star size={16} className="mr-2" /> {holiday.name}
                      {/* Supprimer la mention "Réservation impossible" */}
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Format d'heure toggle */}
            <div className="mb-4 flex justify-end items-center gap-2">
              <span className="text-sm text-gray-500">Format:</span>
              <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                <button
                  onClick={() => setTimeView("12h")}
                  className={`px-3 py-1 text-sm rounded ${
                    timeView === "12h"
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  } transition-colors`}
                >
                  12h
                </button>
                <button
                  onClick={() => setTimeView("24h")}
                  className={`px-3 py-1 text-sm rounded ${
                    timeView === "24h"
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  } transition-colors`}
                >
                  24h
                </button>
              </div>
            </div>

            {/* Liste des réservations pour le jour sélectionné */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {(
                allEvents[selectedDate.getFullYear()]?.[
                  selectedDate.getMonth()
                ] || []
              )
                .filter(
                  (e) => new Date(e.date).getDate() === selectedDate.getDate()
                )
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((e) => (
                  <div
                    key={e.id}
                    className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all border-l-4 border-l-teal-500 group animate-fadeIn cursor-pointer hover:translate-y-1"
                    onClick={() => setReservationDetail(e)}
                  >
                    <div className="flex-1 space-y-2">
                      {/* Titre et service */}
                      <div className="border-b border-gray-100 pb-2">
                        <h4 className="font-semibold text-teal-700">
                          {e.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock size={14} className="mr-1" />
                          {formatTime(e.time)}
                        </div>
                      </div>

                      {/* Informations client */}
                      <div className="border-b border-gray-100 pb-2">
                        <div className="font-medium text-xs text-gray-500 mb-1">
                          CLIENT
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-teal-100 text-teal-700 p-1 rounded flex items-center justify-center h-7 w-7">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {e.clientFirstName} {e.clientLastName}
                            </div>
                            <div className="text-xs text-gray-600 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                              {e.clientPhoneNumber}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Employé */}
                      {e.employee && (
                        <div className="pt-1">
                          <div className="font-medium text-xs text-gray-500 mb-1">
                            EMPLOYÉ
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full overflow-hidden border-2 border-indigo-100 flex-shrink-0">
                              {e.employee.imageUrl ? (
                                <img
                                  src={e.employee.imageUrl}
                                  alt={`${e.employee.firstName} ${e.employee.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div
                                  className={`h-full w-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(
                                    e.employee.id
                                  )}`}
                                >
                                  {getInitials(
                                    e.employee.firstName,
                                    e.employee.lastName
                                  )}
                                </div>
                              )}
                            </div>
                            <span className="text-gray-700">
                              {e.employee.firstName} {e.employee.lastName}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Bouton supprimer */}
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          confirmDeleteReservation(
                            event,
                            e.id,
                            e.title,
                            e.time
                          );
                        }}
                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Supprimer cette réservation"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              {!(
                allEvents[selectedDate.getFullYear()]?.[
                  selectedDate.getMonth()
                ] || []
              ).some(
                (e) => new Date(e.date).getDate() === selectedDate.getDate()
              ) && (
                <div className="text-center text-gray-500 p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <CalendarIcon
                    size={32}
                    className="mx-auto mb-2 text-gray-400"
                  />
                  <p>Aucune réservation pour cette date</p>
                  <div className="flex justify-center gap-2 mt-3">
                    <button
                      onClick={openReservationModal}
                      className="text-sm text-emerald-600 hover:bg-emerald-500 hover:text-white px-4 py-2 border border-emerald-300 rounded-md transition-colors"
                    >
                      <Users size={14} className="inline mr-1" />
                      Ajouter une réservation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 p-10 bg-gray-50 rounded-lg border border-gray-100">
            <CalendarIcon size={48} className="mx-auto mb-2" />
            <p>Sélectionnez une date pour voir ou ajouter des réservations</p>
          </div>
        )}
      </div>

      {/* Main calendar */}
      <div className="flex-grow p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <button
              onClick={() => setCurrentYear((y) => y - 1)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Année précédente"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">{currentYear}</h2>
            <button
              onClick={() => setCurrentYear((y) => y + 1)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Année suivante"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Month/Year/Day toggle */}
          <div className="flex border-b">
            {["Jour", "Mois", "Année"].map((v) => (
              <button
                key={v}
                onClick={() => setSelectedView(v)}
                className={`flex-1 py-3 font-medium transition-colors ${
                  selectedView === v
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="p-6">
            {selectedView === "Mois" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() =>
                      setSelectedMonth((m) => (m > 0 ? m - 1 : 11))
                    }
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <ChevronLeft />
                  </button>
                  <h3 className="text-xl font-medium text-indigo-800">
                    {new Date(currentYear, selectedMonth).toLocaleString(
                      "fr-FR",
                      { month: "long" }
                    )}
                  </h3>
                  <button
                    onClick={() =>
                      setSelectedMonth((m) => (m < 11 ? m + 1 : 0))
                    }
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <ChevronRight />
                  </button>
                </div>
                {renderCalendarGrid(selectedMonth)}
              </>
            )}

            {selectedView === "Année" && renderYearView()}

            {selectedView === "Jour" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(newDate.getDate() - 1);
                      setSelectedDate(newDate);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <ChevronLeft />
                  </button>
                  <h3 className="text-xl font-medium text-indigo-800">
                    {selectedDate.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </h3>
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(newDate.getDate() + 1);
                      setSelectedDate(newDate);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <ChevronRight />
                  </button>
                </div>
                {renderDayView()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Réservation Modal ───────────────────────────────────────── */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-auto">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scaleIn">
            {/* En-tête du formulaire */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-xl shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-xl md:text-2xl font-bold flex items-center">
                  <Users size={24} className="mr-3" />
                  Nouvelle réservation
                </h3>
                <button
                  onClick={() => setShowReservationModal(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
              <p className="mt-2 text-white/80">
                {selectedDate &&
                  selectedDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
              </p>
            </div>

            {/* Corps du formulaire */}
            <div className="p-6">
              {submitSuccess && (
                <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 flex items-center animate-slideIn">
                  <div className="bg-emerald-500 text-white p-2 rounded-full mr-3">
                    <Check size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Réservation créée avec succès !
                    </h4>
                    <p className="text-sm text-emerald-700">
                      La réservation a été ajoutée à votre calendrier.
                    </p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-xl border border-red-200 flex items-center animate-slideIn">
                  <div className="bg-red-500 text-white p-2 rounded-full mr-3">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Erreur</h4>
                    <p className="text-sm text-red-700">{submitError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={submitReservation} className="space-y-8">
                {/* Section Service et Employé */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3">
                      <CalendarIcon size={20} />
                    </div>
                    Détails du service
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Service */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                        Service <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="serviceId"
                        value={reservationForm.serviceId || ""}
                        onChange={handleReservationInput}
                        className={`w-full border rounded-xl p-3 focus:ring-2 focus:outline-none transition-colors ${
                          formErrors.serviceId
                            ? "border-red-300 bg-red-50 focus:ring-red-200"
                            : "focus:ring-blue-200 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <option value="">— Choisir un service —</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.serviceId && (
                        <p className="text-red-500 text-sm mt-1 flex items-start ml-1">
                          <AlertCircle
                            size={14}
                            className="mr-1 mt-0.5 flex-shrink-0"
                          />
                          {formErrors.serviceId}
                        </p>
                      )}
                    </div>

                    {/* Heure */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                        Heure <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <Clock size={18} />
                        </div>
                        <input
                          type="time"
                          name="time"
                          value={reservationForm.time}
                          onChange={handleReservationInput}
                          className={`w-full border rounded-xl p-3 pl-10 focus:ring-2 focus:outline-none transition-colors ${
                            formErrors.time
                              ? "border-red-300 bg-red-50 focus:ring-red-200"
                              : "focus:ring-blue-200 border-gray-200 hover:border-blue-300"
                          }`}
                        />
                      </div>
                      {formErrors.time && (
                        <p className="text-red-500 text-sm mt-1 flex items-start ml-1">
                          <AlertCircle
                            size={14}
                            className="mr-1 mt-0.5 flex-shrink-0"
                          />
                          {formErrors.time}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Nombre de participants */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                      Nombre de participants{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Users size={18} />
                      </div>
                      <input
                        type="number"
                        name="numberOfAttendees"
                        min="1"
                        value={reservationForm.numberOfAttendees || ""}
                        onChange={handleReservationInput}
                        className={`w-full border rounded-xl p-3 pl-10 focus:ring-2 focus:outline-none transition-colors ${
                          formErrors.numberOfAttendees
                            ? "border-red-300 bg-red-50 focus:ring-red-200"
                            : "focus:ring-blue-200 border-gray-200 hover:border-blue-300"
                        }`}
                      />
                    </div>
                    {formErrors.numberOfAttendees && (
                      <p className="text-red-500 text-sm mt-1 flex items-start ml-1">
                        <AlertCircle
                          size={14}
                          className="mr-1 mt-0.5 flex-shrink-0"
                        />
                        {formErrors.numberOfAttendees}
                      </p>
                    )}
                  </div>

                  {/* Affichage conditionnel de la sélection d'employé */}
                  {(() => {
                    const svc = services.find(
                      (s) => s.id === +reservationForm.serviceId
                    );
                    if (svc?.requiresEmployeeSelection) {
                      return (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <label className="block text-sm font-medium text-gray-700 mb-3 ml-1">
                            Choisir un employé{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
                            {svc.employees.map((emp) => (
                              <div
                                key={emp.id}
                                onClick={() => {
                                  const newValue =
                                    +reservationForm.employeeId === emp.id
                                      ? null
                                      : emp.id.toString();
                                  handleReservationInput({
                                    target: {
                                      name: "employeeId",
                                      value: newValue,
                                    },
                                  });
                                }}
                                className={`bg-white rounded-2xl p-3 shadow-sm border transition-all cursor-pointer transform ${
                                  +reservationForm.employeeId === emp.id
                                    ? "scale-105 border-blue-400 ring-2 ring-blue-300 shadow-md"
                                    : "border-gray-200 hover:border-blue-300 hover:scale-105"
                                } w-full max-w-[120px]`}
                              >
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`h-16 w-16 rounded-full overflow-hidden shadow-sm border-2 ${
                                      +reservationForm.employeeId === emp.id
                                        ? "border-blue-500"
                                        : "border-gray-200"
                                    }`}
                                  >
                                    {emp.imageUrl ? (
                                      <img
                                        src={emp.imageUrl}
                                        alt={`${emp.firstName} ${emp.lastName}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div
                                        className={`h-full w-full bg-gradient-to-br ${getAvatarColor(
                                          emp.id
                                        )} flex items-center justify-center text-white`}
                                      >
                                        <span className="font-bold text-lg">
                                          {getInitials(
                                            emp.firstName,
                                            emp.lastName
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-center mt-2 font-medium text-gray-700 line-clamp-1">
                                    {emp.firstName}
                                  </p>
                                  <p className="text-center text-sm text-gray-500 line-clamp-1">
                                    {emp.lastName}
                                  </p>
                                </div>
                                {+reservationForm.employeeId === emp.id && (
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                                    <Check size={14} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {formErrors.employeeId && (
                            <p className="text-red-500 text-sm mt-3 flex items-start ml-1">
                              <AlertCircle
                                size={14}
                                className="mr-1 mt-0.5 flex-shrink-0"
                              />
                              {formErrors.employeeId}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Section Informations Client */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg mr-3">
                      <Users size={20} />
                    </div>
                    Informations client
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Prénom */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="clientFirstName"
                        value={reservationForm.clientFirstName}
                        onChange={handleReservationInput}
                        className={`w-full border rounded-xl p-3 focus:ring-2 focus:outline-none transition-colors ${
                          formErrors.clientFirstName
                            ? "border-red-300 bg-red-50 focus:ring-red-200"
                            : "focus:ring-blue-200 border-gray-200 hover:border-blue-300"
                        }`}
                        placeholder="Prénom du client"
                      />
                      {formErrors.clientFirstName && (
                        <p className="text-red-500 text-sm mt-1 flex items-start ml-1">
                          <AlertCircle
                            size={14}
                            className="mr-1 mt-0.5 flex-shrink-0"
                          />
                          {formErrors.clientFirstName}
                        </p>
                      )}
                    </div>

                    {/* Nom */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="clientLastName"
                        value={reservationForm.clientLastName}
                        onChange={handleReservationInput}
                        className={`w-full border rounded-xl p-3 focus:ring-2 focus:outline-none transition-colors ${
                          formErrors.clientLastName
                            ? "border-red-300 bg-red-50 focus:ring-red-200"
                            : "focus:ring-blue-200 border-gray-200 hover:border-blue-300"
                        }`}
                        placeholder="Nom du client"
                      />
                      {formErrors.clientLastName && (
                        <p className="text-red-500 text-sm mt-1 flex items-start ml-1">
                          <AlertCircle
                            size={14}
                            className="mr-1 mt-0.5 flex-shrink-0"
                          />
                          {formErrors.clientLastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="clientPhoneNumber"
                        value={reservationForm.clientPhoneNumber}
                        onChange={handleReservationInput}
                        className={`w-full border rounded-xl p-3 pl-10 focus:ring-2 focus:outline-none transition-colors ${
                          formErrors.clientPhoneNumber
                            ? "border-red-300 bg-red-50 focus:ring-red-200"
                            : "focus:ring-blue-200 border-gray-200 hover:border-blue-300"
                        }`}
                        placeholder="Numéro de téléphone"
                      />
                    </div>
                    {formErrors.clientPhoneNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-start ml-1">
                        <AlertCircle
                          size={14}
                          className="mr-1 mt-0.5 flex-shrink-0"
                        />
                        {formErrors.clientPhoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Email (optional) */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div className="relative inline-block w-10 h-5 transition-colors duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="hasClientEmail"
                            checked={hasClientEmail}
                            onChange={(e) => {
                              setHasClientEmail(e.target.checked);
                              if (!e.target.checked) {
                                setReservationForm((f) => ({
                                  ...f,
                                  clientEmail: "",
                                }));
                                setFormErrors((prev) => {
                                  const updated = { ...prev };
                                  delete updated.clientEmail;
                                  return updated;
                                });
                              }
                            }}
                            className="absolute opacity-0 w-0 h-0"
                          />
                          <span
                            className={`block w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${
                              hasClientEmail ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          ></span>
                          <span
                            className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                              hasClientEmail ? "transform translate-x-5" : ""
                            }`}
                          ></span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Le client a un email
                        </span>
                      </label>
                    </div>

                    {hasClientEmail && (
                      <div className="mt-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                          </div>
                          <input
                            type="email"
                            name="clientEmail"
                            value={reservationForm.clientEmail}
                            onChange={handleReservationInput}
                            className={`w-full border rounded-xl p-3 pl-10 focus:ring-2 focus:outline-none transition-colors ${
                              formErrors.clientEmail
                                ? "border-red-300 bg-red-50 focus:ring-red-200"
                                : "focus:ring-blue-200 border-gray-200 hover:border-blue-300"
                            }`}
                            placeholder="Email du client"
                          />
                        </div>
                        {formErrors.clientEmail && (
                          <p className="text-red-500 text-sm mt-1 flex items-start ml-1">
                            <AlertCircle
                              size={14}
                              className="mr-1 mt-0.5 flex-shrink-0"
                            />
                            {formErrors.clientEmail}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReservationModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl font-medium text-white shadow-md transition-all ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                            d="M4 12a8 8 0 100-16 8 8 0 000 16z"
                          ></path>
                        </svg>
                        Création en cours...
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                          </svg>
                          Créer la réservation
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(40px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(40px);
            opacity: 0;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-slideOut {
          animation: slideOut 0.5s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        /* Custom scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(79, 70, 229, 0.3);
          border-radius: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(79, 70, 229, 0.5);
        }
      `}</style>

      {/* Modal de confirmation de suppression */}
      {deleteConfirmation && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setDeleteConfirmation(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-500 p-4 text-white flex items-center">
              <AlertCircle size={24} className="mr-2" />
              <h3 className="text-lg font-medium">Confirmer la suppression</h3>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  Êtes-vous sûr de vouloir supprimer cette réservation ?
                </p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2">
                  <div className="font-medium text-gray-800">
                    {deleteConfirmation.title}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <Clock size={14} className="mr-1" />
                    {formatTime(deleteConfirmation.time)}
                  </div>
                </div>
                <p className="text-sm text-red-600">
                  Cette action est irréversible et supprimera définitivement la
                  réservation.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmation(null)}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => deleteReservation(deleteConfirmation.id)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          d="M4 12a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Suppression...
                    </span>
                  ) : (
                    <>
                      <X size={18} className="mr-1" />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {reservationDetail && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setReservationDetail(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 animate-scaleIn relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => setReservationDetail(null)}
            >
              <X size={22} />
            </button>
            <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
              <CalendarIcon size={20} className="mr-2" />
              Détail réservation
            </h3>
            <div className="space-y-3">
              {/* Service */}
              <div className="bg-blue-50 p-2 rounded-lg">
                <span className="font-medium text-blue-700">Service :</span>
                <span className="ml-1 text-gray-800">
                  {reservationDetail.title}
                </span>
              </div>

              {/* Date et heure */}
              <div className="bg-gray-50 p-2 rounded-lg flex justify-between">
                <div>
                  <span className="font-medium text-gray-700">Date :</span>
                  <span className="ml-1">{reservationDetail.date}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Heure :</span>
                  <span className="ml-1">
                    {formatTime(reservationDetail.time)}
                  </span>
                </div>
              </div>

              {/* Client info */}
              <div className="bg-teal-50 p-2 rounded-lg space-y-1">
                <div className="font-medium text-teal-700">
                  Informations client :
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Nom complet :
                  </span>{" "}
                  {reservationDetail.clientFirstName}{" "}
                  {reservationDetail.clientLastName}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Téléphone :</span>{" "}
                  {reservationDetail.clientPhoneNumber || "Non renseigné"}
                </div>
                {reservationDetail.clientEmail && (
                  <div>
                    <span className="font-medium text-gray-700">Email :</span>{" "}
                    {reservationDetail.clientEmail}
                  </div>
                )}
              </div>

              {/* Employee */}
              {reservationDetail.employee && (
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <span className="font-medium text-indigo-700">Employé :</span>{" "}
                  {reservationDetail.employee.firstName}{" "}
                  {reservationDetail.employee.lastName}
                </div>
              )}

              {/* Participants */}
              <div>
                <span className="font-medium text-gray-700">
                  Participants :
                </span>{" "}
                {reservationDetail.numberOfAttendees}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
