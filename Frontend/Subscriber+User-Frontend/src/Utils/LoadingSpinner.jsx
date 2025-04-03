import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingSpinner = ({ progress = 0 }) => {
  const [activePhase, setActivePhase] = useState(0);
  
  // Phases génériques pour le chargement
  const loadingPhases = [
    "Initialisation",
    "Chargement",
    "Préparation",
    "Finalisation"
  ];

  // Mettre à jour la phase de chargement en fonction de la progression
  useEffect(() => {
    if (progress < 25) setActivePhase(0);
    else if (progress < 50) setActivePhase(1);
    else if (progress < 75) setActivePhase(2);
    else setActivePhase(3);
  }, [progress]);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        {Array(12).fill().map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-10"
            style={{
              width: Math.random() * 120 + 30,
              height: Math.random() * 120 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(30px)'
            }}
            animate={{
              x: [0, Math.random() * 60 - 30, 0],
              y: [0, Math.random() * 60 - 30, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      {/* Container principal */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo au centre */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo - Remplacez par votre propre logo SVG */}
          <motion.div 
            className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center mb-8"
            animate={{
              boxShadow: ['0 0 20px rgba(99, 102, 241, 0.3)', '0 0 40px rgba(99, 102, 241, 0.5)', '0 0 20px rgba(99, 102, 241, 0.3)']
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 8V12L15 15" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <circle 
                cx="12" 
                cy="12" 
                r="9" 
                stroke="currentColor" 
                strokeWidth="2"
              />
            </svg>
          </motion.div>
          
          {/* Indicateurs de phase */}
          <div className="flex space-x-2 mb-6">
            {loadingPhases.map((_, i) => (
              <motion.div
                key={i}
                className={`h-2.5 w-2.5 rounded-full ${i <= activePhase ? 'bg-indigo-500' : 'bg-white/20'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              />
            ))}
          </div>
          
          {/* Barre de progression */}
          <motion.div 
            className="w-64 relative h-1.5 bg-white/10 rounded-full overflow-hidden mb-2"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 256 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
              style={{ width: `${progress}%` }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%']
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          </motion.div>
          
          {/* Pourcentage */}
          <motion.p
            className="text-white/80 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {Math.round(progress)}%
          </motion.p>
          
          {/* Points de chargement animés */}
          <motion.div 
            className="flex space-x-1 mt-4"
            animate={{
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
          >
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                className="w-2 h-2 rounded-full bg-indigo-400"
                animate={{
                  y: [0, -4, 0]
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  repeat: Infinity
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;