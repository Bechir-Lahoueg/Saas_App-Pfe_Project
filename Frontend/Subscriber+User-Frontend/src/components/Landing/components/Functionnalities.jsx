import React, { useState } from 'react';

const FeaturePage = () => {
  const [activeTab, setActiveTab] = useState('principal');

  // Données pour chaque onglet
  const featuresData = {
    principal: [
      {
        icon: "globe",
        title: "Accepter les réservations en ligne",
        description: "Sync your Webflow account to FlowPay, and watch your billing data flow in automatically—no manual input needed."
      },
      {
        icon: "notification",
        title: "Notifications via SMS/Email",
        description: "FlowPay automatically generates invoices for you, making it easy to send them to clients and get paid faster."
      },
      {
        icon: "list",
        title: "Application client et administrateur",
        description: "Keep tabs on your payments in real-time. Instantly know which invoices are paid, overdue, or pending."
      },
      {
        icon: "globe",
        title: "Accepter paiements",
        description: "Sync your Webflow account to FlowPay, and watch your billing data flow in automatically—no manual input needed."
      },
      {
        icon: "notification",
        title: "Intégration & API",
        description: "FlowPay automatically generates invoices for you, making it easy to send them to clients and get paid faster."
      },
      {
        icon: "list",
        title: "Fonctionnalités paramétrables",
        description: "Keep tabs on your payments in real-time. Instantly know which invoices are paid, overdue, or pending."
      }
    ],
    entreprises: [
      {
        icon: "globe",
        title: "Gestion multi-comptes",
        description: "Gérez facilement plusieurs comptes clients depuis une interface unifiée avec des permissions personnalisables."
      },
      {
        icon: "notification",
        title: "Rapports financiers avancés",
        description: "Générez des rapports détaillés sur vos revenus, vos transactions et vos prévisions financières."
      },
      {
        icon: "list",
        title: "Facturation récurrente",
        description: "Mettez en place des paiements automatiques et récurrents pour vos abonnements et services réguliers."
      },
      {
        icon: "globe",
        title: "Paiements internationaux",
        description: "Acceptez des paiements dans plusieurs devises avec conversion automatique et frais optimisés."
      },
      {
        icon: "notification",
        title: "Intégration comptable",
        description: "Synchronisez automatiquement vos données avec les principaux logiciels de comptabilité."
      },
      {
        icon: "list",
        title: "Tableau de bord personnalisable",
        description: "Configurez votre interface selon vos besoins spécifiques et suivez les métriques importantes pour votre entreprise."
      }
    ],
    clients: [
      {
        icon: "globe",
        title: "Portail client intuitif",
        description: "Offrez à vos clients une interface simple pour consulter et payer leurs factures en quelques clics."
      },
      {
        icon: "notification",
        title: "Plusieurs options de paiement",
        description: "Permettez à vos clients de payer par carte bancaire, virement, prélèvement ou autres méthodes locales."
      },
      {
        icon: "list",
        title: "Historique des transactions",
        description: "Vos clients peuvent consulter l'ensemble de leur historique de paiements et télécharger leurs factures."
      },
      {
        icon: "globe",
        title: "Paiements partiels",
        description: "Offrez la possibilité d'effectuer des paiements échelonnés ou partiels sur les grosses factures."
      },
      {
        icon: "notification",
        title: "Communication intégrée",
        description: "Échangez facilement avec vos clients directement depuis la plateforme de facturation."
      },
      {
        icon: "list",
        title: "Application mobile",
        description: "Vos clients peuvent gérer leurs paiements, consulter leurs factures et recevoir des notifications sur mobile."
      }
    ]
  };

  // Composant pour les icônes
  const FeatureIcon = ({ type }) => {
    const iconStyles = "w-6 h-6 text-blue-600";
    
    const icons = {
      globe: (
        <svg className={iconStyles} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      notification: (
        <svg className={iconStyles} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      list: (
        <svg className={iconStyles} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };

    return (
      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shadow-sm mb-4 group-hover:bg-blue-100 transition-colors duration-300">
        {icons[type]}
      </div>
    );
  };

  // Composant pour les cartes de fonctionnalités
  const FeatureCard = ({ feature }) => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 group hover:border-blue-200">
        <FeatureIcon type={feature.icon} />
        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    );
  };

  // Titres des onglets
  const tabTitles = {
    principal: "Fonctionnalités principales",
    entreprises: "Solutions pour entreprises",
    clients: "Expérience client optimale"
  };
  
  // Descriptions des onglets
  const tabDescriptions = {
    principal: "Découvrez les fonctionnalités essentielles qui font de notre plateforme un outil incontournable pour la gestion de vos paiements.",
    entreprises: "Des outils puissants conçus pour répondre aux besoins spécifiques des entreprises en croissance.",
    clients: "Offrez à vos clients une expérience de paiement fluide et intuitive pour renforcer leur satisfaction."
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="bg-blue-100 px-4 py-1.5 rounded-full text-sm font-medium text-blue-800 mb-4">
            SIMPLIFIEZ VOS PAIEMENTS
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Nos fonctionnalités</span> pour vous simplifier la vie
          </h1>
          
          <p className="text-gray-600 max-w-2xl mb-12">
            Des outils puissants et intuitifs pour gérer vos paiements, factures et clients en toute simplicité.
          </p>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-6 mb-16 w-full max-w-3xl bg-white p-2 rounded-full shadow-sm">
            {Object.keys(featuresData).map(tabKey => (
              <button 
                key={tabKey}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tabKey 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab(tabKey)}
              >
                {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{tabTitles[activeTab]}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{tabDescriptions[activeTab]}</p>
        </div>
        
        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuresData[activeTab].map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-blue-600 text-white rounded-xl p-8 md:p-12 max-w-4xl mx-auto shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Prêt à simplifier vos paiements ?</h3>
            <p className="mb-8 opacity-90">Essayez notre plateforme gratuitement pendant 14 jours, sans carte de crédit.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Commencer l'essai gratuit
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Demander une démo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;