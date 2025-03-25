import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '../../components/Landing/Index';

const PaymentGatewayPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Function to generate a random order ID
  const generateOrderId = () => {
    return `ORDER-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now()}`;
  };

  // Payment initialization handler
  const handleInitiatePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare payment data
      const paymentData = {
        receiverWalletId: "67dd5a772f786e7f6069197a",
        token: "TND",
        amount: 500,
        type: "immediate",
        description: "Custom payment description",
        acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
        lifespan: 10,
        checkoutForm: true,
        addPaymentFeesToAmount: true,
        orderId: generateOrderId(), // Randomly generated order ID
        successUrl: "https://gateway.sandbox.konnect.network/payment-success",
        failUrl: "https://gateway.sandbox.konnect.network/payment-failure",
        theme: "dark"
      };

      // Send payment initialization request
      const response = await fetch('https://api.sandbox.konnect.network/api/v2/payments/init-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '67dd5a752f786e7f60691967:BcTXdYquEql7EzbId65fTjvEm8'
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      // Handle response
      if (response.ok && result.payUrl) {
        // Redirect to Konnect payment page
        window.location.href = result.payUrl;
      } else {
        // Handle error
        setError(result.message || 'Payment initialization failed');
      }
    } catch (err) {
      setError('An error occurred during payment initialization');
      console.error('Payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      {/* En-tête */}
      <Navbar />

      {/* Contenu principal */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
        className="flex-grow p-8 flex flex-col md:flex-row items-start max-w-7xl mx-auto w-full"
      >
        {/* Colonne de gauche avec logo */}
        <motion.div
          variants={fadeInVariants}
          className="w-full md:w-1/3 pr-0 md:pr-12 flex flex-col items-center md:sticky md:top-24 mb-8 md:mb-0"
        >
          <motion.div
            className="mb-6"
            whileHover={{ rotate: 15, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M70 0L105 35L70 70L35 35L70 0Z"
                fill="#2563EB"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              />
              <motion.path
                d="M70 70L105 105L70 140L35 105L70 70Z"
                fill="#2563EB"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
              <motion.path
                d="M0 70L35 35L70 70L35 105L0 70Z"
                fill="#2563EB"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              />
              <motion.path
                d="M140 70L105 35L70 70L105 105L140 70Z"
                fill="#2563EB"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              />
            </svg>
          </motion.div>
          <motion.h2
            variants={fadeInVariants}
            className="text-3xl font-bold text-blue-600 mt-4 mb-6"
          >
            Payment Gateway
          </motion.h2>

          <motion.div
            variants={fadeInVariants}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm border border-blue-100"
          >
            <h3 className="font-medium text-gray-700 mb-4">Sécurité garantie</h3>
            <div className="flex items-center mb-3">
              <div className="mr-3 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <span className="text-sm text-gray-600">Paiement sécurisé SSL</span>
            </div>
            <div className="flex items-center mb-3">
              <div className="mr-3 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="text-sm text-gray-600">Traitement rapide</span>
            </div>
            <div className="flex items-center">
              <div className="mr-3 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <span className="text-sm text-gray-600">Support client 24/7</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Colonne de droite avec le récapitulatif de paiement */}
        <motion.div
          variants={fadeInVariants}
          className="w-full md:w-2/3 bg-white p-8 rounded-xl shadow-md border border-gray-100"
        >
          <motion.h1
            variants={fadeInVariants}
            className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4"
          >
            Finaliser votre paiement
          </motion.h1>

          {/* Résumé du paiement */}
          <motion.section
            variants={fadeInVariants}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <span className="mr-2 bg-blue-100 text-blue-600 h-8 w-8 rounded-full flex items-center justify-center">1</span>
              Résumé de la commande
            </h2>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Montant</span>
                <span className="font-semibold">500 TND</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Description</span>
                <span className="font-semibold">Custom payment description</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Numéro de commande</span>
                <span className="font-semibold">#{generateOrderId()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-blue-100">
                <span className="text-gray-700 font-medium">Total</span>
                <span className="font-bold text-blue-600">0.500 TND</span>
              </div>
            </div>
          </motion.section>

          {/* Méthodes de paiement */}
          <motion.section
            variants={fadeInVariants}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <span className="mr-2 bg-blue-100 text-blue-600 h-8 w-8 rounded-full flex items-center justify-center">2</span>
              Méthodes de paiement disponibles
            </h2>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-lg flex items-center">
                <span className="font-medium text-green-600 mr-2">Wallet</span>
                <span className="text-xs text-gray-500">Portefeuille numérique</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              En cliquant sur "Payer maintenant", vous serez redirigé vers la plateforme sécurisée de paiement Konnect pour finaliser votre transaction.
            </p>
          </motion.section>

          {/* Messages d'erreur */}
          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Bouton de paiement */}
          <motion.button
            onClick={handleInitiatePayment}
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-lg`}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </span>
            ) : (
              'Payer maintenant'
            )}
          </motion.button>

          <div className="mt-4 text-xs text-center text-gray-500">
            <p>Paiement sécurisé via Konnect Payment Gateway</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Pied de page */}
      <Footer />
    </div>
  );
};

export default PaymentGatewayPage;