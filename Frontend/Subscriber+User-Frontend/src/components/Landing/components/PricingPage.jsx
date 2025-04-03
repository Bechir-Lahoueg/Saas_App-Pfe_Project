import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('annual');

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 font-sans relative overflow-hidden">
        <Navbar />
      {/* Éléments de fond animés */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Motif de grille en superposition */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
        {/* Header Banner */}
        <div className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
          COMMENCEZ AUJOURD'HUI—VOTRE FACTURATION, À VOTRE FAÇON
        </div>
        
        {/* Title Section */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Trouvez <span className="text-blue-600">le bon plan</span> pour gérer
          <span className="block">votre site de réservation</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Que vous soyez freelance ou à la tête d'une équipe, notre plateforme propose des plans adaptés à votre
          croissance. Trouvez l'offre idéale et gérez vos réservations en toute simplicité ! ❤️
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-16">
          <span className={`font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
            Facture annuelle
          </span>
          
          <div 
            className="w-16 h-8 bg-blue-600 rounded-full p-1 cursor-pointer shadow-md"
            onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
          >
            <div 
              className={`bg-white w-6 h-6 rounded-full transform transition-transform ${
                billingCycle === 'monthly' ? 'translate-x-8' : ''
              }`} 
            />
          </div>
          
          <span className={`font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Facture mensuelle
          </span>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl p-8 text-left relative transition-all hover:shadow-xl hover:-translate-y-1 border border-blue-50">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                <path d="M11 3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V3z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Starter</h3>
            <p className="text-gray-600 mb-6">Libérez la puissance de l'automatisation.</p>
            
            <h2 className="text-5xl font-bold mb-1 text-gray-900">20 Dt</h2>
            <p className="text-gray-500 mb-6">{billingCycle === 'annual' ? '/mois, facturé annuellement' : '/mois'}</p>
            
            <ul className="space-y-4 mb-16">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Multi-étapes d'automatisation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>3 Applications Premium</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Équipe de 2 utilisateurs</span>
              </li>
            </ul>
            
            <button className="absolute bottom-8 left-8 right-8 bg-white text-blue-600 font-medium py-3 px-6 rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm">
              Choisir ce plan
            </button>
          </div>
          
          {/* Professional Plan */}
          <div className="bg-white rounded-2xl p-8 text-left relative transition-all hover:shadow-xl hover:-translate-y-1 border border-blue-50">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Professional</h3>
            <p className="text-gray-600 mb-6">Des outils avancés pour améliorer votre travail.</p>
            
            <h2 className="text-5xl font-bold mb-1 text-gray-900">50 Dt</h2>
            <p className="text-gray-500 mb-6">{billingCycle === 'annual' ? '/mois, facturé annuellement' : '/mois'}</p>
            
            <ul className="space-y-4 mb-16">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Multi-étapes d'automatisation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Applications Premium illimitées</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Équipe de 50 utilisateurs</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Espace de travail partagé</span>
              </li>
            </ul>
            
            <button className="absolute bottom-8 left-8 right-8 bg-white text-blue-600 font-medium py-3 px-6 rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm">
              Choisir ce plan
            </button>
          </div>
          
          {/* Company Plan */}
          <div className="bg-blue-600 rounded-2xl p-8 text-left text-white relative transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -top-4 inset-x-0 mx-auto w-auto bg-green-400 text-xs font-bold text-white px-4 py-1 rounded-full shadow-md inline-block">
              LE PLUS POPULAIRE
            </div>
            
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Company</h3>
            <p className="text-blue-100 mb-6">Automatisation et fonctionnalités professionnelles.</p>
            
            <h2 className="text-5xl font-bold mb-1">90 Dt</h2>
            <p className="text-blue-200 mb-6">{billingCycle === 'annual' ? '/mois, facturé annuellement' : '/mois'}</p>
            
            <ul className="space-y-4 mb-16">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Multi-étapes d'automatisation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Applications Premium illimitées</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Utilisateurs illimités</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Administration avancée</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Conservation de données personnalisée</span>
              </li>
            </ul>
            
            <button className="absolute bottom-8 left-8 right-8 bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors shadow-lg">
              Choisir ce plan
            </button>
          </div>
        </div>
        
        {/* Testimonial/CTA Section */}
        <div className="mt-20 bg-white p-8 rounded-2xl shadow-md max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.691-.1-1.021A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-gray-700 italic mb-3">"Cette plateforme a transformé la façon dont nous gérons nos réservations. Nous avons augmenté nos rendez-vous de 40% tout en réduisant les absences."</p>
              <p className="font-medium text-gray-900">Sophie Martin</p>
              <p className="text-sm text-gray-500">Propriétaire, Salon de Beauté Élégance</p>
            </div>
          </div>
        </div>
        
        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Vous avez des questions ? Consultez notre 
            <a href="#" className="text-blue-600 font-medium ml-1 hover:underline">
              FAQ
            </a>
            {" "}ou 
            <a href="#" className="text-blue-600 font-medium ml-1 hover:underline">
              contactez-nous
            </a>
          </p>
        </div>
      </div>
      <Footer />

    </div>
  );
};

export default PricingPage;