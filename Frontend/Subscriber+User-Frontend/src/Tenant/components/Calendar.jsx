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
    numberOfAttendees: null,
    startTime: "",
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
    // adjust these as needed for your auth cookie names
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

    fetchServices();
    fetchEmployees();

    // Définir la date du jour comme date sélectionnée par défaut
    setSelectedDate(new Date());
  }, []);

  // ─── Fetchers ──────────────────────────────────────────────────────
  const fetchServices = async () => {
    try {
      const { data } = await axios.get("/schedule/service/getall");
      setServices(data);
      // after services, also fetch existing reservations to display
      fetchReservations(data);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get("/schedule/employee/getall");
      setEmployees(data);
    } catch (error) {
      console.error("Erreur lors du chargement des employés:", error);
    }
  };

  const fetchReservations = async (svcList = services) => {
    try {
      const { data } = await axios.get("/schedule/reservation/getall");
      // build month→events map
      const byMonth = {};
      data.forEach((r) => {
        // Convertir la date UTC en date locale
        const dt = new Date(r.startTime);

        const m = dt.getMonth();
        const svc = svcList.find((s) => s.id === r.serviceId);
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
        };

        byMonth[m] = [...(byMonth[m] || []), evt];
      });

      // Remplacer complètement les événements par les réservations
      setAllEvents(byMonth);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    }
  };

  // ─── Helpers ───────────────────────────────────────────────────────
  // Obtenir les jours fériés pour une date donnée
  const getHolidayInfo = (year, month, day) => {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateKey = `${monthStr}-${dayStr}`;

    return tunisianHolidays[dateKey];
  };

  // Formater l'heure en fonction du format sélectionné (12h ou 24h)
  const formatTime = (timeStr) => {
    if (timeView === "24h" || !timeStr) return timeStr;

    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    return `${h}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // Vérifier si un événement est une réservation (toujours vrai maintenant)
  const isReservation = () => {
    return true; // Tous les événements sont des réservations maintenant
  };

  // ─── Réservation Handlers ─────────────────────────────────────────
  const openReservationModal = () => {
    if (!selectedDate) {
      alert("Veuillez sélectionner une date d'abord");
      return;
    }
    setReservationForm({
      serviceId: null,
      employeeId: null,
      time: "09:00",
      numberOfAttendees: null,
      startTime: "",
    });
    setFormErrors({});
    setSubmitSuccess(false);
    setSubmitError("");
    setShowReservationModal(true);
  };

  const validateForm = () => {
    const e = {};
    if (!reservationForm.serviceId) {
      e.serviceId = "Service requis";
    } else {
      const svc = services.find((s) => s.id === +reservationForm.serviceId);
      if (svc?.requiresEmployeeSelection && !reservationForm.employeeId) {
        e.employeeId = "Employé requis";
      }
    }
    if (!reservationForm.time) e.time = "Heure requise";
    if (reservationForm.numberOfAttendees < 1) {
      e.numberOfAttendees = "Au moins 1 participant";
    }
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReservationInput = (e) => {
    const { name, value } = e.target;
    setReservationForm((f) => ({ ...f, [name]: value }));
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
      });

      setSubmitSuccess(true);
      // refresh events
      fetchReservations();
      // auto-close after a moment
      setTimeout(() => {
        setShowReservationModal(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Erreur lors de la création"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Reservation delete handler ───────────────────────────────────
  const deleteReservation = async (id) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")
    ) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/schedule/reservation/delete/${id}`);

      // Mise à jour immédiate de l'état local (sans rechargement)
      setAllEvents((prevEvents) => {
        const updatedEvents = {};

        // Pour chaque mois dans les événements
        Object.keys(prevEvents).forEach((month) => {
          // Filtrer pour retirer l'événement supprimé
          updatedEvents[month] = prevEvents[month].filter(
            (event) => event.id !== id
          );
        });

        return updatedEvents;
      });

      // Message de succès plus discret avec disparition automatique
      const successAlert = document.createElement("div");
      successAlert.className =
        "fixed top-4 right-4 bg-emerald-100 text-emerald-800 p-3 rounded-lg shadow-md animate-fadeIn z-50";
      successAlert.innerHTML = `<div class="flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Réservation supprimée</div>`;
      document.body.appendChild(successAlert);

      // Retire le message après 2 secondes
      setTimeout(() => {
        successAlert.classList.add("animate-fadeOut");
        setTimeout(() => successAlert.remove(), 300);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert(
        "Erreur lors de la suppression: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Calendar Render Helpers ──────────────────────────────────────
  const renderCalendarGrid = (month) => {
    const firstDay = new Date(currentYear, month, 1).getDay();
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const monthEvents = allEvents[month] || [];

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
      const evts = monthEvents.filter(
        (e) => new Date(e.date).getDate() === day
      );

      // Vérifier s'il y a un jour férié
      const holiday = getHolidayInfo(currentYear, month, day);

      cells.push(
        <div
          key={day}
          onClick={() => setSelectedDate(dt)}
          className={`
            p-2 h-24 sm:h-28 md:h-32 rounded-lg cursor-pointer relative
            overflow-hidden
            ${
              isSel
                ? "bg-blue-100 border-2 border-blue-400"
                : "border border-gray-200"
            }
            ${isToday ? "ring-2 ring-blue-500 ring-inset" : ""}
            ${
              holiday
                ? holiday.type === "religious"
                  ? "bg-emerald-50"
                  : "bg-amber-50"
                : "hover:bg-blue-50"
            }
            transition-colors duration-200
          `}
        >
          {/* Numéro du jour */}
          <div className="flex justify-between items-start mb-1">
            <span
              className={`
              inline-flex justify-center items-center w-7 h-7 rounded-full font-medium
              ${isSel ? "bg-blue-500 text-white" : ""}
              ${isToday && !isSel ? "bg-blue-200 text-blue-800" : ""}
              ${
                holiday && !isSel && !isToday
                  ? holiday.type === "religious"
                    ? "bg-emerald-200 text-emerald-800"
                    : "bg-amber-200 text-amber-800"
                  : ""
              }
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
                `}
                title={holiday.name}
              >
                <Star size={10} className="mr-1" />
                <span className="hidden sm:inline">
                  {holiday.name.length > 8
                    ? holiday.name.substring(0, 8) + "..."
                    : holiday.name}
                </span>
              </span>
            )}
          </div>

          {/* Liste des réservations */}
          <div className="mt-1 space-y-1 max-h-20 overflow-y-auto scrollbar-thin">
            {evts.slice(0, 3).map((e) => (
              <div
                key={e.id}
                title={`${e.title} - ${formatTime(e.time)}`}
                className="text-xs text-white px-1 py-0.5 rounded truncate flex items-center bg-teal-500 hover:bg-teal-600 shadow-sm"
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
              <div className="text-xs text-gray-500 font-medium text-center bg-gray-100 rounded py-0.5">
                +{evts.length - 3} {evts.length - 3 > 1 ? "autres" : "autre"}
              </div>
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
      {[...Array(12)].map((_, month) => (
        <div
          key={month}
          className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50"
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
                const hasEvt = (allEvents[month] || []).some(
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
                      ${hasEvt ? "bg-teal-100" : ""}
                      ${holiday ? "bg-amber-100" : ""}
                      ${isToday ? "ring-1 ring-blue-500" : ""}
                      font-medium
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
      ))}
    </div>
  );

  // Vue journalière avec les heures (plage de 24h)
  const renderDayView = () => {
    if (!selectedDate) return null;

    // Récupérer les événements de la journée sélectionnée
    const dateEvents = (allEvents[selectedDate.getMonth()] || [])
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
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white border-b px-4 py-2 font-medium text-gray-800">
            Horaires -{" "}
            {selectedDate.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </div>

          <div className="overflow-y-auto max-h-[600px] overflow-x-hidden">
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
                  } hover:bg-gray-50`}
                >
                  {/* Heure */}
                  <div className="w-20 py-3 flex-shrink-0 border-r text-right pr-2 text-gray-500 font-medium">
                    {formatTime(`${hourStr}:00`)}
                  </div>

                  {/* Conteneur pour les événements */}
                  <div className="flex-1 p-1 min-h-[60px] relative">
                    {hourEvents.length === 0 ? (
                      <div className="flex items-center justify-center h-full w-full">
                        <button
                          onClick={openReservationModal}
                          className="text-xs text-gray-400 hover:text-teal-600 py-1"
                        >
                          <Users size={12} className="inline mr-1" />
                          Ajouter une réservation
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {hourEvents.map((e) => (
                          <div
                            key={e.id}
                            className="px-3 py-1.5 rounded-md text-white text-sm shadow-sm
                              bg-teal-500 hover:bg-teal-600 cursor-pointer
                              transition-transform hover:translate-x-1 flex justify-between items-center"
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
                                deleteReservation(e.id);
                              }}
                              className="text-white/70 hover:text-white ml-2"
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
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4 sm:mb-0">
            Calendrier
          </h2>
          <div className="flex gap-2">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg flex items-center shadow-md transition-all"
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

              {/* Affichage des jours fériés */}
              {(() => {
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
                      : "text-gray-600"
                  }`}
                >
                  12h
                </button>
                <button
                  onClick={() => setTimeView("24h")}
                  className={`px-3 py-1 text-sm rounded ${
                    timeView === "24h"
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  24h
                </button>
              </div>
            </div>

            {/* Liste des réservations pour le jour sélectionné */}
            <div
              className="space-y-3 max-h-96 overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(203, 213, 225, 0.5) transparent",
              }}
            >
              {(allEvents[selectedDate.getMonth()] || [])
                .filter(
                  (e) => new Date(e.date).getDate() === selectedDate.getDate()
                )
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((e) => (
                  <div
                    key={e.id}
                    className="bg-white border rounded-lg p-4 shadow-sm flex items-start gap-3 
                      hover:shadow-md transition-shadow border-l-4 border-l-teal-500"
                  >
                    <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0 bg-teal-500" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{e.title}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />{" "}
                        {formatTime(e.time)}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteReservation(e.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      title="Supprimer cette réservation"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              {!(allEvents[selectedDate.getMonth()] || []).some(
                (e) => new Date(e.date).getDate() === selectedDate.getDate()
              ) && (
                <div className="text-center text-gray-500 p-6 bg-gray-50 rounded-lg">
                  <CalendarIcon
                    size={32}
                    className="mx-auto mb-2 text-gray-400"
                  />
                  <p>Aucune réservation pour cette date</p>
                  <div className="flex justify-center gap-2 mt-3">
                    <button
                      onClick={openReservationModal}
                      className="text-sm text-emerald-600 hover:underline px-3 py-1 border border-emerald-300 rounded-md hover:bg-emerald-50"
                    >
                      Ajouter une réservation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 p-10 bg-gray-50 rounded-lg">
            <CalendarIcon size={48} className="mx-auto mb-2" />
            <p>Sélectionnez une date pour voir ou ajouter</p>
          </div>
        )}
      </div>

      {/* Main calendar */}
      <div className="flex-grow p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
            <button
              onClick={() => setCurrentYear((y) => y - 1)}
              className="p-1 hover:bg-white/20 rounded transition"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">{currentYear}</h2>
            <button
              onClick={() => setCurrentYear((y) => y + 1)}
              className="p-1 hover:bg-white/20 rounded transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-semibold text-emerald-800">
                Nouvelle réservation
              </h3>
              <button
                onClick={() => setShowReservationModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            {submitSuccess && (
              <div className="mb-4 p-3 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Réservation créée avec succès !
              </div>
            )}

            {submitError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {submitError}
              </div>
            )}

            <form onSubmit={submitReservation} className="space-y-4">
              {/* Date sélectionnée */}
              <div className="mb-4 bg-emerald-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  Date de réservation:
                </p>
                <p className="font-medium text-emerald-800">
                  {selectedDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service
                </label>
                <select
                  name="serviceId"
                  value={reservationForm.serviceId || ""}
                  onChange={handleReservationInput}
                  className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">— Choisir un service —</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {formErrors.serviceId && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.serviceId}
                  </p>
                )}
              </div>

              {/* Employee */}
              {(() => {
                const svc = services.find(
                  (s) => s.id === +reservationForm.serviceId
                );
                if (svc?.requiresEmployeeSelection) {
                  return (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Employé
                      </label>
                      <select
                        name="employeeId"
                        value={reservationForm.employeeId || ""}
                        onChange={handleReservationInput}
                        className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="">— Choisir un employé —</option>
                        {svc.employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                          </option>
                        ))}
                      </select>
                      {formErrors.employeeId && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.employeeId}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heure
                </label>
                <input
                  type="time"
                  name="time"
                  value={reservationForm.time}
                  onChange={handleReservationInput}
                  className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {formErrors.time && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.time}</p>
                )}
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de participants
                </label>
                <input
                  type="number"
                  name="numberOfAttendees"
                  min="1"
                  value={reservationForm.numberOfAttendees || ""}
                  onChange={handleReservationInput}
                  className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {formErrors.numberOfAttendees && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.numberOfAttendees}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white shadow transition ${
                    loading
                      ? "bg-gray-400"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {loading ? "En cours..." : "Créer réservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out forwards;
        }

        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(79, 70, 229, 0.3);
          border-radius: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(79, 70, 229, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Calendar;