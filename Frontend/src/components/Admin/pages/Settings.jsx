import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Paramètres</h2>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <SettingsIcon className="text-indigo-600 mr-2" size={24} />
          <h3 className="text-lg font-medium text-gray-800">Options de configuration</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-800">Langue</label>
            <select className="mt-1 block w-full p-2 border border-gray-200 rounded-lg text-sm">
              <option>Français</option>
              <option>Anglais</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Fuseau horaire</label>
            <select className="mt-1 block w-full p-2 border border-gray-200 rounded-lg text-sm">
              <option>UTC+1 (Paris)</option>
              <option>UTC (Londres)</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;