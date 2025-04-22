import React, { useState, useEffect } from 'react';
import axios from 'axios';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const ServicesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([
    { id: 1, name: 'Consultation', duration: 60, price: 50 }
  ]);

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
    
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      // Endpoint for fetching services
      const { data } = await axios.get(`/services/getall`);
      if (data && data.length > 0) {
        setServices(data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services data');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Basic validation
      for (const service of services) {
        if (!service.name.trim()) {
          setError('Tous les services doivent avoir un nom');
          setIsLoading(false);
          return;
        }
        if (service.duration <= 0) {
          setError('La durée du service doit être supérieure à 0');
          setIsLoading(false);
          return;
        }
      }

      // Save services to backend
      await axios.post(`/services/update`, { services });
      
      alert('Services sauvegardés avec succès !');
    } catch (err) {
      console.error('Error saving services:', err);
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Services proposés</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
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
            {isLoading ? 'Enregistrement...' : 'Enregistrer les services'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;