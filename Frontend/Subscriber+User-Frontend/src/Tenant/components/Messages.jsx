import React, { useState, useEffect } from 'react';
import axios from 'axios';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const TenantConfigPage = () => {
  const [activeTab, setActiveTab] = useState('workingHours');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const toMins = timeStr => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
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
      const active    = dayData.isActive;

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

    const handleSubmit = async () => {
      setIsLoading(true);
      setError(null);
  
      // 1) Validation pass: for each active day, start < end
      for (const [day, { isActive, start, end }] of Object.entries(workingHours)) {
        if (isActive && toMins(start) >= toMins(end)) {
          setError(`Le créneau pour ${day} est invalide : l'heure de début doit être avant l'heure de fin.`);
          setIsLoading(false);
          return; // stop everything
        }
      }
      try {
        for (const day of Object.keys(workingHours)) {
          const ok = await saveWorkingDay(day, workingHours[day]);
          if (!ok) {
            setError(`Failed to save working hours for ${day}`);
            break;
          }
        }
        if (!error) {
          alert('Configuration sauvegardée avec succès !');
        }
      } catch (err) {
        console.error('Error during save:', err);
        setError('Une erreur est survenue lors de la sauvegarde');
      } finally {
        setIsLoading(false);
      }
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
        setError('Failed to load working hours data');
      } finally {
        setIsLoading(false);
      }
    };

  const [services, setServices] = useState([
    { id: 1, name: 'Consultation', duration: 60, price: 50 }
  ]);
  const [breaks, setBreaks] = useState([]);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    logo: null,
    companyName: '',
    businessType: '',
  });


  // Fetch existing working days on component mount
  useEffect(() => {
    fetchWorkingDays();
  }, []);

  const addService = () => {
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    setServices([...services, { id: newId, name: '', duration: 30, price: 0 }]);
  };

  const updateService = (id, field, value) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const removeService = (id) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const addBreak = () => {
    setBreaks([...breaks, { day: 'monday', start: '12:00', end: '13:00' }]);
  };

  const updateBreak = (index, field, value) => {
    setBreaks(prev => prev.map((brk, i) => 
      i === index ? { ...brk, [field]: value } : brk
    ));
  };

  const removeBreak = (index) => {
    setBreaks(prev => prev.filter((_, i) => i !== index));
  };

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderWorkingHours = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Définir vos heures de travail</h3>
      {Object.entries(workingHours).map(([day, hours]) => (
        <div key={day} className="flex items-center gap-4 p-2 border rounded">
          <div className="w-28 capitalize">{day}</div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hours.isActive}
              onChange={e => handleWorkingHoursChange(day, 'isActive', e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600">
              <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-5"/>
            </div>
            <span className="ml-2 text-sm">{hours.isActive ? 'Actif' : 'Inactif'}</span>
          </label>
          {hours.isActive && (
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={hours.start}
                onChange={e => handleWorkingHoursChange(day, 'start', e.target.value)}
                className="border rounded p-1"
              />
              <span>à</span>
              <input
                type="time"
                value={hours.end}
                onChange={e => handleWorkingHoursChange(day, 'end', e.target.value)}
                className="border rounded p-1"
              />
            </div>
          )}
        </div>
      ))}
      

    </div>
  );


  const renderServices = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Services proposés</h3>
        <button onClick={addService} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          + Ajouter
        </button>
      </div>
      
      {services.map(service => (
        <div key={service.id} className="p-3 border rounded space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Nom du service</label>
              <input
                type="text"
                value={service.name}
                onChange={(e) => updateService(service.id, 'name', e.target.value)}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="ex: Consultation"
              />
            </div>
            
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700">Durée (min)</label>
              <input
                type="number"
                value={service.duration}
                onChange={(e) => updateService(service.id, 'duration', parseInt(e.target.value))}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                min="5"
              />
            </div>
            
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700">Prix (€)</label>
              <input
                type="number"
                value={service.price}
                onChange={(e) => updateService(service.id, 'price', parseFloat(e.target.value))}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                min="0"
              />
            </div>
            
            <button 
              onClick={() => removeService(service.id)}
              className="mt-6 p-1 text-red-500 hover:text-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBreaks = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Pauses</h3>
        <button onClick={addBreak} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          + Ajouter
        </button>
      </div>
      
      {breaks.map((brk, index) => (
        <div key={index} className="p-3 border rounded flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Jour</label>
            <select
              value={brk.day}
              onChange={(e) => updateBreak(index, 'day', e.target.value)}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            >
              <option value="monday">Lundi</option>
              <option value="tuesday">Mardi</option>
              <option value="wednesday">Mercredi</option>
              <option value="thursday">Jeudi</option>
              <option value="friday">Vendredi</option>
              <option value="saturday">Samedi</option>
              <option value="sunday">Dimanche</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Début</label>
            <input
              type="time"
              value={brk.start}
              onChange={(e) => updateBreak(index, 'start', e.target.value)}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Fin</label>
            <input
              type="time"
              value={brk.end}
              onChange={(e) => updateBreak(index, 'end', e.target.value)}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>
          
          <button 
            onClick={() => removeBreak(index)}
            className="mt-6 p-1 text-red-500 hover:text-red-700"
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Informations personnelles</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom complet</label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
          <input
            type="text"
            value={personalInfo.companyName}
            onChange={(e) => handlePersonalInfoChange('companyName', e.target.value)}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Type d'activité</label>
          <select
            value={personalInfo.businessType}
            onChange={(e) => handlePersonalInfoChange('businessType', e.target.value)}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          >
            <option value="">Sélectionnez...</option>
            <option value="healthcare">Santé</option>
            <option value="beauty">Beauté</option>
            <option value="consulting">Conseil</option>
            <option value="education">Éducation</option>
            <option value="other">Autre</option>
          </select>
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <div className="mt-1 flex items-center">
            {personalInfo.logo ? (
              <div className="relative">
                <img 
                  src={URL.createObjectURL(personalInfo.logo)} 
                  alt="Logo preview" 
                  className="w-20 h-20 object-cover rounded"
                />
                <button 
                  onClick={() => handlePersonalInfoChange('logo', null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="cursor-pointer bg-gray-100 p-2 rounded border hover:bg-gray-200">
                <span>Choisir un fichier</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePersonalInfoChange('logo', e.target.files[0]);
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Configuration de votre plateforme de réservation</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'personalInfo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('personalInfo')}
              >
                Informations
              </button>
              <button
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'workingHours'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('workingHours')}
              >
                Heures de travail
              </button>
              <button
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('services')}
              >
                Services
              </button>
              <button
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'breaks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('breaks')}
              >
                Pauses
              </button>
            </nav>
          </div>
        </div>
        
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'personalInfo' && renderPersonalInfo()}
              {activeTab === 'workingHours' && renderWorkingHours()}
              {activeTab === 'services' && renderServices()}
              {activeTab === 'breaks' && renderBreaks()}
            </>
          )}
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 rounded font-medium ${
              isLoading 
                ? 'bg-gray-400 text-gray-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer la configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantConfigPage;