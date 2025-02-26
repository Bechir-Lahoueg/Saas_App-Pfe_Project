import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../../components/Landing/Index';
import { motion } from 'framer-motion';

const PaymentGatewayPage = () => {
  const [selectedPayment, setSelectedPayment] = useState('visa');
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [formFields, setFormFields] = useState({
    address: '',
    state: '',
    city: '',
    postalCode: '',
    cardHolder: '',
    cardNumber: '',
    expiration: '',
    cvc: ''
  });

  useEffect(() => {
    // Vérifier si tous les champs sont remplis
    const allFieldsFilled = Object.values(formFields).every(field => field.trim() !== '');
    setIsFormComplete(allFieldsFilled);
  }, [formFields]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
        
        {/* Colonne de droite avec le formulaire */}
        <motion.div 
          variants={fadeInVariants}
          className="w-full md:w-2/3 bg-white p-8 rounded-xl shadow-md border border-gray-100"
        >
          <motion.h1 
            variants={fadeInVariants}
            className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4"
          >
            Compléter l'inscription
          </motion.h1>
          
          {/* Section Détails personnels */}
          <motion.section 
            variants={fadeInVariants}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <span className="mr-2 bg-blue-100 text-blue-600 h-8 w-8 rounded-full flex items-center justify-center">1</span>
              Détails personnels
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium mb-2 text-gray-600">Adresse</label>
                <motion.input 
                  type="text" 
                  name="address"
                  value={formFields.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="P.o Box 1233"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium mb-2 text-gray-600">État</label>
                <motion.input 
                  type="text" 
                  name="state"
                  value={formFields.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Arusha, Tanzania"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium mb-2 text-gray-600">Ville</label>
                <motion.input 
                  type="text" 
                  name="city"
                  value={formFields.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Arusha"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium mb-2 text-gray-600">Code Postal</label>
                <motion.input 
                  type="text" 
                  name="postalCode"
                  value={formFields.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="9090"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>
          </motion.section>
          
          {/* Section Méthodes de paiement */}
          <motion.section 
            variants={fadeInVariants}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <span className="mr-2 bg-blue-100 text-blue-600 h-8 w-8 rounded-full flex items-center justify-center">2</span>
              Méthodes de paiement
            </h2>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <motion.div 
                className={`px-6 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${selectedPayment === 'visa' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'}`}
                onClick={() => setSelectedPayment('visa')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-bold text-lg">VISA</span>
              </motion.div>
              
              <motion.div 
                className={`px-6 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${selectedPayment === 'stripe' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'}`}
                onClick={() => setSelectedPayment('stripe')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium text-lg">stripe</span>
              </motion.div>
              
              <motion.div 
                className={`px-6 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${selectedPayment === 'paypal' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'}`}
                onClick={() => setSelectedPayment('paypal')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-bold text-lg text-blue-600">P</span>
              </motion.div>
              
              <motion.div 
                className={`px-6 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${selectedPayment === 'mastercard' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'}`}
                onClick={() => setSelectedPayment('mastercard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-yellow-500 rounded-full -ml-2"></div>
                </div>
              </motion.div>
              
              <motion.div 
                className={`px-6 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${selectedPayment === 'gpay' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'}`}
                onClick={() => setSelectedPayment('gpay')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium text-lg">
                  <span className={selectedPayment === 'gpay' ? 'text-white' : 'text-blue-600'}>G</span>
                  <span className={selectedPayment === 'gpay' ? 'text-white' : 'text-red-500'}>Pay</span>
                </span>
              </motion.div>
            </div>
          </motion.section>
          
          {/* Section Détails de la carte */}
          <motion.section 
            variants={fadeInVariants}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <span className="mr-2 bg-blue-100 text-blue-600 h-8 w-8 rounded-full flex items-center justify-center">3</span>
              Détails de la carte
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-600">Nom du titulaire de la carte</label>
              <motion.input 
                type="text" 
                name="cardHolder"
                value={formFields.cardHolder}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Votre nom complet"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-600">Numéro de la carte</label>
              <motion.div className="relative">
                <motion.input 
                  type="text" 
                  name="cardNumber"
                  value={formFields.cardNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="1234 5678 9012 3456"
                  whileFocus={{ scale: 1.01 }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {selectedPayment === 'visa' && <span className="font-bold text-blue-800">VISA</span>}
                  {selectedPayment === 'mastercard' && 
                    <div className="flex">
                      <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                      <div className="w-5 h-5 bg-yellow-500 rounded-full -ml-2"></div>
                    </div>
                  }
                </div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">Date d'expiration</label>
                <motion.input 
                  type="text" 
                  name="expiration"
                  value={formFields.expiration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="MM/AA"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">CVC</label>
                <motion.input 
                  type="text" 
                  name="cvc"
                  value={formFields.cvc}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="123"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>
          </motion.section>
          
          {/* Bouton de soumission */}
          <motion.button 
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${isFormComplete ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            whileHover={isFormComplete ? { scale: 1.02 } : {}}
            whileTap={isFormComplete ? { scale: 0.98 } : {}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Confirmer le paiement
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Pied de page */}
      <Footer />
    </div>
  );
};

export default PaymentGatewayPage;