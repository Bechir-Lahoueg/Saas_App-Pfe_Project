import { useState } from 'react';
import { Footer } from '../components/Landing/Index';

// Cette page est utilisée pour saisir l'email et demander la réinitialisation
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Envoi de la demande de réinitialisation à l'API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation simple de l'email
    if (!email || !email.includes('@')) {
      setErrorMessage('Veuillez entrer une adresse email valide');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Appel à l'API pour déclencher l'envoi d'email
      const response = await fetch('http://localhost:8888/auth/tenant/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setErrorMessage('');
      } else {
        // Tenter de lire le message d'erreur JSON, mais gérer le cas où la réponse n'est pas du JSON
        try {
          const data = await response.json();
          setErrorMessage(data.message || 'Une erreur est survenue. Veuillez réessayer.');
        } catch (e) {
          setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
        }
      }
    } catch (error) {
      setErrorMessage('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
      console.error('Erreur lors de la demande:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Contenu principal qui prend tout l'espace disponible sauf celui du footer */}
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800">Mot de passe oublié</h1>
            {!isSubmitted && (
              <p className="mt-2 text-sm text-gray-600">
                Entrez votre adresse email pour recevoir un lien de réinitialisation
              </p>
            )}
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="exemple@email.com"
                    required
                  />
                </div>
              </div>
              
              {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Chargement...
                    </>
                  ) : 'Envoyer le lien'}
                </button>
              </div>
              
              <div className="text-center">
                <a href="/connexion" className="text-sm text-blue-600 hover:text-blue-800">
                  Retour à la connexion
                </a>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">Email envoyé</h2>
              <p className="mt-2 text-base text-gray-600">
                Un lien de réinitialisation a été envoyé à
              </p>
              <p className="text-lg font-medium text-gray-800 mt-1 mb-4">{email}</p>
              <p className="text-sm text-gray-500 mb-6">
                Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
              </p>
              
              <button
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer qui reste toujours en bas */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;