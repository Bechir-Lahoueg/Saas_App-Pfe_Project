import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Users,
  Check,
  X,
  Info,
  ChevronDown,
  ChevronRight,
  Map,
  Phone,
  Mail,
  Star,
  Heart,
  Clock4,
  Play,
  Plus,
  CheckSquare, // Ajout de CheckSquare qui était manquant
  User, // Ajout de User qui pourrait aussi être utilisé
} from "lucide-react";
import planifygoLogo from "../assets/LogoPlanifygoPNG.png";

// Utility to map JS getDay() to backend DayOfWeek
const JS_DAY_TO_BACKEND = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function formatLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Extraction du composant de confirmation en dehors du composant principal
const ConfirmationComponent = ({
  selectedDate,
  selectedTime,
  selectedService,
  selectedEmployee,
  clientInfo,
  setClientInfo,
}) => {
  // Simple onChange handler
  const handleChange = (field) => (e) => {
    setClientInfo((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Check className="h-5 w-5 mr-2.5 text-indigo-600" />
        Récapitulatif de votre réservation
      </h3>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-5 mb-8">
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-indigo-700" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">Date et heure</div>
              <div className="font-semibold text-gray-900 mt-1">
                {selectedDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                à <span className="text-indigo-700">{selectedTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="h-5 w-5 text-indigo-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">Service</div>
              <div className="font-semibold text-gray-900 mt-1">
                {selectedService?.name}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-sm text-gray-700 mr-4">
                  <Clock className="h-4 w-4 text-gray-500 mr-1.5" />
                  <span>{selectedService?.duration} min</span>
                </div>
                <div className="text-sm text-indigo-700 font-bold">
                  {selectedService?.price
                    ? `${selectedService?.price}€`
                    : "Sur demande"}
                </div>
              </div>
            </div>
          </div>

          {selectedService?.requiresEmployeeSelection && selectedEmployee && (
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-indigo-700" />
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-500">Spécialiste</div>
                <div className="font-semibold text-gray-900 mt-1 flex items-center">
                  {selectedEmployee.profilePicture ? (
                    <img
                      src={selectedEmployee.profilePicture}
                      alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                      className="h-6 w-6 rounded-full mr-2 object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center mr-2 text-xs font-bold">
                      {`${selectedEmployee.firstName.charAt(
                        0
                      )}${selectedEmployee.lastName.charAt(0)}`}
                    </div>
                  )}
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </div>
                {selectedEmployee.title && (
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedEmployee.title}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client information form - redesigned */}
      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-800 mb-5 flex items-center">
          <svg
            className="h-4 w-4 mr-2 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Vos informations
        </h4>

        <div className="bg-gray-50 p-5 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Prénom *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={clientInfo.firstName}
                onChange={handleChange("firstName")}
                required
                placeholder="Votre prénom"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={clientInfo.lastName}
                onChange={handleChange("lastName")}
                required
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Téléphone *
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={clientInfo.phoneNumber}
                onChange={handleChange("phoneNumber")}
                required
                placeholder="Ex: 06 12 34 56 78"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={clientInfo.email}
                onChange={handleChange("email")}
                required
                placeholder="votre.email@exemple.com"
              />
            </div>
          </div>

          <div className="mt-5 text-sm text-gray-500 flex items-start">
            <svg
              className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Vos données personnelles sont utilisées uniquement pour la gestion
              de votre réservation et la relation commerciale qui en découle.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Reservation() {
  const [tenant, setTenant] = useState("");
  const [availability, setAvailability] = useState(null);
  const [tenantData, setTenantData] = useState(null); // Ajout d'un nouvel état pour les données du tenant
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [providerMedia, setProviderMedia] = useState({
    logo: null,
    banner: null,
    videos: [],
    images: [],
  });
  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [activeVideo, setActiveVideo] = useState(null);
  const videoRef = useRef(null);
  const [existingReservations, setExistingReservations] = useState({});
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Base URL for API
  const API_BASE = `http://${window.location.hostname}:8888`;

  // Default media
  const DEFAULT_MEDIA = {
    logo: "https://placehold.co/400x200?text=Logo",
    banner: "https://placehold.co/800x200?text=Banner",
  };
  useEffect(() => {}, [selectedTime]);
  // Extract tenant from hostname
  useEffect(() => {
    setTenant(window.location.hostname.split(".")[0]);
  }, []);

  // Fetch tenant data and availability
  useEffect(() => {
    if (!tenant) return;

    setLoading(true);
    setLoadingReservations(true);

    // Première requête: récupération des informations du tenant
    const fetchTenantData = fetch(
      `${API_BASE}/auth/tenant/getTenantBySubdomain/${tenant}`
    )
      .then((res) => {
        if (!res.ok)
          throw new Error(
            "Impossible de récupérer les informations du prestataire"
          );
        return res.json();
      })
      .then((data) => {
        setTenantData(data);
        return data;
      });

    // Seconde requête: récupération des disponibilités pour les réservations
    const fetchAvailability = fetch(
      `${API_BASE}/booking/client/reservation/getAvailability`,
      {
        headers: { "X-Tenant-ID": tenant },
      }
    )
      .then((res) => {
        if (!res.ok)
          throw new Error("Impossible de récupérer les disponibilités");
        return res.json();
      })
      .then((data) => {
        const reservationsByDate = {};

        if (data.reservations && Array.isArray(data.reservations)) {
          data.reservations.forEach((reservation) => {
            // Utiliser la date brute de la chaîne ISO (toujours UTC)
            // => On prend la date locale de la réservation, pas celle convertie par JS
            // Si le backend renvoie "2025-05-10T10:00:00.000Z", on veut "2025-05-10"
            // Si le backend renvoie "2025-05-10T10:00:00", on veut aussi "2025-05-10"
            const dateKey = reservation.startTime.substring(0, 10);

            if (!reservationsByDate[dateKey]) {
              reservationsByDate[dateKey] = [];
            }

            // Extraire l'heure sans conversion
            const timeString = reservation.startTime.split("T")[1];
            const formattedStart = timeString.substring(0, 5);

            reservationsByDate[dateKey].push({
              ...reservation,
              formattedStart: formattedStart,
            });
          });
        }

        setExistingReservations(reservationsByDate);
        setLoadingReservations(false);

        // Process media assets
        if (data.medias && Array.isArray(data.medias)) {
          const mediaByType = {
            logo: null,
            banner: null,
            videos: [],
            images: [],
          };

          data.medias.forEach((media) => {
            if (media.mediaType === "logo") {
              mediaByType.logo = media.url;
            } else if (media.mediaType === "banner") {
              mediaByType.banner = media.url;
            } else if (media.resourceType === "video") {
              mediaByType.videos.push(media);
            } else if (
              media.resourceType === "image" &&
              !["logo", "banner"].includes(media.mediaType)
            ) {
              mediaByType.images.push(media);
            }
          });

          setProviderMedia(mediaByType);
        }

        setAvailability(data);
        return data;
      });

    // Effectuer les deux requêtes en parallèle
    Promise.all([fetchTenantData, fetchAvailability])
      .catch((err) => {
        console.error("Erreur lors du chargement des données:", err);
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des données"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tenant]);

  // Build time slots (HH:mm format)
  useEffect(() => {
    if (!availability) return;
    const dayKey = JS_DAY_TO_BACKEND[selectedDate.getDay()];
    const wd = availability.workingDays.find(
      (w) => w.dayOfWeek === dayKey && w.active
    );
    if (!wd) return setTimeSlots([]);
    const slots = [];
    wd.timeSlots.forEach((ts) => {
      const [sH, sM] = ts.startTime.split(":").map(Number);
      const [eH, eM] = ts.endTime.split(":").map(Number);
      const start = new Date(selectedDate);
      start.setHours(sH, sM, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(eH, eM, 0, 0);
      let cursor = new Date(start);
      while (cursor < end) {
        const hh = cursor.getHours().toString().padStart(2, "0");
        const mm = cursor.getMinutes().toString().padStart(2, "0");
        slots.push(`${hh}:${mm}`);
        cursor = new Date(cursor.getTime() + 30 * 60000);
      }
    });
    setTimeSlots(slots);
    setSelectedTime(null);
  }, [selectedDate, availability]);

  const handleConfirm = () => {
    if (!selectedService || !selectedTime) return;
    const [h, m] = selectedTime.split(":").map(Number);
    const localStart = new Date(selectedDate);
    localStart.setHours(h, m, 0, 0);

    // Format date components directly without timezone conversion
    const dateStr = formatLocalDateKey(localStart);
    const startTimeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:00`;

    // Calculate end time
    const duration = selectedService.duration || 30;
    const localEnd = new Date(localStart.getTime() + duration * 60000);
    const endH = localEnd.getHours();
    const endM = localEnd.getMinutes();
    const endTimeStr = `${String(endH).padStart(2, "0")}:${String(
      endM
    ).padStart(2, "0")}:00`;

    // Combine date and time strings - DÉFINIR D'ABORD
    const startISOString = `${dateStr}T${startTimeStr}`;
    const endISOString = `${dateStr}T${endTimeStr}`;

    // Au moment de choisir une date - PUIS FAIRE LES LOGS
    console.log("Date sélectionnée:", formatLocalDateKey(selectedDate));

    // Au moment de confirmer une réservation - MAINTENANT startISOString EST DÉFINI
    console.log("Date envoyée au serveur:", startISOString);

    // À la réception des réservations existantes
    console.log("Réservations reçues:", existingReservations);

    const body = {
      serviceId: selectedService.id,
      employeeId: selectedService.requiresEmployeeSelection
        ? selectedEmployee.id
        : null,
      startTime: startISOString,
      endTime: endISOString,
      numberOfAttendees: 1,
      clientFirstName: clientInfo.firstName,
      clientLastName: clientInfo.lastName,
      clientPhoneNumber: clientInfo.phoneNumber,
      clientEmail: clientInfo.email,
    };

    fetch(`${API_BASE}/booking/client/reservation/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Tenant-ID": tenant },
      body: JSON.stringify(body),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Booking failed")))
      .then((data) => {
        sessionStorage.setItem("reservationId", data.id);
        sessionStorage.removeItem("confirmationCode");
        window.location.href = `/reservation/${data.id}`;
      })
      .catch(() => alert("Error creating reservation"));
  };

  // Format step indicator labels
  const getStepLabel = (stepNum) => {
    const labels = [
      "À propos",
      "Sélectionner date",
      "Choisir service",
      "Choisir employé",
      "Confirmation",
    ];

    return labels[stepNum - 1] || "Confirmation";
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full mb-10">
        <div className="relative">
          {/* Progress track */}
          <div className="absolute top-5 inset-x-0 h-1.5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full"></div>

          {/* Progress fill - animation added */}
          <div
            className="absolute top-5 left-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(step - 1) * 25}%` }}
          ></div>

          {/* Step indicators - redesigned */}
          <div className="relative flex justify-between items-center w-full">
            {[1, 2, 3, 4, 5].map((num) => {
              const isActive = num <= step;
              const isCompleted = num < step;
              const isCurrent = num === step;

              return (
                <div key={num} className="flex flex-col items-center relative">
                  <div
                    className={`
                    z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ease-out
                    ${
                      isActive
                        ? isCompleted
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white scale-110 shadow-lg shadow-indigo-200/50"
                          : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110 shadow-lg shadow-indigo-200/50 animate-pulse-subtle"
                        : "bg-white text-gray-400 border-2 border-gray-200"
                    }
                    ${isCurrent ? "ring-4 ring-indigo-100" : ""}
                  `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 animate-appear" />
                    ) : (
                      <span className="text-sm font-medium">{num}</span>
                    )}
                  </div>

                  <span
                    className={`absolute -bottom-7 text-xs font-medium whitespace-nowrap transform -translate-x-1/2 left-1/2 w-max transition-all duration-300 ${
                      isActive
                        ? "text-indigo-700 font-semibold scale-105"
                        : "text-gray-500"
                    }`}
                  >
                    {getStepLabel(num)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Navbar component
  const Navbar = () => {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <img src={planifygoLogo} alt="PlanifyGo Logo" className="h-8" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="#"
                className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Page d'accueil
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Mes Reservations
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  // Ajouter ces fonctions auxiliaires avant le composant ProviderInfoCard

  // Fonction pour vérifier si le commerce est actuellement ouvert
  const isCurrentlyOpen = (workingDays) => {
    if (!workingDays || !Array.isArray(workingDays)) return false;

    const now = new Date();
    const currentDay = JS_DAY_TO_BACKEND[now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeStr = `${currentHour
      .toString()
      .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    // Trouver le jour actuel dans workingDays
    const today = workingDays.find(
      (day) => day.dayOfWeek === currentDay && day.active
    );

    if (!today || !today.timeSlots || today.timeSlots.length === 0)
      return false;

    // Vérifier si l'heure actuelle est dans l'un des créneaux horaires
    return today.timeSlots.some((slot) => {
      return slot.startTime <= currentTimeStr && currentTimeStr <= slot.endTime;
    });
  };

  // Formater les horaires d'ouverture pour l'affichage
  const formatWorkingHours = (workingDays) => {
    if (!workingDays || !Array.isArray(workingDays))
      return "Horaires non disponibles";

    const dayNames = {
      MONDAY: "Lun",
      TUESDAY: "Mar",
      WEDNESDAY: "Mer",
      THURSDAY: "Jeu",
      FRIDAY: "Ven",
      SATURDAY: "Sam",
      SUNDAY: "Dim",
    };

    // Organiser les jours dans l'ordre de la semaine
    const orderedDays = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];

    // Pour chaque jour, générer une chaîne formatée
    const formattedDays = orderedDays.map((dayKey) => {
      const day = workingDays.find((d) => d.dayOfWeek === dayKey);

      if (!day || !day.active) {
        return `${dayNames[dayKey]}: Fermé`;
      }

      // Formater les horaires pour chaque créneau
      if (day.timeSlots && day.timeSlots.length > 0) {
        const timeRanges = day.timeSlots
          .map((slot) => `${slot.startTime}-${slot.endTime}`)
          .join(", ");
        return `${dayNames[dayKey]}: ${timeRanges}`;
      }

      return `${dayNames[dayKey]}: Indisponible`;
    });

    // Pour un affichage plus compact, regrouper les jours consécutifs avec les mêmes horaires
    return formattedDays;
  };

  // Composant pour afficher les horaires
  const OpeningHoursDisplay = ({ workingDays }) => {
    if (!workingDays || !Array.isArray(workingDays)) {
      return <span>Horaires non disponibles</span>;
    }

    const isOpen = isCurrentlyOpen(workingDays);
    const formattedHours = formatWorkingHours(workingDays);

    return (
      <div>
        <div className="flex items-center mb-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isOpen ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                isOpen ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {isOpen ? "Ouvert maintenant" : "Fermé actuellement"}
          </span>
        </div>

        <div className="mt-3 bg-gray-50 rounded-lg p-3">
          <h4 className="font-medium text-gray-700 mb-2 text-sm">
            Horaires d'ouverture
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {formattedHours.map((day, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Modifier le ProviderInfoCard pour intégrer les horaires d'ouverture
  const ProviderInfoCard = () => {
    if (!availability || !tenantData) return null;

    // Déterminer si le commerce est actuellement ouvert
    const open = isCurrentlyOpen(availability.workingDays);

    // Récupérer l'heure de fermeture d'aujourd'hui
    const getClosingTime = () => {
      const now = new Date();
      const currentDay = JS_DAY_TO_BACKEND[now.getDay()];

      const today = availability.workingDays?.find(
        (day) => day.dayOfWeek === currentDay && day.active
      );

      if (today && today.timeSlots && today.timeSlots.length > 0) {
        // Prendre le dernier créneau si plusieurs sont disponibles
        const lastSlot = today.timeSlots[today.timeSlots.length - 1];
        return `Fermeture à ${lastSlot.endTime}`;
      }

      return "";
    };

    return (
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Banner with business name overlay */}
        <div className="relative h-48 bg-gray-100">
          <img
            src={providerMedia.banner || DEFAULT_MEDIA.banner}
            alt="Business Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          {/* Business Name Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-white text-3xl font-extrabold">
              {tenantData.businessName || availability.businessName || tenant}
            </h1>
          </div>

          {/* Logo */}
          <div className="absolute -bottom-12 right-6 h-24 w-24 bg-white rounded-xl p-1 shadow-lg">
            <img
              src={providerMedia.logo || DEFAULT_MEDIA.logo}
              alt="Business Logo"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Status badges - UPDATED */}
        <div className="px-6 pt-16 pb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                open ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 ${
                  open ? "bg-green-500" : "bg-red-500"
                } rounded-full mr-1.5`}
              ></span>
              {open ? "Ouvert maintenant" : "Fermé actuellement"}
            </span>
            {open && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                <Clock className="w-3 h-3 mr-1.5 text-blue-500" />
                {getClosingTime()}
              </span>
            )}
          </div>

          {/* Propriétaire section - IMPROVED STYLING */}
          <div className="flex items-start mb-6 pb-6 border-b border-gray-100">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-xl font-extrabold text-white shadow-inner overflow-hidden">
              {tenantData.profileImageUrl ? (
                <img
                  src={tenantData.profileImageUrl}
                  alt={tenantData.firstName || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                tenantData.firstName?.charAt(0) || tenant?.charAt(0) || "?"
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                {tenantData.firstName && tenantData.lastName
                  ? `${tenantData.firstName} ${tenantData.lastName}`
                  : "Propriétaire"}
              </h3>
              <p className="text-indigo-600 text-sm font-medium mt-0.5">
                @{tenant || tenantData.subdomain || "subdomain"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Propriétaire et gestionnaire
              </p>
            </div>
          </div>

          {/* Contact details - UPDATED avec horaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Address */}
            <p className="text-gray-600 flex items-center font-medium">
              <svg
                className="w-4 h-4 mr-2.5 text-blue-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span className="line-clamp-2">
                {tenantData.address ||
                  availability.address ||
                  "Adresse non spécifiée"}
                {tenantData.city && tenantData.zipcode
                  ? `, ${tenantData.city}, ${tenantData.zipcode}`
                  : ""}
                {tenantData.country ? `, ${tenantData.country}` : ""}
              </span>
            </p>

            {/* Phone */}
            <p className="text-gray-600 flex items-center font-medium">
              <svg
                className="w-4 h-4 mr-2.5 text-blue-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              <span>
                {tenantData.phone ||
                  availability.phone ||
                  "Téléphone non spécifié"}
              </span>
            </p>

            {/* Email if available */}
            {(tenantData.email || availability.email) && (
              <p className="text-gray-600 flex items-center font-medium">
                <svg
                  className="w-4 h-4 mr-2.5 text-blue-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span>{tenantData.email || availability.email}</span>
              </p>
            )}
          </div>

          {/* Horaires d'ouverture - NOUVELLE SECTION */}
          {availability.workingDays && availability.workingDays.length > 0 && (
            <div className="bg-gray-50/80 p-4 rounded-xl mb-6">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                Horaires de Travail
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                {formatWorkingHours(availability.workingDays).map(
                  (day, index) => (
                    <div
                      key={index}
                      className="py-1 border-b border-gray-100 last:border-0"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-gray-200">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                    open
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      open ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {open ? "Actuellement ouvert" : "Actuellement fermé"}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {(tenantData.description || availability.description) && (
            <div className="bg-gray-50/80 p-4 rounded-xl mb-6">
              <h4 className="font-medium text-gray-800 mb-2">À propos</h4>
              <p className="text-gray-600 text-sm">
                {tenantData.description || availability.description}
              </p>
            </div>
          )}

          {/* Gallery Section - FIXED VIDEO AND IMAGES */}
          {(providerMedia.images.length > 0 ||
            providerMedia.videos.length > 0) && (
            <div className="pt-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Galerie
              </h3>

              {/* Videos section - FIXED */}
              {providerMedia.videos.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 text-sm">
                    Vidéos ({providerMedia.videos.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {providerMedia.videos.slice(0, 4).map((video, idx) => (
                      <div
                        key={`video-${idx}`}
                        onClick={() => setActiveVideo(video)}
                        className="aspect-video rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-full h-full relative">
                          <img
                            src={
                              video.thumbnailUrl ||
                              `https://placehold.co/640x360?text=Video ${
                                idx + 1
                              }`
                            }
                            alt={`Video thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all flex items-center justify-center">
                            <div className="h-12 w-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="h-5 w-5 text-indigo-700 ml-1" />
                            </div>
                          </div>
                          {/* Video Title */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                            <h5 className="text-white text-sm font-medium truncate">
                              {video.title || `Vidéo ${idx + 1}`}
                            </h5>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Images section */}
              {providerMedia.images.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-3 text-sm">
                    Photos ({providerMedia.images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {providerMedia.images.slice(0, 6).map((image, idx) => (
                      <div
                        key={`image-${idx}`}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group hover:shadow-md transition-shadow duration-300"
                      >
                        <img
                          src={
                            image.url ||
                            `https://placehold.co/400/400?text=Image ${idx + 1}`
                          }
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View all button */}
              {[...providerMedia.images, ...providerMedia.videos].length >
                6 && (
                <div className="text-center">
                  <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all flex items-center mx-auto">
                    Voir tous les médias
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Composant de vidéo modal - ADDED FOR VIDEO PLAYBACK
  const VideoModal = ({ video, onClose }) => {
    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!video) return null;

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-black rounded-lg overflow-hidden max-w-4xl w-full max-h-[80vh] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 z-10"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="aspect-video w-full">
            <video
              ref={videoRef}
              src={video.url}
              className="w-full h-full object-contain"
              controls
              autoPlay
            >
              Votre navigateur ne prend pas en charge la lecture de vidéos.
            </video>
          </div>

          {video.title && (
            <div className="p-4 bg-black text-white">
              <h3 className="font-medium text-lg">{video.title}</h3>
              {video.description && (
                <p className="text-gray-300 text-sm mt-1">
                  {video.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Gallery Section - SIMPLIFIED VERSION
  const GallerySection = () => {
    if (!providerMedia.images.length && !providerMedia.videos.length)
      return null;

    return null; // Nous n'affichons pas cette section séparément car elle est déjà intégrée dans ProviderInfoCard
  };

  // Service Selection Component
  const ServiceSelection = () => {
    if (!availability) return null;

    return (
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg
            className="h-5 w-5 mr-2.5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 11h14"
            />
          </svg>
          Choisir un service
        </h3>

        <div className="grid gap-6">
          {availability.services.map((service) => (
            <div
              key={service.id}
              onClick={() =>
                timeSlots.includes(selectedTime) && setSelectedService(service)
              }
              className={`p-5 rounded-xl transition-all duration-300 cursor-pointer transform ${
                selectedService?.id === service.id
                  ? "bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 shadow-md -translate-y-1"
                  : "bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900 text-lg group-hover:text-indigo-700 transition-colors">
                      {service.name}
                    </h4>
                    {selectedService?.id === service.id && (
                      <div className="ml-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-full animate-appear">
                        Sélectionné
                      </div>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-3">
                      {service.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center mt-3 gap-3">
                    <div className="flex items-center text-sm bg-gray-50 px-3 py-1.5 rounded-full">
                      <Clock className="h-4 w-4 text-indigo-500 mr-1.5" />
                      <span className="font-medium text-gray-700">
                        {service.duration} min
                      </span>
                    </div>

                    {service.category && (
                      <div className="text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                        {service.category}
                      </div>
                    )}

                    {/* Popularité du service - nouvelle fonctionnalité */}
                    <div className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-orange-500 stroke-0" />
                      <span>Populaire</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div
                    className={`font-bold text-xl ${
                      selectedService?.id === service.id
                        ? "text-indigo-700"
                        : "text-gray-800"
                    }`}
                  >
                    {service.price ? `${service.price}€` : "Sur demande"}
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mt-3 transition-all duration-300
            ${
              selectedService?.id === service.id
                ? "border-indigo-600 bg-indigo-600 text-white scale-125 shadow-md shadow-indigo-200"
                : "border-gray-300"
            }`}
                  >
                    {selectedService?.id === service.id ? (
                      <Check className="h-5 w-5 animate-appear" />
                    ) : (
                      <Plus className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Employee Selection Component
  // Date Selection Component - REMPLACER l'ancienne version par celle-ci
  const DateSelection = () => {
    // State pour gérer le mois et les vues
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState("month"); // 'year', 'month', 'day'
    const [animationDirection, setAnimationDirection] = useState(""); // 'left', 'right', 'up', 'down'
    const [transitioning, setTransitioning] = useState(false);
    // Fonction pour calculer la disponibilité par jour de la semaine (0 = lundi, 6 = dimanche)
    const calculateDayAvailability = (dayIndex) => {
      if (!availability) return 0;

      // Convertir l'index (0-6 où lundi est 0) au format backend MONDAY, TUESDAY etc.
      const weekdays = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ];
      const backendDayKey = weekdays[dayIndex];

      // Trouver la configuration du jour dans les workingDays
      const workingDay = availability.workingDays?.find(
        (wd) => wd.dayOfWeek === backendDayKey && wd.active
      );

      // Si le jour n'est pas configuré comme jour de travail
      if (!workingDay) return 0;

      // Calculer les heures de travail totales pour ce jour
      let totalMinutes = 0;
      if (workingDay.timeSlots && workingDay.timeSlots.length > 0) {
        workingDay.timeSlots.forEach((slot) => {
          const [startHour, startMin] = slot.startTime.split(":").map(Number);
          const [endHour, endMin] = slot.endTime.split(":").map(Number);

          // Calculer la durée totale en minutes
          const startTotalMins = startHour * 60 + startMin;
          const endTotalMins = endHour * 60 + endMin;
          totalMinutes += endTotalMins - startTotalMins;
        });
      }

      // Calculer les réservations pour ce jour de la semaine
      // Obtenir la date du prochain jour correspondant
      const today = new Date();
      const currentDay = today.getDay(); // 0 = dimanche, 6 = samedi
      const targetDay = dayIndex === 6 ? 0 : dayIndex + 1; // Convertir notre index en index JavaScript (0 = dimanche)

      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7; // Ajouter une semaine si le jour est déjà passé

      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);

      // Formater la date pour correspondre à nos clés d'existingReservations
      const dateKey = formatLocalDateKey(targetDate);
      const reservationsForDay = existingReservations[dateKey] || [];
      // Calculer le temps réservé en minutes
      let reservedMinutes = 0;
      reservationsForDay.forEach(() => {
        // Estimation simple: chaque service prend 30 minutes en moyenne
        // Si vous avez accès à la durée réelle du service, utilisez-la
        reservedMinutes += 30;
      });

      // Calculer la disponibilité sur une échelle de 0 à 10
      let availabilityScore = 10;

      if (totalMinutes > 0) {
        // Déduire en fonction du pourcentage de temps réservé
        const percentageReserved = Math.min(
          100,
          (reservedMinutes / totalMinutes) * 100
        );
        availabilityScore = Math.round(10 - percentageReserved / 10);
      } else {
        // Pas d'heures de travail définies pour ce jour
        availabilityScore = 0;
      }

      return Math.max(0, availabilityScore);
    };
    // Fonctions utilitaires pour le calendrier
    const getDaysInMonth = (year, month) =>
      new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) =>
      new Date(year, month, 1).getDay();

    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    // Navigation entre les périodes avec animation
    const navigate = (direction, newView = null) => {
      setTransitioning(true);
      setAnimationDirection(direction);

      setTimeout(() => {
        // Handle date changes based on direction
        if (direction === "left") {
          if (calendarView === "month")
            setCurrentMonthDate(new Date(year, month - 1, 1));
          else if (calendarView === "year")
            setCurrentMonthDate(new Date(year - 1, 0, 1));
          else if (calendarView === "day") {
            const newDate = new Date(currentMonthDate);
            newDate.setDate(currentMonthDate.getDate() - 1);
            setCurrentMonthDate(newDate);
            setSelectedDate(newDate); // Synchroniser avec selectedDate
          }
        } else if (direction === "right") {
          if (calendarView === "month")
            setCurrentMonthDate(new Date(year, month + 1, 1));
          else if (calendarView === "year")
            setCurrentMonthDate(new Date(year + 1, 0, 1));
          else if (calendarView === "day") {
            const newDate = new Date(currentMonthDate);
            newDate.setDate(currentMonthDate.getDate() + 1);
            setCurrentMonthDate(newDate);
            setSelectedDate(newDate); // Synchroniser avec selectedDate
          }
        }

        // Change view if provided and synchronize dates when switching views
        if (newView) {
          // Si on passe à la vue jour, aligner currentMonthDate sur selectedDate
          if (newView === "day") {
            setCurrentMonthDate(new Date(selectedDate));
          }
          setCalendarView(newView);
        }

        setTransitioning(false);
        setAnimationDirection("");
      }, 300); // Match this with CSS transition duration
    };

    // Format localized strings
    const formatMonthName = (date) => {
      return date.toLocaleDateString("fr-FR", { month: "long" });
    };

    const formatDayName = (date) => {
      const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
      return days[date.getDay()];
    };

    const formatDayNumber = (date) => {
      return date.getDate().toString().padStart(2, "0");
    };

    // Check date states
    const isSelected = (date) => {
      return date.toDateString() === selectedDate.toDateString();
    };

    const isToday = (date) => {
      const today = new Date();
      // Utiliser des comparaisons numériques directes, pas de conversion
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    const isPastDate = (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    };

    // Get reservations for a specific date
    const getReservationsForDate = (date) => {
      const dateKey = formatLocalDateKey(date);
      return existingReservations[dateKey] || [];
    };

    // YearView Component - REDESIGNED
    const YearView = () => {
      const months = Array.from({ length: 12 }, (_, m) => {
        const monthDate = new Date(year, m, 1);
        const monthDays = getDaysInMonth(year, m);
        const firstDay = getFirstDayOfMonth(year, m);

        return {
          date: monthDate,
          name: formatMonthName(monthDate),
          days: monthDays,
          firstDay: firstDay,
          hasReservations: Array.from(
            { length: monthDays },
            (_, i) => i + 1
          ).some((day) => {
            const dateObj = new Date(year, m, day);
            const dateKey = formatLocalDateKey(dateObj);
            return existingReservations[dateKey]?.length > 0;
          }),
          isCurrentMonth:
            new Date().getMonth() === m && new Date().getFullYear() === year,
        };
      });

      return (
        <div
          className={`transition-all duration-300 ease-out transform ${
            transitioning
              ? `opacity-0 translate-${
                  animationDirection === "left"
                    ? "-x-5"
                    : animationDirection === "right"
                    ? "x-5"
                    : animationDirection === "up"
                    ? "-y-5"
                    : "y-5"
                }`
              : "opacity-100 translate-x-0"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
            {months.map((month, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentMonthDate(month.date);
                  // Si le mois sélectionné contient le jour actuel de selectedDate, conservez le jour
                  const currentDay = selectedDate.getDate();
                  const newSelectedDate = new Date(month.date);
                  const daysInSelectedMonth = getDaysInMonth(
                    newSelectedDate.getFullYear(),
                    newSelectedDate.getMonth()
                  );

                  // S'assurer que le jour existe dans le nouveau mois
                  if (currentDay <= daysInSelectedMonth) {
                    newSelectedDate.setDate(currentDay);
                  }

                  setSelectedDate(newSelectedDate);
                  navigate("down", "month");
                }}
                className={`
                  group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300
                  ${
                    month.isCurrentMonth
                      ? "ring-2 ring-indigo-500 ring-offset-2"
                      : "border border-gray-200"
                  }
                  ${
                    month.hasReservations
                      ? "bg-gradient-to-br from-indigo-50/80 to-blue-50/80"
                      : "bg-white hover:bg-gray-50/80"
                  }
                  transform hover:-translate-y-1 hover:shadow-lg
                `}
              >
                {/* Month Header with Glassmorphism */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-3 flex justify-between items-center">
                  <h5 className="font-semibold text-lg capitalize">
                    {month.name}
                  </h5>
                  {month.hasReservations && (
                    <div className="h-6 w-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-xs">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  {/* Mini Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-xs text-center">
                    {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
                      <div key={i} className="text-gray-400 font-medium py-1">
                        {d}
                      </div>
                    ))}

                    {Array(month.firstDay)
                      .fill(null)
                      .map((_, idx) => (
                        <div
                          key={`empty-${idx}`}
                          className="aspect-square"
                        ></div>
                      ))}

                    {Array.from({ length: month.days }, (_, i) => i + 1).map(
                      (day) => {
                        const dateObj = new Date(year, idx, day);
                        const hasReservations =
                          getReservationsForDate(dateObj).length > 0;
                        const isDateSelected = isSelected(dateObj);
                        const dayIsToday = isToday(dateObj);

                        return (
                          <div
                            key={`day-${day}`}
                            className={`
                            aspect-square flex items-center justify-center text-xs rounded-full
                            transition-all duration-200 
                            ${
                              isDateSelected
                                ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-300/30"
                                : dayIsToday
                                ? "bg-red-100 text-red-700 font-bold"
                                : hasReservations
                                ? "font-medium text-indigo-700"
                                : "text-gray-800 group-hover:text-gray-900"
                            }
                            ${
                              hasReservations && !isDateSelected && !dayIsToday
                                ? "bg-indigo-50"
                                : ""
                            }
                          `}
                          >
                            {day}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Month Status Indicator */}
                {month.isCurrentMonth && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                    <span className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 font-medium shadow-sm">
                      Mois actuel
                    </span>
                  </div>
                )}

                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/5 group-hover:to-indigo-600/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    // MonthView - ENHANCED
    const MonthView = () => {
      // Weekdays for header
      const weekdays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

      return (
        <div
          className={`transition-all duration-300 ease-out transform ${
            transitioning
              ? `opacity-0 translate-${
                  animationDirection === "left"
                    ? "-x-5"
                    : animationDirection === "right"
                    ? "x-5"
                    : animationDirection === "up"
                    ? "-y-5"
                    : "y-5"
                }`
              : "opacity-100 translate-x-0"
          }`}
        >
          {/* Enhanced Week Day Header */}
          <div className="grid grid-cols-7 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-700 to-indigo-800 text-white shadow-md">
            {weekdays.map((day, idx) => (
              <div
                key={idx}
                className={`
                  py-3 text-center font-medium
                  ${idx === 0 || idx === 6 ? "text-indigo-200" : ""}
                  ${idx === new Date().getDay() ? "bg-white/10" : ""}
                `}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day Grid with Enhanced Styling */}
          <div className="grid grid-cols-7 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md mt-1">
            {/* Empty cells before the first day of month */}
            {Array(firstDayOfMonth)
              .fill(null)
              .map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="aspect-square md:aspect-auto md:h-28 border-b border-r border-dashed border-gray-100 bg-gray-50/50"
                ></div>
              ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dateObj = new Date(year, month, day);
              const dateKey = formatLocalDateKey(dateObj);
              const reservationsForDay = existingReservations[dateKey] || [];
              const hasReservations = reservationsForDay.length > 0;
              const isDateSelected = isSelected(dateObj);
              const dayIsToday = isToday(dateObj);
              const isPast = isPastDate(dateObj);
              const isWeekend =
                dateObj.getDay() === 0 || dateObj.getDay() === 6;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => {
                    if (!isPast) {
                      const newDate = new Date(year, month, day);
                      setSelectedDate(newDate);
                      setCurrentMonthDate(newDate); // Synchroniser currentMonthDate avec la date sélectionnée
                      navigate("down", "day");
                    }
                  }}
                  className={`
                    group aspect-square md:aspect-auto md:h-28 p-1 relative transition-all duration-200
                    border-b border-r ${
                      isPast ? "border-gray-100" : "border-gray-200"
                    }
                    ${
                      isDateSelected
                        ? "bg-gradient-to-br from-indigo-50/90 to-blue-50/90 shadow-sm"
                        : isPast
                        ? "bg-gray-50/80"
                        : isWeekend
                        ? "bg-blue-50/30 hover:bg-blue-50/50"
                        : "bg-white hover:bg-indigo-50/30"
                    }
                    ${
                      isPast
                        ? "cursor-not-allowed"
                        : "cursor-pointer hover:shadow-inner"
                    }
                  `}
                >
                  {/* Day number with better indication */}
                  <div
                    className={`
                    relative flex justify-between items-center mb-1
                    ${dayIsToday ? "bg-red-100/60 rounded-t-lg" : ""}
                    ${
                      isDateSelected && !dayIsToday
                        ? "bg-indigo-100/60 rounded-t-lg"
                        : ""
                    }
                    px-1
                  `}
                  >
                    <div
                      className={`
                        h-7 w-7 flex items-center justify-center rounded-full 
                        font-medium text-sm transition-all duration-300
                        ${
                          dayIsToday
                            ? "bg-red-500 text-white shadow-md shadow-red-200"
                            : isDateSelected
                            ? "bg-indigo-600 text-white shadow-md"
                            : isPast
                            ? "text-gray-400"
                            : "text-gray-700 group-hover:text-indigo-700"
                        }
                      `}
                    >
                      {day}
                    </div>

                    {/* Indicators */}
                    <div className="flex space-x-1">
                      {dayIsToday && !isDateSelected && (
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded-sm">
                          Aujourd'hui
                        </span>
                      )}
                      {hasReservations && (
                        <span className="h-2 w-2 bg-indigo-500 rounded-full"></span>
                      )}
                    </div>
                  </div>

                  {/* Reservation indicators with improved styling */}
                  <div className="px-0.5 space-y-1 max-h-[calc(100%-2rem)] overflow-hidden">
                    {reservationsForDay.slice(0, 2).map((res, idx) => (
                      <div
                        key={idx}
                        className="text-[10px] p-1 rounded-md bg-gradient-to-r from-indigo-100 to-indigo-50 
                          text-indigo-800 truncate shadow-sm border-l-2 border-indigo-500"
                      >
                        {res.formattedStart} -{" "}
                        {availability?.services?.find(
                          (s) => s.id === res.serviceId
                        )?.name || ""}
                      </div>
                    ))}

                    {reservationsForDay.length > 2 && (
                      <div
                        className="text-[10px] text-center text-indigo-600 font-medium py-0.5 
                        bg-indigo-50 rounded-sm mt-0.5"
                      >
                        +{reservationsForDay.length - 2} autres
                      </div>
                    )}
                  </div>

                  {/* Availability indicator for non-past dates */}
                  {!isPast && timeSlots.length > 0 && (
                    <div className="absolute bottom-1 right-1 flex">
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                    </div>
                  )}

                  {/* Selected indicator */}
                  {isDateSelected && (
                    <div className="absolute inset-0 border-2 border-indigo-500 rounded-lg pointer-events-none"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    // DayView - REDESIGNED
    const DayView = () => {
      // Business hours display (8:00 - 20:00)
      const hoursOfOperation = Array.from({ length: 13 }, (_, i) => i + 8);
      const reservations = getReservationsForDate(currentMonthDate);
      const currentDayName = currentMonthDate.toLocaleDateString("fr-FR", {
        weekday: "long",
      });

      return (
        <div
          className={`transition-all duration-300 ease-out transform ${
            transitioning
              ? `opacity-0 translate-${
                  animationDirection === "left"
                    ? "-x-5"
                    : animationDirection === "right"
                    ? "x-5"
                    : animationDirection === "up"
                    ? "-y-5"
                    : "y-5"
                }`
              : "opacity-100 translate-x-0"
          }`}
        >
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
            {/* Day header - Enhanced with glassmorphism */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-600 opacity-90"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454117096348-e4abbeba002c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>

              <div className="relative z-10 p-5 flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {currentMonthDate.getDate()}
                  </h3>
                  <div className="text-xl text-white font-medium capitalize">
                    {formatMonthName(currentMonthDate)}{" "}
                    {currentMonthDate.getFullYear()}
                  </div>
                  <div className="text-indigo-100 font-medium capitalize mt-1">
                    {currentDayName}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      isToday(currentMonthDate)
                        ? "bg-white text-indigo-700"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {isToday(currentMonthDate) ? "Aujourd'hui" : ""}
                  </div>

                  <div className="mt-2 flex items-center space-x-2">
                    {reservations.length > 0 && (
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></div>
                        {reservations.length} réservation
                        {reservations.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* All-day events section with nicer styling */}
            <div className="border-b border-gray-200 p-3 flex bg-gray-50">
              <div className="w-16 text-xs text-gray-600 flex items-center font-medium">
                Journée
              </div>
              <div className="flex-1 min-h-12 bg-white rounded-lg border border-dashed border-gray-200 p-2">
                <div className="text-xs text-gray-500 text-center">
                  Aucun événement sur la journée
                </div>
              </div>
            </div>

            {/* Hourly slots with enhanced design */}
            <div className="overflow-y-auto max-h-[500px] divide-y divide-gray-100">
              {hoursOfOperation.map((hour) => {
                const resForHour = reservations.filter((res) => {
                  const resHour = parseInt(res.formattedStart.split(":")[0]);
                  return resHour === hour;
                });

                const timeAvailable = timeSlots.some((ts) => {
                  const tsHour = parseInt(ts.split(":")[0]);
                  return tsHour === hour;
                });

                // Check if current hour
                const isCurrentHour =
                  new Date().getHours() === hour && isToday(currentMonthDate);

                return (
                  <div
                    key={hour}
                    className={`flex group transition-colors duration-200
                      ${
                        isCurrentHour
                          ? "bg-yellow-50/60"
                          : "hover:bg-blue-50/40"
                      }`}
                  >
                    {/* Hour indicator with improved styling */}
                    <div
                      className={`w-16 py-3 pr-2 text-right text-sm border-r ${
                        isCurrentHour
                          ? "bg-yellow-100/50 text-orange-700 font-medium"
                          : "text-gray-500 border-gray-200"
                      }`}
                    >
                      {hour.toString().padStart(2, "0")}:00
                    </div>

                    {/* Hour slot with potential reservations */}
                    <div className="flex-1 min-h-[5rem] relative">
                      {/* Current time indicator */}
                      {isCurrentHour && (
                        <div
                          className="absolute left-0 right-0 h-0.5 bg-red-400 z-10"
                          style={{
                            top: `${(new Date().getMinutes() / 60) * 100}%`,
                          }}
                        >
                          <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
                        </div>
                      )}

                      {/* Available time indicator with gradient */}
                      {timeAvailable && (
                        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-green-400 via-green-500 to-green-400 rounded-r-full"></div>
                      )}

                      {/* Reservations for this hour with card design */}
                      <div className="p-2">
                        {resForHour.map((res, idx) => (
                          <div
                            key={idx}
                            className="mb-2 p-2.5 text-sm rounded-md shadow-sm bg-white border-l-4 border-indigo-500 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">
                                {res.formattedStart}
                              </span>
                              <span className="text-indigo-600 font-medium">
                                {availability?.services?.find(
                                  (s) => s.id === res.serviceId
                                )?.name || ""}
                              </span>
                            </div>
                            <div className="mt-1 text-xs flex items-center text-gray-600">
                              <User className="h-3 w-3 mr-1.5" />
                              {res.clientFirstName} {res.clientLastName}
                            </div>
                          </div>
                        ))}

                        {/* Time slot buttons with improved design */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {timeSlots
                            .filter((ts) => parseInt(ts.split(":")[0]) === hour)
                            .map((time) => {
                              const isReserved = reservations.some(
                                (res) => res.formattedStart === time
                              );
                              return (
                                <button
                                  key={time}
                                  onClick={() => {
                                    if (!isReserved) {
                                      setSelectedTime(time);
                                      // On garde délibérément la vue jour active
                                      // en évitant de modifier calendarView
                                    }
                                  }}
                                  disabled={isReserved}
                                  className={`
    px-3 py-1.5 rounded-full text-xs font-medium transition-all relative
    ${
      selectedTime === time
        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white ring-2 ring-indigo-300 transform scale-110"
        : isReserved
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-sm"
    }
  `}
                                >
                                  {time}
                                  {/* ... reste du code */}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    };

    // Enhanced time slots display
    const renderTimeSlots = () => {
      if (calendarView === "day") {
        // Simplified version for day view with enhanced styling
        return (
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Clock className="h-4 w-4 text-indigo-700" />
              </div>
              <h4 className="font-medium text-lg">Créneau sélectionné</h4>
            </div>

            {selectedTime ? (
              <div className="flex items-center justify-center gap-3">
                <div className="px-8 py-4 bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-800 rounded-xl font-medium text-2xl shadow-sm">
                  {selectedTime}
                </div>
                <button
                  onClick={() => setSelectedTime(null)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Effacer la sélection"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                Sélectionnez un créneau horaire dans la vue journalière
              </div>
            )}
          </div>
        );
      }

      if (timeSlots.length === 0) {
        return (
          <div className="bg-amber-50/70 backdrop-blur-sm border border-amber-200 rounded-xl p-5 text-amber-700 flex items-start">
            <Info className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">
              Aucun créneau disponible pour cette date. Veuillez sélectionner
              une autre date.
            </p>
          </div>
        );
      }

      // Group time slots by morning, afternoon, evening
      const morningSlots = [];
      const afternoonSlots = [];
      const eveningSlots = [];

      timeSlots.forEach((time) => {
        const hour = parseInt(time.split(":")[0]);
        if (hour < 12) morningSlots.push(time);
        else if (hour < 17) afternoonSlots.push(time);
        else eveningSlots.push(time);
      });

      // Get reservations for selected date
      const dateKey = formatLocalDateKey(selectedDate);
      const reservationsForDate = existingReservations[dateKey] || [];

      // Create a set of reserved time slots for quick lookup
      const reservedTimes = new Set();
      reservationsForDate.forEach((reservation) => {
        reservedTimes.add(reservation.formattedStart);
      });

      // Enhanced time slot group rendering
      const renderTimeGroup = (slots, title, icon) => {
        if (slots.length === 0) return null;

        return (
          <div className="mb-6 last:mb-0">
            <div className="flex items-center mb-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100/80 flex items-center justify-center shadow-sm mr-2">
                {icon}
              </div>
              <h5 className="text-base font-medium text-gray-700">{title}</h5>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map((time) => {
                const isReserved = reservedTimes.has(time);
                return (
                  <button
                    key={time}
                    onClick={() => {
                      if (!isReserved) {
                        setSelectedTime(time);
                      }
                    }}
                    disabled={isReserved}
                    className={`
                      relative py-3 rounded-xl text-center font-medium transition-all duration-200
                      ${
                        selectedTime === time
                          ? "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/30 transform scale-105 -translate-y-0.5"
                          : isReserved
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-indigo-50 text-gray-800 hover:shadow border border-gray-200 hover:border-indigo-300 hover:-translate-y-0.5"
                      }
                    `}
                  >
                    {time}
                    {isReserved && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                    {selectedTime === time && (
                      <>
                        <span className="absolute inset-0 rounded-xl bg-indigo-400/20 animate-pulse-subtle"></span>
                        <Check className="absolute right-2 top-2 h-4 w-4 text-white bg-indigo-400 rounded-full p-0.5" />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      };

      return (
        <div className="space-y-5">
          {/* Time slots header with selected date */}
          <div className="bg-gradient-to-r from-indigo-100 to-blue-50 rounded-xl p-4 flex items-center justify-between mb-4 border border-indigo-200/50">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2.5 text-indigo-700" />
              <span className="font-medium text-indigo-900">
                {selectedDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>

            {selectedTime && (
              <div className="bg-white px-3 py-1.5 rounded-lg text-indigo-800 font-medium shadow-sm border border-indigo-100">
                {selectedTime}
              </div>
            )}
          </div>

          {/* Time slots groups with enhanced styling */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 shadow-sm border border-gray-200">
            {renderTimeGroup(
              morningSlots,
              "Matin",
              <svg
                className="w-5 h-5 text-amber-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {renderTimeGroup(
              afternoonSlots,
              "Après-midi",
              <svg
                className="w-5 h-5 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 101.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
              </svg>
            )}
            {renderTimeGroup(
              eveningSlots,
              "Soir",
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-indigo-600 mr-2"></div>
                <span className="text-gray-600">Sélectionné</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-gray-600">Réservé</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-gray-600">Disponible</span>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="mb-8 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Calendar className="h-5 w-5 mr-2.5 text-indigo-600" />
          Sélectionner une date
        </h3>

        {/* Calendar toolbar with improved design */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center bg-gray-50 rounded-xl p-1.5 shadow-inner w-full sm:w-auto">
            <button
              onClick={() => navigate("left")}
              className="p-2.5 hover:bg-white rounded-lg transition-colors"
              aria-label="Précédent"
            >
              <ChevronDown className="h-5 w-5 rotate-90 text-gray-600" />
            </button>

            <div
              className="flex-1 text-center cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
              onClick={() =>
                navigate("up", calendarView === "month" ? "year" : "month")
              }
            >
              <h4 className="text-lg font-medium text-gray-800 capitalize whitespace-nowrap">
                {calendarView === "year" && year}
                {calendarView === "month" &&
                  `${formatMonthName(currentMonthDate)} ${year}`}
                {calendarView === "day" &&
                  currentMonthDate.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
              </h4>
            </div>

            <button
              onClick={() => navigate("right")}
              className="p-2.5 hover:bg-white rounded-lg transition-colors"
              aria-label="Suivant"
            >
              <ChevronDown className="h-5 w-5 -rotate-90 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center bg-indigo-50 rounded-xl p-1.5 shadow-sm w-full sm:w-auto">
            <button
              onClick={() => {
                // Synchroniser la date courante avec la date sélectionnée
                setCurrentMonthDate(new Date(selectedDate));
                setCalendarView("day");
              }}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                calendarView === "day"
                  ? "bg-white shadow-sm text-indigo-700 border border-indigo-100"
                  : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50"
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setCalendarView("month")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                calendarView === "month"
                  ? "bg-white shadow-sm text-indigo-700 border border-indigo-100"
                  : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50"
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setCalendarView("year")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                calendarView === "year"
                  ? "bg-white shadow-sm text-indigo-700 border border-indigo-100"
                  : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50"
              }`}
            >
              Année
            </button>
          </div>
        </div>

        {/* Render appropriate view with improved animation */}
        <div className="mb-8 overflow-hidden">
          {calendarView === "year" && <YearView />}
          {calendarView === "month" && <MonthView />}
          {calendarView === "day" && <DayView />}
        </div>

        {/* Time slots section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock className="h-5 w-5 mr-2.5 text-indigo-600" />
              Horaires disponibles
            </h4>

            {/* Show reservations count with badge */}
            {getReservationsForDate(selectedDate).length > 0 && (
              <span className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-full font-medium flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                {getReservationsForDate(selectedDate).length} réservation(s)
              </span>
            )}
          </div>

          {loadingReservations ? (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
              <p className="text-gray-500 text-sm">
                Chargement des disponibilités...
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-5">{renderTimeSlots()}</div>
          )}
        </div>
        {/* Ajoutez cet indicateur sous votre calendrier principal */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <svg
              className="h-4 w-4 mr-2 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Disponibilité cette semaine
          </h4>

          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <div className="flex">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                (day, idx) => {
                  const availability = calculateDayAvailability(idx); // Fonction à créer

                  return (
                    <div key={day} className="flex-1 px-1">
                      <div className="text-xs text-center text-gray-600 py-2">
                        {day}
                      </div>
                      <div className="h-24 flex flex-col items-stretch gap-0.5">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-sm ${
                              availability > i ? "bg-green-500" : "bg-gray-200"
                            }`}
                          ></div>
                        ))}
                      </div>
                      <div className="text-xs text-center mt-2 font-medium">
                        {availability > 7
                          ? "Très disponible"
                          : availability > 4
                          ? "Disponible"
                          : availability > 1
                          ? "Peu disponible"
                          : "Complet"}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Remplacez la vue des créneaux horaires par cette version améliorée
  const TimelineView = () => {
    const workingHours = { start: 8, end: 20 }; // Définir en fonction de vos heures d'ouverture
    const hours = Array.from(
      { length: workingHours.end - workingHours.start },
      (_, i) => workingHours.start + i
    );

    const reservations = getReservationsForDate(selectedDate);

    // Créer une structure pour suivre les réservations par créneau
    const timelineSlots = {};
    timeSlots.forEach((slot) => {
      const hour = parseInt(slot.split(":")[0]);
      const minute = parseInt(slot.split(":")[1]);
      const key = `${hour}:${minute}`;
      timelineSlots[key] = {
        time: slot,
        reserved: false,
        reservation: null,
      };
    });

    // Marquer les créneaux réservés
    reservations.forEach((res) => {
      const [h, m] = res.formattedStart.split(":").map(Number);
      const key = `${h}:${m}`;
      if (timelineSlots[key]) {
        timelineSlots[key].reserved = true;
        timelineSlots[key].reservation = res;
      }
    });

    return (
      <div className="mt-6 relative">
        {/* Timeline header */}
        <div className="flex mb-1">
          <div className="w-20 flex-shrink-0"></div>
          <div className="flex-1 flex">
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex-1 text-center text-xs font-medium text-gray-500"
              >
                {hour}:00
              </div>
            ))}
          </div>
        </div>

        {/* Timeline grid */}
        <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200">
          {/* Time markers */}
          <div className="flex h-full">
            <div className="w-20 flex-shrink-0"></div>
            <div className="flex-1 flex relative">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex-1 border-l border-gray-200 h-full"
                ></div>
              ))}
            </div>
          </div>

          {/* Current time indicator */}
          {isToday(selectedDate) && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
              style={{
                left: `${calculateCurrentTimePosition(workingHours)}%`,
                boxShadow: "0 0 8px rgba(239, 68, 68, 0.5)",
              }}
            >
              <div className="h-3 w-3 rounded-full bg-red-500 -ml-1.5 -mt-1.5 animate-pulse"></div>
            </div>
          )}

          {/* Availability blocks */}
          <div className="absolute inset-0 pointer-events-none">
            {renderAvailabilityBlocks(workingHours)}
          </div>

          {/* Reservation blocks */}
          <div className="absolute inset-0 pointer-events-none">
            {reservations.map((res, idx) =>
              renderReservationBlock(res, idx, workingHours)
            )}
          </div>

          {/* Time slots */}
          <div className="absolute inset-0">
            {Object.values(timelineSlots).map((slot, idx) =>
              renderTimeSlotMarker(slot, idx, workingHours)
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Chargement en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start">
            <X className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">
                Une erreur est survenue
              </h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!availability) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:p-8 space-y-6">
        {" "}
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <span className="hover:text-indigo-700 cursor-pointer">
            Page d'accueil
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">
            {availability.businessName || "Service Provider"}
          </span>
        </div>
        {/* Step 1: About Provider */}
        {step === 1 && (
          <div className="space-y-6">
            <ProviderInfoCard />
            <GallerySection />
          </div>
        )}
        {/* Steps 2-5: Booking Process */}
        {step > 1 && (
          <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100 mb-6">
            <div className="p-6">
              {renderProgressBar()}

              {step === 2 && <DateSelection />}
              {step === 3 && <ServiceSelection />}
              {step === 4 && selectedService?.requiresEmployeeSelection && (
                <EmployeeSelection />
              )}
              {step === 5 && (
                <ConfirmationComponent
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  selectedService={selectedService}
                  selectedEmployee={selectedEmployee}
                  clientInfo={clientInfo}
                  setClientInfo={setClientInfo}
                />
              )}

              <div className="flex justify-between mt-8 border-t pt-6">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all flex items-center shadow-sm hover:shadow group"
                  >
                    <ChevronDown className="h-4 w-4 mr-2 rotate-90 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    <span className="font-medium">Retour</span>
                  </button>
                )}

                {step < 5 ? (
                  <button
                    onClick={() => {
                      if (step === 1) setStep(2);
                      else if (step === 2) setStep(3);
                      else if (step === 3)
                        setStep(
                          selectedService?.requiresEmployeeSelection ? 4 : 5
                        );
                      else if (step === 4) setStep(5);
                    }}
                    disabled={
                      (step === 2 && !selectedTime) ||
                      (step === 3 && !selectedService) ||
                      (step === 4 && !selectedEmployee)
                    }
                    className="ml-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl transition-all flex items-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                  >
                    <span className="font-medium mr-2">Continuer</span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </button>
                ) : (
                  <button
                    onClick={handleConfirm}
                    disabled={
                      !clientInfo.firstName ||
                      !clientInfo.lastName ||
                      !clientInfo.phoneNumber ||
                      !clientInfo.email
                    }
                    className="ml-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl transition-all flex items-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                  >
                    <span className="font-medium mr-2">
                      Confirmer ma réservation
                    </span>
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Book Now floating button in step 1 */}
      {step === 1 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10">
          <button
            onClick={() => setStep(2)}
            className="group px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center font-medium transform hover:-translate-y-1"
          >
            <div className="mr-3 bg-white/20 rounded-full p-1.5 backdrop-blur-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <span>Réserver maintenant</span>
            <ChevronRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      )}
      {/* Video Modal - ADDED */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}
