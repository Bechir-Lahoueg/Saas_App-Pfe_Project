import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('annual');
  
  // Configuration des prix et taux de remise
  const prices = {
    essential: { monthly: 20, annual: 16 },
    professional: { monthly: 50, annual: 40 },
    enterprise: { monthly: 90, annual: 75 }
  };
  
  // Calculer les prix en fonction du cycle de facturation
  const calculatePrice = (basePrice, cycle) => {
    return cycle === 'annual' ? basePrice * 12 : basePrice;
  };

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
          DÉMARREZ AVEC PLANIFYGO AUJOURD'HUI — CHOISISSEZ VOTRE FORMULE
        </div>
        
        {/* Title Section */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Choisissez <span className="text-blue-600">la formule idéale</span> pour gérer
          <span className="block">vos réservations avec PlanifyGo</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Que vous soyez indépendant ou responsable d'une équipe, PlanifyGo propose des formules adaptées à vos besoins
          de réservation. Simplifiez la gestion de votre agenda et optimisez votre activité !
        </p>
        
        {/* Billing Toggle avec économies affichées */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className={`font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
              Facturation annuelle
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
              Facturation mensuelle
            </span>
          </div>
          
          {billingCycle === 'annual' && (
            <div className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
              Économisez 20% avec la facturation annuelle
            </div>
          )}
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
            
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Essentiel</h3>
            <p className="text-gray-600 mb-6">Pour commencer à gérer vos réservations efficacement</p>
            
            <div className="flex items-baseline mb-1">
              <h2 className="text-5xl font-bold text-gray-900">
                {billingCycle === 'annual' ? calculatePrice(prices.essential.annual, billingCycle) : prices.essential.monthly}
              </h2>
              <span className="text-lg text-gray-600 ml-1">Dt</span>
            </div>
            <p className="text-gray-500 mb-2">
              {billingCycle === 'annual' 
                ? `${prices.essential.annual} Dt/mois, facturé annuellement` 
                : `/mois`}
            </p>
            
            {billingCycle === 'annual' && (
              <p className="text-green-600 text-sm font-medium mb-6">
                Économisez {(prices.essential.monthly - prices.essential.annual) * 12} Dt par an
              </p>
            )}
            
            <ul className="space-y-4 mb-16">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Calendrier de réservation simple</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>3 services réservables</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Jusqu'à 2 utilisateurs</span>
              </li>
            </ul>
            
            <a 
              href="/paiement" 
              className="absolute bottom-8 left-8 right-8 bg-white text-blue-600 font-medium py-3 px-6 rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm text-center block"
            >
              Choisir cette formule
            </a>
          </div>
          
          {/* Professional Plan */}
          <div className="bg-white rounded-2xl p-8 text-left relative transition-all hover:shadow-xl hover:-translate-y-1 border border-blue-50">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Professionnel</h3>
            <p className="text-gray-600 mb-6">Optimisez la gestion de vos réservations</p>
            
            <div className="flex items-baseline mb-1">
              <h2 className="text-5xl font-bold text-gray-900">
                {billingCycle === 'annual' ? calculatePrice(prices.professional.annual, billingCycle) : prices.professional.monthly}
              </h2>
              <span className="text-lg text-gray-600 ml-1">Dt</span>
            </div>
            <p className="text-gray-500 mb-2">
              {billingCycle === 'annual' 
                ? `${prices.professional.annual} Dt/mois, facturé annuellement` 
                : `/mois`}
            </p>
            
            {billingCycle === 'annual' && (
              <p className="text-green-600 text-sm font-medium mb-6">
                Économisez {(prices.professional.monthly - prices.professional.annual) * 12} Dt par an
              </p>
            )}
            
            <ul className="space-y-4 mb-16">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Réservations automatisées avancées</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Services réservables illimités</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Jusqu'à 50 utilisateurs</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Tableau de bord collaboratif</span>
              </li>
            </ul>
            
            <a 
              href="/paiement" 
              className="absolute bottom-8 left-8 right-8 bg-white text-blue-600 font-medium py-3 px-6 rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm text-center block"
            >
              Choisir cette formule
            </a>
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
            
            <h3 className="text-2xl font-bold mb-2">Entreprise</h3>
            <p className="text-blue-100 mb-6">Solution complète de gestion des réservations</p>
            
            <div className="flex items-baseline mb-1">
              <h2 className="text-5xl font-bold text-white">
                {billingCycle === 'annual' ? calculatePrice(prices.enterprise.annual, billingCycle) : prices.enterprise.monthly}
              </h2>
              <span className="text-lg text-blue-200 ml-1">Dt</span>
            </div>
            <p className="text-blue-200 mb-2">
              {billingCycle === 'annual' 
                ? `${prices.enterprise.annual} Dt/mois, facturé annuellement` 
                : `/mois`}
            </p>
            
            {billingCycle === 'annual' && (
              <p className="text-green-300 text-sm font-medium mb-6">
                Économisez {(prices.enterprise.monthly - prices.enterprise.annual) * 12} Dt par an
              </p>
            )}
            
            <ul className="space-y-4 mb-16">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Système de réservation personnalisable</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Fonctionnalités premium illimitées</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Nombre d'utilisateurs illimité</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Outils d'analyse et statistiques</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Support client prioritaire</span>
              </li>
            </ul>
            
            <a 
              href="/paiement" 
              className="absolute bottom-8 left-8 right-8 bg-white text-blue-600 font-medium py-3 px-6 rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm text-center block"
            >
              Choisir cette formule
            </a>
          </div>
        </div>
        
        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Vous avez des questions sur nos formules ? Consultez notre 
            <a href="/#faq" className="text-blue-600 font-medium ml-1 hover:underline">
              FAQ
            </a>
            {" "}ou 
            <a href="#" className="text-blue-600 font-medium ml-1 hover:underline">
              contactez notre équipe
            </a>
          </p>
          
          {/* Garantie de remboursement */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-medium">Garantie satisfait ou remboursé pendant 14 jours</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;