import React, { useState } from 'react';

const FeaturePage = () => {
  const [activeTab, setActiveTab] = useState('booking');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Données pour chaque onglet
  const featuresData = {
    booking: [
      {
        icon: "calendar",
        title: "Réservation en ligne 24/7",
        description: "Permettez à vos clients de réserver vos services à tout moment, même en dehors des heures d'ouverture.",
        animation: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      },
      {
        icon: "notification",
        title: "Rappels automatiques",
        description: "Réduisez les absences grâce aux rappels automatiques par email envoyés avant chaque rendez-vous.",
        animation: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      },
      {
        icon: "mobile",
        title: "Interface web optimisée",
        description: "Offrez une expérience de réservation fluide sur tous les appareils avec notre interface responsive.",
        animation: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      },
      {
        icon: "payment",
        title: "Confirmation anticipée",
        description: "Recevez des confirmations lors de la réservation pour réduire les annulations de dernière minute.",
        animation: "M5 13l4 4L19 7"
      },
      {
        icon: "integration",
        title: "Annulation Automatique",
        description: "Gérez facilement les réservations grace à l'annulation automatique des réservation non confirmés après 30 min.",
        animation: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      },
      {
        icon: "customize",
        title: "Personnalisation complète",
        description: "Adaptez le système de réservation à votre image de marque et à vos besoins spécifiques.",
        animation: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      }
    ],
    business: [
      {
        icon: "team",
        title: "Gestion d'employés",
        description: "Assignez des rendez-vous à différents membres de votre équipe selon leurs compétences.",
        animation: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      },
      {
        icon: "analytics",
        title: "Analyses et statistiques",
        description: "Suivez vos performances avec des rapports détaillés sur les réservations, taux d'occupation et revenus estimés.",
        animation: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      },
      {
        icon: "recurring",
        title: "Rendez-vous récurrents",
        description: "Configurez facilement des séries de rendez-vous pour vos clients réguliers.",
        animation: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      },
      // {
      //   icon: "resources",
      //   title: "Gestion des ressources",
      //   description: "Optimisez l'utilisation de vos salles, équipements et autres ressources pour éviter les chevauchements.",
      //   animation: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      // },
      // {
      //   icon: "automation",
      //   title: "Automatisations intelligentes",
      //   description: "Créez des workflows personnalisés qui s'adaptent à votre processus de réservation unique.",
      //   animation: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
      // },
      // {
      //   icon: "multi",
      //   title: "Multi-établissements",
      //   description: "Gérez plusieurs lieux ou succursales depuis une interface unifiée avec paramètres spécifiques.",
      //   animation: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      // }
    ],
    client: [
      {
        icon: "profile",
        title: "Réservations sans compte",
        description: "Vos clients peuvent suivre leurs réservations et préférences sans créer un compte.",
        animation: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      },
      {
        icon: "selfservice",
        title: "Self-service complet",
        description: "Les clients peuvent réserver et confirmer leurs rendez-vous sans intervention manuelle.",
        animation: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      },
      {
        icon: "history",
        title: "Historique des réservations",
        description: "Accès facile à l'historique complet des rendez-vous passés et futurs en utilisant l'email uniquement.",
        animation: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      },
      // {
      //   icon: "ratings",
      //   title: "Avis et évaluations",
      //   description: "Recueillez les retours clients après chaque rendez-vous pour améliorer continuellement vos services.",
      //   animation: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      // },
      // {
      //   icon: "communication",
      //   title: "Communication fluide",
      //   description: "Messagerie intégrée permettant des échanges directs entre prestataires et clients.",
      //   animation: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      // },
      // {
      //   icon: "loyalty",
      //   title: "Programme de fidélité",
      //   description: "Récompensez vos clients fidèles avec des points, réductions ou avantages exclusifs.",
      //   animation: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      // }
    ]
  };

  // Composant pour les icônes animées
  const AnimatedIcon = ({ path, isHovered }) => {
    return (
      <svg 
        className="w-10 h-10 text-blue-600" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d={path} 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
      </svg>
    );
  };

  // Composant pour les cartes de fonctionnalités
  const FeatureCard = ({ feature, index }) => {
    return (
      <div 
        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-blue-200 relative overflow-hidden"
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Fond décoratif */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
        
        {/* Icône animée */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm mb-6 group-hover:bg-blue-100 transition-colors duration-300">
          <AnimatedIcon path={feature.animation} isHovered={hoveredCard === index} />
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-gray-600 mb-4">{feature.description}</p>
        

      </div>
    );
  };

  // Titres et descriptions des onglets
  const tabTitles = {
    booking: "Système de réservation intelligent",
    business: "Solutions pour professionnels",
    client: "Expérience client exceptionnelle"
  };
  
  const tabDescriptions = {
    booking: "Offrez à vos clients un système de réservation moderne et intuitif accessible 24h/24 et 7j/7.",
    business: "Des outils puissants pour gérer efficacement votre agenda, votre équipe et optimiser votre taux d'occupation.",
    client: "Une expérience de réservation fluide et personnalisée qui fidélise vos clients et renforce votre image."
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen relative overflow-hidden">
      {/* Formes décoratives animées */}
      <div className="absolute top-1/4 right-20 w-64 h-64 rounded-full bg-blue-100/30 blur-3xl -z-10 animate-float1"></div>
      <div className="absolute bottom-1/4 left-20 w-64 h-64 rounded-full bg-blue-100/40 blur-3xl -z-10 animate-float2"></div>
      <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-blue-200/20 blur-2xl -z-10 animate-float3"></div>
      
      {/* Animation SVG décorative */}
      <svg className="absolute top-0 left-0 w-full h-full -z-20 opacity-10" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="bg-blue-100 px-4 py-1.5 rounded-full text-sm font-medium text-blue-800 mb-4 shadow-sm inline-flex items-center">
            <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            SIMPLIFIEZ VOS RÉSERVATIONS
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight max-w-3xl">
            <span className="text-blue-600 relative inline-block">
              PlanifyGo
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-100 opacity-50 -z-10 animate-pulse-slow"></span>
            </span> transforme votre gestion de rendez-vous
          </h1>
          
          <p className="text-gray-600 max-w-2xl mb-12 text-lg">
            Une plateforme complète de réservation en ligne pour tous les types de services, adaptée à votre activité et à vos clients.
          </p>
          
          {/* Tabs stylisés */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-6 mb-16 w-full max-w-3xl bg-white p-2 rounded-full shadow-md border border-gray-200">
            {Object.keys(featuresData).map(tabKey => (
              <button 
                key={tabKey}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  activeTab === tabKey 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab(tabKey)}
              >
                {activeTab === tabKey && (
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {tabKey === 'booking' ? 'Réservation' : tabKey === 'business' ? 'Professionnels' : 'Clients'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{tabTitles[activeTab]}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{tabDescriptions[activeTab]}</p>
        </div>
        
        {/* Grille de cartes de fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuresData[activeTab].map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>

      {/* Animation globale */}
      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, 20px) rotate(2deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 20px) rotate(-2deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.3; }
        }
        .animate-float1 { animation: float1 10s ease-in-out infinite; }
        .animate-float2 { animation: float2 12s ease-in-out infinite; }
        .animate-float3 { animation: float3 8s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default FeaturePage;