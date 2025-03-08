import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 font-sans relative overflow-hidden">
      {/* Éléments de fond animés */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Motif de grille en superposition */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      {/* Section héro */}
      <div className="relative z-10 px-6 py-16 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Côté gauche - Contenu textuel */}
        <div className="md:w-1/2 md:pr-12 mb-12 md:mb-0">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6">
            Simplifiez votre processus de réservation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            <span className="block">Solution de réservation pour</span>
            <span className="text-blue-600">tous les services professionnels</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Transformez la façon dont vos clients réservent vos services avec notre plateforme tout-en-un. Définissez vos services, configurez vos disponibilités et laissez votre agenda se remplir 24h/24 et 7j/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md transform hover:-translate-y-1">
              Commencer gratuitement
            </button>
            <button className="px-8 py-3 rounded-lg bg-white text-blue-600 font-medium border border-blue-200 hover:border-blue-400 transition-all shadow-sm flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Voir la démo
            </button>
          </div>
          
          {/* Preuve sociale */}
          <div className="mt-10">
            <p className="text-sm text-gray-500 mb-3">Utilisé par plus de 10 000 entreprises dans le monde</p>
            <div className="flex flex-wrap gap-6 items-center opacity-70">
              <div className="h-8 w-auto">Entreprise 1</div>
              <div className="h-8 w-auto">Entreprise 2</div>
              <div className="h-8 w-auto">Entreprise 3</div>
              <div className="h-8 w-auto">Entreprise 4</div>
            </div>
          </div>
        </div>
        
        {/* Côté droit - Illustration */}
        <div className="md:w-1/2 relative">
          <div className="bg-white p-2 rounded-2xl shadow-xl">
            <div className="aspect-w-16 aspect-h-12 rounded-xl overflow-hidden bg-blue-50">
              {/* Illustration de calendrier */}
              <div className="p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                    <span>Mars 2025</span>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded hover:bg-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className="p-1 rounded hover:bg-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                      <div key={i} className="text-center py-2 bg-gray-100 text-gray-500 text-sm font-medium">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => (
                      <div key={i} className={`text-center py-2 bg-white hover:bg-blue-50 ${i === 2 || i === 14 ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700'}`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Créneaux de réservation */}
                <div className="mt-4 space-y-2">
                  <div className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">Coupe de cheveux - Jean</p>
                      <p className="text-sm text-gray-500">10:00 - 10:45</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Confirmé</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">Massage - Emma</p>
                      <p className="text-sm text-gray-500">11:30 - 12:30</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Nouveau</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Éléments décoratifs */}
          <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 w-24 h-24 bg-yellow-200 rounded-full opacity-70 z-0"></div>
          <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 translate-y-1/4 w-32 h-32 bg-green-100 rounded-full opacity-60 z-0"></div>
        </div>
      </div>
      
      {/* Points forts des fonctionnalités */}
      <div className="relative z-10 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-blue-50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Réservation en ligne 24/7</h3>
              <p className="text-gray-600">Permettez à vos clients de réserver à tout moment, même en dehors des heures d'ouverture.</p>
            </div>
            <div className="p-6 rounded-xl bg-blue-50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Services personnalisés</h3>
              <p className="text-gray-600">Définissez vos services, prix et durées avec une flexibilité totale.</p>
            </div>
            <div className="p-6 rounded-xl bg-blue-50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Rappels automatiques</h3>
              <p className="text-gray-600">Réduisez les absences avec des notifications automatiques par email et SMS.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;