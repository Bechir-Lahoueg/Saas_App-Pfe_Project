import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Calendar, CheckCircle, AlertTriangle, Save, X, ChevronRight, Sun, Moon } from 'lucide-react';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const WorkingHoursComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [animateSubmit, setAnimateSubmit] = useState(false);
  const [workingHours, setWorkingHours] = useState({
    monday: { isActive: true, start: '09:00', end: '17:00' },
    tuesday: { isActive: true, start: '09:00', end: '17:00' },
    wednesday: { isActive: true, start: '09:00', end: '17:00' },
    thursday: { isActive: true, start: '09:00', end: '17:00' },
    friday: { isActive: true, start: '09:00', end: '17:00' },
    saturday: { isActive: false, start: '09:00', end: '17:00' },
    sunday: { isActive: false, start: '09:00', end: '17:00' },
  });

  const [workingDayIds, setWorkingDayIds] = useState({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  });

  const dayColors = {
    monday: { light: '#EFF6FF', accent: '#3B82F6' },    // Blue
    tuesday: { light: '#F0FDF4', accent: '#10B981' },   // Green
    wednesday: { light: '#FEF2F2', accent: '#EF4444' }, // Red
    thursday: { light: '#F9FAFB', accent: '#6366F1' },  // Indigo
    friday: { light: '#FFF7ED', accent: '#F59E0B' },    // Amber
    saturday: { light: '#ECFDF5', accent: '#059669' },  // Emerald
    sunday: { light: '#FDF2F8', accent: '#EC4899' },    // Pink
  };

  const getDayLabel = (day) => {
    const labels = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
    };
    return labels[day] || day;
  };

  const toMins = timeStr => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}h${minutes}`;
  };

  // On mount: configure axios with our tenant header and auth token
  useEffect(() => {
    const subdomain = getCookie('subdomain');
    const token = getCookie('accessToken');
    
    // Set up axios defaults for all requests
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    if (subdomain) {
      axios.defaults.headers.common['X-Tenant-ID'] = subdomain;
    }
    axios.defaults.baseURL = 'http://localhost:8888';
    axios.defaults.withCredentials = true;
    
    fetchWorkingDays();
  }, []);

  const handleWorkingHoursChange = (day, field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const saveWorkingDay = async (day, dayData) => {
    const dayOfWeek = day.toUpperCase();
    const timeSlot = { startTime: dayData.start, endTime: dayData.end };
    const active = dayData.isActive;

    try {
      if (workingDayIds[day]) {
        // update existing
        await axios.put(
          `/schedule/working-day/update/${workingDayIds[day]}`,
          { dayOfWeek, active, timeSlots: dayData.isActive ? [timeSlot] : [] }
        );
        
      } else if (dayData.isActive) {
        // create new
        const { data } = await axios.post(
          `/schedule/working-day/create`,
          { dayOfWeek, active, timeSlots: [timeSlot] }
        );
        setWorkingDayIds(prev => ({ ...prev, [day]: data.id }));
      }
      return true;
    } catch (err) {
      console.error(`Error saving working day ${day}:`, err);
      return false;
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setAnimateSubmit(true);

    // 1) Validation pass: for each active day, start < end
    for (const [day, { isActive, start, end }] of Object.entries(workingHours)) {
      if (isActive && toMins(start) >= toMins(end)) {
        setError(`Le créneau pour ${getDayLabel(day)} est invalide : l'heure de début doit être avant l'heure de fin.`);
        setIsLoading(false);
        setAnimateSubmit(false);
        return; // stop everything
      }
    }
    
    setTimeout(async () => {
      try {
        for (const day of Object.keys(workingHours)) {
          const ok = await saveWorkingDay(day, workingHours[day]);
          if (!ok) {
            setError(`Échec de l'enregistrement des heures de travail pour ${getDayLabel(day)}`);
            showNotification('error', `Échec de l'enregistrement des heures de travail pour ${getDayLabel(day)}`);
            break;
          }
        }
        if (!error) {
          showNotification('success', 'Configuration sauvegardée avec succès !');
        }
      } catch (err) {
        console.error('Error during save:', err);
        setError('Une erreur est survenue lors de la sauvegarde');
        showNotification('error', 'Une erreur est survenue lors de la sauvegarde');
      } finally {
        setIsLoading(false);
        setAnimateSubmit(false);
      }
    }, 800); // Add a slight delay for animation
  };

  const fetchWorkingDays = async () => {
    try {
      setIsLoading(true);
      // No need to add headers here, they are already set in axios defaults
      const { data } = await axios.get(`/schedule/working-day/getall`);
      
      const updatedHours = { ...workingHours };
      const updatedIds = { ...workingDayIds };
      
      data.forEach(day => {
        const key = day.dayOfWeek.toLowerCase();
        if (updatedHours[key]) {
          updatedHours[key].isActive = day.active;
          if (day.timeSlots?.length) {
            const slot = day.timeSlots[0];
            updatedHours[key] = { isActive: true, start: slot.startTime, end: slot.endTime };
          }
          updatedIds[key] = day.id;
        }
      });
      
      setWorkingHours(updatedHours);
      setWorkingDayIds(updatedIds);
    } catch (err) {
      console.error('Error fetching working days:', err);
      setError('Impossible de charger les données des heures de travail');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-xl max-w-4xl mx-auto transition-all duration-500 ease-in-out transform">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 rounded-lg shadow-lg mr-4">
          <Calendar className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Heures de travail
          </h2>
          <p className="text-gray-600 mt-1">Définissez vos disponibilités pour chaque jour de la semaine</p>
        </div>
      </div>

      {/* Toast Notifications - Now at the top */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 rounded-lg shadow-xl p-4 text-white flex items-center space-x-3 max-w-md animate-slide-in-top transition-all duration-300 z-50 ${
            notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="text-white flex-shrink-0" size={20} />
          ) : (
            <AlertTriangle className="text-white flex-shrink-0" size={20} />
          )}
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification(null)}
            className="ml-auto text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error message - Now at the top */}
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-500 flex items-center space-x-3 animate-shake">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <span className="text-red-800">{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="ml-auto text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(workingHours).map(([day, hours], index) => (
          <div 
            key={day} 
            className={`rounded-xl p-5 transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
              hours.isActive 
                ? `bg-gradient-to-r from-${dayColors[day].light} to-white border-l-4`
                : 'bg-white'
            }`}
            style={{ 
              borderLeftColor: hours.isActive ? dayColors[day].accent : 'transparent',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              animationDelay: `${index * 100}ms` 
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: dayColors[day].accent }}
                >
                  {getDayLabel(day).charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{getDayLabel(day)}</h3>
                  {hours.isActive && (
                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span>{formatTime(hours.start)} - {formatTime(hours.end)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={hours.isActive}
                      onChange={e => handleWorkingHoursChange(day, 'isActive', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div 
                      className="w-14 h-7 rounded-full transition-colors duration-300 ease-in-out peer-focus:ring-4 peer-focus:ring-opacity-30"
                      style={{ 
                        backgroundColor: hours.isActive ? dayColors[day].accent : '#CBD5E0',
                        boxShadow: hours.isActive ? `0 0 8px ${dayColors[day].accent}` : 'none',
                        ringColor: dayColors[day].accent
                      }}
                    >
                      <div 
                        className="absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center"
                        style={{ transform: hours.isActive ? 'translateX(28px)' : 'translateX(0)' }}
                      >
                        {hours.isActive ? (
                          <Sun className="w-3 h-3 text-yellow-500" />
                        ) : (
                          <Moon className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </label>

                {hours.isActive && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex items-center">
                      <input
                        type="time"
                        value={hours.start}
                        onChange={e => handleWorkingHoursChange(day, 'start', e.target.value)}
                        className="pl-4 pr-4 py-2 border-0 rounded-lg shadow-sm focus:ring-2 outline-none transition-all text-gray-700 bg-gray-50"
                        style={{ focusRingColor: dayColors[day].accent }}
                      />
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                    <div className="relative flex items-center">
                      <input
                        type="time"
                        value={hours.end}
                        onChange={e => handleWorkingHoursChange(day, 'end', e.target.value)}
                        className="pl-4 pr-4 py-2 border-0 rounded-lg shadow-sm focus:ring-2 outline-none transition-all text-gray-700 bg-gray-50"
                        style={{ focusRingColor: dayColors[day].accent }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-8 py-4 rounded-xl font-bold text-white flex items-center justify-center transition-all duration-500 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg hover:shadow-xl'
          } ${animateSubmit ? 'animate-pulse' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement en cours...
            </>
          ) : (
            <>
              <Save className="mr-2" size={20} />
              Enregistrer la configuration
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInTop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.8s ease-in-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.4s forwards;
        }
        
        .animate-slide-in-top {
          animation: slideInTop 0.4s forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        /* Make the days appear with a staggered animation */
        [class*="rounded-xl"] {
          animation: fadeIn 0.5s ease-in-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default WorkingHoursComponent;