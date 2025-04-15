import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WorkflowSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      number: "01",
      title: "Connectez Votre Compte PlanifyGo",
      description: "Après avoir créé votre compte et effectué votre paiement, connectez-vous à PlanifyGo. En quelques clics, vous aurez accès à votre tableau de bord personnalisé pour gérer toutes vos réservations.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      image: "/images/dashboard-mockup.png"
    },
    {
      number: "02",
      title: "Créez Votre Espace de Réservation",
      description: "Configurez facilement votre espace de réservation personnalisé. Définissez vos disponibilités, services, tarifs et personnalisez l'apparence de votre calendrier. PlanifyGo vous permet de créer une expérience de réservation professionnelle en quelques minutes.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      image: "/images/calendar-mockup.png"
    },
    {
      number: "03",
      title: "Suivez Vos Réservations en Temps Réel",
      description: "PlanifyGo vous permet de suivre toutes vos réservations en temps réel. Recevez des notifications instantanées, gérez vos confirmations et annulations, et accédez à des statistiques détaillées sur vos services les plus populaires et vos créneaux les plus demandés.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      image: "/images/analytics-mockup.png"
    }
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-5 py-16 md:py-20 font-sans relative overflow-hidden">
      {/* Arrière-plan amélioré avec gradient et formes */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-white -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-indigo-100/30 blur-2xl"></div>
        
        {/* Pattern design elements */}
        <div className="hidden lg:block absolute top-20 right-20 opacity-20">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="55" stroke="#3B82F6" strokeWidth="2" strokeDasharray="8 8"/>
            <circle cx="60" cy="60" r="25" stroke="#3B82F6" strokeWidth="2"/>
          </svg>
        </div>
        <div className="hidden lg:block absolute bottom-20 left-20 opacity-20">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" rx="15" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5 5"/>
          </svg>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start relative">
        {/* Section de gauche - 2 colonnes */}
        <div className="lg:col-span-2 mb-8 lg:mb-0 lg:sticky lg:top-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-xs font-semibold inline-block mb-4 shadow-sm">
              COMMENT FONCTIONNE PLANIFYGO
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              De <span className="text-blue-600 inline-block relative">
                l'Inscription
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600/30 rounded-full"></span>
              </span> à la <span className="text-blue-600 inline-block relative">
                Réservation
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600/30 rounded-full"></span>
              </span>
            </h1>
            
            <p className="text-gray-600 text-base md:text-lg">
              Simplifiez la gestion de vos réservations et concentrez-vous sur votre activité principale avec une solution intuitive et complète.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-md hover:translate-y-[-1px] group text-sm"
               onClick={() => (window.location.href = "/paiement")}>
                <span>Démarrer l’aventure</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 font-semibold py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md text-sm" 
              onClick={() => (window.location.href = "/Demo")}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Voir la démo
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Section de droite - 3 colonnes avec étapes */}
        <div className="lg:col-span-3 relative space-y-6">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveStep(index)}
              className={`flex flex-col lg:flex-row gap-5 p-5 rounded-xl transition-all duration-500 cursor-pointer ${
                activeStep === index 
                  ? 'bg-white shadow-xl scale-[1.02] border-l-4 border-blue-600' 
                  : 'bg-white/70 hover:bg-white hover:shadow-md'
              }`}
            >
              {/* Numéro et ligne de connexion */}
              <div className="flex flex-row lg:flex-col items-start lg:items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold z-10 transition-colors duration-300 ${
                  activeStep === index
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'border-2 border-blue-600 text-blue-600 bg-white'
                }`}>
                  {step.number}
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block w-0.5 h-full bg-blue-200 my-2"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`text-xl ${activeStep === index ? 'text-blue-600' : 'text-blue-400'}`}>
                    {step.icon}
                  </div>
                  <h3 className={`text-lg md:text-xl font-bold ${activeStep === index ? 'text-blue-600' : 'text-gray-800'}`}>
                    {step.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-3 text-sm md:text-base">
                  {step.description}
                </p>

                {/* Badges for keywords */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {index === 0 && (
                    <>
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">Inscription</span>
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">Connexion</span>
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">Tableau de bord</span>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">Calendrier</span>
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">Services</span>
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">Personnalisation</span>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">Notifications</span>
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">Gestion</span>
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">Statistiques</span>
                    </>
                  )}
                </div>

                {/* Image placeholder */}
                {activeStep === index && (
                  <div className="mt-3 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                    <div className="p-1 bg-gray-200 flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="h-[180px] md:h-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-3">
                      <p className="text-center text-gray-500 text-xs">
                        {index === 0 && "Interface du tableau de bord PlanifyGo"}
                        {index === 1 && "Configuration de votre calendrier de réservation"}
                        {index === 2 && "Suivi des réservations et statistiques"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mt-8 gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveStep(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeStep === index ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkflowSection;