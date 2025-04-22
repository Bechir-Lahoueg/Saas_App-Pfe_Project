import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const BreaksPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [breaks, setBreaks] = useState([]);

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
    
    fetchBreaks();
  }, []);

  const fetchBreaks = async () => {
    try {
      setIsLoading(true);
      // Implement your API call to fetch breaks
      // const { data } = await axios.get(`/api/breaks`);
      // setBreaks(data);
      
      // For now, we'll just use the default state
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching breaks:', err);
      setError('Failed to load breaks data');
      setIsLoading(false);
    }
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

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Implement your API call to save breaks
      // await axios.post('/api/breaks', { breaks });
      
      // For now, just simulate a successful save
      setTimeout(() => {
        alert('Pauses sauvegardées avec succès !');
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error saving breaks:', err);
      setError('Une erreur est survenue lors de la sauvegarde');
      setIsLoading(false);
    }
  };

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
              <Link
                to="/personal-info"
                className="py-2 px-4 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Informations
              </Link>
              <Link
                to="/working-hours"
                className="py-2 px-4 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Heures de travail
              </Link>
              <Link
                to="/services"
                className="py-2 px-4 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Services
              </Link>
              <Link
                to="/breaks"
                className="py-2 px-4 border-b-2 font-medium text-sm border-blue-500 text-blue-600"
              >
                Pauses
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
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

              {breaks.length === 0 && (
                <div className="p-4 border rounded text-center text-gray-500">
                  Aucune pause configurée. Cliquez sur "Ajouter" pour créer une pause.
                </div>
              )}
            </div>
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
            {isLoading ? 'Enregistrement...' : 'Enregistrer les pauses'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreaksPage;