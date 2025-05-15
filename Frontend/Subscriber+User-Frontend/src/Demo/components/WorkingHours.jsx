import React from 'react';
import { Calendar, Save, ChevronRight, Sun, Moon } from 'lucide-react';

const StaticWorkingHoursComponent = () => {
  // Données statiques pour la démonstration
  const workingHours = {
    monday: { isActive: true, start: '09:00', end: '17:00' },
    tuesday: { isActive: true, start: '09:00', end: '17:00' },
    wednesday: { isActive: true, start: '09:00', end: '17:00' },
    thursday: { isActive: true, start: '09:00', end: '17:00' },
    friday: { isActive: true, start: '09:00', end: '17:00' },
    saturday: { isActive: false, start: '09:00', end: '17:00' },
    sunday: { isActive: false, start: '09:00', end: '17:00' },
  };

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

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}h${minutes}`;
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
                      readOnly
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
                        readOnly
                        className="pl-4 pr-4 py-2 border-0 rounded-lg shadow-sm focus:ring-2 outline-none transition-all text-gray-700 bg-gray-50"
                        style={{ focusRingColor: dayColors[day].accent }}
                      />
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                    <div className="relative flex items-center">
                      <input
                        type="time"
                        value={hours.end}
                        readOnly
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
          className={`px-8 py-4 rounded-xl font-bold text-white flex items-center justify-center transition-all duration-500 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg hover:shadow-xl`}
        >
          <Save className="mr-2" size={20} />
          Enregistrer la configuration
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
      `}</style>
    </div>
  );
};

export default StaticWorkingHoursComponent;