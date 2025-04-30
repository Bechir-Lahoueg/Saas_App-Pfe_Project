import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { UserCircle, Camera, Loader, Check, X, Edit } from 'lucide-react';
import { getCookie } from './ConfigurationDashboard/authUtils';

const TenantProfilePage = () => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  

  const tenantId= getCookie('tenantId')
  const subdomain = getCookie('subdomain');
  
  // Configuration d'axios
  const API_URL = "http://localhost:8888/auth";
  
  // axios.defaults.headers.common['X-Tenant-ID'] = `${subdomain}`;

  // Récupérer les informations du tenant au chargement
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/tenant/get/${tenantId}`);
        setTenant(response.data);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des données: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    if (subdomain) {
      fetchTenantData();
    } else {
      setError("Impossible de déterminer le sous-domaine");
      setLoading(false);
    }
  }, [subdomain]);
  
  // Déclencher le sélecteur de fichier
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  // Gérer la sélection d'une image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validation du type de fichier
    if (!file.type.match('image.*')) {
      setError("Veuillez sélectionner une image valide");
      return;
    }
    
    // Validation de la taille (max 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo");
      return;
    }
    
    // Prévisualisation de l'image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };
  
  // Envoyer l'image au serveur
  const handleUploadImage = async () => {
    if (!fileInputRef.current.files[0]) return;
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', fileInputRef.current.files[0]);
    
    try {
      const response = await axios.post(
        `${API_URL}/tenant/upload-profile-image/${tenant.id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setTenant(response.data);
      setSuccess("Photo de profil mise à jour avec succès!");
      setImagePreview(null);
      fileInputRef.current.value = '';
    } catch (err) {
      setError("Erreur lors de l'upload: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };
  
  // Annuler la modification
  const handleCancelUpload = () => {
    setImagePreview(null);
    setError(null);
    fileInputRef.current.value = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-700">Chargement des informations...</p>
      </div>
    );
  }
  
  if (error && !tenant) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profil de l'entreprise</h1>
          <p className="mt-2 text-sm text-gray-600">Gérez vos informations et votre photo de profil</p>
        </div>

        {/* Notification de succès */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <div className="ml-auto">
                <button 
                  className="text-green-500 hover:text-green-700"
                  onClick={() => setSuccess(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Notification d'erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto">
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setError(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Section photo de profil */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Photo de profil</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Image actuelle ou prévisualisation */}
              <div className="relative group">
                {imagePreview ? (
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-100">
                    <img 
                      src={imagePreview} 
                      alt="Prévisualisation" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : tenant?.profileImageUrl ? (
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-100">
                    <img 
                      src={tenant.profileImageUrl} 
                      alt={`${tenant.businessName}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-full flex items-center justify-center bg-gray-100 border-4 border-blue-100">
                    <UserCircle className="w-32 h-32 text-gray-400" />
                  </div>
                )}
                
                <button 
                  onClick={handleImageClick}
                  className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all"
                  title="Modifier la photo"
                >
                  <Camera size={20} />
                </button>
              </div>
              
              {/* Contrôles pour la modification d'image */}
              <div className="mt-4 md:mt-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {imagePreview && (
                  <div className="flex flex-col space-y-3">
                    <p className="text-sm text-gray-600">
                      Cliquez sur "Enregistrer" pour appliquer la nouvelle photo
                    </p>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleUploadImage}
                        disabled={uploading}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {uploading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin mr-2" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Enregistrer
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelUpload}
                        disabled={uploading}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
                
                {!imagePreview && (
                  <div>
                    <button
                      onClick={handleImageClick}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier la photo
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      Format recommandé: JPG, PNG. Taille maximale: 5 Mo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Informations du tenant */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations de l'entreprise</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nom de l'entreprise</h3>
                <p className="mt-1 text-base text-gray-900">{tenant.businessName || "Non spécifié"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sous-domaine</h3>
                <p className="mt-1 text-base text-gray-900">{tenant.subdomain || "Non spécifié"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Prénom</h3>
                <p className="mt-1 text-base text-gray-900">{tenant.firstName || "Non spécifié"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                <p className="mt-1 text-base text-gray-900">{tenant.lastName || "Non spécifié"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-base text-gray-900">{tenant.email || "Non spécifié"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                <p className="mt-1 text-base text-gray-900">{tenant.phone || "Non spécifié"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                <p className="mt-1 text-base text-gray-900">{tenant.address || "Non spécifiée"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Ville</h3>
                <p className="mt-1 text-base text-gray-900">{tenant.city || "Non spécifiée"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Pays</h3>
                <p className="mt-1 text-base text-gray-900">{tenant.country || "Non spécifié"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Code postal</h3>
                <p className="mt-1 text-base text-gray-900">{tenant.zipcode || "Non spécifié"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantProfilePage;