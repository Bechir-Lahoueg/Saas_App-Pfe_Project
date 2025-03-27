import React, { useEffect, useState } from 'react';

const ReservationLoadingSpinner = () => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    // Animation complète en 2 secondes
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 5; // 5% toutes les 100ms (20 étapes pour 2 secondes)
      });
    }, 100);
    
    // Mise à jour du message d'étape
    const stepInterval = setInterval(() => {
      setStep(prev => (prev + 1) % 4);
    }, 500); // Change de message toutes les 500ms
    
    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  // Messages animés par étape
  const stepMessages = [
    "Vérification des disponibilités",
    "Préparation de votre réservation",
    "Confirmation des détails",
    "Finalisation de votre réservation"
  ];

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-indigo-50 to-blue-100">
      <div className="flex flex-col items-center max-w-md w-full px-6">
        {/* Container principal */}
        <div className="relative w-full rounded-2xl bg-white shadow-xl p-8 border border-indigo-100 overflow-hidden">
          {/* Effet de fond animé */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500" 
               style={{ width: `${progress}%`, transition: 'width 100ms linear' }}></div>
          
          {/* Ornements décoratifs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mt-16 -mr-16 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 rounded-full -mb-12 -ml-12 opacity-20"></div>
          
          {/* Titre avec décoration */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 mr-3 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-gray-800">Réservation en cours</h2>
            <div className="w-2 h-8 bg-gradient-to-b from-purple-600 to-indigo-600 ml-3 rounded-full"></div>
          </div>
          
          {/* Illustration animée */}
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40">
              {/* Cercles pulsants */}
              <div className="absolute inset-0 animate-pulse-slow flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-2 border-indigo-200"></div>
              </div>
              <div className="absolute inset-0 animate-pulse-medium flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-2 border-indigo-300"></div>
              </div>
              
              {/* Calendrier principal */}
              <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
                {/* Corps du calendrier */}
                <rect x="15" y="20" width="70" height="65" rx="6" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" filter="drop-shadow(0px 4px 6px rgba(79, 70, 229, 0.15))" />
                
                {/* En-tête du calendrier */}
                <rect x="15" y="20" width="70" height="16" rx="6" fill="url(#headerGradient)" />
                <defs>
                  <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                
                {/* Reliefs (jours de la semaine) */}
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                  <text 
                    key={i} 
                    x={22 + i * 10} 
                    y="48" 
                    fontSize="5" 
                    fontWeight="500" 
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {day}
                  </text>
                ))}
                
                {/* Dates dans le calendrier - avec effet de sélection animé */}
                {Array.from({ length: 28 }).map((_, i) => {
                  const row = Math.floor(i / 7);
                  const col = i % 7;
                  const isHighlighted = i === 15;
                  
                  return (
                    <g key={i}>
                      {isHighlighted && 
                        <circle 
                          cx={22 + col * 10} 
                          cy={58 + row * 9} 
                          r="5" 
                          fill={progress > 50 ? "#7c3aed" : "#4f46e5"}
                          className="transition-all duration-500"
                        />
                      }
                      <text 
                        x={22 + col * 10} 
                        y={60 + row * 9} 
                        fontSize="5" 
                        fontWeight={isHighlighted ? "bold" : "normal"} 
                        fill={isHighlighted ? "#ffffff" : "#374151"} 
                        textAnchor="middle"
                        opacity={isHighlighted || (i % 3 === 0) ? "1" : "0.6"}
                      >
                        {i + 1}
                      </text>
                    </g>
                  );
                })}
                
                {/* Icône de confirmation animée */}
                {progress > 70 && (
                  <g>
                    <circle cx="75" cy="30" r="4" fill="#10b981" />
                    <path 
                      d="M72,30 L74,32 L78,28" 
                      stroke="#ffffff" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      fill="none"
                    />
                  </g>
                )}
              </svg>
              
              {/* Particules d'animation */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-medium">
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 45) * (Math.PI / 180);
                  const distance = i % 2 === 0 ? 46 : 42;
                  const x = 50 + distance * Math.cos(angle);
                  const y = 50 + distance * Math.sin(angle);
                  const size = i % 3 === 0 ? 2 : 1.5;
                  
                  return (
                    <circle 
                      key={i} 
                      cx={x} 
                      cy={y} 
                      r={size} 
                      fill={i % 2 === 0 ? "#4f46e5" : "#7c3aed"} 
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          
          {/* Message d'étape animé */}
          <div className="text-center mb-6">
            <div className="h-6 flex items-center justify-center">
              <span className="text-gray-700 font-medium animate-fade-in">
                {stepMessages[step]}
              </span>
            </div>
            {/* Indicateurs d'étape */}
            <div className="flex justify-center mt-3 space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${step === i ? 'bg-indigo-600 scale-125' : 'bg-indigo-200'}`}
                />
              ))}
            </div>
          </div>
          
          {/* Barre de progression élégante */}
          <div className="h-1.5 w-full bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 rounded-full transition-all duration-100 ease-out"
              style={{ 
                width: `${progress}%`,
                backgroundSize: '200% 100%',
                animation: 'gradientMove 2s linear infinite'
              }}
            ></div>
          </div>
          
          {/* Délai estimé avec icônes */}
          <div className="flex justify-center items-center text-sm">
            <svg className="w-4 h-4 text-indigo-500 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-gray-500 font-medium">
              Temps estimé: {Math.max(Math.ceil((100 - progress) / 50), 1)} seconde{Math.ceil((100 - progress) / 50) > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* Informations supplémentaires */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-1">Merci de patienter pendant que nous finalisons votre demande</p>
          <p className="text-xs text-indigo-500 font-medium">Vous recevrez une confirmation par email</p>
        </div>
      </div>
      
      {/* Styles d'animation améliorés */}
      <style jsx global>{`
        .animate-spin-medium {
          animation: spin 4s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-medium {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ReservationLoadingSpinner;