import React, { useState, useEffect } from 'react';
import axios from 'axios';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const PersonalInfoPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    logo: null,
    companyName: '',
    businessType: '',
  });

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
    
    fetchPersonalInfo();
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      setIsLoading(true);
      // Endpoint for fetching personal info would need to be implemented
      const { data } = await axios.get(`/tenant/personal-info`);
      setPersonalInfo(data);
    } catch (err) {
      console.error('Error fetching personal info:', err);
      setError('Failed to load personal information');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Need to create FormData if we're uploading a file
      const formData = new FormData();
      for (const [key, value] of Object.entries(personalInfo)) {
        formData.append(key, value);
      }
      
      // Update personal information
      await axios.post(`/tenant/personal-info/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Informations personnelles sauvegardées avec succès !');
    } catch (err) {
      console.error('Error saving personal info:', err);
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Informations personnelles</h1>
        
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
                          src={typeof personalInfo.logo === 'object' ? URL.createObjectURL(personalInfo.logo) : personalInfo.logo} 
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
            {isLoading ? 'Enregistrement...' : 'Enregistrer les informations'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;