import React, { useState, useEffect } from 'react';
import Navbar from '../Landing/Components/Navbar';
import Footer from '../Landing/Components/Footer';

export default function Support() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  // Animation au défilement - comme dans GetStarted.jsx
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const animatedElements = document.querySelectorAll('.reveal');
    
    animatedElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Construction du lien mailto avec les données du formulaire
      const subject = encodeURIComponent(`Support: ${formData.subject}`);
      const body = encodeURIComponent(
        `Informations du contact:\n` +
        `Nom: ${formData.firstName} ${formData.lastName}\n` +
        `Email: ${formData.email}\n\n` +
        `Message:\n${formData.message}`
      );
      
      // Ouvre le client email de l'utilisateur avec les informations préremplies
      window.location.href = `mailto:redfrexi17@gmail.com?subject=${subject}&body=${body}`;
      
      // Simulation d'envoi réussi
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Affichage du succès
      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
      console.error('Erreur d\'envoi:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Fond abstrait moderne avec formes géométriques */}
        <Navbar />
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 -left-10 w-96 h-96 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-purple-300 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
        
        {/* Motif de grille moderne */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-30" style={{ backgroundSize: '25px 25px' }}></div>
        </div>
        
        {/* Effet de particules légères */}
        <div className="sparkles absolute inset-0 opacity-40"></div>
      </div>
      
      <div className="relative z-10 pt-14 pb-20 md:pt-28">
        <div className="max-w-3xl mx-auto px-6">
          {/* En-tête */}
          <div className="text-center mb-10 reveal">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 font-medium text-sm mb-5">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              <span>Service client</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-4 reveal">
              <span className="block text-gray-900">Support</span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-transparent bg-clip-text">Technique</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed reveal">
              Besoin d'aide? Notre équipe est là pour vous aider à résoudre vos problèmes.
            </p>
          </div>
          
          {isSubmitted ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50 reveal">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-500 mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Ticket envoyé avec succès!</h2>
                <p className="text-gray-600 mb-8">
                  Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-xl transition-all transform hover:-translate-y-1 group"
                >
                  <span className="flex items-center justify-center">
                    Soumettre un autre ticket
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50 reveal">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre.email@exemple.com"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" disabled>Sélectionnez un sujet</option>
                    <option value="Problème technique">Problème technique</option>
                    <option value="Problème de compte">Problème de compte</option>
                    <option value="Problème de paiement">Problème de paiement</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Description du problème *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Décrivez votre problème en détail..."
                  ></textarea>
                </div>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-xl transition-all transform hover:-translate-y-1 group"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <span className="flex items-center justify-center">
                        Envoyer ma demande
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm reveal">
            <p>Pour les problèmes urgents, consultez notre <a href="#" className="text-blue-600 hover:text-blue-500">FAQ</a> ou contactez-nous sur les réseaux sociaux.</p>
          </div>
        </div>
      </div>
      
      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        
        .animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .sparkles {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 40px 40px, 40px 40px, 60px 60px;
        }
      `}</style>
              <Footer />

    </div>
  );
}