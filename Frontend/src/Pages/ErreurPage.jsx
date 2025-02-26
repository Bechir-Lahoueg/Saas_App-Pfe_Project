import React from 'react';

const Error404Page = () => {
  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Formes d'arrière-plan */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full -translate-y-1/4 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full translate-y-1/4 -translate-x-1/4"></div>
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-400 rounded-full -translate-x-1/4"></div>
      
      {/* Carte d'erreur 404 */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md z-10 flex flex-col items-center">
        {/* Fenêtre de navigateur avec erreur 404 */}
        <div className="w-64 h-32 bg-blue-100 rounded-lg overflow-hidden mb-6">
          {/* Barre supérieure de la fenêtre */}
          <div className="h-6 bg-gray-200 flex items-center px-2">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
          
          {/* Contenu de la fenêtre - message 404 */}
          <div className="h-26 bg-blue-500 flex flex-col justify-center items-center p-2">
            <div className="text-5xl font-bold text-orange-400">404</div>
            <div className="flex justify-between w-full mt-2">
              <div className="w-8 h-1 bg-white rounded"></div>
              <div className="flex">
                <div className="w-1 h-1 bg-white rounded-full mx-0.5"></div>
                <div className="w-1 h-1 bg-white rounded-full mx-0.5"></div>
                <div className="w-1 h-1 bg-white rounded-full mx-0.5"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Message d'erreur */}
        <h2 className="text-xl text-gray-800 mb-6">Looks like you've got lost....</h2>
        
        {/* Bouton de retour */}
        <button 
          className="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-500 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Error404Page;