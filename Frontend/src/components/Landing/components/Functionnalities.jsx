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

  // Rendu des icônes
  const renderIcon = (iconType) => {
    if (iconType === "globe") {
      return (
        <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H22" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    } else if (iconType === "notification") {
      return (
        <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H3.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 12H3.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 18H3.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }
  };

  // Rendu des cartes de fonctionnalités
  const renderFeatureCards = () => {
    return featuresData[activeTab].map((feature, index) => (
      <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
        {renderIcon(feature.icon)}
        <h3 className="text-xl font-bold mt-4 mb-2">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 px-3 py-1 rounded-md text-xs font-semibold text-blue-800">
            BILLING MADE SIMPLE
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Nos fonctionnalités</h1>
        
        {/* Tabs */}
        <div className="flex space-x-8 mb-12 border-b">
          <button 
            className={`pb-4 ${activeTab === 'principal' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('principal')}
          >
            Principal
          </button>
          <button 
            className={`pb-4 ${activeTab === 'entreprises' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('entreprises')}
          >
            Pour les entreprises
          </button>
          <button 
            className={`pb-4 ${activeTab === 'clients' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('clients')}
          >
            Pour les clients
          </button>
        </div>
        
        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderFeatureCards()}
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;