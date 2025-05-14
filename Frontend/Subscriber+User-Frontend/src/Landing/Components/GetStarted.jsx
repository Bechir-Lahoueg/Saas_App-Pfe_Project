import React, { useEffect } from 'react';

const LandingPage = () => {
  // Animation au défilement
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const animatedElements = document.querySelectorAll('.reveal');
    
    animatedElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Fond abstrait moderne avec formes géométriques améliorées */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 -left-10 w-96 h-96 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-purple-300 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-to-tl from-cyan-100 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-3000"></div>
        
        {/* Motif de grille moderne */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-30" style={{ backgroundSize: '25px 25px' }}></div>
        </div>
        
        {/* Effet de particules légères amélioré */}
        <div className="sparkles absolute inset-0 opacity-40"></div>
      </div>

      {/* Ajusté le pt (padding-top) de 10 à 24 (et de 16 à 32 pour écrans medium) pour laisser de l'espace à la navbar */}
      <div className="relative z-10 pt-14 pb-32 md:pt-28 md:pb-40">
        <div className="max-w-7xl mx-auto px-6">
          {/* J'ai retiré la div avec le logo BookSync et les liens de connexion/inscription qui ressemblait à une navbar */}
          
          <div className="flex flex-col lg:flex-row items-center">
            {/* Côté gauche - Contenu textuel avec effets de révélation améliorés */}
            <div className="lg:w-1/2 lg:pr-16 mb-16 lg:mb-0 reveal">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 font-medium text-sm mb-8 reveal">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                <span>Réinventez votre gestion des rendez-vous</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 reveal">
                <span className="block text-gray-900">Solution de</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-transparent bg-clip-text">réservation pro</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed reveal">
                Transformez la façon dont vos clients réservent vos services avec notre plateforme 
                tout-en-un. Définissez vos services, configurez vos disponibilités et 
                <span className="text-blue-600 font-medium"> laissez votre agenda se remplir 24h/24</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 reveal">
                <button 
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-xl transition-all transform hover:-translate-y-1 group"
                  onClick={() => (window.location.href = "/paiement")}
                >
                  <span className="flex items-center justify-center">
                    Commencer maintenant
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                
                <a href="/demo" 
                  className="px-8 py-4 rounded-xl bg-white text-gray-700 font-medium border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center group"
                >
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>Voir la démo</span>
                </a>
              </div>
              
            </div>
            
            {/* Côté droit - Calendrier avec design 3D et neumorphism amélioré */}
            <div className="lg:w-1/2 relative">
              <div className="reveal">
                {/* Cadre du calendrier avec effet modern neumorphic amélioré */}
                <div className="relative mx-auto bg-white rounded-3xl shadow-2xl p-5 transform rotate-1 hover:rotate-0 transition-transform">
                  {/* Effet glimmer amélioré */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-3xl blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  
                  {/* Calendrier avec design amélioré */}
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-inner">
                    {/* Header du calendrier */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 flex justify-between items-center">
                      <span className="text-lg font-medium">Avril 2025</span>
                      <div className="flex space-x-3">
                        <button className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Jours de la semaine */}
                    <div className="grid grid-cols-7 bg-gray-50">
                      {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                        <div key={i} className="text-center py-3 text-gray-500 text-sm font-semibold">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Dates */}
                    <div className="grid grid-cols-7 gap-px bg-gray-100">
                      {Array.from({ length: 31 }, (_, i) => {
                        let dayClass = "py-4 text-center hover:bg-blue-50 transition-colors relative cursor-pointer";
                        
                        // Jours avec des rendez-vous
                        if (i === 2) {
                          dayClass += " font-semibold";
                        } else if (i === 14) {
                          dayClass += " font-semibold";
                        }
                        
                        return (
                          <div key={i} className={dayClass}>
                            <span className={i === 2 || i === 14 ? "flex items-center justify-center text-blue-600" : ""}>
                              {i + 1}
                            </span>
                            
                            {/* Indicateurs de rendez-vous améliorés */}
                            {i === 2 && (
                              <div className="absolute bottom-1 inset-x-0 flex justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                              </div>
                            )}
                            {i === 14 && (
                              <div className="absolute bottom-1 inset-x-0 flex justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Créneaux de réservation avec design moderne amélioré */}
                  <div className="mt-6 space-y-4 p-2">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-0.5 duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium text-sm shadow-inner border border-blue-50">
                            3
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Coupe de cheveux - Bechir</p>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              10:00 - 10:45
                            </div>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                          Confirmé
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-0.5 duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-600 font-medium text-sm shadow-inner border border-indigo-50">
                            15
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Massage - Safwene</p>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              11:30 - 12:30
                            </div>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                          Nouveau
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Éléments décoratifs améliorés */}
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-tr from-purple-300 to-indigo-200 rounded-full opacity-30 blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-100 rounded-full opacity-40 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section des caractéristiques avec design moderne amélioré */}
      <div id="features" className="relative z-10 py-24 bg-white/80 backdrop-blur-sm rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 font-medium text-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              <span>Avantages exclusifs</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Fonctionnalités exceptionnelles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour gérer vos réservations de manière professionnelle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 - Amélioré */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg border border-blue-50 hover:shadow-xl transition-all duration-300 group reveal">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Réservation en ligne 24/7</h3>
              <p className="text-gray-600 mb-6">Permettez à vos clients de réserver à tout moment, même en dehors des heures d'ouverture. Notre interface intuitive facilite le processus.</p>
            </div>
            
            {/* Feature Card 2 - Amélioré */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg border border-blue-50 hover:shadow-xl transition-all duration-300 group reveal">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Services personnalisés</h3>
              <p className="text-gray-600 mb-6">Définissez vos services, prix et durées avec une flexibilité totale. Adaptez votre offre à votre métier et à vos clients.</p>
            </div>
            
            {/* Feature Card 3 - Amélioré */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg border border-blue-50 hover:shadow-xl transition-all duration-300 group reveal">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Rappels automatiques</h3>
              <p className="text-gray-600 mb-6">Réduisez les absences avec des notifications automatiques par email. Gardez vos clients informés à tout moment.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Styles CSS pour les animations améliorées */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        
        .animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .sparkles {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 40px 40px, 40px 40px, 60px 60px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;