import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  X,
  Users,
  Star,
  AlertCircle,
  Check,
} from "lucide-react";

const StaticCalendar = () => {
  // État pour contrôler la visibilité du modal de détail (initialement fermé)
  const [showReservationDetail, setShowReservationDetail] = useState(false);

  // Données statiques pour la démo
  const currentYear = 2025;
  const selectedMonth = 4; // Mai (0-indexed)
  const selectedView = "Mois"; // 'Jour', 'Mois', 'Année'
  const selectedDate = new Date(2025, 4, 15);
  const timeView = "24h"; // "12h" ou "24h"
  
  // Événements statiques pour la démo
  const staticEvents = {
    2025: {
      4: [
        {
          id: 1,
          title: "Consultation standard",
          date: "2025-05-15",
          time: "09:00",
          color: "teal",
          employeeId: 1,
          employee: {
            id: 1,
            firstName: "Sarah",
            lastName: "Martin",
            imageUrl: null
          },
          numberOfAttendees: 1,
          clientFirstName: "Jean",
          clientLastName: "Dupont",
          clientPhoneNumber: "+216 55 123 456",
          clientEmail: "jean.dupont@example.com"
        },
        {
          id: 2,
          title: "Examen approfondi",
          date: "2025-05-15",
          time: "14:30",
          color: "teal",
          employeeId: 2,
          employee: {
            id: 2,
            firstName: "Mohamed",
            lastName: "Ben Ali",
            imageUrl: null
          },
          numberOfAttendees: 1,
          clientFirstName: "Marie",
          clientLastName: "Leclerc",
          clientPhoneNumber: "+216 56 789 012",
          clientEmail: "marie.leclerc@example.com"
        },
        {
          id: 3,
          title: "Suivi mensuel",
          date: "2025-05-16",
          time: "10:15",
          color: "teal",
          employeeId: 1,
          employee: {
            id: 1,
            firstName: "Sarah",
            lastName: "Martin",
            imageUrl: null
          },
          numberOfAttendees: 2,
          clientFirstName: "Ahmed",
          clientLastName: "Khelifi",
          clientPhoneNumber: "+216 57 345 678",
          clientEmail: "ahmed.k@example.com"
        }
      ]
    }
  };

  // Réservation sélectionnée pour le détail
  const reservationDetail = staticEvents[2025]?.[4]?.[0];

  // Jours fériés et fêtes tunisiennes (fêtes fixes uniquement) - Pour la démo
  const tunisianHolidays = {
    "01-01": { name: "Nouvel An", type: "national" },
    "01-14": { name: "Fête de la Révolution", type: "national" },
    "03-20": { name: "Fête de l'Indépendance", type: "national" },
    "04-09": { name: "Jour des Martyrs", type: "national" },
    "05-01": { name: "Fête du Travail", type: "national" },
    "05-18": { name: "Aïd al-Fitr", type: "religious" }, // Pour la démo
    "07-25": { name: "Fête de la République", type: "national" },
    "08-13": { name: "Fête de la Femme", type: "national" },
    "10-15": { name: "Fête de l'Évacuation", type: "national" },
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
    const today = new Date(2025, 4, 14); // Date fixe pour la démo (14 mai 2025)
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

  // ─── Calendar Render Helpers ──────────────────────────────────────
  const renderCalendarGrid = (month) => {
    const firstDay = new Date(currentYear, month, 1).getDay();
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const monthEvents = staticEvents[currentYear]?.[month] || [];

    // Ajustement pour commencer la semaine par Lundi (0: lundi, 6: dimanche)
    const blanks = firstDay === 0 ? 6 : firstDay - 1;
    const cells = [];

    // Cases vides au début
    for (let i = 0; i < blanks; i++)
      cells.push(<div key={`b${i}`} className="h-24 sm:h-28 md:h-32" />);

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dt = new Date(currentYear, month, day);
      const isSel = selectedDate && dt.toDateString() === selectedDate.toDateString();
      const isToday = new Date(2025, 4, 15).toDateString() === dt.toDateString(); // Date fixe pour la démo
      const isPast = isPastDate(dt);
      const evts = monthEvents.filter(
        (e) => new Date(e.date).getDate() === day
      );

      // Vérifier s'il y a un jour férié
      const holiday = getHolidayInfo(currentYear, month, day);

      cells.push(
        <div
          key={day}
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
                onClick={() => setShowReservationDetail(true)} // Ouvre le modal au clic
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
          <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isPast ? (
              <button
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
        // Simuler des événements pour certains mois
        const hasEvents = [3, 4, 5, 9].includes(month);

        return (
          <div
            key={month}
            className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer hover:bg-blue-50 hover:border-blue-200 transform hover:-translate-y-1"
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
                  // Simuler des événements et jours fériés pour la démo
                  const hasEvt = hasEvents && [5, 12, 18, 26].includes(day);
                  const holiday = getHolidayInfo(currentYear, month, day);
                  const isToday = month === 4 && day === 15; // 15 mai pour la démo

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
    // Récupérer les événements de la journée sélectionnée
    const dateEvents = (staticEvents[2025]?.[4] || [])
      .filter((e) => new Date(e.date).getDate() === 15) // Jour fixe pour la démo
      .sort((a, b) => a.time.localeCompare(b.time));

    // Vérifier s'il y a un jour férié
    const holiday = getHolidayInfo(2025, 4, 15);

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
              Jeudi 15 mai 2025
            </span>
          </div>

          <div className="overflow-y-auto max-h-[600px] overflow-x-hidden custom-scrollbar">
            {[...Array(24)].map((_, i) => {
              const hourStr = String(i).padStart(2, "0");
              const hourEvents = dateEvents.filter((e) =>
                e.time.startsWith(hourStr + ":")
              );
              const isCurrentHour = i === 10; // Simulation d'heure actuelle pour la démo

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
                        {!holiday && i >= 9 && i <= 18 ? (
                          <button
                            className="text-xs text-gray-400 hover:text-teal-600 py-1 px-2 rounded-md hover:bg-teal-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Users size={12} className="inline mr-1" />
                            Ajouter une réservation
                          </button>
                        ) : isPastDate(new Date(2025, 4, 15, i)) ? (
                          <span className="text-xs text-red-400 py-1 px-2 opacity-0 group-hover:opacity-100">
                            <AlertCircle size={12} className="inline mr-1" />
                            Heure passée - Réservation impossible
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 py-1 px-2 opacity-0 group-hover:opacity-100">
                            <AlertCircle size={12} className="inline mr-1" />
                            Hors heures d'ouverture
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
                            onClick={() => setShowReservationDetail(true)} // Ouvre le modal au clic
                          >
                            <div>
                              <div className="font-medium">{e.title}</div>
                              <div className="text-xs text-white/90">
                                {formatTime(e.time)}
                              </div>
                            </div>

                            <button
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
            >
              <Users size={18} className="mr-1" />
              Réservation
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg mb-4 shadow-inner">
          <h3 className="font-medium text-indigo-800">
            Date sélectionnée :
          </h3>
          <p className="text-lg text-indigo-900 font-semibold">
            Jeudi 15 mai 2025
          </p>

          {/* Affichage des jours fériés ou dates passées */}
          {getHolidayInfo(2025, 4, 15) && (
            <div
              className="mt-2 p-2 rounded-md flex items-center bg-emerald-100 text-emerald-800"
            >
              <Star size={16} className="mr-2" /> {tunisianHolidays["05-18"]?.name || "Jour férié"}
            </div>
          )}
        </div>

        {/* Format d'heure toggle */}
        <div className="mb-4 flex justify-end items-center gap-2">
          <span className="text-sm text-gray-500">Format:</span>
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button
              className={`px-3 py-1 text-sm rounded text-gray-600 hover:text-gray-800 transition-colors`}
            >
              12h
            </button>
            <button
              className={`px-3 py-1 text-sm rounded bg-white shadow text-blue-600 transition-colors`}
            >
              24h
            </button>
          </div>
        </div>

        {/* Liste des réservations pour le jour sélectionné */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {staticEvents[2025]?.[4]
            .filter((e) => new Date(e.date).getDate() === 15)
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((e) => (
              <div
                key={e.id}
                className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all border-l-4 border-l-teal-500 group animate-fadeIn cursor-pointer hover:translate-y-1"
                onClick={() => setShowReservationDetail(true)} // Ouvre le modal au clic
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
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Supprimer cette réservation"
                    onClick={(e) => e.stopPropagation()} // Empêche l'ouverture du modal au clic
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Main calendar */}
      <div className="flex-grow p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <button
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Année précédente"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">{currentYear}</h2>
            <button
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
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <ChevronLeft />
                  </button>
                  <h3 className="text-xl font-medium text-indigo-800">
                    Jeudi 15 mai 2025
                  </h3>
                  <button
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

      {/* ─── Détail de réservation Modal ───────────────────────────────────────── */}
      {showReservationDetail && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowReservationDetail(false)} // Ferme le modal au clic en dehors
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 animate-scaleIn relative"
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic sur le modal
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => setShowReservationDetail(false)} // Ferme le modal au clic sur le X
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
                  {reservationDetail.clientFirstName} {reservationDetail.clientLastName}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Téléphone :</span>{" "}
                  {reservationDetail.clientPhoneNumber}
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
                  {reservationDetail.employee.firstName} {reservationDetail.employee.lastName}
                </div>
              )}

              {/* Participants */}
              <div>
                <span className="font-medium text-gray-700">
                  Participants :
                </span>{" "}
                {reservationDetail.numberOfAttendees}
              </div>
              
              {/* Bouton de fermeture en bas */}
              <div className="mt-4 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setShowReservationDetail(false)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors flex items-center justify-center"
                >
                  <X size={16} className="mr-1" />
                  Fermer
                </button>
              </div>
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
    </div>
  );
};

export default StaticCalendar;