import React from 'react';
import { Navbar, Footer } from '../../components/Landing/Index';

const OnboardingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* En-tête */}
      <Navbar />
      
      {/* Contenu principal */}
      <div className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex">
        {/* Colonne de gauche - Étapes d'intégration */}
        <div className="w-1/2 pr-12">
          <div className="flex items-start mb-12">
            {/* Cercle numéroté */}
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              01
            </div>
            
            {/* Contenu de l'étape */}
            <div>
              <h3 className="font-bold text-lg mb-2">Connect Your Webflow Account</h3>
              <p className="text-gray-600">
                Start by easily linking your Webflow account to FlowPay, in just a few clicks. FlowPay syncs all your projects and billing data, bringing everything into one organized dashboard.
              </p>
            </div>
          </div>
          
          {/* Ligne verticale de connexion */}
          <div className="border-l-2 border-blue-200 h-12 ml-6"></div>
          
          <div className="flex items-start mb-12">
            {/* Cercle numéroté */}
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold mr-4 flex-shrink-0">
              02
            </div>
            
            {/* Contenu de l'étape */}
            <div>
              <h3 className="font-bold text-lg mb-2">Automate Invoices and Payments</h3>
              <p className="text-gray-600">
                FlowPay eliminates the headache of manual invoicing by automatically generating invoices from your Webflow billing. With one-click sending and automated reminders, you can ensure your clients are always up to date on their payments.
              </p>
            </div>
          </div>
          
          {/* Ligne verticale de connexion */}
          <div className="border-l-2 border-blue-200 h-12 ml-6"></div>
          
          <div className="flex items-start">
            {/* Cercle numéroté */}
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold mr-4 flex-shrink-0">
              03
            </div>
            
            {/* Contenu de l'étape */}
            <div>
              <h3 className="font-bold text-lg mb-2">Track Payments in Real-Time</h3>
              <p className="text-gray-600">
                After the invoices are sent, FlowPay tracks payments as they come in, giving you real-time updates. You'll always know what's paid, what's pending, and when to expect the money in your account.
              </p>
            </div>
          </div>
        </div>
        
        {/* Colonne de droite - Formulaire d'information */}
        <div className="w-1/2 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold mb-6">General company information</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company URL (cannot be changed)
            </label>
            <div className="flex">
              <div className="bg-gray-100 px-3 py-2 rounded-l-md border border-gray-300 text-gray-500">
                https://
              </div>
              <input 
                type="text" 
                className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md"
                placeholder="P.o Box 1233"
                value="Ubistream.com"
                readOnly
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="9090"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business category
            </label>
            <div className="relative">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white text-gray-400"
              >
                <option>What is your business category?</option>
                <option>E-commerce</option>
                <option>Software</option>
                <option>Consulting</option>
                <option>Education</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      
      {/* Pied de page */}
      <Footer />
    </div>
  );
};

export default OnboardingPage;