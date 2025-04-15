import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer } from '../components/Landing/Index';

// Cette page est utilisée pour créer un nouveau mot de passe après avoir cliqué sur le lien dans l'email
const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  
  // Extraction du token de l'URL
  const location = useLocation();
  
  useEffect(() => {
    // Récupérer le token depuis les paramètres de l'URL
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    
    if (!tokenFromUrl) {
      setErrorMessage('Le lien est invalide ou expiré. Veuillez indiquer votre adresse email pour en obtenir un nouveau.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [location]);
  
  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation du mot de passe
    if (newPassword.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Appel à l'API de réinitialisation
      const response = await fetch('http://localhost:8888/auth/tenant/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword
        }),
      });
      
      if (response.ok) {
        setIsCompleted(true);
        setErrorMessage('');
      } else {
        // Tenter de lire le message d'erreur JSON, mais gérer le cas où la réponse n'est pas du JSON
        try {
          const data = await response.json();
          setErrorMessage(data || 'Une erreur est survenue lors de la réinitialisation du mot de passe');
        } catch (e) {
          setErrorMessage('Une erreur est survenue lors de la réinitialisation du mot de passe');
        }
      }
    } catch (error) {
      setErrorMessage('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
      console.error('Erreur lors de la réinitialisation:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-white p-8 rounded-md shadow-lg border border-gray-200">
          {!isCompleted ? (
            <>
              <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Créer un nouveau mot de passe</h1>
              
              {!token ? (
                <div className="text-center p-4">
                  <p className="text-red-500">
                    {errorMessage || 'Lien de réinitialisation invalide ou expiré'}
                  </p>
                  <a 
                    href="/forgot-password" 
                    className="text-blue-600 underline block mt-4 hover:text-blue-800"
                  >
                    Demander un nouveau lien
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="new-password" className="text-sm text-gray-600 font-medium">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="p-3 bg-white border border-gray-300 rounded-md text-gray-800"
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    <p className="text-xs text-gray-500">Minimum 6 caractères</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="confirm-password" className="text-sm text-gray-600 font-medium">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="p-3 bg-white border border-gray-300 rounded-md text-gray-800"
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                  </div>
                  
                  {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-blue-600 text-white py-3 mt-4 rounded-md hover:bg-blue-700 transition ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Chargement...' : 'Confirmer'}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Mot de passe réinitialisé</h2>
              <p className="mb-6 text-gray-600">
                Votre mot de passe a été modifié avec succès.
              </p>
              <button
                onClick={() => {
                  window.location.href = "/login";
                }}
                className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition w-full"
              >
                Se connecter
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full mt-auto">
        <div className="border-t border-gray-200 w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;