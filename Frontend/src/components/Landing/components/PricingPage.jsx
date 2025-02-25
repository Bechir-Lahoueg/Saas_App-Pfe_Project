import React, { useState } from 'react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('annual');

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      {/* Header Banner */}
      <div className="bg-gray-100 rounded-full inline-block px-4 py-2 mb-6 text-sm">
        GET STARTED TODAY—YOUR BILLING, YOUR WAY.
      </div>
      
      {/* Title Section */}
      <h1 className="text-4xl font-bold mb-2">
        Trouvez <span className="text-blue-500">le bon plan</span> pour gérer
      </h1>
      <h2 className="text-4xl font-bold mb-8">votre site de réservation</h2>
      
      {/* Subtitle */}
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Que vous soyez freelance ou à la tête d'une équipe, FlowPay propose des plans adaptés à votre
        croissance. Trouvez l'offre idéale et gérez vos paiements en toute simplicité ! ❤️
      </p>
      
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4 mb-12">
        <span className={`font-medium ${billingCycle === 'annual' ? 'text-black' : 'text-gray-500'}`}>
          Facture annuelle
        </span>
        
        <div 
          className="w-12 h-6 bg-blue-500 rounded-full p-1 cursor-pointer"
          onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
        >
          <div 
            className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
              billingCycle === 'monthly' ? 'translate-x-6' : ''
            }`} 
          />
        </div>
        
        <span className={`font-medium ${billingCycle === 'monthly' ? 'text-black' : 'text-gray-500'}`}>
          Facture mensuelle
        </span>
      </div>
      
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className="bg-gray-50 rounded-2xl p-8 text-left relative">
          <h2 className="text-5xl font-bold mb-1">20 Dt</h2>
          <p className="text-gray-500 mb-6">/mois</p>
          
          <h3 className="text-2xl font-bold mb-2">Starter</h3>
          <p className="text-gray-600 mb-6">Unleash the power of automation.</p>
          
          <ul className="space-y-3 mb-12">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              Multi-step Zaps
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              3 Premium Apps
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              2 Users team
            </li>
          </ul>
          
          <button className="absolute bottom-8 bg-blue-200 text-blue-700 font-medium py-3 px-6 rounded-full hover:bg-blue-300 transition-colors">
            Choose plan
          </button>
        </div>
        
        {/* Professional Plan */}
        <div className="bg-gray-50 rounded-2xl p-8 text-left relative">
          <h2 className="text-5xl font-bold mb-1">50 Dt</h2>
          <p className="text-gray-500 mb-6">/mois</p>
          
          <h3 className="text-2xl font-bold mb-2">Professional</h3>
          <p className="text-gray-600 mb-6">Advanced tools to take your work to the next level.</p>
          
          <ul className="space-y-3 mb-12">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              Multi-step Zaps
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              Unlimited Premium
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              50 Users team
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              Shared Workspace
            </li>
          </ul>
          
          <button className="absolute bottom-8 bg-blue-200 text-blue-700 font-medium py-3 px-6 rounded-full hover:bg-blue-300 transition-colors">
            Choose plan
          </button>
        </div>
        
        {/* Company Plan */}
        <div className="bg-blue-500 rounded-2xl p-8 text-left text-white relative shadow-lg">
          <div className="absolute top-0 right-6 bg-white text-xs font-bold text-gray-800 px-3 py-1 rounded-b-lg">
            MOST POPULAR
          </div>
          
          <h2 className="text-5xl font-bold mb-1">90 Dt</h2>
          <p className="text-blue-200 mb-6">/mois</p>
          
          <h3 className="text-2xl font-bold mb-2">Company</h3>
          <p className="text-blue-100 mb-6">Automation plus enterprise-grade features.</p>
          
          <ul className="space-y-3 mb-12">
            <li className="flex items-start">
              <span className="text-white mr-2">✓</span>
              Multi-step Zap
            </li>
            <li className="flex items-start">
              <span className="text-white mr-2">✓</span>
              Unlimited Premium
            </li>
            <li className="flex items-start">
              <span className="text-white mr-2">✓</span>
              Unlimited Users Team
            </li>
            <li className="flex items-start">
              <span className="text-white mr-2">✓</span>
              Advanced Admin
            </li>
            <li className="flex items-start">
              <span className="text-white mr-2">✓</span>
              Custom Data Retention
            </li>
          </ul>
          
          <button className="absolute bottom-8 bg-white text-blue-700 font-medium py-3 px-6 rounded-full hover:bg-gray-100 transition-colors">
            Choose plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;