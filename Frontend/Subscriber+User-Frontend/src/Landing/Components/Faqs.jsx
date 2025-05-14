import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const faqs = [
    {
      question: "Comment fonctionne le système de réservation PlanifyGo ?",
      answer: "PlanifyGo permet à vos clients de réserver vos services en ligne 24h/24. Vous configurez vos disponibilités, services et employés dans l'interface d'administration, et vos clients peuvent ensuite prendre rendez-vous directement via votre page PlanifyGo personnalisée."
    },
    {
      question: "Comment les clients reçoivent-ils des rappels de rendez-vous ?",
      answer: "PlanifyGo envoie automatiquement des rappels par email aux clients avant leurs rendez-vous."
    },
    {
      question: "Y a-t-il des frais supplémentaires pour les paiements en ligne ?",
      answer: "PlanifyGo s'intègre avec Konnect qui applique des frais de transaction de 0%. Notre solution elle-même n'applique pas de frais supplémentaires."
    },
    {
      question: "Puis-je utiliser PlanifyGo sur mon site web existant ?",
      answer: "Cette fonctionnalité n'est pas encore disponible mais sera implémentée dans une future version de PlanifyGo. Mais vous pouvez toujours partager le lien de votre page PlanifyGo avec vos clients en média sociale."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleContactClick = () => {
    window.location.href = "mailto:planifygo17@gmail.com?subject=Demande d'information sur PlanifyGo";
  };

  const handleDocumentationClick = () => {
    // Ici vous pouvez ajouter la logique pour rediriger vers votre documentation
    // Par exemple : window.location.href = "/documentation";
    alert("La documentation sera disponible prochainement.");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-medium mb-3 tracking-wide">
          SUPPORT
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          Questions fréquentes
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-lg mx-auto">
          Trouvez rapidement les réponses à vos questions
        </p>
      </div>
      
      {/* FAQ Items */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`relative overflow-hidden transition-all duration-200 ease-in-out ${
              activeIndex === index 
                ? 'bg-white shadow-md rounded-lg border border-gray-100' 
                : 'bg-white rounded-lg border border-gray-100 hover:shadow-sm'
            }`}
          >
            <button
              className="flex justify-between items-center w-full text-left p-5 focus:outline-none"
              onClick={() => toggleFAQ(index)}
              aria-expanded={activeIndex === index}
            >
              <h3 className="text-lg font-semibold text-gray-900 pr-6">
                <span className="text-blue-500 mr-2">{index + 1}.</span>
                {faq.question}
              </h3>
              <span className={`flex-shrink-0 ml-2 transition-transform duration-200 ${
                activeIndex === index ? 'text-blue-500' : 'text-gray-400'
              }`}>
                {activeIndex === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </button>
            
            <div 
              className={`px-5 pb-5 transition-all duration-300 ease-in-out ${
                activeIndex === index 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="relative bg-gray-900 rounded-xl p-8 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-3">Besoin d'aide supplémentaire ?</h3>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto text-sm">
              Notre équipe est disponible 7j/7 pour répondre à vos questions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button 
                onClick={handleContactClick}
                className="bg-white text-gray-900 font-medium rounded-full px-6 py-3 hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contactez-nous
                </span>
              </button>
              {/* <button 
                onClick={handleDocumentationClick}
                className="bg-transparent border border-white text-white font-medium rounded-full px-6 py-3 hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documentation
                </span>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;