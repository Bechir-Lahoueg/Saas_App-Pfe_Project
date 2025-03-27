import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  const events = [
    { id: 1, title: 'Réunion équipe', date: '2025-03-11', time: '10:00' },
    { id: 2, title: 'Appel client', date: '2025-03-11', time: '14:00' },
    { id: 3, title: 'Revue projet', date: '2025-03-12', time: '09:30' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calendrier</h2>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <CalendarIcon className="text-indigo-600 mr-2" size={24} />
          <h3 className="text-lg font-medium text-gray-800">Événements à venir</h3>
        </div>
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div>
                <p className="text-sm font-medium text-gray-800">{event.title}</p>
                <p className="text-xs text-gray-500">{event.date} - {event.time}</p>
              </div>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">Planifié</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;