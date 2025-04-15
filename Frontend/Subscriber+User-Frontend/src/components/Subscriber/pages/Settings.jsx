import React, { useState } from 'react';
import { Edit, Trash2, Save, X, User, Globe, Bell, Moon, Sun } from 'lucide-react';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('Compte');
  const [profileName, setProfileName] = useState('Bachir Lahoueg');
  const [phoneNumber, setPhoneNumber] = useState('+216 28509217');
  const [description, setDescription] = useState('Hi there! 👋 I\'m X-Æ-A-19, an AI enthusiast and fitness aficionado. When I\'m not crunching numbers or optimizing algorithms, you can find me hitting the gym.');
  const [descriptionCharsRemaining, setDescriptionCharsRemaining] = useState(250 - description.length);
  const [language, setLanguage] = useState('Français');
  const [theme, setTheme] = useState('Système');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleDescriptionChange = (e) => {
    const newText = e.target.value;
    setDescription(newText);
    setDescriptionCharsRemaining(250 - newText.length);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Navigation */}
        <div className="bg-gray-50 border-b border-gray-200 flex">
          {['Compte', 'Générale'].map((tab) => (
            <button 
              key={tab}
              className={`flex-1 px-4 py-4 font-semibold transition-all duration-300 
                ${activeTab === tab 
                  ? 'text-indigo-600 border-b-3 border-indigo-600 bg-white' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Container */}
        <div className="p-8">
          {activeTab === 'Compte' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img 
                    src="/api/placeholder/120/120" 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-100 shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0 bg-white shadow-md rounded-full p-1.5">
                    <Edit className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profileName}</h2>
                  <p className="text-gray-500">AI Enthusiast & Fitness Aficionado</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input 
                    type="text" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numero de telephone</label>
                  <div className="flex">
                    <div className="bg-gray-100 px-3 py-3 rounded-l-lg border border-r-0 border-gray-300 flex items-center">
                      <img 
                        src="/api/placeholder/24/16" 
                        alt="Flag" 
                        className="w-6 h-4 rounded mr-2"
                      />
                      +216
                    </div>
                    <input 
                      type="text" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description Admin</label>
                <textarea 
                  value={description}
                  onChange={handleDescriptionChange}
                  maxLength={250}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {descriptionCharsRemaining} characters remaining
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex items-center">
                  <X className="mr-2 w-5 h-5" /> Annuler
                </button>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center shadow-md">
                  <Save className="mr-2 w-5 h-5" /> Enregistrer
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Générale' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <Globe className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-800">Paramètres Généraux</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                  <div className="relative">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Français</option>
                      <option>Anglais</option>
                      <option>Arabe</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Clair', 'Sombre', 'Système'].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => setTheme(themeOption)}
                        className={`flex items-center justify-center py-3 rounded-lg border transition-all ${
                          theme === themeOption 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {themeOption === 'Clair' ? <Sun className="mr-2 w-5 h-5" /> : 
                         themeOption === 'Sombre' ? <Moon className="mr-2 w-5 h-5" /> : 
                         <Globe className="mr-2 w-5 h-5" />}
                        {themeOption}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <Bell className="w-6 h-6 text-indigo-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Préférences de Notification</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Notifications par Email</p>
                        <p className="text-xs text-gray-500">Recevez des mises à jour par email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                        className="sr-only peer" 
                      />
                      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                        ${emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'}`}
                      ></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Bell className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Notifications Push</p>
                        <p className="text-xs text-gray-500">Recevez des alertes instantanées</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pushNotifications}
                        onChange={() => setPushNotifications(!pushNotifications)}
                        className="sr-only peer" 
                      />
                      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                        ${pushNotifications ? 'bg-indigo-600' : 'bg-gray-200'}`}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex items-center">
                  <X className="mr-2 w-5 h-5" /> Annuler
                </button>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center shadow-md">
                  <Save className="mr-2 w-5 h-5" /> Enregistrer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;