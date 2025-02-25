import React, { useState } from 'react';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0);
  
  const faqs = [
    {
      question: "Puis-je envoyer des factures directement via FlowPay ?",
      answer: "Oui ! FlowPay génère automatiquement des factures basées sur votre facturation Webflow. En un seul clic, vous pouvez les envoyer directement à vos clients. FlowPay gère également les rappels de paiement, vous permettant de suivre facilement les factures impayées."
    },
    {
      question: "Comment puis-je démarrer avec FlowPay ?",
      answer: "Pour commencer avec FlowPay, créez simplement un compte, connectez votre site Webflow et configurez vos préférences de paiement. Notre processus d'intégration guidé vous aide à tout configurer en quelques minutes. Vous pouvez ensuite commencer à recevoir des paiements immédiatement."
    },
    {
      question: "Comment FlowPay m'aide à me faire payer plus rapidement ?",
      answer: "FlowPay accélère vos paiements grâce à des factures automatiques, des rappels personnalisés et des options de paiement multiples. Notre système simplifie le processus pour vos clients, ce qui conduit à des paiements plus rapides et améliore votre flux de trésorerie."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <h2 className="text-4xl font-bold text-center text-blue-600 mb-12">FAQs</h2>
      
      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left py-2"
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            >
              <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
              <span>
                {openFAQ === index ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
            </button>
            
            {openFAQ === index && (
              <div className="mt-2 text-gray-600">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Still have questions section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Vous avez encore une question ?</h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Nous avons couvert les questions les plus courantes, mais si vous êtes toujours curieux 
          de savoir comment FlowPay fonctionne ou si vous avez besoin de détails spécifiques, 
          nous sommes là pour vous aider. N'hésitez pas à nous contacter—nous sommes heureux 
          de vous fournir plus d'informations et de vous guider à travers tout ce dont vous avez besoin.
        </p>
        <button className="bg-white border-2 border-blue-600 text-blue-600 font-medium rounded-full px-6 py-3 hover:bg-blue-50 transition-colors">
          Commencer un essai gratuit de 7 jours
        </button>
      </div>
    </div>
  );
};

export default FAQSection;