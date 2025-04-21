import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths } from "date-fns";
import { fr } from "date-fns/locale";

const PlanifyGoDemo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [email, setEmail] = useState("demo@planifygo.com");
  const [password, setPassword] = useState("demo1234");
  const [showLoginMessage, setShowLoginMessage] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState({
    '2025-04-02': [{ id: 1, type: 'consultation', title: 'Sophie Martin', time: '10:00', duration: 60 }],
    '2025-04-05': [{ id: 2, type: 'maintenance', title: 'Maintenance système', time: '14:00', duration: 45 }],
  });
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '18:00',
    days: [1, 2, 3, 4, 5] // Lundi à Vendredi
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'consultation',
    date: '',
    time: '10:00',
    duration: '60'
  });
  const [services, setServices] = useState([
    { id: 1, name: 'Consultation initiale', price: 75, duration: 60, active: true },
    { id: 2, name: 'Formation standard', price: 120, duration: 120, active: true },
    { id: 3, name: 'Maintenance mensuelle', price: 60, duration: 45, active: true }
  ]);

  // Génération du calendrier dynamique
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateNavigation = (direction) => {
    setCurrentDate(addMonths(currentDate, direction));
  };

  const handleDateClick = (date) => {
    if (!workingHours.days.includes(date.getDay())) return;
    
    setSelectedDate(date);
    setShowEventModal(true);
    setNewEvent(prev => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd'),
      time: workingHours.start
    }));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const eventConflict = (calendarEvents[dateKey] || []).some(event => {
      const eventStart = parseInt(event.time.replace(':', ''));
      const newStart = parseInt(newEvent.time.replace(':', ''));
      return newStart < eventStart + event.duration && newStart + parseInt(newEvent.duration) > eventStart;
    });

    if (eventConflict) {
      alert('Conflit de réservation !');
      return;
    }

    setCalendarEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), {
        ...newEvent,
        id: Date.now(),
        duration: parseInt(newEvent.duration)
      }]
    }));
    setShowEventModal(false);
    setNewEvent({ title: '', type: 'consultation', date: '', time: '10:00', duration: '60' });
  };

  const deleteEvent = (dateKey, eventId) => {
    setCalendarEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(event => event.id !== eventId)
    }));
  };

  const renderCalendarGrid = () => {
    const grid = [];
    const startDay = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;

    // Jours vides avant le début du mois
    for (let i = 0; i < startDay; i++) {
      grid.push(<div key={`empty-${i}`} className="p-2 text-gray-300"></div>);
    }

    // Jours du mois
    daysInMonth.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      const isWorkingDay = workingHours.days.includes(day.getDay());
      const dayEvents = calendarEvents[dayKey] || [];

      grid.push(
        <div 
          key={dayKey}
          onClick={() => handleDateClick(day)}
          className={`p-2 border rounded-lg cursor-pointer transition-all min-h-24
            ${isSameDay(day, new Date()) ? 'bg-blue-50 border-blue-200' : 'border-gray-100'}
            ${isWorkingDay ? 'hover:bg-blue-50' : 'bg-gray-50 opacity-75'}`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm ${isSameDay(day, new Date()) ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
              {format(day, 'd')}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-xs text-white bg-blue-500 rounded-full px-2">
                {dayEvents.length}
              </span>
            )}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id}
                className={`text-xs p-1 rounded flex justify-between items-center ${
                  event.type === 'consultation' ? 'bg-blue-100 text-blue-800' :
                  event.type === 'formation' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}
              >
                <span>{event.time} - {event.title}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEvent(dayKey, event.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    });

    return grid;
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginMessage(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLoginMessage(true);
    setActiveTab("dashboard");
  };

  const renderLoginScreen = () => (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
      {showLoginMessage && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <p className="font-medium">Version de démonstration premium</p>
          <p className="text-sm mt-1">Utilisez les identifiants fournis pour accéder au tableau de bord complet</p>
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Connexion à PlanifyGo</h1>
      
      <div className="mb-4">
        <label className="block text-left text-sm font-medium mb-2 text-gray-700">Adresse e-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-left text-sm font-medium mb-2 text-gray-700">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
      >
        Accéder au Dashboard
      </button>
    </div>
  );

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* ... (mêmes statistiques que précédemment) ... */}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Prochaines réservations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-3 text-left text-sm font-medium">Client</th>
                <th className="p-3 text-left text-sm font-medium">Date</th>
                <th className="p-3 text-left text-sm font-medium">Service</th>
                <th className="p-3 text-left text-sm font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(calendarEvents).flatMap(([date, events]) =>
                events.map(event => (
                  <tr key={event.id} className="hover:bg-gray-50 border-b">
                    <td className="p-3">{event.title}</td>
                    <td className="p-3">{format(new Date(date), 'dd/MM/yyyy')} {event.time}</td>
                    <td className="p-3 capitalize">{event.type}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Confirmé
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleDateNavigation(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => handleDateNavigation(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center font-medium mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="p-2 text-sm text-gray-500">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 auto-rows-min">
          {renderCalendarGrid()}
        </div>
      </div>

      {/* Paramètres avancés */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-6">Configuration du calendrier</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Heures d'ouverture</label>
            <div className="flex gap-4">
              <input
                type="time"
                value={workingHours.start}
                onChange={e => setWorkingHours(prev => ({ ...prev, start: e.target.value }))}
                className="w-full p-2 border rounded"
              />
              <input
                type="time"
                value={workingHours.end}
                onChange={e => setWorkingHours(prev => ({ ...prev, end: e.target.value }))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Jours de travail</label>
            <div className="grid grid-cols-7 gap-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                <label 
                  key={day}
                  className={`flex items-center justify-center h-10 rounded cursor-pointer ${
                    workingHours.days.includes(index) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={workingHours.days.includes(index)}
                    onChange={() => {
                      const newDays = workingHours.days.includes(index)
                        ? workingHours.days.filter(d => d !== index)
                        : [...workingHours.days, index];
                      setWorkingHours(prev => ({ ...prev, days: newDays }));
                    }}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              Nouvelle réservation - {format(selectedDate, 'dd/MM/yyyy')}
            </h3>
            <form onSubmit={handleAddEvent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de l'événement</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={newEvent.title}
                    onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Heure de début</label>
                    <input
                      type="time"
                      required
                      className="w-full p-2 border rounded-lg"
                      value={newEvent.time}
                      min={workingHours.start}
                      max={workingHours.end}
                      onChange={e => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Durée</label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={newEvent.duration}
                      onChange={e => setNewEvent(prev => ({ ...prev, duration: e.target.value }))}
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 heure</option>
                      <option value="90">1h30</option>
                      <option value="120">2 heures</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type de service</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={newEvent.type}
                    onChange={e => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                  >
                    {services.map(service => (
                      <option key={service.id} value={service.name.toLowerCase()}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          {renderLoginScreen()}
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-blue-600">PlanifyGo</h1>
                </div>
                <div className="flex items-center gap-6">
                  <nav className="hidden md:flex gap-6">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`${activeTab === 'dashboard' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className={`${activeTab === 'calendar' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Calendrier
                    </button>
                    <button
                      onClick={() => setActiveTab('services')}
                      className={`${activeTab === 'services' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Services
                    </button>
                  </nav>
                  <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-600 hover:text-gray-900">
                      <span className="sr-only">Notifications</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                      </svg>
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        D
                      </div>
                      <span className="hidden md:inline">Compte Démo</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 py-8">
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'calendar' && renderCalendar()}
              {activeTab === 'services' && (
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Gestion des services</h2>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      + Nouveau service
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">{service.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {service.active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-600">Durée: {service.duration} minutes</p>
                          <p className="text-2xl font-bold text-blue-600">{service.price}€</p>
                          <div className="flex gap-2 mt-4">
                            <button className="text-blue-600 hover:text-blue-800">
                              Modifier
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default PlanifyGoDemo;