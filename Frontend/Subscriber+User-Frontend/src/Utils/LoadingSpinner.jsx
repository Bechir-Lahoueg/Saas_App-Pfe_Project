import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoPlanifyGo from '../assets/LogoPlanifygoPNG.png';

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  
  // Phases génériques pour le chargement
  const loadingPhases = [
    "Initialisation",
    "Chargement",
    "Préparation",
    "Finalisation"
  ];

  // Simuler la progression automatique basée sur le temps écoulé
  useEffect(() => {
    let startTime = Date.now();
    let animationFrame;
    
    const updateProgress = () => {
      // Calculer le temps écoulé (max 5 secondes pour atteindre 95%)
      const elapsed = Date.now() - startTime;
      // Fonction non linéaire pour la progression (rapide au début, plus lente ensuite)
      // Reste à 95% max pour laisser le temps au composant réel de se charger
      const newProgress = Math.min(95, Math.pow(elapsed / 2000, 0.7) * 95);
      
      setProgress(newProgress);
      
      // Continuer l'animation tant que nous n'avons pas atteint 95%
      if (newProgress < 95) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };
    
    animationFrame = requestAnimationFrame(updateProgress);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Mettre à jour la phase de chargement en fonction de la progression
  useEffect(() => {
    if (progress < 25) setActivePhase(0);
    else if (progress < 50) setActivePhase(1);
    else if (progress < 75) setActivePhase(2);
    else setActivePhase(3);
  }, [progress]);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Éléments décoratifs d'arrière-plan - plus nombreux et plus dynamiques */}
      <div className="absolute inset-0 overflow-hidden">
        {Array(20).fill().map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-10"
            style={{
              width: Math.random() * 180 + 40,
              height: Math.random() * 180 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(40px)'
            }}
            animate={{
              x: [0, Math.random() * 80 - 40, 0],
              y: [0, Math.random() * 80 - 40, 0],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Contexte temporel - Éléments d'horloge en arrière-plan */}
      <div className="absolute inset-0">
        {/* Cercles concentriques représentant le temps */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 border border-pink-500/10 rounded-full" style={{ width: '70vw', height: '70vw', left: 'calc(50% - 35vw)', top: 'calc(50% - 35vw)' }}></div>
            <div className="absolute inset-0 border border-pink-500/20 rounded-full" style={{ width: '50vw', height: '50vw', left: 'calc(50% - 25vw)', top: 'calc(50% - 25vw)' }}></div>
            <div className="absolute inset-0 border border-pink-500/30 rounded-full" style={{ width: '30vw', height: '30vw', left: 'calc(50% - 15vw)', top: 'calc(50% - 15vw)' }}></div>
          </div>
        </motion.div>
      </div>
      
      {/* Overlay pour améliorer la lisibilité avec effet de flou */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
      
      {/* Container principal */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo et animations */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Container du logo PlanifyGo avec effets temporels - TAILLE CONSIDÉRABLEMENT AUGMENTÉE */}
          <div className="relative mb-12">
            {/* Logo principal avec animation temportelle - BEAUCOUP PLUS GRAND */}
            <motion.div
              className="relative w-96 h-96 flex items-center justify-center"
              animate={{
                y: [0, -15, 0, -10, 0],
                rotate: [0, 3, 0, -3, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Effet de traînée temporelle derrière le logo */}
              <motion.div 
                className="absolute top-0 left-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Array(5).fill().map((_, i) => (
                  <motion.div
                    key={`trail-${i}`}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      opacity: 0.2 - (i * 0.03)
                    }}
                    animate={{
                      y: [-(i * 8), -(i * 10)],
                      opacity: [0.2 - (i * 0.03), 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.08
                    }}
                  >
                    <div className="w-full h-full relative">
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
                        style={{
                          backgroundImage: `url(${LogoPlanifyGo})`,
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          filter: 'blur(8px) brightness(1.5)'
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Super effet de lumière derrière le logo */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-red-400"
                style={{ 
                  filter: 'blur(35px)',
                  opacity: 0.6,
                  transform: 'scale(1.3)'
                }}
                animate={{
                  scale: [1.2, 1.4, 1.2],
                  opacity: [0.5, 0.7, 0.5],
                  background: [
                    'linear-gradient(90deg, rgba(236,72,153,1) 0%, rgba(168,85,247,1) 50%, rgba(248,113,113,1) 100%)',
                    'linear-gradient(90deg, rgba(236,72,153,0.8) 0%, rgba(168,85,247,1) 50%, rgba(248,113,113,0.8) 100%)',
                    'linear-gradient(90deg, rgba(236,72,153,1) 0%, rgba(168,85,247,1) 50%, rgba(248,113,113,1) 100%)'
                  ]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              {/* Logo PlanifyGo - CONSIDÉRABLEMENT AGRANDI */}
              <motion.div
                className="w-full h-full relative z-10"
                animate={{
                  rotateY: [0, 5, 0, -5, 0], // Effet 3D léger
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <motion.img 
                  src={LogoPlanifyGo} 
                  alt="PlanifyGo Logo" 
                  className="w-full h-full object-contain"
                  animate={{
                    scale: [1, 1.05, 0.98, 1],
                    filter: [
                      'drop-shadow(0 0 12px rgba(255,64,129,0.7))', 
                      'drop-shadow(0 0 20px rgba(255,64,129,0.9))', 
                      'drop-shadow(0 0 12px rgba(255,64,129,0.7))'
                    ]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              
              {/* Effet d'horloge/chronomètre plus élaboré */}
              <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                  className="absolute top-0 right-0 w-full h-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    transformOrigin: 'center'
                  }}
                >
                  <motion.div
                    className="absolute top-0 left-1/2 h-1/2 w-1 origin-bottom"
                    style={{
                      transformOrigin: 'bottom center'
                    }}
                  >
                    <motion.div 
                      className="w-1.5 h-full bg-gradient-to-t from-pink-500 to-transparent rounded-full"
                      animate={{
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  </motion.div>
                </motion.div>
                
                {/* Aiguille des minutes */}
                <motion.div 
                  className="absolute top-0 right-0 w-full h-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3600,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    transformOrigin: 'center'
                  }}
                >
                  <motion.div
                    className="absolute top-0 left-1/2 h-2/5 w-1 origin-bottom"
                    style={{
                      transformOrigin: 'bottom center'
                    }}
                  >
                    <motion.div 
                      className="w-1 h-full bg-gradient-to-t from-red-400 to-transparent rounded-full"
                      animate={{
                        opacity: [0.7, 0.9, 0.7]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Particules animées autour du logo - plus nombreuses et plus dynamiques */}
            {Array(12).fill().map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const radius = 180; // Rayon plus grand pour l'effet
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-4 h-4 bg-gradient-to-br from-pink-500 to-red-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    x: x,
                    y: y,
                    filter: 'blur(2px)'
                  }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.6, 1, 0.6],
                    x: [x, x + (Math.random() * 30 - 15), x],
                    y: [y, y + (Math.random() * 30 - 15), y],
                  }}
                  transition={{
                    duration: 3 + i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.1
                  }}
                />
              );
            })}
            
            {/* Orbites qui tournent autour du logo */}
            <motion.div 
              className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2">
                <div className="absolute w-96 h-96 border border-pink-500/30 rounded-full" style={{ left: 'calc(50% - 12rem)', top: 'calc(50% - 12rem)' }}></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2">
                <div className="absolute w-112 h-112 border border-purple-500/20 rounded-full" style={{ width: '28rem', height: '28rem', left: 'calc(50% - 14rem)', top: 'calc(50% - 14rem)' }}></div>
              </div>
            </motion.div>
          </div>
          
          {/* Indicateurs de phase avec style amélioré */}
          <div className="flex space-x-4 mb-8">
            {loadingPhases.map((phase, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <motion.div 
                  className={`h-4 w-4 rounded-full ${i <= activePhase ? 'bg-pink-500' : 'bg-white/20'}`}
                  animate={i === activePhase ? {
                    scale: [1, 1.5, 1],
                    boxShadow: [
                      '0 0 0px rgba(236, 72, 153, 0.7)',
                      '0 0 15px rgba(236, 72, 153, 0.9)',
                      '0 0 0px rgba(236, 72, 153, 0.7)'
                    ]
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
                <span className="text-sm text-white/70 mt-2 font-medium">{phase}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Barre de progression avec animation de temps améliorée */}
          <motion.div 
            className="w-96 relative h-3 bg-white/10 rounded-full overflow-hidden mb-4 shadow-inner shadow-black/50"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 384 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Lignes de graduation pour effet "temps" */}
            <div className="absolute inset-0 flex justify-between px-1 items-center">
              {Array(12).fill().map((_, i) => (
                <div key={i} className="w-px h-1.5 bg-white/20" />
              ))}
            </div>
            
            {/* Barre de progression dynamique */}
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-purple-400 to-red-400"
              style={{ width: `${progress}%` }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%']
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              {/* Effet de lueur à la fin de la barre de progression */}
              <motion.div 
                className="absolute right-0 top-0 h-full w-8 bg-white/50"
                style={{ filter: 'blur(6px)' }}
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity
                }}
              />
            </motion.div>
          </motion.div>
          
          {/* Pourcentage et temps restant avec style amélioré */}
          <div className="flex items-center justify-center space-x-4">
            <motion.p
              className="text-white/90 text-xl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {Math.round(progress)}%
            </motion.p>
          </div>
          
          {/* Texte PlanifyGo qui apparaît avec animation améliorée */}
          <motion.p
            className="mt-6 text-white font-bold tracking-widest text-3xl bg-gradient-to-r from-pink-400 via-purple-300 to-red-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            PlanifyGo
          </motion.p>
          
          {/* Slogan animé amélioré */}
          <motion.p
            className="text-white/80 text-base mt-2 font-light italic tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1] }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            Votre temps est précieux
          </motion.p>
          
          {/* Nouvelle ligne pour renforcer le concept de temps */}
          <motion.p
            className="text-white/60 text-xs mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1] }}
            transition={{ delay: 1.6, duration: 1 }}
          >
            Chaque seconde compte
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;