import { useState, useEffect } from 'react';
import axios from 'axios';

const MediaManager = () => {
  const [medias, setMedias] = useState({
    logo: [],
    banner: [],
    video: [],
    photo: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState('logo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Récupérer tous les médias au chargement
  useEffect(() => {
    fetchAllMedia();
  }, []);

  // Récupérer tous les médias et les organiser par type
  const fetchAllMedia = async () => {
    try {
      const response = await axios.get('/schedule/media');
      
      // Organiser par type
      const mediaByType = {
        logo: [],
        banner: [],
        video: [],
        photo: []
      };
      
      response.data.forEach(media => {
        if (mediaByType[media.mediaType]) {
          mediaByType[media.mediaType].push(media);
        }
      });
      
      setMedias(mediaByType);
    } catch (err) {
      setError('Erreur lors du chargement des médias');
      console.error(err);
    }
  };

  // Gérer le changement de fichier
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Validation du type de fichier
      if (selectedType === 'video' && !file.type.startsWith('video/')) {
        setError('Veuillez sélectionner un fichier vidéo');
        return;
      }
      
      if (selectedType !== 'video' && !file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image');
        return;
      }
      
      setError('');
    }
  };

  // Upload du fichier
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('mediaType', selectedType);
    
    try {
      await axios.post('/schedule/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(`${selectedType} téléchargé avec succès`);
      setSelectedFile(null);
      document.getElementById('file-input').value = '';
      
      // Rafraîchir les médias
      fetchAllMedia();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Erreur lors du téléchargement');
      } else {
        setError('Erreur lors du téléchargement');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un média
  const handleDelete = async (id, type) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce média ?')) {
      try {
        await axios.delete(`/schedule/media/${id}`);
        setSuccess(`${type} supprimé avec succès`);
        fetchAllMedia();
      } catch (err) {
        setError('Erreur lors de la suppression du média');
        console.error(err);
      }
    }
  };

  // Afficher un média selon son type
  const renderMedia = (media) => {
    if (media.mediaType === 'video') {
      return (
        <video 
          className="w-full h-auto rounded shadow-md" 
          controls
          key={media.id}
        >
          <source src={media.url} type="video/mp4" />
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>
      );
    } else {
      return (
        <img 
          src={media.url} 
          alt={media.mediaType} 
          className={`
            ${media.mediaType === 'logo' ? 'max-h-24 object-contain' : ''}
            ${media.mediaType === 'banner' ? 'w-full h-48 object-cover' : ''}
            ${media.mediaType === 'photo' ? 'h-48 w-full object-cover' : ''}
            rounded shadow-md
          `}
          key={media.id}
        />
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Gestionnaire de médias</h1>
      
      {/* Formulaire d'upload */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Ajouter un média</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de média
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="logo">Logo</option>
              <option value="banner">Bannière</option>
              <option value="video">Vidéo</option>
              <option value="photo">Photo</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fichier
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept={selectedType === 'video' ? 'video/*' : 'image/*'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="mt-1 text-sm text-gray-500">
              {selectedType === 'logo' && 'Format recommandé: PNG ou SVG avec fond transparent'}
              {selectedType === 'banner' && 'Format recommandé: 1920x480px, JPG ou PNG'}
              {selectedType === 'video' && 'Format recommandé: MP4, durée maximale de 1 minute'}
              {selectedType === 'photo' && 'Format recommandé: JPG ou PNG, haute résolution'}
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading || !selectedFile}
            className={`w-full py-2 px-4 rounded-md text-white font-medium 
              ${loading || !selectedFile 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Téléchargement...' : 'Télécharger'}
          </button>
        </form>
      </div>
      
      {/* Affichage des médias */}
      <div className="space-y-10">
        {/* Logo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Logo</h2>
          {medias.logo.length > 0 ? (
            <div className="flex flex-col items-center">
              {renderMedia(medias.logo[0])}
              <button 
                onClick={() => handleDelete(medias.logo[0].id, 'Logo')}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          ) : (
            <p className="text-gray-500 italic">Aucun logo téléchargé</p>
          )}
        </div>
        
        {/* Bannière */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Bannière</h2>
          {medias.banner.length > 0 ? (
            <div>
              {renderMedia(medias.banner[0])}
              <button 
                onClick={() => handleDelete(medias.banner[0].id, 'Bannière')}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          ) : (
            <p className="text-gray-500 italic">Aucune bannière téléchargée</p>
          )}
        </div>
        
        {/* Vidéo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Vidéo</h2>
          {medias.video.length > 0 ? (
            <div>
              {renderMedia(medias.video[0])}
              <button 
                onClick={() => handleDelete(medias.video[0].id, 'Vidéo')}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          ) : (
            <p className="text-gray-500 italic">Aucune vidéo téléchargée</p>
          )}
        </div>
        
        {/* Photos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Photos ({medias.photo.length}/5)</h2>
          {medias.photo.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {medias.photo.map((photo) => (
                <div key={photo.id} className="relative">
                  {renderMedia(photo)}
                  <button 
                    onClick={() => handleDelete(photo.id, 'Photo')}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Aucune photo téléchargée</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaManager;