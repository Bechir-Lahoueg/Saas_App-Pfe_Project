import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Base</h2>
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <span className="ml-2">Tableau de bord</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/todo"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <span className="ml-2">To-Do List</span>
          </NavLink>
        </li>
        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">Analytique</li>
        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">Facture</li>
        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">Liste RH</li>
        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">Messages</li>
        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">Notification</li>
        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">Paramètres</li>
      </ul>
    </div>
  );
};

export default Sidebar;