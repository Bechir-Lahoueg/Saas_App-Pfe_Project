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
  Star,
  Play,
  Plus,
  CheckSquare,
  User,
} from "lucide-react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
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

const getTunisianHolidays = (year) => {
  const fixedHolidays = [
    { date: `${year}-01-01`, name: "Jour de l'an", type: "national" },
    { date: `${year}-01-14`, name: "Fête de la Révolution", type: "national" },
    { date: `${year}-03-20`, name: "Jour de l'Indépendance", type: "national" },
    { date: `${year}-04-09`, name: "Jour des Martyrs", type: "national" },
    { date: `${year}-05-01`, name: "Fête du Travail", type: "national" },
    { date: `${year}-07-25`, name: "Fête de la République", type: "national" },
    { date: `${year}-08-13`, name: "Fête de la Femme", type: "national" },
    { date: `${year}-10-15`, name: "Fête de l'Évacuation", type: "national" },
  ];

  const religiousHolidays = {
    2024: [
      {
        date: "2024-03-10",
        name: "Début du Ramadan",
        type: "religious",
        duration: 30,
      },
      {
        date: "2024-04-10",
        name: "Aïd al-Fitr",
        type: "religious",
        duration: 3,
      },
      {
        date: "2024-06-17",
        name: "Aïd al-Adha",
        type: "religious",
        duration: 3,
      },
      { date: "2024-07-07", name: "Nouvel An Hégirien", type: "religious" },
      {
        date: "2024-09-16",
        name: "Mawlid (Naissance du Prophète)",
        type: "religious",
      },
    ],
    2025: [
      {
        date: "2025-02-28",
        name: "Début du Ramadan",
        type: "religious",
        duration: 30,
      },
      {
        date: "2025-03-30",
        name: "Aïd al-Fitr",
        type: "religious",
        duration: 3,
      },
      {
        date: "2025-06-06",
        name: "Aïd al-Adha",
        type: "religious",
        duration: 3,
      },
      { date: "2025-06-26", name: "Nouvel An Hégirien", type: "religious" },
      {
        date: "2025-09-05",
        name: "Mawlid (Naissance du Prophète)",
        type: "religious",
      },
    ],
    2026: [
      {
        date: "2026-02-17",
        name: "Début du Ramadan",
        type: "religious",
        duration: 30,
      },
      {
        date: "2026-03-20",
        name: "Aïd al-Fitr",
        type: "religious",
        duration: 3,
      },
      {
        date: "2026-05-27",
        name: "Aïd al-Adha",
        type: "religious",
        duration: 3,
      },
      { date: "2026-06-16", name: "Nouvel An Hégirien", type: "religious" },
      {
        date: "2026-08-26",
        name: "Mawlid (Naissance du Prophète)",
        type: "religious",
      },
    ],
  };

  let allHolidays = [...fixedHolidays];

  if (religiousHolidays[year]) {
    allHolidays = [...allHolidays, ...religiousHolidays[year]];
  }

  return allHolidays;
};

const isHoliday = (date) => {
  const holidays = getTunisianHolidays(date.getFullYear());
  const dateStr = formatLocalDateKey(date);

  const holiday = holidays.find((h) => {
    if (h.duration) {
      const startDate = new Date(h.date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + h.duration - 1);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return checkDate >= startDate && checkDate <= endDate;
    }

    return h.date === dateStr;
  });

  return holiday || false;
};

