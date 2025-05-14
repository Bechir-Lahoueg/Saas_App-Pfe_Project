import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
  Check,
  AlertTriangle,
  ChevronRight,
  MapPin,
  DollarSign,
  X,
} from "lucide-react";

// Importer le logo
import planifygoLogo from "/LogoPlanifygoPNG.png";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

export default function Historique() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mettre à jour l'heure actuelle chaque minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fonction pour calculer le temps restant avant le rendez-vous
  const calculateTimeRemaining = (appointmentTime) => {
    const now = currentTime;
    const appointmentDate = new Date(appointmentTime);
    const diffMs = appointmentDate - now;

    // Si la date est passée
    if (diffMs < 0) {
      return { isPast: true, text: "Rendez-vous passé" };
    }

    // Calculer jours, heures, minutes
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // Formatage du texte
    let timeText = "";
    if (diffDays > 0) {
      timeText += `${diffDays} jour${diffDays > 1 ? "s" : ""}, `;
    }

    if (diffHours > 0 || diffDays > 0) {
      timeText += `${diffHours} heure${diffHours > 1 ? "s" : ""}, `;
    }

    timeText += `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;

    // Déterminer l'urgence
    const isUrgent = diffDays === 0 && diffHours < 3;
    const isSoon = diffDays === 0 && diffHours < 24;

    return {
      isPast: false,
      isUrgent,
      isSoon,
      text: `Dans ${timeText}`,
      days: diffDays,
      hours: diffHours,
      minutes: diffMinutes,
    };
  };

  // Fonction pour rechercher les réservations
  const searchReservations = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Veuillez entrer une adresse email");
      return;
    }

    setLoading(true);
    setError(null);
    setIsSubmitted(true);

    try {
      // Obtenir le tenant ID depuis le hostname
      const tenant = window.location.hostname.split(".")[0];

      // URL de base de l'API
      const API_BASE = `http://${window.location.hostname}:8888`;

      const response = await fetch(
        `${API_BASE}/booking/client/reservation/getAvailability`,
        {
          headers: { "X-Tenant-ID": tenant },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data = await response.json();

      // Filtrer les réservations pour cet email
      const clientReservations = data.reservations.filter(
        (res) => res.clientEmail.toLowerCase() === email.toLowerCase()
      );

      // Extraire les informations du client à partir de la première réservation (si disponible)
      if (clientReservations.length > 0) {
        const firstReservation = clientReservations[0];
        setClientInfo({
          firstName: firstReservation.clientFirstName,
          lastName: firstReservation.clientLastName,
          phoneNumber: firstReservation.clientPhoneNumber,
          email: firstReservation.clientEmail,
        });
      } else {
        setClientInfo(null);
      }

      // Récupérer les détails des services
      const servicesMap = {};
      if (data.services && Array.isArray(data.services)) {
        data.services.forEach((service) => {
          servicesMap[service.id] = service;
        });
      }

      // Récupérer les détails des employés
      const employeesMap = {};
      if (data.employees && Array.isArray(data.employees)) {
        data.employees.forEach((employee) => {
          employeesMap[employee.id] = employee;
        });
      }

      // Enrichir les réservations avec les détails des services et employés
      const enrichedReservations = clientReservations.map((reservation) => ({
        ...reservation,
        serviceDetails: servicesMap[reservation.serviceId] || null,
        employeeDetails: reservation.employeeId
          ? employeesMap[reservation.employeeId] || null
          : null,
      }));

      setReservations(enrichedReservations);
    } catch (err) {
      console.error("Erreur:", err);
      setError("Une erreur est survenue lors de la recherche des réservations");
    } finally {
      setLoading(false);
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Organiser les réservations par statut
  const confirmedReservations = reservations.filter(
    (res) => res.status === "CONFIRMED"
  );
  const pendingReservations = reservations.filter(
    (res) => res.status === "PENDING"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:p-8">
        <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100 mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-3 text-indigo-600" />
              Historique de vos réservations
            </h1>

            {/* Email Search Form - Design amélioré */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="md:flex">
                {/* Section illustration animée */}
                <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 md:w-2/5 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <style jsx>{`
                      @keyframes float {
                        0% {
                          transform: translateY(0px);
                        }
                        50% {
                          transform: translateY(-10px);
                        }
                        100% {
                          transform: translateY(0px);
                        }
                      }
                      @keyframes pulse {
                        0% {
                          opacity: 0.7;
                        }
                        50% {
                          opacity: 1;
                        }
                        100% {
                          opacity: 0.7;
                        }
                      }
                      @keyframes rotate {
                        0% {
                          transform: rotate(0deg);
                        }
                        100% {
                          transform: rotate(360deg);
                        }
                      }
                      @keyframes dash {
                        to {
                          stroke-dashoffset: -400;
                        }
                      }
                      .calendar-float {
                        animation: float 3s ease-in-out infinite;
                      }
                      .envelope-pulse {
                        animation: pulse 2s ease-in-out infinite;
                      }
                      .circle-rotate {
                        animation: rotate 30s linear infinite;
                      }
                      .path-dash {
                        stroke-dasharray: 100;
                        animation: dash 15s linear infinite;
                      }
                    `}</style>

                    <svg
                      className="w-64 h-64 mx-auto"
                      viewBox="0 0 500 500"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Cercle décoratif animé */}
                      <circle
                        className="circle-rotate"
                        cx="250"
                        cy="250"
                        r="200"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="20"
                        strokeDasharray="40 20"
                      />
                      <circle
                        cx="250"
                        cy="250"
                        r="180"
                        fill="rgba(255,255,255,0.03)"
                      />

                      {/* Lignes courbes décoratives */}
                      <path
                        className="path-dash"
                        d="M100,250 Q175,150 250,250 T400,250"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="path-dash"
                        d="M100,200 Q200,100 300,200 T500,200"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="10 5"
                      />

                      {/* Calendrier en animation flottante */}
                      <g className="calendar-float">
                        {/* Fond du calendrier */}
                        <rect
                          x="150"
                          y="150"
                          width="200"
                          height="200"
                          rx="15"
                          fill="white"
                        />

                        {/* En-tête du calendrier */}
                        <rect
                          x="150"
                          y="150"
                          width="200"
                          height="40"
                          rx="15"
                          fill="#6366f1"
                        />
                        <rect
                          x="150"
                          y="150"
                          width="200"
                          height="15"
                          rx="15"
                          fill="#6366f1"
                        />

                        {/* Jours de la semaine */}
                        <text
                          x="180"
                          y="175"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          D
                        </text>
                        <text
                          x="210"
                          y="175"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          L
                        </text>
                        <text
                          x="240"
                          y="175"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          M
                        </text>
                        <text
                          x="270"
                          y="175"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          M
                        </text>
                        <text
                          x="300"
                          y="175"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          J
                        </text>
                        <text
                          x="330"
                          y="175"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          V
                        </text>

                        {/* Lignes de la grille */}
                        <line
                          x1="150"
                          y1="190"
                          x2="350"
                          y2="190"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <line
                          x1="150"
                          y1="230"
                          x2="350"
                          y2="230"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <line
                          x1="150"
                          y1="270"
                          x2="350"
                          y2="270"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <line
                          x1="150"
                          y1="310"
                          x2="350"
                          y2="310"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />

                        <line
                          x1="180"
                          y1="190"
                          x2="180"
                          y2="350"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <line
                          x1="210"
                          y1="190"
                          x2="210"
                          y2="350"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <line
                          x1="240"
                          y1="190"
                          x2="240"
                          y2="350"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <line
                          x1="270"
                          y1="190"
                          x2="270"
                          y2="350"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <line
                          x1="300"
                          y1="190"
                          x2="300"
                          y2="350"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <line
                          x1="330"
                          y1="190"
                          x2="330"
                          y2="350"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />

                        {/* Dates */}
                        <text x="165" y="210" fill="#9ca3af" fontSize="12">
                          1
                        </text>
                        <text x="195" y="210" fill="#9ca3af" fontSize="12">
                          2
                        </text>
                        <text x="225" y="210" fill="#9ca3af" fontSize="12">
                          3
                        </text>
                        <text x="255" y="210" fill="#9ca3af" fontSize="12">
                          4
                        </text>
                        <text x="285" y="210" fill="#9ca3af" fontSize="12">
                          5
                        </text>
                        <text x="315" y="210" fill="#9ca3af" fontSize="12">
                          6
                        </text>

                        <text x="165" y="250" fill="#9ca3af" fontSize="12">
                          7
                        </text>
                        <text x="195" y="250" fill="#9ca3af" fontSize="12">
                          8
                        </text>
                        <text x="225" y="250" fill="#9ca3af" fontSize="12">
                          9
                        </text>
                        <text
                          x="255"
                          y="250"
                          fill="#1f2937"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          10
                        </text>
                        <text x="285" y="250" fill="#9ca3af" fontSize="12">
                          11
                        </text>
                        <text x="315" y="250" fill="#9ca3af" fontSize="12">
                          12
                        </text>

                        {/* Date sélectionnée avec un cercle */}
                        <circle
                          cx="260"
                          cy="245"
                          r="15"
                          fill="#818cf8"
                          fillOpacity="0.2"
                        />

                        <text x="165" y="290" fill="#9ca3af" fontSize="12">
                          13
                        </text>
                        <text x="195" y="290" fill="#9ca3af" fontSize="12">
                          14
                        </text>
                        <text x="225" y="290" fill="#9ca3af" fontSize="12">
                          15
                        </text>
                        <text x="255" y="290" fill="#9ca3af" fontSize="12">
                          16
                        </text>
                        <text x="285" y="290" fill="#9ca3af" fontSize="12">
                          17
                        </text>
                        <text x="315" y="290" fill="#9ca3af" fontSize="12">
                          18
                        </text>

                        <text x="165" y="330" fill="#9ca3af" fontSize="12">
                          19
                        </text>
                        <text x="195" y="330" fill="#9ca3af" fontSize="12">
                          20
                        </text>
                        <text x="225" y="330" fill="#9ca3af" fontSize="12">
                          21
                        </text>
                        <text x="255" y="330" fill="#9ca3af" fontSize="12">
                          22
                        </text>
                        <text x="285" y="330" fill="#9ca3af" fontSize="12">
                          23
                        </text>
                        <text x="315" y="330" fill="#9ca3af" fontSize="12">
                          24
                        </text>
                      </g>

                      {/* Enveloppe avec effet pulsation */}
                      <g
                        className="envelope-pulse"
                        transform="translate(280, 120) scale(0.6)"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="140"
                          height="90"
                          rx="5"
                          fill="white"
                          stroke="#6366f1"
                          strokeWidth="5"
                        />
                        <path
                          d="M0,0 L70,45 L140,0"
                          transform="translate(0, 20)"
                          stroke="#6366f1"
                          strokeWidth="5"
                          fill="none"
                        />
                        <path
                          d="M0,90 L50,50"
                          stroke="#6366f1"
                          strokeWidth="5"
                          fill="none"
                        />
                        <path
                          d="M140,90 L90,50"
                          stroke="#6366f1"
                          strokeWidth="5"
                          fill="none"
                        />

                        {/* Notification badge */}
                        <circle cx="120" cy="20" r="15" fill="#ef4444" />
                        <text
                          x="120"
                          y="25"
                          fill="white"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          1
                        </text>
                      </g>

                      {/* Petites étoiles scintillantes */}
                      <circle
                        className="envelope-pulse"
                        cx="150"
                        cy="100"
                        r="3"
                        fill="white"
                        opacity="0.8"
                      />
                      <circle
                        className="envelope-pulse"
                        cx="370"
                        cy="300"
                        r="2"
                        fill="white"
                        opacity="0.8"
                      />
                      <circle
                        className="envelope-pulse"
                        cx="120"
                        cy="320"
                        r="2"
                        fill="white"
                        opacity="0.8"
                      />
                      <circle
                        className="envelope-pulse"
                        cx="390"
                        cy="170"
                        r="3"
                        fill="white"
                        opacity="0.8"
                      />
                      <circle
                        className="envelope-pulse"
                        cx="330"
                        cy="390"
                        r="2"
                        fill="white"
                        opacity="0.8"
                      />
                    </svg>

                    <h3 className="text-white text-xl font-bold mt-6">
                      Retrouvez vos réservations
                    </h3>
                    <p className="text-blue-100 mt-2">
                      Entrez votre email pour consulter l'historique de vos
                      rendez-vous
                    </p>
                  </div>
                </div>

                {/* Section formulaire */}
                <div className="md:w-3/5 p-8 md:p-12">
                  <form onSubmit={searchReservations} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <Calendar className="h-7 w-7 mr-3 text-indigo-600" />
                        Historique de vos réservations
                      </h2>

                      <label
                        htmlFor="email"
                        className="block text-base font-medium text-gray-700 mb-2"
                      >
                        Votre adresse email
                      </label>
                      <div className="mt-1 relative rounded-xl shadow-sm group transition duration-300 hover:shadow-md">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-6 w-6 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-14 pr-12 border-gray-300 rounded-xl h-14 text-lg transition-all duration-300"
                          placeholder="exemple@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                        />
                        {email && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="h-6 w-6 text-indigo-500">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-gray-500 flex items-center">
                        <svg
                          className="h-4 w-4 mr-1 text-indigo-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 16v-4M12 8h.01"></path>
                        </svg>
                        Entrez l'adresse email que vous avez utilisée lors de
                        votre réservation
                      </p>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white transition-all duration-300 ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        }`}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            Recherche en cours...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="11" cy="11" r="8"></circle>
                              <path d="M21 21l-4.35-4.35"></path>
                            </svg>
                            Rechercher mes réservations
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-center space-x-4">
                      <span className="flex items-center text-sm text-gray-500">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Confidentialité assurée
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        Accès sécurisé
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            {isSubmitted && !loading && !error && (
              <div className="space-y-8">
                {/* Client Information */}
                {clientInfo ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-indigo-600" />
                      Informations client
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium text-lg text-gray-900">
                          {clientInfo.firstName} {clientInfo.lastName}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Adresse email</p>
                        <p className="font-medium text-indigo-600">
                          {clientInfo.email}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Numéro de téléphone
                        </p>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <p className="font-medium">
                            {clientInfo.phoneNumber}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Total des réservations
                        </p>
                        <p className="font-medium text-lg">
                          {reservations.length}
                          <span className="text-sm text-gray-500 ml-1">
                            ({confirmedReservations.length} confirmée
                            {confirmedReservations.length > 1 ? "s" : ""},{" "}
                            {pendingReservations.length} en attente)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  isSubmitted &&
                  !loading &&
                  reservations.length === 0 && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-amber-700">
                            Aucune réservation trouvée pour cette adresse email.
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* Reservation Stats */}
                {reservations.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-800 font-medium">
                            Réservations confirmées
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {confirmedReservations.length}
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                          <Check className="h-6 w-6 text-green-700" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-amber-800 font-medium">
                            Réservations en attente
                          </p>
                          <p className="text-2xl font-bold text-amber-900">
                            {pendingReservations.length}
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-amber-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirmed Reservations */}
                {confirmedReservations.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-600" />
                      Réservations confirmées ({confirmedReservations.length})
                    </h2>
                    <div className="grid gap-4">
                      {confirmedReservations.map((reservation) => {
                        const timeRemaining = calculateTimeRemaining(
                          reservation.startTime
                        );
                        return (
                          <div
                            key={reservation.id}
                            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="border-l-4 border-green-500 pl-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                      Confirmée
                                    </span>
                                    <span className="ml-3 text-gray-500 text-sm">
                                      Réservation #{reservation.id}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-medium text-gray-900 mt-2">
                                    Service:{" "}
                                    {reservation.serviceDetails?.name ||
                                      `Service #${reservation.serviceId}`}
                                  </h3>
                                </div>

                                {/* Compte à rebours */}
                                {!timeRemaining.isPast && (
                                  <div
                                    className={`px-3 py-2 rounded-md ${
                                      timeRemaining.isUrgent
                                        ? "bg-red-50 border border-red-200 text-red-700"
                                        : timeRemaining.isSoon
                                        ? "bg-amber-50 border border-amber-200 text-amber-700"
                                        : "bg-blue-50 border border-blue-200 text-blue-700"
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <Clock
                                        className={`h-4 w-4 mr-1 ${
                                          timeRemaining.isUrgent
                                            ? "text-red-500"
                                            : timeRemaining.isSoon
                                            ? "text-amber-500"
                                            : "text-blue-500"
                                        }`}
                                      />
                                      <span className={`text-sm font-medium`}>
                                        {timeRemaining.text}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Afficher si le rendez-vous est déjà passé */}
                                {timeRemaining.isPast && (
                                  <div className="px-3 py-2 rounded-md bg-gray-50 border border-gray-200 text-gray-500">
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                      <span className="text-sm font-medium">
                                        Rendez-vous passé
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="flex items-center">
                                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Date et heure
                                    </p>
                                    <p>{formatDate(reservation.startTime)}</p>
                                  </div>
                                </div>

                                {reservation.employeeDetails && (
                                  <div className="flex items-start">
                                    {/* Display employee image */}
                                    {reservation.employeeDetails.imageUrl ? (
                                      <img
                                        src={
                                          reservation.employeeDetails.imageUrl
                                        }
                                        alt={`${reservation.employeeDetails.firstName} ${reservation.employeeDetails.lastName}`}
                                        className="h-10 w-10 rounded-full object-cover mr-2"
                                      />
                                    ) : (
                                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mr-2">
                                        {reservation.employeeDetails.firstName?.charAt(
                                          0
                                        ) || ""}
                                        {reservation.employeeDetails.lastName?.charAt(
                                          0
                                        ) || ""}
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Spécialiste
                                      </p>
                                      <p>
                                        {reservation.employeeDetails.firstName}{" "}
                                        {reservation.employeeDetails.lastName}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-start">
                                  <div className="h-5 w-5 text-gray-400 mr-2 flex items-center justify-center">
                                    <span className="text-sm font-bold">
                                      👥
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Participants
                                    </p>
                                    <p>
                                      {reservation.numberOfAttendees}{" "}
                                      {reservation.numberOfAttendees > 1
                                        ? "personnes"
                                        : "personne"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Durée
                                    </p>
                                    <p>
                                      {reservation.serviceDetails?.duration ||
                                        "N/A"}{" "}
                                      minutes
                                    </p>
                                  </div>
                                </div>

                                {reservation.serviceDetails?.price && (
                                  <div className="flex items-start">
                                    <DollarSign className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Prix
                                      </p>
                                      <p className="font-medium">
                                        {reservation.serviceDetails.price} DT
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Section de compte à rebours visuel pour les rendez-vous à venir */}
                              {!timeRemaining.isPast &&
                                timeRemaining.days < 7 && (
                                  <div className="md:col-span-2 mt-2">
                                    <div
                                      className={`w-full h-2 rounded-full ${
                                        timeRemaining.isUrgent
                                          ? "bg-red-100"
                                          : timeRemaining.isSoon
                                          ? "bg-amber-100"
                                          : "bg-blue-100"
                                      }`}
                                    >
                                      <div
                                        className={`h-2 rounded-full ${
                                          timeRemaining.isUrgent
                                            ? "bg-red-500"
                                            : timeRemaining.isSoon
                                            ? "bg-amber-500"
                                            : "bg-blue-500"
                                        }`}
                                        style={{
                                          width: `${
                                            100 -
                                            Math.min(
                                              100,
                                              ((timeRemaining.days * 24 +
                                                timeRemaining.hours) *
                                                100) /
                                                168
                                            )
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                    <div className="flex justify-between text-xs mt-1 text-gray-500">
                                      <span>Maintenant</span>
                                      <span>
                                        À venir dans {timeRemaining.days}j{" "}
                                        {timeRemaining.hours}h
                                      </span>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pending Reservations */}
                {pendingReservations.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      {/* Remplacer l'icône horloge par une icône d'alerte rouge */}
                      <svg
                        className="w-6 h-6 mr-2 text-red-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-red-700">
                        Réservations en attente de confirmation (
                        {pendingReservations.length})
                      </span>
                    </h2>
                    <div className="grid gap-4">
                      {pendingReservations.map((reservation) => {
                        const timeRemaining = calculateTimeRemaining(
                          reservation.startTime
                        );
                        return (
                          <div
                            key={reservation.id}
                            className="bg-white rounded-xl border border-red-300 p-4 shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="border-l-4 border-red-500 pl-4">
                              <div className="flex justify-between items-start flex-col md:flex-row gap-3">
                                <div>
                                  <div className="flex items-center">
                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                      Non confirmée
                                    </span>
                                    <span className="ml-3 text-gray-500 text-sm">
                                      Réservation #{reservation.id}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-medium text-gray-900 mt-2">
                                    Service:{" "}
                                    {reservation.serviceDetails?.name ||
                                      `Service #${reservation.serviceId}`}
                                  </h3>

                                  {/* Ajout du compte à rebours pour rendez-vous en attente */}
                                  {!timeRemaining.isPast && (
                                    <div className="mt-2 flex items-center">
                                      <Clock
                                        className={`h-4 w-4 mr-1 ${
                                          timeRemaining.isUrgent
                                            ? "text-red-600"
                                            : timeRemaining.isSoon
                                            ? "text-amber-600"
                                            : "text-blue-600"
                                        }`}
                                      />
                                      <span
                                        className={`text-sm font-medium ${
                                          timeRemaining.isUrgent
                                            ? "text-red-700"
                                            : timeRemaining.isSoon
                                            ? "text-amber-700"
                                            : "text-blue-700"
                                        }`}
                                      >
                                        {timeRemaining.text}
                                        {timeRemaining.isUrgent &&
                                          " - ACTION URGENTE REQUISE"}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Encadré plus visible pour le code de confirmation */}
                                {reservation.confirmationCode && (
                                  <div className="bg-red-50 px-4 py-3 rounded-md border border-red-200 shadow-sm w-full md:w-auto">
                                    <div className="flex items-center mb-1">
                                      <svg
                                        className="w-5 h-5 text-red-700 mr-2"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      <span className="font-medium text-red-800">
                                        Code de confirmation
                                      </span>
                                    </div>
                                    <div className="text-xs text-red-700 mb-2">
                                      Utilisez ce code pour confirmer votre
                                      réservation avant qu'elle ne soit
                                      automatiquement annulée
                                    </div>
                                    <p className="font-mono font-bold text-xl text-red-800 tracking-wider text-center bg-white py-1 px-2 rounded border border-red-200">
                                      {reservation.confirmationCode}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="flex items-center">
                                  <svg
                                    className="h-5 w-5 text-red-500 mr-2"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Date et heure
                                    </p>
                                    <p className="font-medium">
                                      {formatDate(reservation.startTime)}
                                    </p>
                                  </div>
                                </div>

                                {reservation.employeeDetails && (
                                  <div className="flex items-start">
                                    {/* Display employee image for pending reservation */}
                                    {reservation.employeeDetails.imageUrl ? (
                                      <img
                                        src={
                                          reservation.employeeDetails.imageUrl
                                        }
                                        alt={`${reservation.employeeDetails.firstName} ${reservation.employeeDetails.lastName}`}
                                        className="h-10 w-10 rounded-full object-cover mr-2 border-2 border-red-200"
                                      />
                                    ) : (
                                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-sm font-bold mr-2">
                                        {reservation.employeeDetails.firstName?.charAt(
                                          0
                                        ) || ""}
                                        {reservation.employeeDetails.lastName?.charAt(
                                          0
                                        ) || ""}
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Spécialiste
                                      </p>
                                      <p className="font-medium">
                                        {reservation.employeeDetails.firstName}{" "}
                                        {reservation.employeeDetails.lastName}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-start">
                                  <svg
                                    className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Participants
                                    </p>
                                    <p className="font-medium">
                                      {reservation.numberOfAttendees}{" "}
                                      {reservation.numberOfAttendees > 1
                                        ? "personnes"
                                        : "personne"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <svg
                                    className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Durée
                                    </p>
                                    <p className="font-medium">
                                      {reservation.serviceDetails?.duration ||
                                        "N/A"}{" "}
                                      minutes
                                    </p>
                                  </div>
                                </div>

                                {reservation.serviceDetails?.price && (
                                  <div className="flex items-start">
                                    <svg
                                      className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6C14 7.10457 13.1046 8 12 8ZM12 8V14M9 14H15M8 22H16C18.2091 22 20 20.2091 20 18V6C20 3.79086 18.2091 2 16 2H8C5.79086 2 4 3.79086 4 6V18C4 20.2091 5.79086 22 8 22Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Prix
                                      </p>
                                      <p className="font-medium">
                                        {reservation.serviceDetails.price} DT
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0">
                                    <svg
                                      className="h-6 w-6 text-red-600"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                      Attention: Cette réservation n'est pas
                                      encore confirmée
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                      <p>
                                        Votre réservation sera automatiquement
                                        annulée si vous ne la confirmez pas.
                                        Utilisez soit le code affiché ci-dessus,
                                        soit le code envoyé dans votre email de
                                        confirmation pour valider votre
                                        rendez-vous.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex justify-end">
                                <button
                                  className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:outline-none shadow-sm flex items-center"
                                  onClick={() =>
                                    (window.location.href = `/reservation/${reservation.id}`)
                                  }
                                >
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Confirmer cette réservation
                                  <svg
                                    className="ml-1 h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9 6L15 12L9 18"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No Reservations */}
                {reservations.length === 0 && isSubmitted && !loading && (
                  <div className="text-center py-10">
                    <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                      <Calendar className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune réservation trouvée
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Nous n'avons trouvé aucune réservation associée à
                      l'adresse email {email}. Veuillez vérifier l'orthographe
                      ou essayer avec une autre adresse email.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
