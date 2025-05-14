import React, { useState } from 'react';

// Importation des icônes
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

export default function Calendar() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(4); // Mai (0-indexed)
  const today = new Date();
  
  // Jours fériés et fêtes régionales tunisiennes
  const tunisianHolidays = {
    // Format: "MM-DD": { name: "Nom de la fête", description: "Description", type: "national/regional" }
    "01-01": { name: "Jour de l'an", description: "Nouvel an du calendrier grégorien", type: "national" },
    "01-14": { name: "Fête de la Révolution", description: "Commémoration de la révolution tunisienne", type: "national" },
    "03-20": { name: "Fête de l'Indépendance", description: "Indépendance de la Tunisie (1956)", type: "national" },
    "04-09": { name: "Journée des Martyrs", description: "Commémoration des martyrs de Tunisie", type: "national" },
    "05-01": { name: "Fête du Travail", description: "Journée internationale des travailleurs", type: "national" },
    "07-25": { name: "Fête de la République", description: "Proclamation de la République Tunisienne (1957)", type: "national" },
    "08-13": { name: "Fête de la Femme", description: "Journée nationale de la femme tunisienne", type: "national" },
    "10-15": { name: "Fête de l'Évacuation", description: "Évacuation des dernières troupes françaises (1963)", type: "national" },
    // Fêtes régionales (exemples)
    "05-20": { name: "Festival de Douz", description: "Festival du Sahara à Douz", type: "regional" },
    "07-10": { name: "Festival de Carthage", description: "Festival international de Carthage", type: "regional" },
    "08-05": { name: "Festival de Hammamet", description: "Festival international de Hammamet", type: "regional" },
    "09-01": { name: "Festival de Dougga", description: "Festival des arts et cultures à Dougga", type: "regional" }
    // Note: Les fêtes religieuses musulmanes suivent le calendrier lunaire et changent chaque année
  };
  
  // Fêtes religieuses pour 2025 (dates approximatives car basées sur le calendrier lunaire)
  const religiousHolidays2025 = {
    "01-02": { name: "Nouvel An Islamique", description: "1447 Hégire", type: "religious" },
    "03-12": { name: "Mouled", description: "Anniversaire du Prophète Mohammed", type: "religious" },
    "04-10": { name: "Aïd Al-Fitr", description: "Fin du mois de Ramadan", type: "religious" },
    "06-17": { name: "Aïd Al-Idha", description: "Fête du sacrifice", type: "religious" }
  };
  
  // Fusionner les fêtes fixes et religieuses
  const holidays = { ...tunisianHolidays, ...religiousHolidays2025 };
  
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  
  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const firstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const getHolidayForDate = (year, month, day) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${monthStr}-${dayStr}`;
    return holidays[dateKey];
  };
  
  const isToday = (year, month, day) => {
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate();
  };
  
  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentYear, currentMonth);
    const firstDay = firstDayOfMonth(currentYear, currentMonth);
    
    // Ajouter les jours vides au début du mois
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1 bg-gray-50"></div>);
    }
    
    // Ajouter tous les jours du mois
    for (let day = 1; day <= totalDays; day++) {
      const holiday = getHolidayForDate(currentYear, currentMonth, day);
      const isHoliday = !!holiday;
      const todayCheck = isToday(currentYear, currentMonth, day);
      
      let bgColorClass = '';
      let borderClass = 'border border-gray-200';
      let textColorClass = '';
      
      if (todayCheck) {
        borderClass = 'border-2 border-blue-500';
        textColorClass = 'text-blue-700';
      }
      
      if (isHoliday) {
        if (holiday.type === 'national') {
          bgColorClass = 'bg-red-50';
          textColorClass = todayCheck ? 'text-blue-700' : 'text-red-700';
        } else if (holiday.type === 'religious') {
          bgColorClass = 'bg-green-50';
          textColorClass = todayCheck ? 'text-blue-700' : 'text-green-700';
        } else {
          bgColorClass = 'bg-blue-50';
          textColorClass = todayCheck ? 'text-blue-700' : 'text-blue-700';
        }
      }
      
      days.push(
        <div 
          key={day} 
          className={`p-1 h-28 ${borderClass} ${bgColorClass} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <div className={`flex justify-between items-center mb-1 ${textColorClass}`}>
            <span className={`text-lg font-bold ${todayCheck ? 'rounded-full bg-blue-500 text-white h-7 w-7 flex items-center justify-center' : ''}`}>
              {day}
            </span>
            {isHoliday && (
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-white bg-opacity-60">
                {holiday.type === 'national' ? '🇹🇳' : holiday.type === 'religious' ? '🕌' : '🎭'}
              </span>
            )}
          </div>
          {isHoliday && (
            <div className="text-xs mt-1 overflow-hidden">
              <div className="font-semibold">{holiday.name}</div>
              <div className="text-gray-600 truncate text-xs">{holiday.description}</div>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const changeYear = (increment) => {
    setCurrentYear(currentYear + increment);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <CalendarIcon />
          <h1 className="text-4xl font-bold text-gray-800 ml-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-600">
            Calendrier
          </h1>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <button 
            onClick={() => changeYear(-1)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <ChevronLeftIcon />
          </button>
          <h2 className="text-3xl font-bold text-gray-700">{currentYear}</h2>
          <button 
            onClick={() => changeYear(1)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <ChevronRightIcon />
          </button>
        </div>
        <p className="text-gray-600 mt-2">Fêtes nationales et régionales de Tunisie</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => changeMonth(-1)} 
            className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <ChevronLeftIcon />
            <span className="ml-1">Précédent</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 px-4 py-2 border-b-2 border-red-500">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button 
            onClick={() => changeMonth(1)} 
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <span className="mr-1">Suivant</span>
            <ChevronRightIcon />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map(day => (
            <div key={day} className="font-bold text-center p-2 bg-gray-100 rounded-md text-gray-700">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">Légende</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center rounded-lg bg-red-50 p-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-100 border border-red-300 mr-3 text-center">
              🇹🇳
            </div>
            <span className="font-medium text-red-700">Fêtes nationales</span>
          </div>
          <div className="flex items-center rounded-lg bg-green-50 p-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 border border-green-300 mr-3 text-center">
              🕌
            </div>
            <span className="font-medium text-green-700">Fêtes religieuses</span>
          </div>
          <div className="flex items-center rounded-lg bg-blue-50 p-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 border border-blue-300 mr-3 text-center">
              🎭
            </div>
            <span className="font-medium text-blue-700">Fêtes régionales</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800">Informations</h3>
        <p className="text-gray-600">
          Les dates des fêtes religieuses musulmanes sont approximatives car elles suivent le calendrier lunaire 
          et peuvent varier de 1-2 jours selon l'observation de la lune.
        </p>
        <p className="text-gray-600 mt-2">
          Ce calendrier présente les principales fêtes et célébrations tunisiennes pour l'année {currentYear}.
        </p>
      </div>
    </div>
  );
}