const getHolidayInfo = (date) => {
  const holiday = isHoliday(date);
  if (!holiday) return null;

  return {
    name: holiday.name,
    type: holiday.type,
    isFirst: holiday.date === formatLocalDateKey(date),
    duration: holiday.duration || 1,
  };
};
const ConfirmationComponent = ({
  selectedDate,
  selectedTime,
  selectedService,
  selectedEmployee,
  clientInfo,
  setClientInfo,
}) => {
  // États pour gérer la validation des champs
  const [errors, setErrors] = useState({});
  const [countryCode, setCountryCode] = useState("+216"); // Tunisie par défaut
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Liste des pays populaires avec leurs codes et drapeaux
  const countries = [
    { code: "+216", name: "Tunisie", flag: "🇹🇳" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+1", name: "États-Unis", flag: "🇺🇸" },
    { code: "+44", name: "Royaume-Uni", flag: "🇬🇧" },
    { code: "+212", name: "Maroc", flag: "🇲🇦" },
    { code: "+213", name: "Algérie", flag: "🇩🇿" },
    { code: "+32", name: "Belgique", flag: "🇧🇪" },
    { code: "+41", name: "Suisse", flag: "🇨🇭" },
    { code: "+39", name: "Italie", flag: "🇮🇹" },
    { code: "+49", name: "Allemagne", flag: "🇩🇪" },
  ];

  // Fonction pour obtenir le drapeau et le code du pays
  const getCurrentCountry = () => {
    const country =
      countries.find((c) => c.code === countryCode) || countries[0];
    return `${country.flag} ${country.code}`;
  };

  // Validation des champs
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        return /^[a-zA-ZÀ-ÿ\s'-]{2,30}$/.test(value)
          ? ""
          : "Le prénom doit contenir entre 2 et 30 caractères alphabétiques";

      case "lastName":
        return /^[a-zA-ZÀ-ÿ\s'-]{2,30}$/.test(value)
          ? ""
          : "Le nom doit contenir entre 2 et 30 caractères alphabétiques";

      case "phoneNumber":
        return /^\d{8,12}$/.test(value)
          ? ""
          : "Le numéro doit contenir entre 8 et 12 chiffres";

      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Veuillez entrer une adresse email valide";

      case "numberOfAttendees":
        return value >= 1 ? "" : "Au moins 1 participant est requis";

      default:
        return "";
    }
  };

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Pour le numéro de téléphone, ne garder que les chiffres
    if (name === "phoneNumber") {
      processedValue = value.replace(/\D/g, "");
    }

    // Mettre à jour les infos du client
    setClientInfo({
      ...clientInfo,
      [name]: processedValue,
    });

    // Valider et mettre à jour les erreurs
    const errorMessage = validateField(name, processedValue);
    setErrors({
      ...errors,
      [name]: errorMessage,
    });
  };

  // Sélection d'un pays
  const selectCountry = (code) => {
    setCountryCode(code);
    setShowCountryDropdown(false);
  };

  return (
    <div className="mb-8 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2.5 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        Confirmer votre réservation
      </h3>

      {/* Récapitulatif */}
      <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
        <div className="mb-3 text-sm text-gray-600">
          <h4 className="font-semibold text-base text-indigo-700 mb-2">
            Récapitulatif:
          </h4>
          <div className="grid md:grid-cols-2 gap-2">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-indigo-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                <span className="font-medium text-gray-700">Date:</span>{" "}
                {selectedDate.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  weekday: "long",
                })}
              </span>
            </div>
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-indigo-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <span className="font-medium text-gray-700">Heure:</span>{" "}
                {selectedTime}
              </span>
            </div>
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-indigo-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>
                <span className="font-medium text-gray-700">Service:</span>{" "}
                {selectedService?.name}
              </span>
            </div>
            {selectedEmployee && (
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-indigo-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>
                  <span className="font-medium text-gray-700">
                    Spécialiste:
                  </span>{" "}
                  {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire avec validation améliorée */}
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Prénom */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={clientInfo.firstName}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring focus:ring-indigo-200 transition-all ${
                errors.firstName
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
              placeholder="Votre prénom"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={clientInfo.lastName}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring focus:ring-indigo-200 transition-all ${
                errors.lastName
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
              placeholder="Votre nom"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Numéro de téléphone avec sélecteur de pays */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Téléphone <span className="text-red-500">*</span>
            </label>
            <div className="relative flex">
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center justify-between w-28 h-full p-3 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:outline-none"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  <div className="flex items-center">
                    <span className="text-sm">{getCurrentCountry()}</span>
                  </div>
                  <svg
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showCountryDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => selectCountry(country.code)}
                      >
                        <span className="mr-2">{country.flag}</span>
                        <span className="mr-2">{country.code}</span>
                        <span className="text-sm text-gray-600">
                          {country.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={clientInfo.phoneNumber}
                onChange={handleChange}
                className={`flex-grow p-3 border-t border-r border-b rounded-r-lg focus:ring focus:ring-indigo-200 transition-all ${
                  errors.phoneNumber
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 focus:border-indigo-500"
                }`}
                placeholder="Numéro de téléphone"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.phoneNumber}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Exemple: {countryCode} XXXXXXXX
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={clientInfo.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring focus:ring-indigo-200 transition-all ${
                errors.email
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
              placeholder="votre-email@exemple.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Nombre de participants */}
          <div>
            <label
              htmlFor="numberOfAttendees"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre de participants <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="numberOfAttendees"
              name="numberOfAttendees"
              min="1"
              value={clientInfo.numberOfAttendees || "1"}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring focus:ring-indigo-200 transition-all ${
                errors.numberOfAttendees
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
              placeholder="1"
            />
            {errors.numberOfAttendees && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.numberOfAttendees}
              </p>
            )}
          </div>
        </div>

        {/* Message de réussite de validation */}
        {Object.values(errors).every((err) => !err) &&
          Object.keys(errors).length > 0 && (
            <div className="mt-6 bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-200 flex items-center animate-fadeIn">
              <svg
                className="h-5 w-5 mr-2 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Les informations sont valides, vous pouvez confirmer votre
              réservation.
            </div>
          )}
      </form>

      {/* Terms et conditions - facultatif */}
      <div className="mt-8 text-sm text-gray-500">
        <p>
          En réservant ce service, vous acceptez nos{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            conditions générales d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            politique de confidentialité
          </a>
          .
        </p>
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
    numberOfAttendees: 1, // Valeur par défaut à 1 comme demandé
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

    // First request: get tenant info
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

    // Second request: get availability data
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
        // Process reservations
        const reservationsByDate = {};

        if (data.reservations && Array.isArray(data.reservations)) {
          data.reservations.forEach((reservation) => {
            // Use raw date from ISO string
            const dateKey = reservation.startTime.substring(0, 10);

            if (!reservationsByDate[dateKey]) {
              reservationsByDate[dateKey] = [];
            }

            // Extract time without conversion
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

        // Process services to ensure they have capacity and simultaneous booking info
        if (data.services && Array.isArray(data.services)) {
          data.services = data.services.map((service) => ({
            ...service,
            // Use the properties directly from the API without adding 's'
            allowsSimultaneous: service.allowSimultaneous || false,
            capacity: service.capacity || 1,
            duration: service.duration || 30,
          }));
        }

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

    // Execute both requests in parallel
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
  // Add this function to check employee availability
  const getAvailableEmployeesForTimeSlot = (dateObj, timeSlot, serviceId) => {
    if (!serviceId || !availability?.services) return [];

    // Get all employees for this service
    const service = availability.services.find((s) => s.id === serviceId);
    if (!service || !service.employees || service.employees.length === 0)
      return [];

    const dateKey = formatLocalDateKey(dateObj);
    const reservationsForDate = existingReservations[dateKey] || [];

    // Parse selected time
    const [selectedHour, selectedMinute] = timeSlot.split(":").map(Number);
    const startTime = new Date(dateObj);
    startTime.setHours(selectedHour, selectedMinute, 0, 0);

    // Calculate end time based on service duration
    const endTime = new Date(startTime.getTime() + service.duration * 60000);

    // Find employees who are already booked at this time
    const busyEmployeeIds = new Set();
    reservationsForDate.forEach((res) => {
      // Skip if no employee assigned
      if (!res.employeeId) return;

      // Parse reservation time
      const [resHour, resMinute] = res.formattedStart.split(":").map(Number);
      const resStartTime = new Date(dateObj);
      resStartTime.setHours(resHour, resMinute, 0, 0);

      // Get reservation service
      const resService = availability.services.find(
        (s) => s.id === res.serviceId
      );
      if (!resService) return;

      // Calculate reservation end time
      const resEndTime = new Date(
        resStartTime.getTime() + resService.duration * 60000
      );

      // Check for time overlap
      if (startTime < resEndTime && endTime > resStartTime) {
        busyEmployeeIds.add(res.employeeId);
      }
    });

    // Return employees who are available (not in busyEmployeeIds)
    return service.employees.filter((emp) => !busyEmployeeIds.has(emp.id));
  };

  // Build time slots (HH:mm format)
  useEffect(() => {
    if (!availability) return;
    if (!availability) return;

    const dayKey = JS_DAY_TO_BACKEND[selectedDate.getDay()];
    const wd = availability.workingDays.find(
      (w) => w.dayOfWeek === dayKey && w.active
    );

    if (!wd) return setTimeSlots([]);

    const slots = [];
    const interval = 15; // Intervalle en minutes (15 min au lieu de 30)

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
        cursor = new Date(cursor.getTime() + interval * 60000);
      }
    });

    setTimeSlots(slots);
    setSelectedTime(null);
  }, [selectedDate, availability]);
  const isAnyServiceAvailableForTimeSlot = (dateObj, timeSlot) => {
    if (!availability?.services || availability.services.length === 0)
      return false;

    // Vérifier si au moins un service est disponible à ce créneau
    return availability.services.some((service) =>
      isSlotAvailableForService(dateObj, timeSlot, service)
    );
  };

  const getServiceAvailability = (date, timeSlot) => {
    if (!availability?.services || !timeSlot) return [];

    const dateKey = formatLocalDateKey(date);
    const reservationsForDate = existingReservations[dateKey] || [];

    return availability.services.map((service) => {
      // Compter les réservations existantes pour ce service à cette heure
      const existingBookings = reservationsForDate.filter(
        (res) => res.serviceId === service.id && res.formattedStart === timeSlot
      ).length;

      // Calculer les places restantes
      const totalSlots = service.allowSimultaneous ? service.capacity : 1;
      const remainingSlots = totalSlots - existingBookings;

      // Déterminer la disponibilité
      const isAvailable = remainingSlots > 0;

      return {
        ...service,
        remainingSlots,
        totalSlots,
        isAvailable,
      };
    });
  };
  // Ajouter cette fonction pour vérifier si un créneau horaire est déjà passé
  const isTimeSlotPassed = (date, timeSlot) => {
    // Si la date est dans le passé (jour précédent ou antérieur), tout le créneau est passé
    const today = new Date();

    // Comparer uniquement les dates (sans les heures)
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Si la date est avant aujourd'hui, c'est forcément passé
    if (dateOnly < todayDateOnly) return true;

    // Si la date est après aujourd'hui, ce n'est pas encore passé
    if (dateOnly > todayDateOnly) return false;

    // Si c'est aujourd'hui, on compare l'heure
    const [timeHour, timeMinute] = timeSlot.split(":").map(Number);
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    // Comparer les heures et minutes
    if (timeHour < currentHour) return true;
    if (timeHour === currentHour && timeMinute < currentMinute) return true;

    return false;
  };
  // Ajouter ce composant dans DateSelection pour afficher les services disponibles
  const ServiceAvailabilitySection = () => {
    if (!selectedTime) return null;

    const servicesAvailability = getServiceAvailability(
      selectedDate,
      selectedTime
    );
    const availableServices = servicesAvailability.filter((s) => s.isAvailable);
    const unavailableServices = servicesAvailability.filter(
      (s) => !s.isAvailable
    );

    if (servicesAvailability.length === 0) {
      return (
        <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-lg">
          <div className="p-6 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <h4 className="flex items-center text-lg font-bold text-amber-900">
              <div className="p-3 bg-amber-100 rounded-xl mr-4 shadow-inner">
                <Info className="h-6 w-6 text-amber-600" />
              </div>
              Aucun service configuré
            </h4>
            <p className="mt-3 text-amber-800 ml-16">
              Il n'y a pas de services configurés pour ce créneau horaire.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-12 relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl"></div>
        </div>

        {/* Section header with animated gradient */}
        <div className="flex items-center mb-8">
          <div className="relative mr-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white flex items-center justify-center p-0.5">
              <div className="h-full w-full rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-800 to-blue-700 bg-clip-text text-transparent">
              Services disponibles
            </h3>
            <p className="text-gray-500 flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1.5 text-indigo-500" />
              <span>Pour votre rendez-vous à </span>
              <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md font-medium">
                {selectedTime}
              </span>
            </p>
          </div>
        </div>

        {/* Available Services Section */}
        {availableServices.length > 0 && (
          <div className="mb-10">
            <div className="grid gap-4">
              {availableServices.map((service, index) => (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setStep(3);
                  }}
                  className="group relative bg-white rounded-2xl transition-all duration-500 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card highlight border with animation */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-indigo-500 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-white"></div>
                  </div>

                  {/* Card content */}
                  <div className="relative p-6 flex items-center justify-between overflow-hidden group-hover:transform group-hover:-translate-y-0.5 transition-transform duration-300">
                    {/* Left side with service info */}
                    <div className="flex items-start">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex-shrink-0 flex items-center justify-center border border-green-200 shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-500">
                        <svg
                          className="h-7 w-7 text-green-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 4L12 14.01l-3-3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <div className="flex items-center">
                          <h5 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {service.name}
                          </h5>
                          <div className="hidden md:flex ml-3 items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600 mr-1.5"></div>
                              Disponible
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center mt-2 gap-3">
                          <span className="flex items-center text-gray-700">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-50 mr-2">
                              <Clock className="h-3.5 w-3.5 text-indigo-500" />
                            </div>
                            <span className="text-sm font-medium">
                              {service.duration} min
                            </span>
                          </span>

                          {service.allowSimultaneous && (
                            <span className="flex items-center text-gray-700">
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 mr-2">
                                <Users className="h-3.5 w-3.5 text-blue-500" />
                              </div>
                              <span className="text-sm font-medium">
                                {service.remainingSlots}/{service.totalSlots}{" "}
                                places
                              </span>
                            </span>
                          )}
                        </div>

                        {service.description && (
                          <p className="mt-2 text-gray-600 line-clamp-2 max-w-md text-sm">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right side with price and action */}
                    <div className="flex flex-col items-end ml-4">
                      {service.price && (
                        <div className="font-bold text-2xl text-indigo-800 group-hover:scale-110 transition-transform">
                          {service.price
                            ? `${service.price} DT`
                            : "Sur demande"}
                        </div>
                      )}

                      <div className="mt-3 flex items-center">
                        <div className="text-xs text-green-700 font-medium mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          Sélectionner
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center justify-center border border-indigo-100 group-hover:border-indigo-300 group-hover:shadow-md transition-all">
                          <ChevronRight className="h-5 w-5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Animated highlight effect on hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unavailable Services Section with elegant divider */}
        {unavailableServices.length > 0 && (
          <>
            <div className="relative py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 py-2 rounded-full bg-white text-gray-500 text-sm font-medium border border-gray-200 shadow-sm">
                  Services non disponibles
                </span>
              </div>
            </div>

            <div className="grid gap-3 opacity-90">
              {unavailableServices.map((service) => (
                <div
                  key={service.id}
                  className="relative bg-white/80 border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Left border indicator */}
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r-full"></div>

                  <div className="p-5 pl-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-100 border border-amber-100 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-amber-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>

                        <div className="ml-4">
                          <div className="flex items-center mb-1">
                            <h5 className="font-medium text-gray-500">
                              {service.name}
                            </h5>
                            <span className="ml-2 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-md border border-amber-100">
                              Non disponible
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="flex items-center text-gray-500">
                              <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                              {service.duration} min
                            </span>
                            <span className="flex items-center text-amber-600">
                              <Info className="h-4 w-4 mr-1.5" />
                              Complet pour ce créneau
                            </span>
                          </div>
                        </div>
                      </div>

                      {service.price && (
                        <div className="text-xl font-bold text-gray-300">
                          {service.price} DT
                        </div>
                      )}
                    </div>

                    {/* Diagonal pattern overlay */}
                    <div className="absolute inset-0 pattern-stripes opacity-5 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* View all services button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setStep(3)}
            className="group relative overflow-hidden px-8 py-3 rounded-full bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 hover:text-indigo-900 font-medium shadow-sm hover:shadow transition-all duration-300"
          >
            <span className="relative z-10 flex items-center">
              Voir tous les services
              <div className="ml-2 h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <ChevronRight className="h-4 w-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </span>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-100 to-indigo-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </button>
        </div>

        <style jsx>{`
          .pattern-stripes {
            background-image: repeating-linear-gradient(
              45deg,
              #000,
              #000 1px,
              transparent 1px,
              transparent 10px
            );
          }

          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeSlideIn {
            animation: fadeSlideIn 0.5s ease forwards;
          }
        `}</style>
      </div>
    );
  };
  const ServiceDurationTimeline = () => {
    if (!availability?.services || !selectedTime || !selectedDate) return null;

    // Extraire l'heure et les minutes du temps sélectionné
    const [selectedHour, selectedMinute] = selectedTime.split(":").map(Number);
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(selectedHour, selectedMinute, 0, 0);

    // Calculer une fenêtre de 4 heures autour du temps sélectionné pour la visualisation
    const viewStart = new Date(selectedDateTime);
    viewStart.setHours(viewStart.getHours() - 1); // 1 heure avant

    const viewEnd = new Date(selectedDateTime);
    viewEnd.setHours(viewEnd.getHours() + 3); // 3 heures après

    // Obtenir les services disponibles
    const servicesAvailability = getServiceAvailability(
      selectedDate,
      selectedTime
    );
    const availableServices = servicesAvailability.filter((s) => s.isAvailable);

    if (availableServices.length === 0) return null;

    return (
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CheckSquare className="h-5 w-5 mr-2.5 text-indigo-600" />
          Visualisation des durées de service
        </h4>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="relative overflow-x-auto">
            {/* Timeline header - heures */}
            <div className="flex border-b border-gray-200 pb-2 mb-3">
              <div className="w-24 flex-shrink-0 font-medium text-gray-500 text-sm">
                Service
              </div>
              <div className="flex-1 relative">
                {Array.from({ length: 5 }, (_, i) => {
                  const hourTime = new Date(viewStart);
                  hourTime.setHours(viewStart.getHours() + i);
                  return (
                    <div
                      key={i}
                      className="absolute text-xs text-gray-500 font-medium"
                      style={{ left: `${i * 25}%` }}
                    >
                      {hourTime.getHours()}:00
                    </div>
                  );
                })}

                {/* Ligne représentant l'heure sélectionnée */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-10 h-full"
                  style={{
                    left: `${
                      ((selectedDateTime - viewStart) / (4 * 60 * 60 * 1000)) *
                      100
                    }%`,
                    top: "20px",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-600 -ml-1 absolute -top-1"></div>
                  <div className="absolute -top-6 -translate-x-1/2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded whitespace-nowrap">
                    {selectedTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Services avec visualisation de leur durée */}
            <div className="space-y-3">
              {availableServices.map((service) => {
                // Calculer l'heure de fin basée sur la durée du service
                const serviceEndTime = new Date(selectedDateTime);
                serviceEndTime.setMinutes(
                  serviceEndTime.getMinutes() + service.duration
                );

                // Calculer la position et la largeur du bloc de service
                const startPosition =
                  ((selectedDateTime - viewStart) / (4 * 60 * 60 * 1000)) * 100;
                const duration = service.duration;
                const blockWidth = (duration / (4 * 60)) * 100;

                return (
                  <div key={service.id} className="flex items-center">
                    <div className="w-24 flex-shrink-0 text-sm text-gray-700 truncate pr-2">
                      {service.name}
                    </div>
                    <div className="flex-1 h-8 relative">
                      <div
                        className={`absolute h-8 rounded-md ${
                          service.duration <= 30
                            ? "bg-green-100 border border-green-200"
                            : service.duration <= 60
                            ? "bg-blue-100 border border-blue-200"
                            : "bg-purple-100 border border-purple-200"
                        }`}
                        style={{
                          left: `${startPosition}%`,
                          width: `${blockWidth}%`,
                          minWidth: "20px",
                        }}
                      >
                        <div className="h-full flex items-center justify-center px-2 text-xs font-medium">
                          {service.duration} min
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-3 text-xs text-gray-600">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-100 border border-green-300 mr-1"></div>
                <span>&lt;30 min</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-100 border border-blue-300 mr-1"></div>
                <span>30-60 min</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-purple-100 border border-purple-300 mr-1"></div>
                <span>&gt;60 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const handleConfirm = () => {
    if (!selectedService || !selectedTime) return;

    // Validation des champs obligatoires
    const errors = {};
    if (!clientInfo.firstName) errors.firstName = "Prénom requis";
    if (!clientInfo.lastName) errors.lastName = "Nom requis";
    if (!clientInfo.phoneNumber)
      errors.phoneNumber = "Numéro de téléphone requis";
    if (!clientInfo.email) errors.email = "Email requis";
    if (!clientInfo.numberOfAttendees || clientInfo.numberOfAttendees < 1) {
      errors.numberOfAttendees = "Au moins 1 participant est requis";
    }

    // Validation du format des champs
    if (
      clientInfo.firstName &&
      !/^[a-zA-ZÀ-ÿ\s'-]{2,30}$/.test(clientInfo.firstName)
    ) {
      errors.firstName = "Format de prénom invalide";
    }
    if (
      clientInfo.lastName &&
      !/^[a-zA-ZÀ-ÿ\s'-]{2,30}$/.test(clientInfo.lastName)
    ) {
      errors.lastName = "Format de nom invalide";
    }
    if (clientInfo.phoneNumber && !/^\d{8,12}$/.test(clientInfo.phoneNumber)) {
      errors.phoneNumber = "Format de numéro invalide";
    }
    if (
      clientInfo.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email)
    ) {
      errors.email = "Format d'email invalide";
    }

    // Si des erreurs sont présentes, on ne continue pas
    if (Object.keys(errors).length > 0) {
      // Afficher les erreurs
      Object.entries(errors).forEach(([field, message]) => {
        showToast(`${message}`, "error");
      });
      return;
    }

    const [h, m] = selectedTime.split(":").map(Number);
    const localStart = new Date(selectedDate);
    localStart.setHours(h, m, 0, 0);

    // Format date components directly without timezone conversion
    const dateStr = formatLocalDateKey(localStart);
    const startTimeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:00`;

    // Calculate end time using service duration
    const duration = selectedService.duration || 30;
    const localEnd = new Date(localStart.getTime() + duration * 60000);
    const endH = localEnd.getHours();
    const endM = localEnd.getMinutes();
    const endTimeStr = `${String(endH).padStart(2, "0")}:${String(
      endM
    ).padStart(2, "0")}:00`;

    // Check if this time slot is available for this service
    const isAvailable = isSlotAvailableForService(
      selectedDate,
      selectedTime,
      selectedService
    );

    if (!isAvailable) {
      alert(
        "Ce créneau n'est plus disponible pour ce service. Veuillez en choisir un autre."
      );
      return;
    }

    // If employee selection is required, verify employee is still available
    if (selectedService.requiresEmployeeSelection && selectedEmployee) {
      const availableEmployees = getAvailableEmployeesForTimeSlot(
        selectedDate,
        selectedTime,
        selectedService.id
      );

      const employeeStillAvailable = availableEmployees.some(
        (emp) => emp.id === selectedEmployee.id
      );

      if (!employeeStillAvailable) {
        alert(
          "Cet employé n'est plus disponible pour ce créneau. Veuillez en choisir un autre."
        );
        return;
      }
    }

    // Combine date and time strings
    const startISOString = `${dateStr}T${startTimeStr}`;
    const endISOString = `${dateStr}T${endTimeStr}`;

    // Proceed with booking
    const body = {
      serviceId: selectedService.id,
      employeeId: selectedService.requiresEmployeeSelection
        ? selectedEmployee.id
        : null,
      startTime: startISOString,
      endTime: endISOString,
      numberOfAttendees: parseInt(clientInfo.numberOfAttendees, 10) || 1,
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
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then((data) => {
        sessionStorage.setItem("reservationId", data.id);
        sessionStorage.removeItem("confirmationCode");
        window.location.href = `/reservation/${data.id}`;
      })
      .catch((error) => {
        console.error("Error creating reservation:", error);
        alert("Erreur lors de la création de la réservation: " + error.message);
      });
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

  const isSlotAvailableForService = (dateObj, timeSlot, service) => {
    if (!service) return false;

    // 1. Vérifier les disponibilités des dates et des réservations existantes
    const dateKey = formatLocalDateKey(dateObj);
    const reservationsForDate = existingReservations[dateKey] || [];

    // 2. Vérifier si le jour est un jour de travail
    const dayOfWeek = JS_DAY_TO_BACKEND[dateObj.getDay()];
    const workingDay = availability.workingDays?.find(
      (wd) => wd.dayOfWeek === dayOfWeek && wd.active
    );

    if (
      !workingDay ||
      !workingDay.timeSlots ||
      workingDay.timeSlots.length === 0
    ) {
      return false; // Ce jour n'est pas un jour de travail
    }

    // 3. Vérifier si ce créneau est déjà passé aujourd'hui
    if (isTimeSlotPassed(dateObj, timeSlot)) {
      return false; // Ce créneau est déjà passé
    }

    // 4. Vérifier si le service peut être complété avant l'heure de fermeture
    const [hours, minutes] = timeSlot.split(":").map(Number);
    const startDateTime = new Date(dateObj);
    startDateTime.setHours(hours, minutes, 0, 0);

    // Calculer l'heure de fin du service
    const endDateTime = new Date(
      startDateTime.getTime() + service.duration * 60000
    );

    // Vérifier que le service se termine avant l'heure de fermeture
    let isWithinWorkingHours = false;

    // Vérifier également que l'heure de début est dans une plage horaire de travail
    let isStartTimeWithinWorkingHours = false;

    for (const slot of workingDay.timeSlots) {
      const [startHour, startMin] = slot.startTime.split(":").map(Number);
      const [endHour, endMin] = slot.endTime.split(":").map(Number);

      const slotStartTime = new Date(dateObj);
      slotStartTime.setHours(startHour, startMin, 0, 0);

      const slotEndTime = new Date(dateObj);
      slotEndTime.setHours(endHour, endMin, 0, 0);

      // Vérifier si l'heure de début est dans cette plage horaire
      if (startDateTime >= slotStartTime && startDateTime < slotEndTime) {
        isStartTimeWithinWorkingHours = true;
      }

      // Vérifier si l'heure de fin est avant la fermeture
      if (endDateTime <= slotEndTime && startDateTime >= slotStartTime) {
        isWithinWorkingHours = true;
      }
    }

    if (!isStartTimeWithinWorkingHours || !isWithinWorkingHours) {
      return false; // Le service ne peut pas être effectué dans les heures d'ouverture
    }

    // 5. Vérifier les réservations qui se chevauchent
    const overlappingReservations = reservationsForDate.filter((res) => {
      // Ne vérifier que les réservations pour ce service spécifique
      if (res.serviceId !== service.id) return false;

      // Convertir l'heure de début de la réservation existante en Date
      const [resHours, resMinutes] = res.formattedStart.split(":").map(Number);
      const resStartDateTime = new Date(dateObj);
      resStartDateTime.setHours(resHours, resMinutes, 0, 0);

      // Calculer l'heure de fin de la réservation existante
      const resService = availability.services.find(
        (s) => s.id === res.serviceId
      );
      const resDuration = resService?.duration || 30;
      const resEndDateTime = new Date(
        resStartDateTime.getTime() + resDuration * 60000
      );

      // Vérifier si les deux plages horaires se chevauchent
      return startDateTime < resEndDateTime && endDateTime > resStartDateTime;
    });

    // 6. Pour les services avec réservations simultanées
    if (service.allowSimultaneous && service.capacity) {
      // Compter combien de réservations se chevauchent exactement à cette heure
      const exactTimeSlotCount = overlappingReservations.filter(
        (res) => res.formattedStart === timeSlot
      ).length;

      // Si c'est un nouveau créneau, vérifier uniquement la capacité pour ce créneau exact
      if (exactTimeSlotCount > 0) {
        return exactTimeSlotCount < service.capacity;
      }

      // Pour tout chevauchement, vérifier si la capacité le permet
      return overlappingReservations.length < service.capacity;
    } else {
      // Pour les services sans réservations simultanées, aucun chevauchement n'est permis
      return overlappingReservations.length === 0;
    }
  };

  // Also fix this function to use the correct property name
  const isTimeRangeBlocked = (dateObj, startTimeStr, durationMinutes) => {
    const dateKey = formatLocalDateKey(dateObj);
    const reservationsForDate = existingReservations[dateKey] || [];

    // Parse start time
    const [startHour, startMinute] = startTimeStr.split(":").map(Number);
    const startTime = new Date(dateObj);
    startTime.setHours(startHour, startMinute, 0, 0);

    // Calculate end time
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    // Check for any overlapping reservations
    return reservationsForDate.some((res) => {
      // Fix: Use allowSimultaneous (not allowsSimultaneous)
      const resService = availability.services.find(
        (s) => s.id === res.serviceId
      );
      if (resService?.allowSimultaneous) {
        // Count reservations for this service at this time
        const sameServiceCount = reservationsForDate.filter(
          (r) =>
            r.serviceId === res.serviceId &&
            r.formattedStart === res.formattedStart
        ).length;

        if (sameServiceCount < resService.capacity) return false;
      }

      // Parse reservation time
      const [resHour, resMinute] = res.formattedStart.split(":").map(Number);
      const resStartTime = new Date(dateObj);
      resStartTime.setHours(resHour, resMinute, 0, 0);

      // Get reservation duration
      const resDuration = resService?.duration || 30;
      const resEndTime = new Date(resStartTime.getTime() + resDuration * 60000);

      // Check for overlap
      return startTime < resEndTime && endTime > resStartTime;
    });
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

  const EmployeeSelection = () => {
    if (!availability || !selectedService) return null;

    // Only show employees who are available at the selected time
    const availableEmployees = getAvailableEmployeesForTimeSlot(
      selectedDate,
      selectedTime,
      selectedService.id
    );

    if (availableEmployees.length === 0) {
      return (
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2.5 text-indigo-600" />
            Choisir un spécialiste
          </h3>

          <div className="bg-red-50 p-4 rounded-xl text-red-700 flex items-start">
            <Info className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">
                Aucun spécialiste n'est disponible pour ce créneau.
              </p>
              <p>
                Tous nos spécialistes sont déjà occupés à cette heure. Veuillez
                choisir un autre créneau horaire.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Users className="h-5 w-5 mr-2.5 text-indigo-600" />
          Choisir un spécialiste
        </h3>

        <div className="grid gap-4">
          {availableEmployees.map((employee) => (
            <div
              key={employee.id}
              onClick={() => setSelectedEmployee(employee)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedEmployee?.id === employee.id
                  ? "bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 shadow-md transform -translate-y-1"
                  : "bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Updated employee card content to use imageUrl instead of profilePicture */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {employee.imageUrl ? (
                    <img
                      src={employee.imageUrl}
                      alt={`${employee.firstName} ${employee.lastName}`}
                      className="h-16 w-16 rounded-lg object-cover shadow-sm"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                      {employee.firstName?.charAt(0) || ""}
                      {employee.lastName?.charAt(0) || ""}
                    </div>
                  )}
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </h4>

                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                        ${
                          selectedEmployee?.id === employee.id
                            ? "border-indigo-600 bg-indigo-600 text-white scale-125 shadow-md shadow-indigo-200"
                            : "border-gray-300"
                        }`}
                    >
                      {selectedEmployee?.id === employee.id ? (
                        <Check className="h-5 w-5 animate-appear" />
                      ) : (
                        <Plus className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {employee.title && (
                    <p className="text-gray-600 text-sm">{employee.title}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                    {employee.specialties?.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}

                    {employee.rating && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-amber-500 stroke-0" />
                        {employee.rating}/5
                      </span>
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

  <Navbar />;

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

    // Filtrer strictement les services disponibles pour le créneau sélectionné
    const availableServices = selectedTime
      ? getServiceAvailability(selectedDate, selectedTime).filter(
          (service) => service.isAvailable
        )
      : [];

    // Si aucun créneau horaire n'est sélectionné, afficher un message
    if (!selectedTime) {
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

          <div className="bg-blue-50 p-4 rounded-xl text-blue-700 flex items-start">
            <Info className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">
                Veuillez d'abord sélectionner un créneau horaire
              </p>
              <p>
                Retournez à l'étape précédente pour choisir une date et une
                heure avant de sélectionner un service.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Afficher un message si aucun service n'est disponible
    if (availableServices.length === 0) {
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

          <div className="bg-amber-50 p-4 rounded-xl text-amber-700 flex items-start">
            <Info className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">
                Aucun service disponible à {selectedTime}
              </p>
              <p>
                Tous les services sont complets pour ce créneau horaire.
                Veuillez sélectionner un autre créneau.
              </p>
              <button
                onClick={() => setStep(2)}
                className="mt-3 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-sm font-medium transition-colors"
              >
                Retour à la sélection d'horaire
              </button>
            </div>
          </div>
        </div>
      );
    }

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
          Choisir un service pour {selectedTime}
        </h3>

        <div className="bg-blue-50 p-3 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            <span className="text-blue-800 font-medium">
              {selectedDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              à {selectedTime}
            </span>
          </div>

          <button
            onClick={() => setStep(2)}
            className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
          >
            Modifier
          </button>
        </div>

        <div className="grid gap-6">
          {availableServices.map((service) => {
            // Calculer les places restantes
            const remainingSlots = service.remainingSlots || 0;

            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
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

                      {service.allowSimultaneous && service.capacity > 1 && (
                        <div className="flex items-center text-sm bg-green-50 px-3 py-1.5 rounded-full">
                          <Users className="h-4 w-4 text-green-600 mr-1.5" />
                          <span className="font-medium text-green-700">
                            {remainingSlots} place
                            {remainingSlots > 1 ? "s" : ""} restante
                            {remainingSlots > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
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
                      {service.price ? `${service.price} DT` : "Sur demande"}
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
            );
          })}
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
            // Pour la navigation jour à jour, on modifie à la fois currentMonthDate ET selectedDate
            const newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() - 1);
            setSelectedDate(newDate); // Important: mettre à jour selectedDate
            setCurrentMonthDate(newDate);
          }
        } else if (direction === "right") {
          if (calendarView === "month")
            setCurrentMonthDate(new Date(year, month + 1, 1));
          else if (calendarView === "year")
            setCurrentMonthDate(new Date(year + 1, 0, 1));
          else if (calendarView === "day") {
            // Pour la navigation jour à jour, on modifie à la fois currentMonthDate ET selectedDate
            const newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() + 1);
            setSelectedDate(newDate); // Important: mettre à jour selectedDate
            setCurrentMonthDate(newDate);
          }
        }

        // Change view if provided
        if (newView) {
          if (newView === "day") {
            // Quand on passe en vue jour, ne pas modifier currentMonthDate
            // Cela préservera le contexte du mois affiché
          } else if (newView === "month" && calendarView === "day") {
            // Quand on revient de la vue jour vers le mois,
            // synchroniser le mois affiché avec le mois de la date sélectionnée
            setCurrentMonthDate(
              new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
            );
          }
          setCalendarView(newView);
        }

        setTransitioning(false);
        setAnimationDirection("");
      }, 300);
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

    // Obtenir les jours du mois précédent pour compléter la première semaine
    const getPreviousMonthDays = () => {
      const firstDay = getFirstDayOfMonth(year, month);
      if (firstDay === 0) return []; // Dimanche, pas besoin de jours du mois précédent

      const prevMonth = month - 1 < 0 ? 11 : month - 1;
      const prevMonthYear = month - 1 < 0 ? year - 1 : year;
      const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

      return Array.from(
        { length: firstDay },
        (_, i) => daysInPrevMonth - firstDay + i + 1
      );
    };

    // Obtenir les jours du mois suivant pour compléter la dernière semaine
    const getNextMonthDays = () => {
      const totalDaysDisplayed = firstDayOfMonth + daysInMonth;
      const remainingCells = 42 - totalDaysDisplayed; // 6 semaines x 7 jours = 42 cellules

      return Array.from(
        { length: Math.min(remainingCells, 7) },
        (_, i) => i + 1
      );
    };

    // Compter le nombre de réservations dans le mois actuel
    const getMonthlyReservationsCount = () => {
      let count = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateKey = formatLocalDateKey(date);
        count += (existingReservations[dateKey] || []).length;
      }

      return count;
    };

    // Compter les jours disponibles dans le mois
    const getAvailableDaysInMonth = () => {
      let availableDays = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (date < today) continue; // Skip past days

        // Vérifier si ce jour est un jour de travail dans les workingDays
        const dayOfWeek = JS_DAY_TO_BACKEND[date.getDay()];
        const isWorkingDay = availability.workingDays?.some(
          (wd) => wd.dayOfWeek === dayOfWeek && wd.active
        );

        if (isWorkingDay) availableDays++;
      }

      return availableDays;
    };

    // Fonction pour obtenir le nom du mois (pour les cellules des mois adjacents)
    const getMonthName = (monthIndex) => {
      const monthNames = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aoû",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ];
      return monthNames[monthIndex < 0 ? 11 : monthIndex > 11 ? 0 : monthIndex];
    };

    // Calculer le score de disponibilité (0-10) pour un jour donné
    const getDayAvailabilityScore = (date) => {
      if (isPastDate(date)) return 0;

      // Vérifier si ce jour est un jour de travail
      const dayOfWeek = JS_DAY_TO_BACKEND[date.getDay()];
      const workingDay = availability.workingDays?.find(
        (wd) => wd.dayOfWeek === dayOfWeek && wd.active
      );

      if (!workingDay) return 0;

      // Calculer le temps disponible total (en minutes)
      let totalMinutes = 0;
      if (workingDay.timeSlots?.length) {
        workingDay.timeSlots.forEach((slot) => {
          const [startHour, startMin] = slot.startTime.split(":").map(Number);
          const [endHour, endMin] = slot.endTime.split(":").map(Number);

          const startTotalMins = startHour * 60 + startMin;
          const endTotalMins = endHour * 60 + endMin;
          totalMinutes += endTotalMins - startTotalMins;
        });
      }

      // Récupérer les réservations pour ce jour et calculer le temps réservé
      const dateKey = formatLocalDateKey(date);
      const reservationsForDay = existingReservations[dateKey] || [];
      let reservedMinutes = 0;

      reservationsForDay.forEach((res) => {
        const service = availability.services?.find(
          (s) => s.id === res.serviceId
        );
        if (service) {
          reservedMinutes += service.duration || 30;
        } else {
          reservedMinutes += 30; // Durée par défaut
        }
      });

      // Calculer le score de disponibilité (0-10)
      if (totalMinutes <= 0) return 0;

      const percentageReserved = Math.min(
        100,
        (reservedMinutes / totalMinutes) * 100
      );
      const score = Math.round(10 - percentageReserved / 10);
      return Math.max(0, score);
    };

    // Statistiques du mois pour affichage dans la légende
    const getMonthStatistics = () => {
      const workingDaysCount = getAvailableDaysInMonth();
      const totalReservations = getMonthlyReservationsCount();
      const mostBusyDay = getMostBusyDay();

      return `${workingDaysCount} jours ouverts, ${totalReservations} réservations au total${
        mostBusyDay ? `, ${mostBusyDay} jour le plus chargé` : ""
      }`;
    };

    // Trouver le jour le plus chargé du mois
    const getMostBusyDay = () => {
      let maxReservations = 0;
      let busyDay = null;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateKey = formatLocalDateKey(date);
        const reservationsCount = (existingReservations[dateKey] || []).length;

        if (reservationsCount > maxReservations) {
          maxReservations = reservationsCount;
          busyDay = date;
        }
      }

      if (!busyDay) return null;

      return `${busyDay.getDate()} ${formatMonthName(busyDay)}`;
    };

    // MonthView - ENHANCED
    const MonthView = () => {
      // Weekdays for header avec noms courts uniquement
      const weekdaysShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

      // Get previous and next month days for complete calendar view
      const prevMonthDays = getPreviousMonthDays();
      const nextMonthDays = getNextMonthDays();

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
          {/* Header section avec design simplifié - Sans compteur de réservations */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl overflow-hidden shadow-lg mb-4">
            <div className="p-5 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold tracking-wide capitalize">
                    {formatMonthName(currentMonthDate)}{" "}
                    {currentMonthDate.getFullYear()}
                  </h3>
                  <div className="mt-1 text-indigo-200 font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span>{daysInMonth} jours</span>
                    {new Date().getMonth() === month &&
                      new Date().getFullYear() === year && (
                        <span className="ml-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                          Mois en cours
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Week days header - TOUS UNIFORMES maintenant */}
            <div className="grid grid-cols-7 bg-indigo-700/80 text-white">
              {weekdaysShort.map((day, idx) => (
                <div
                  key={idx}
                  className={`
                    py-2.5 text-center font-medium text-sm backdrop-blur-sm
                    ${idx === 0 || idx === 6 ? "text-indigo-200" : ""}
                    ${idx === new Date().getDay() ? "bg-white/10" : ""}
                  `}
                >
                  <span className="relative z-10">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar grid avec jours fériés améliorés */}
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
            {/* Days grid */}
            <div className="grid grid-cols-7">
              {/* Previous month days */}
              {prevMonthDays.map((day, idx) => (
                <div
                  key={`prev-${idx}`}
                  className="aspect-square p-1 border-b border-r border-gray-100 bg-gray-50/80 relative group"
                >
                  <div className="h-full w-full flex flex-col">
                    <div className="text-xs text-gray-400 p-1 font-medium">
                      {day}
                    </div>
                    <div className="flex-1"></div>
                    <div className="text-[9px] text-gray-400 px-1">
                      {getMonthName(month - 1 < 0 ? 11 : month - 1)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (day) => {
                  const dateObj = new Date(year, month, day);
                  const dateKey = formatLocalDateKey(dateObj);
                  const reservationsForDay =
                    existingReservations[dateKey] || [];
                  const reservationsCount = reservationsForDay.length;
                  const hasReservations = reservationsCount > 0;
                  const isDateSelected = isSelected(dateObj);
                  const dayIsToday = isToday(dateObj);
                  const isPast = isPastDate(dateObj);
                  const isWeekend =
                    dateObj.getDay() === 0 || dateObj.getDay() === 6;
                  const holidayInfo = getHolidayInfo(dateObj);
                  const isHolidayDate = !!holidayInfo;

                  // Calculate availability classes and info
                  const dayAvailabilityScore = getDayAvailabilityScore(dateObj);
                  let availabilityClass = "";

                  if (dayAvailabilityScore > 7) {
                    availabilityClass = "bg-green-50 border-green-200";
                  } else if (dayAvailabilityScore > 4) {
                    availabilityClass = "bg-lime-50 border-lime-200";
                  } else if (dayAvailabilityScore > 1) {
                    availabilityClass = "bg-amber-50 border-amber-200";
                  } else if (!isPast) {
                    availabilityClass = "bg-red-50 border-red-200";
                  }

                  return (
                    <div
                      key={`day-${day}`}
                      onClick={() => {
                        if (!isPast) {
                          // Juste mettre à jour la date sélectionnée sans changer de vue
                          const newDate = new Date(year, month, day);
                          setSelectedDate(newDate);
                          // NE PAS appeler navigate("down", "day") ici
                        }
                      }}
                      className={`
                        group aspect-square relative transition-all duration-300
                        ${
                          isDateSelected
                            ? "z-10"
                            : isPast
                            ? "bg-gray-50 opacity-70"
                            : isHolidayDate
                            ? holidayInfo.type === "religious"
                              ? "bg-teal-50/70"
                              : "bg-purple-50/70"
                            : isWeekend
                            ? `${availabilityClass} hover:shadow-inner`
                            : `${availabilityClass} hover:shadow-inner`
                        }
                        ${isPast ? "cursor-not-allowed" : "cursor-pointer"}
                        border-b border-r border-gray-200
                      `}
                    >
                      {/* AMÉLIORÉ: Effet de bordure pour les jours fériés */}
                      {isHolidayDate && (
                        <div
                          className={`absolute inset-0 ${
                            holidayInfo.type === "religious"
                              ? "bg-gradient-to-br from-teal-300/10 to-teal-500/5 border-l-2 border-teal-400"
                              : "bg-gradient-to-br from-purple-300/10 to-purple-500/5 border-l-2 border-purple-400"
                          } rounded-sm pointer-events-none`}
                        ></div>
                      )}

                      {/* Day content container */}
                      <div
                        className={`h-full w-full p-1 flex flex-col transition-all duration-300 relative z-10
                          ${isDateSelected ? "scale-[0.97]" : ""}
                        `}
                      >
                        {/* Day number with better indication */}
                        <div className="flex justify-between items-start mb-0.5">
                          <div
                            className={`
                              h-7 w-7 flex items-center justify-center rounded-full 
                              font-medium text-sm transition-all duration-300
                              ${
                                dayIsToday
                                  ? "bg-red-500 text-white shadow-md shadow-red-200"
                                  : isDateSelected
                                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                  : isHolidayDate
                                  ? holidayInfo.type === "religious"
                                    ? "bg-teal-600 text-white shadow-sm"
                                    : "bg-purple-600 text-white shadow-sm"
                                  : isPast
                                  ? "text-gray-400"
                                  : hasReservations
                                  ? "text-indigo-700 font-semibold"
                                  : "text-gray-700"
                              }
                            `}
                          >
                            {day}
                          </div>

                          {/* Indicators - NOUVEAU: Compteur de réservations */}
                          <div className="flex flex-col space-y-0.5 items-end">
                            {dayIsToday && (
                              <span className="text-[9px] bg-red-100 text-red-700 px-1 rounded">
                                Aujourd'hui
                              </span>
                            )}

                            {hasReservations && (
                              <span className="bg-indigo-100 text-indigo-700 text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                                {reservationsCount}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* AMÉLIORÉ: Affichage des jours fériés avec icônes */}
                        {isHolidayDate && (
                          <div
                            className={`mt-0.5 mb-0.5 px-1 py-0.5 rounded-sm text-[8px] flex items-center gap-1
                              ${
                                holidayInfo.type === "religious"
                                  ? "bg-teal-100/80 text-teal-800"
                                  : "bg-purple-100/80 text-purple-800"
                              }`}
                          >
                            {holidayInfo.type === "religious" ? (
                              <svg
                                className="h-2 w-2 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-2 w-2 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            <div className="truncate line-clamp-1">
                              {holidayInfo.name}
                            </div>
                          </div>
                        )}

                        {/* Reservation summary - seulement 1 réservation visible maintenant */}
                        {hasReservations && (
                          <div
                            className={`flex-1 flex flex-col text-[9px] space-y-0.5 overflow-hidden
                              ${isPast ? "opacity-50" : ""}
                            `}
                          >
                            {reservationsForDay.slice(0, 1).map((res, idx) => {
                              // Get service info
                              const service = availability?.services?.find(
                                (s) => s.id === res.serviceId
                              );

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center px-1 py-0.5 rounded truncate bg-indigo-50/80 text-indigo-800"
                                >
                                  <div className="w-1 h-1 rounded-full mr-1 bg-indigo-500"></div>
                                  <span className="truncate">
                                    {res.formattedStart}
                                  </span>
                                </div>
                              );
                            })}

                            {/* Compteur amélioré */}
                            {reservationsCount > 1 && (
                              <div className="text-[8px] text-center text-indigo-600 font-medium">
                                {reservationsCount} réservations
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Selected day indicator */}
                      {isDateSelected && (
                        <>
                          <div className="absolute inset-0 border-2 border-indigo-500 rounded-lg pointer-events-none"></div>
                          <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-lg blur-sm pointer-events-none animate-pulse-slow opacity-70"></div>
                        </>
                      )}
                    </div>
                  );
                }
              )}

              {/* Next month days */}
              {nextMonthDays.map((day, idx) => (
                <div
                  key={`next-${idx}`}
                  className="aspect-square p-1 border-b border-r border-gray-100 bg-gray-50/80 relative group"
                >
                  <div className="h-full w-full flex flex-col">
                    <div className="text-xs text-gray-400 p-1 font-medium">
                      {day}
                    </div>
                    <div className="flex-1"></div>
                    <div className="text-[9px] text-gray-400 px-1">
                      {getMonthName(month + 1 > 11 ? 0 : month + 1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend and information section - AMÉLIORÉE pour les jours fériés */}
          <div className="mt-4 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-y-2 gap-x-3">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-red-500 rounded-full mr-1.5"></div>
                <span className="text-xs text-gray-700">Aujourd'hui</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-indigo-500 rounded-full mr-1.5"></div>
                <span className="text-xs text-gray-700">Réservation</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-1.5"></div>
                <span className="text-xs text-gray-700">Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 border-l-2 border-purple-400 bg-purple-100/50 rounded-sm mr-1.5"></div>
                <span className="text-xs text-gray-700">Jour férié</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 border-l-2 border-teal-400 bg-teal-100/50 rounded-sm mr-1.5"></div>
                <span className="text-xs text-gray-700">Fête religieuse</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-gray-300 rounded-full mr-1.5"></div>
                <span className="text-xs text-gray-700">Jours passés</span>
              </div>
            </div>
          </div>
        </div>
      );
    };
    const DayView = () => {
      // IMPORTANT: Utiliser selectedDate pour l'affichage du jour
      const weekdays = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ];
      const currentDayOfWeek = weekdays[selectedDate.getDay()];

      // Trouver la configuration du jour dans les workingDays
      const workingDay = availability.workingDays?.find(
        (wd) => wd.dayOfWeek === currentDayOfWeek && wd.active
      );

      // Déterminer les heures d'ouverture pour ce jour
      let startHour = 8; // Heures par défaut si non configurées
      let endHour = 20;

      if (
        workingDay &&
        workingDay.timeSlots &&
        workingDay.timeSlots.length > 0
      ) {
        // Trouver l'heure d'ouverture la plus tôt et de fermeture la plus tard
        const startTimes = workingDay.timeSlots.map((slot) =>
          parseInt(slot.startTime.split(":")[0])
        );
        const endTimes = workingDay.timeSlots.map((slot) => {
          const [hours, minutes] = slot.endTime.split(":").map(Number);
          // Si l'heure de fin a des minutes, arrondir à l'heure suivante
          return minutes > 0 ? hours + 1 : hours;
        });

        startHour = Math.min(...startTimes);
        endHour = Math.max(...endTimes);
      }

      // Ajouter 2 heures avant et après les horaires d'ouverture
      const displayStartHour = Math.max(0, startHour - 2);
      const displayEndHour = Math.min(24, endHour + 2);

      // Générer les heures à afficher
      const hoursOfOperation = Array.from(
        { length: displayEndHour - displayStartHour + 1 },
        (_, i) => displayStartHour + i
      );

      // Utiliser selectedDate au lieu de currentMonthDate
      const reservations = getReservationsForDate(selectedDate);
      // Utiliser selectedDate pour afficher le nom du jour
      const currentDayName = selectedDate.toLocaleDateString("fr-FR", {
        weekday: "long",
      });

      // Déterminer si le commerce est ouvert ce jour
      const isDayOpen = !!workingDay;

      // Obtenir l'heure actuelle pour les effets visuels
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimePosition = currentHour + currentMinute / 60;

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
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
            {/* Day header - Enhanced with dynamic gradient and blur effects */}
            <div className="relative overflow-hidden h-48">
              {/* Background with day-specific gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 opacity-90"></div>

              {/* Dynamic pattern overlay based on day of week */}
              <div className="absolute inset-0 bg-pattern opacity-10"></div>

              {/* Blurred circles for decorative effect */}
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-400/30 blur-2xl"></div>
              <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-purple-400/20 blur-xl"></div>
              <div className="absolute bottom-0 right-10 w-24 h-24 rounded-full bg-indigo-300/30 blur-lg"></div>

              <div className="relative z-10 p-6 flex justify-between h-full">
                <div className="flex flex-col justify-between">
                  <div>
                    {/* CORRECTION: Utiliser selectedDate au lieu de currentMonthDate */}
                    <h3 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">
                      {selectedDate.getDate()}
                    </h3>
                    <div className="text-xl text-white/90 font-medium capitalize tracking-wide mt-1">
                      {formatMonthName(selectedDate)}{" "}
                      {selectedDate.getFullYear()}
                    </div>
                    <div className="text-indigo-100 font-medium capitalize mt-1 flex items-center">
                      <span className="bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm text-white">
                        {currentDayName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <div>
                    <div
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        isToday(selectedDate)
                          ? "bg-white text-indigo-700 shadow-lg shadow-indigo-900/20"
                          : "bg-white/20 text-white backdrop-blur-sm"
                      }`}
                    >
                      {isToday(selectedDate) ? "Aujourd'hui" : ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Heures d'ouverture avec effet glassmorphism */}
              {isDayOpen &&
                workingDay.timeSlots &&
                workingDay.timeSlots.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-900/80 to-indigo-800/80 p-3 backdrop-blur-md border-t border-white/10">
                    <div className="flex items-center space-x-2 text-xs text-white/90 overflow-x-auto no-scrollbar">
                      <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      <span className="font-medium whitespace-nowrap">
                        Heures d'ouverture:
                      </span>
                      <div className="flex space-x-2">
                        {workingDay.timeSlots.map((slot, idx) => (
                          <span
                            key={idx}
                            className="bg-white/15 rounded-md px-3 py-1 backdrop-blur-sm whitespace-nowrap shadow-inner"
                          >
                            {slot.startTime} - {slot.endTime}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Section jours fériés - IMPORTANT: Utiliser selectedDate */}
            {(() => {
              const holidayInfo = getHolidayInfo(selectedDate);
              if (!holidayInfo) return null;

              const isReligious = holidayInfo.type === "religious";

              return (
                <div
                  className={`
                    ${
                      isReligious
                        ? "bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200"
                        : "bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200"
                    } 
                    p-4 flex items-start`}
                >
                  <div
                    className={`
                      h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center mr-4
                      ${
                        isReligious
                          ? "bg-teal-100 text-teal-700 border border-teal-200"
                          : "bg-purple-100 text-purple-700 border border-purple-200"
                      }`}
                  >
                    {isReligious ? (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm0-9a1 1 0 011 1v4a1 1 0 01-2 0V8a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2h-8a2 2 0 01-2-2V4zm3 1h6v7H7V5zm8 0v7h2V5h-2zm0 9v2h2v-2h-2zM7 14h6v2H7v-2zm-2 0v2h2v-2H5zM5 5v7h2V5H5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-medium mb-1 ${
                        isReligious ? "text-teal-800" : "text-purple-800"
                      }`}
                    >
                      {holidayInfo.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        isReligious ? "text-teal-700" : "text-purple-700"
                      }`}
                    >
                      {isReligious
                        ? "Fête religieuse - certains services peuvent être limités"
                        : "Jour férié national - certains services peuvent être indisponibles"}
                      {holidayInfo.duration > 1 &&
                        ` (${holidayInfo.duration} jours)`}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Message quand le commerce est fermé */}
            {!isDayOpen && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50/60 p-5 flex items-start">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0 border border-red-200">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-red-800 mb-1 text-lg">
                    Commerce fermé ce jour
                  </h3>
                  <p className="text-sm text-red-700 mb-3">
                    Nous sommes fermés aujourd'hui. Veuillez choisir un autre
                    jour pour votre réservation.
                  </p>
                  <div className="flex">
                    <button
                      onClick={() => navigate("up", "month")}
                      className="px-4 py-2 text-xs bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 shadow-sm transition-colors flex items-center"
                    >
                      <svg
                        className="w-3.5 h-3.5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Retour au calendrier
                    </button>

                    <button
                      onClick={() => {
                        const nextAvailableDate =
                          findNextAvailableDay(selectedDate);
                        if (nextAvailableDate) {
                          setSelectedDate(nextAvailableDate);
                          // Mettre à jour currentMonthDate pour synchroniser les vues
                          setCurrentMonthDate(
                            new Date(
                              nextAvailableDate.getFullYear(),
                              nextAvailableDate.getMonth(),
                              1
                            )
                          );
                        }
                      }}
                      className="ml-3 px-4 py-2 text-xs bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg shadow-sm transition-colors flex items-center"
                    >
                      Prochain jour disponible
                      <svg
                        className="w-3.5 h-3.5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hourly slots with enhanced design */}
            {isDayOpen && (
              <div className="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
                {hoursOfOperation.map((hour) => {
                  const resForHour = reservations.filter((res) => {
                    const resHour = parseInt(res.formattedStart.split(":")[0]);
                    return resHour === hour;
                  });

                  const timeAvailable = timeSlots.some((ts) => {
                    const tsHour = parseInt(ts.split(":")[0]);
                    return tsHour === hour;
                  });

                  // Vérifier si cet horaire est dans les plages de travail
                  const isInWorkingHours = hour >= startHour && hour < endHour;

                  // Check if current hour
                  const isCurrentHour =
                    currentHour === hour && isToday(selectedDate);

                  // Determine les heures "extra" (2h avant/après horaires d'ouverture)
                  const isBeforeWorkingHours =
                    hour < startHour && hour >= displayStartHour;
                  const isAfterWorkingHours =
                    hour >= endHour && hour <= displayEndHour;

                  return (
                    <div
                      key={hour}
                      className={`flex group transition-colors duration-300 relative
                        ${
                          isCurrentHour
                            ? "bg-gradient-to-r from-yellow-50 via-yellow-50/30 to-transparent"
                            : ""
                        }
                        ${!isInWorkingHours ? "opacity-60" : ""}
                      `}
                    >
                      {/* Highlight for current hour */}
                      {isCurrentHour && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-yellow-400 via-amber-400 to-yellow-400"></div>
                      )}

                      {/* Hour indicator with improved styling */}
                      <div
                        className={`w-20 py-4 pr-3 text-right text-sm border-r ${
                          isCurrentHour
                            ? "text-amber-700 font-medium border-amber-200"
                            : isBeforeWorkingHours || isAfterWorkingHours
                            ? "text-gray-400 border-gray-200/30 italic"
                            : isInWorkingHours
                            ? "text-gray-700 border-gray-200/60 font-medium"
                            : "text-gray-400 border-gray-200/30"
                        }`}
                      >
                        <div className="flex justify-end items-center">
                          {isCurrentHour && (
                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-1.5 animate-pulse"></div>
                          )}
                          <span>{hour.toString().padStart(2, "0")}:00</span>
                        </div>
                      </div>

                      {/* Hour slot with potential reservations */}
                      <div
                        className={`flex-1 min-h-[5.5rem] relative py-2 px-1.5 
                          ${
                            isBeforeWorkingHours || isAfterWorkingHours
                              ? "bg-gradient-to-r from-gray-100/70 to-transparent"
                              : ""
                          }
                          ${isCurrentHour ? "bg-yellow-50/40" : ""}
                        `}
                      >
                        {/* Current time indicator */}
                        {isCurrentHour && (
                          <>
                            <div
                              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 z-10"
                              style={{
                                top: `${(now.getMinutes() / 60) * 100}%`,
                              }}
                            >
                              <div className="absolute -left-2.5 -top-1.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg"></div>
                            </div>
                            <div
                              className="absolute -right-1 h-5 px-1.5 bg-amber-100 rounded-l-md text-amber-800 text-[10px] font-medium flex items-center justify-center shadow-sm"
                              style={{
                                top: `${(now.getMinutes() / 60) * 100}%`,
                                transform: "translateY(-50%)",
                              }}
                            >
                              {String(now.getHours()).padStart(2, "0")}:
                              {String(now.getMinutes()).padStart(2, "0")}
                            </div>
                          </>
                        )}

                        {/* Available time indicator with gradient */}
                        {timeAvailable && isInWorkingHours && (
                          <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-green-400 via-green-500 to-green-400 rounded-r-full"></div>
                        )}

                        {/* Out of working hours indicator */}
                        {(isBeforeWorkingHours || isAfterWorkingHours) && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-gray-100/80 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-200/50 backdrop-blur-sm shadow-inner">
                              {isBeforeWorkingHours
                                ? "Avant l'ouverture"
                                : "Après la fermeture"}
                            </div>
                          </div>
                        )}

                        {/* Reservations for this hour with card design */}
                        {(isInWorkingHours || resForHour.length > 0) && (
                          <div className="p-1.5">
                            {resForHour.map((res, idx) => {
                              // Get reservation service details
                              const resService = availability?.services?.find(
                                (s) => s.id === res.serviceId
                              );

                              // Find how many slots have this same service at the same time
                              const sameServiceCount = resForHour.filter(
                                (r) =>
                                  r.serviceId === res.serviceId &&
                                  r.formattedStart === res.formattedStart
                              ).length;

                              // Check if this is a simultaneous service with remaining capacity
                              const isSimultaneous =
                                resService?.allowSimultaneous &&
                                sameServiceCount < (resService?.capacity || 1);

                              return (
                                <div
                                  key={idx}
                                  className={`mb-2 p-3 text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300
                                    ${
                                      isSimultaneous
                                        ? "bg-gradient-to-r from-white to-amber-50 border-l-4 border-amber-400"
                                        : "bg-gradient-to-r from-white to-indigo-50 border-l-4 border-indigo-500"
                                    }
                                  `}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-800 flex items-center">
                                      <svg
                                        className="w-3.5 h-3.5 mr-1.5 text-gray-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      {res.formattedStart}
                                    </span>
                                    <span
                                      className={`font-medium px-2 py-0.5 rounded-md text-sm ${
                                        isSimultaneous
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-indigo-100 text-indigo-800"
                                      }`}
                                    >
                                      {resService?.name || ""}
                                    </span>
                                  </div>
                                  <div className="mt-2 text-xs flex items-center justify-between border-t border-gray-100 pt-2">
                                    <div className="flex items-center text-gray-600">
                                      <User className="h-3 w-3 mr-1.5" />
                                      {res.clientFirstName} {res.clientLastName}
                                    </div>

                                    <div className="flex items-center gap-3">
                                      {isSimultaneous && (
                                        <div className="bg-amber-100/60 text-amber-800 px-2 py-1 rounded-md text-xs flex items-center border border-amber-200/30">
                                          <Users className="h-3 w-3 mr-1" />
                                          {sameServiceCount}/
                                          {resService.capacity}
                                        </div>
                                      )}

                                      <div className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-700 flex items-center">
                                        <svg
                                          className="w-3 h-3 mr-1"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        {resService?.duration || 30} min
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Time slot buttons with improved design - only for working hours */}
                            {isInWorkingHours && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {timeSlots
                                  .filter(
                                    (ts) => parseInt(ts.split(":")[0]) === hour
                                  )
                                  .map((time) => {
                                    // Récupérer les services disponibles à ce créneau
                                    const availableServices =
                                      availability.services.filter((service) =>
                                        isSlotAvailableForService(
                                          selectedDate,
                                          time,
                                          service
                                        )
                                      );

                                    // Si aucun service n'est disponible, le créneau n'est pas réservable
                                    const isReservable =
                                      availableServices.length > 0;

                                    // Trouver la plus petite et la plus grande durée pour l'affichage
                                    const minDuration = isReservable
                                      ? Math.min(
                                          ...availableServices.map(
                                            (s) => s.duration
                                          )
                                        )
                                      : 0;
                                    const maxDuration = isReservable
                                      ? Math.max(
                                          ...availableServices.map(
                                            (s) => s.duration
                                          )
                                        )
                                      : 0;

                                    return (
                                      <button
                                        key={time}
                                        onClick={() => {
                                          if (isReservable) {
                                            setSelectedTime(time);
                                          }
                                        }}
                                        disabled={!isReservable}
                                        className={`
                                          relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300
                                          ${
                                            selectedTime === time
                                              ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white ring-2 ring-indigo-200 shadow-lg shadow-indigo-500/20 transform scale-105 -translate-y-0.5"
                                              : !isReservable
                                              ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                                              : "bg-gradient-to-br from-green-100 to-green-50 text-green-800 hover:from-green-200 hover:to-green-100 hover:shadow-md border border-green-200/50"
                                          }
                                        `}
                                      >
                                        <div className="font-medium">
                                          {time}
                                        </div>

                                        {/* Affichage des durées disponibles */}
                                        {isReservable &&
                                          minDuration !== maxDuration && (
                                            <span className="text-[9px] block mt-1 opacity-80">
                                              {minDuration}-{maxDuration}m
                                            </span>
                                          )}

                                        {isReservable &&
                                          minDuration === maxDuration && (
                                            <span className="text-[9px] block mt-1 opacity-80">
                                              {minDuration}m
                                            </span>
                                          )}

                                        {!isReservable && (
                                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                                            <X className="h-2 w-2 text-white" />
                                          </span>
                                        )}

                                        {/* Selected indicator */}
                                        {selectedTime === time && (
                                          <span className="absolute -top-1 -left-1 h-4 w-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <Check className="h-2 w-2 text-indigo-600" />
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer with enhanced legend */}
            <div className="bg-gradient-to-b from-gray-50/80 to-gray-50 p-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs">
                <div className="flex items-center px-2 py-1 bg-white rounded-full shadow-sm">
                  <div className="h-3 w-3 bg-gradient-to-br from-green-400 to-green-500 rounded-full mr-1.5 shadow-inner"></div>
                  <span className="text-gray-700 font-medium">Disponible</span>
                </div>
                <div className="flex items-center px-2 py-1 bg-white rounded-full shadow-sm">
                  <div className="h-3 w-3 bg-gradient-to-br from-red-400 to-red-500 rounded-full mr-1.5 shadow-inner"></div>
                  <span className="text-gray-700 font-medium">
                    Indisponible
                  </span>
                </div>
                <div className="flex items-center px-2 py-1 bg-white rounded-full shadow-sm">
                  <div className="h-3 w-3 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full mr-1.5 shadow-inner"></div>
                  <span className="text-gray-700 font-medium">Réservation</span>
                </div>
                {isToday(selectedDate) && (
                  <div className="flex items-center px-2 py-1 bg-white rounded-full shadow-sm">
                    <div className="h-3 w-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full mr-1.5 animate-pulse"></div>
                    <span className="text-gray-700 font-medium">
                      Heure actuelle
                    </span>
                  </div>
                )}
              </div>

              {/* Extra info for time slots outside working hours */}
              <div className="mt-3 text-center text-xs text-gray-500">
                Les plages horaires avant l'ouverture et après la fermeture sont
                affichées pour votre information
              </div>
            </div>

            {/* Styles spécifiques pour ce composant */}
            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }

              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }

              .bg-pattern {
                background-image: radial-gradient(
                    circle at 25px 25px,
                    rgba(255, 255, 255, 0.2) 2%,
                    transparent 0%
                  ),
                  radial-gradient(
                    circle at 75px 75px,
                    rgba(255, 255, 255, 0.2) 2%,
                    transparent 0%
                  );
                background-size: 100px 100px;
              }

              @keyframes pulse-subtle {
                0%,
                100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0.7;
                }
              }

              .animate-pulse-subtle {
                animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              }
            `}</style>
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

      const renderTimeGroup = (slots, title, icon) => {
        if (slots.length === 0) return null;

        return (
          <div className="mb-8 last:mb-4 transition-all duration-300 hover:transform hover:scale-[1.01]">
            {/* En-tête du groupe d'horaires avec effet de bordure dégradée */}
            <div className="flex items-center mb-4 relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center shadow-sm mr-3 border border-indigo-200/40">
                {icon}
              </div>
              <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
              <div className="ml-3 h-0.5 flex-grow bg-gradient-to-r from-indigo-200 via-blue-100 to-transparent rounded-full"></div>
            </div>

            {/* Grille de créneaux horaires améliorée */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {slots.map((time) => {
                // Vérifier si ce créneau est déjà passé aujourd'hui
                const isSlotPassed = isTimeSlotPassed(selectedDate, time);

                // Récupérer les services disponibles à ce créneau
                const servicesForSlot = availability.services.filter(
                  (service) =>
                    isSlotAvailableForService(selectedDate, time, service)
                );

                // Si le créneau est passé ou aucun service n'est disponible, il n'est pas réservable
                const isReservable =
                  !isSlotPassed && servicesForSlot.length > 0;

                // Trouver le service avec la durée la plus courte/longue pour l'affichage
                const minDuration = isReservable
                  ? Math.min(...servicesForSlot.map((s) => s.duration))
                  : 0;
                const maxDuration = isReservable
                  ? Math.max(...servicesForSlot.map((s) => s.duration))
                  : 0;

                return (
                  <div key={time} className="relative group">
                    <button
                      onClick={() => {
                        if (isReservable) {
                          setSelectedTime(time);
                        }
                      }}
                      disabled={!isReservable}
                      className={`
                  relative w-full rounded-xl overflow-hidden text-center transition-all duration-300
                  ${
                    selectedTime === time
                      ? "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/30 transform scale-105"
                      : !isReservable
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-indigo-50 text-gray-800 hover:shadow border border-gray-200 hover:border-indigo-300"
                  }
                  group-hover:shadow-md
                `}
                    >
                      {/* Conteneur de contenu pour un meilleur espacement */}
                      <div className="py-3.5 px-2">
                        <div className="font-semibold text-base mb-1">
                          {time}
                        </div>

                        {/* Indicateur de durées disponibles avec nouvelle présentation */}
                        {isReservable && (
                          <div
                            className={`text-xs px-2 py-1 rounded-full mx-auto w-max ${
                              selectedTime === time
                                ? "bg-white/20 text-white"
                                : "bg-indigo-50 text-indigo-700"
                            }`}
                          >
                            {servicesForSlot.length === 1 ? (
                              <span className="truncate max-w-[80px] inline-block">
                                {servicesForSlot[0].name}
                              </span>
                            ) : (
                              `${servicesForSlot.length} services`
                            )}
                          </div>
                        )}
                      </div>

                      {/* Animations et effets */}
                      <div
                        className={`absolute inset-0 opacity-0 ${
                          selectedTime === time
                            ? "opacity-10"
                            : "group-hover:opacity-5"
                        } bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 transition-opacity duration-300`}
                      ></div>

                      {/* Indicateur de statut - Redesigned */}
                      {!isReservable ? (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center shadow-md shadow-red-500/20 ring-2 ring-white">
                          <X className="h-3 w-3 text-white" />
                        </span>
                      ) : (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center shadow-md shadow-green-500/20 ring-2 ring-white">
                          <Check className="h-3 w-3 text-white" />
                        </span>
                      )}

                      {/* Indicateur pour les heures passées */}
                      {isSlotPassed && (
                        <div className="absolute inset-0 bg-gray-200/70 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                          <div className="flex items-center justify-center px-3 py-1 bg-gray-700/70 backdrop-blur-sm rounded-lg shadow-sm">
                            <Clock className="h-3.5 w-3.5 text-gray-200 mr-1" />
                            <span className="text-xs text-gray-100 font-medium">
                              Passé
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
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
              onClick={() => {
                // Synchroniser currentMonthDate avec selectedDate pour maintenir le contexte
                setCurrentMonthDate(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    1
                  )
                );
                setCalendarView("month");
              }}
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
          {/* En-tête amélioré avec fond dégradé et effet "glow" */}
          <div className="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-indigo-200/40 shadow-sm relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-300/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-2.5 rounded-xl shadow-md shadow-indigo-500/10 mr-4">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-900 text-transparent bg-clip-text">
                    Horaires disponibles
                  </h4>
                  <p className="text-sm text-indigo-600 mt-0.5">
                    Sélectionnez un créneau pour votre rendez-vous
                  </p>
                </div>
              </div>

              {/* Badge amélioré pour les réservations */}
              {getReservationsForDate(selectedDate).length > 0 && (
                <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-100 to-red-100 text-xs font-medium text-rose-800 border border-rose-200/50 shadow-sm flex items-center">
                  <span className="w-2 h-2 bg-rose-500 rounded-full mr-1.5 animate-pulse"></span>
                  {getReservationsForDate(selectedDate).length} réservation(s)
                </span>
              )}
            </div>
          </div>

          {loadingReservations ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4 font-medium">
                Chargement des disponibilités...
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 shadow-lg border border-gray-200/70 transition-all duration-300 hover:shadow-xl">
              {renderTimeSlots()}
            </div>
          )}
        </div>

        {selectedTime && <ServiceDurationTimeline />}
        {selectedTime && <ServiceAvailabilitySection />}
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
      {/* Footer */}
      <Footer />
    </div>
  );
}
