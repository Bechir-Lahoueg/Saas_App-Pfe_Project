import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  MoreHorizontal 
} from 'lucide-react';

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedView, setSelectedView] = useState('Mois');

  // Generate events for 2025
  const generateEvents = () => {
    const events = {
      0: [
        { id: 1, title: 'New Year Celebration', date: '2025-01-01', color: 'blue' },
        { id: 2, title: 'Winter Conference', date: '2025-01-15', color: 'green' }
      ],
      9: [
        { id: 1, title: 'Porsche showroom', date: '2025-10-01', color: 'purple' },
        { id: 2, title: 'Design Conference', date: '2025-10-10', color: 'indigo' },
        { id: 3, title: 'Weekend Festival', date: '2025-10-05', color: 'pink' }
      ],
      11: [
        { id: 1, title: 'Holiday Party', date: '2025-12-24', color: 'red' },
        { id: 2, title: 'New Year\'s Eve', date: '2025-12-31', color: 'yellow' }
      ]
    };
    return events;
  };

  const events = generateEvents();

  const renderCalendarGrid = (month) => {
    const firstDay = new Date(currentYear, month, 1).getDay();
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const monthEvents = events[month] || [];

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

      days.push(
        <div 
          key={day} 
          className={`
            p-2 text-center rounded-lg relative
            ${dayEvents.length ? 'bg-gray-100' : ''}
            hover:bg-gray-200 transition-colors
          `}
        >
          {day}
          {dayEvents.map(event => (
            <div 
              key={event.id}
              className={`
                absolute bottom-0 left-1/2 transform -translate-x-1/2 
                w-2 h-2 rounded-full 
                bg-${event.color}-500
              `}
            ></div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2 text-sm">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="text-center text-gray-500 font-medium">{day}</div>
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
          >
            <h3 className="text-center font-semibold mb-3">
              {new Date(currentYear, month).toLocaleString('default', { month: 'long' })}
            </h3>
            {renderCalendarGrid(month)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar Events */}
      <div className="w-96 bg-white p-6 border-r">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Événements</h2>
          <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
            <PlusCircle size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          {events[selectedMonth]?.map(event => (
            <div 
              key={event.id} 
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full bg-${event.color}-500`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-grow p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Calendar Header */}
          <div className="flex justify-between items-center p-4 border-b">
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
            {['Jour', 'Semaine', 'Mois', 'Année'].map(view => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`
                  flex-1 py-3 transition-colors
                  ${selectedView === view 
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' 
                    : 'text-gray-500 hover:bg-gray-100'}
                `}
              >
                {view}
              </button>
            ))}
            <button className="bg-blue-500 text-white px-6 hover:bg-blue-600 flex items-center">
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
    </div>
  );
};

export default Calendar;