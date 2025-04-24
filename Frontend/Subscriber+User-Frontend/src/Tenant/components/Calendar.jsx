import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  MoreHorizontal,
  Clock,
  X
} from 'lucide-react';

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedView, setSelectedView] = useState('Mois');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    color: 'blue',
    time: '09:00'
  });

  // Generate events for 2025 - now stored in state so we can add to it
  const [allEvents, setAllEvents] = useState({
    0: [
      { id: 1, title: 'New Year Celebration', date: '2025-01-01', color: 'blue', time: '00:00' },
      { id: 2, title: 'Winter Conference', date: '2025-01-15', color: 'green', time: '09:30' }
    ],
    9: [
      { id: 1, title: 'Porsche showroom', date: '2025-10-01', color: 'purple', time: '14:00' },
      { id: 2, title: 'Design Conference', date: '2025-10-10', color: 'indigo', time: '10:00' },
      { id: 3, title: 'Weekend Festival', date: '2025-10-05', color: 'pink', time: '18:00' }
    ],
    11: [
      { id: 1, title: 'Holiday Party', date: '2025-12-24', color: 'red', time: '20:00' },
      { id: 2, title: 'New Year\'s Eve', date: '2025-12-31', color: 'yellow', time: '22:00' }
    ]
  });

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title) return;
    
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    
    const formattedDate = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const newEventObj = {
      id: Date.now(), // Simple ID generation
      title: newEvent.title,
      date: formattedDate,
      color: newEvent.color,
      time: newEvent.time
    };
    
    setAllEvents(prev => ({
      ...prev,
      [month]: [...(prev[month] || []), newEventObj]
    }));
    
    setNewEvent({ title: '', color: 'blue', time: '09:00' });
    setShowEventModal(false);
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    
    return (allEvents[month] || []).filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day;
    });
  };

  const renderCalendarGrid = (month) => {
    const firstDay = new Date(currentYear, month, 1).getDay();
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const monthEvents = allEvents[month] || [];

    let days = [];
    // Add empty days before the first day of the month
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(<div key={`empty-${i}`} className="text-gray-300"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, month, day);
      const dayEvents = monthEvents.filter(
        event => new Date(event.date).getDate() === day
      );

      const isSelected = selectedDate && 
                         selectedDate.getFullYear() === currentYear &&
                         selectedDate.getMonth() === month &&
                         selectedDate.getDate() === day;

      days.push(
        <div 
          key={day} 
          onClick={() => setSelectedDate(currentDate)}
          className={`
            p-2 text-center rounded-lg relative min-h-14 cursor-pointer
            ${isSelected ? 'bg-blue-100 border border-blue-400' : dayEvents.length ? 'bg-gray-50' : ''}
            hover:bg-blue-50 transition-colors
          `}
        >
          <span className={`
            inline-block w-7 h-7 rounded-full leading-7
            ${isSelected ? 'bg-blue-500 text-white' : ''}
          `}>{day}</span>
          
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id}
                className={`
                  text-xs text-white px-1 py-0.5 rounded truncate
                  bg-${event.color}-500
                `}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 font-medium">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="text-center text-gray-500 font-medium py-2">{day}</div>
        ))}
        {days}
      </div>
    );
  };

  const renderYearView = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(12)].map((_, month) => (
          <div 
            key={month} 
            className="border rounded-lg p-3 hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedMonth(month);
              setSelectedView('Mois');
            }}
          >
            <h3 className="text-center font-semibold mb-3">
              {new Date(currentYear, month).toLocaleString('default', { month: 'long' })}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
                <div key={day} className="text-center text-gray-500">{day}</div>
              ))}
              {renderMiniMonth(month)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMiniMonth = (month) => {
    const firstDay = new Date(currentYear, month, 1).getDay();
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const monthEvents = allEvents[month] || [];

    let days = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(<div key={`empty-${i}`} className="text-gray-300"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = monthEvents.filter(
        event => new Date(event.date).getDate() === day
      );

      days.push(
        <div 
          key={day} 
          className={`
            text-center text-xs p-1
            ${dayEvents.length ? 'bg-blue-100 rounded-full' : ''}
          `}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const colorOptions = [
    'blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo', 'orange', 'teal'
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar Events */}
      <div className="w-96 bg-white p-6 border-r shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Événements</h2>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg flex items-center"
            onClick={() => {
              if (selectedDate) {
                setShowEventModal(true);
              } else {
                alert("Veuillez sélectionner une date d'abord");
              }
            }}
          >
            <PlusCircle size={20} className="mr-1" />
            <span>Nouveau</span>
          </button>
        </div>
        
        {selectedDate ? (
          <div>
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <h3 className="font-medium text-blue-800">Date sélectionnée:</h3>
              <p className="text-lg font-semibold text-blue-900">
                {selectedDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <h3 className="font-medium text-gray-700 mb-3">Événements pour cette date:</h3>
            
            {getEventsForSelectedDate().length > 0 ? (
              <div className="space-y-3">
                {getEventsForSelectedDate().map(event => (
                  <div 
                    key={event.id} 
                    className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 bg-${event.color}-500`}></div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock size={14} className="mr-1" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucun événement pour cette date</p>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <CalendarIcon size={30} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Sélectionnez une date pour voir ou ajouter des événements</p>
          </div>
        )}
      </div>

      {/* Main Calendar Area */}
      <div className="flex-grow p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Calendar Header */}
          <div className="flex justify-between items-center p-4 border-b bg-gray-50">
            <button 
              onClick={() => setCurrentYear(currentYear - 1)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold">{currentYear}</h2>
            <button 
              onClick={() => setCurrentYear(currentYear + 1)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* View Selector */}
          <div className="flex border-b">
            {['Mois', 'Année'].map(view => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`
                  flex-1 py-3 transition-colors
                  ${selectedView === view 
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500 font-medium' 
                    : 'text-gray-500 hover:bg-gray-100'}
                `}
              >
                {view}
              </button>
            ))}
            <button 
              className="bg-blue-500 text-white px-6 hover:bg-blue-600 flex items-center"
              onClick={() => {
                if (selectedDate) {
                  setShowEventModal(true);
                } else {
                  alert("Veuillez sélectionner une date d'abord");
                }
              }}
            >
              <PlusCircle size={18} className="mr-2" /> Événement
            </button>
          </div>

          {/* Calendar Content */}
          <div className="p-6">
            {selectedView === 'Mois' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <button 
                    onClick={() => setSelectedMonth(prev => prev > 0 ? prev - 1 : 11)}
                    className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <h3 className="text-xl font-semibold">
                    {new Date(currentYear, selectedMonth).toLocaleString('default', { month: 'long' })}
                  </h3>
                  <button 
                    onClick={() => setSelectedMonth(prev => prev < 11 ? prev + 1 : 0)}
                    className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
                {renderCalendarGrid(selectedMonth)}
              </>
            )}
            
            {selectedView === 'Année' && renderYearView()}
          </div>
        </div>
      </div>
      
      {/* Event Creation Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Nouvel événement</h3>
              <button 
                onClick={() => setShowEventModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Date:</p>
              <p className="font-medium">
                {selectedDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de l'événement"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure
              </label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    className={`
                      w-8 h-8 rounded-full bg-${color}-500
                      ${newEvent.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}
                    `}
                    onClick={() => setNewEvent({...newEvent, color})}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={!newEvent.title}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;