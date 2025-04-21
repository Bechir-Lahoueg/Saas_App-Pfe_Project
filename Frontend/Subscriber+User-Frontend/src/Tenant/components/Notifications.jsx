import React from 'react';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, title: 'Nouvelle facture', time: 'il y a 1h', read: false },
    { id: 2, title: 'Membre ajouté', time: 'il y a 2h', read: true },
    { id: 3, title: 'Mise à jour système', time: 'il y a 3h', read: true },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notifications</h2>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <Bell className="text-indigo-600 mr-2" size={24} />
          <h3 className="text-lg font-medium text-gray-800">Dernières notifications</h3>
        </div>
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`flex items-center justify-between p-2 rounded-lg ${
                !notif.read ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    !notif.read ? 'bg-indigo-600' : 'bg-transparent'
                  }`}
                ></div>
                <p className="text-sm text-gray-800">{notif.title}</p>
              </div>
              <span className="text-xs text-gray-500">{notif.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;