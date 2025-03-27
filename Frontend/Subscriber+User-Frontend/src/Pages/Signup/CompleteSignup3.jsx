import React, { useState } from 'react';
import { Navbar, Footer } from '../../components/Landing/Index';
import { motion } from 'framer-motion';

const WebflowIntegrationPage = () => {
  const [formData, setFormData] = useState({
    country: 'United States',
    state: '',
    city: '',
    zipCode: '',
    streetAddress: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Contenu principal */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
        className="flex-grow py-12 px-4 md:px-12 flex flex-col md:flex-row max-w-7xl mx-auto w-full"
      >
        {/* Colonne de gauche avec les étapes */}
        <motion.div 
          variants={fadeInVariants}
          className="w-full md:w-2/5 pr-0 md:pr-12 mb-8 md:mb-0"
        >
          {/* Étape 1 */}
          <div className="flex mb-10 relative">
            <div className="relative z-10">
              <div className="bg-blue-600 rounded-full h-14 w-14 flex items-center justify-center text-white font-semibold text-lg">
                01
              </div>
              <div className="absolute top-16 bottom-0 left-7 w-0.5 bg-blue-200" style={{ height: 'calc(100% + 2rem)' }}></div>
            </div>
            <div className="ml-4 pt-2">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Connect Your Webflow Account</h3>
              <p className="text-gray-600">
                Start by easily linking your Webflow account to FlowPay. In just a few clicks, FlowPay syncs all your projects and billing data, bringing everything into one organized dashboard.
              </p>
            </div>
          </div>

          {/* Étape 2 */}
          <div className="flex mb-10 relative">
            <div className="relative z-10">
              <div className="bg-blue-600 rounded-full h-14 w-14 flex items-center justify-center text-white font-semibold text-lg">
                02
              </div>
              <div className="absolute top-16 bottom-0 left-7 w-0.5 bg-blue-200" style={{ height: 'calc(100% + 2rem)' }}></div>
            </div>
            <div className="ml-4 pt-2">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Automate Invoices and Payments</h3>
              <p className="text-gray-600">
                FlowPay eliminates the headache of manual invoicing by automatically generating invoices from your Webflow billing. With one-click sending and automated reminders, you can ensure your clients are always up to date on their payments.
              </p>
            </div>
          </div>

          {/* Étape 3 */}
          <div className="flex relative">
            <div className="relative z-10">
              <div className="bg-white border-2 border-blue-600 rounded-full h-14 w-14 flex items-center justify-center text-blue-600 font-semibold text-lg">
                03
              </div>
            </div>
            <div className="ml-4 pt-2">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Track Payments in Real-Time</h3>
              <p className="text-gray-600">
                After the invoices are sent, FlowPay tracks payments as they come in, giving you real-time updates. You'll always know what's paid, what's pending, and when to expect the money in your account.
              </p>
            </div>
          </div>

          {/* Élément de design - Cercle décoratif */}
          <div className="hidden md:block absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full opacity-70" style={{ zIndex: -1, transform: 'translate(-30%, 30%)' }}></div>
        </motion.div>
        
        {/* Colonne de droite avec le formulaire */}
        <motion.div 
          variants={fadeInVariants}
          className="w-full md:w-3/5 bg-white p-8 rounded-xl shadow-md border border-gray-100"
        >
          <motion.h2 
            variants={fadeInVariants}
            className="text-2xl font-bold mb-6 text-gray-800"
          >
            Address
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-600">Country</label>
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-400 flex items-center">
                    <img src="https://flagicons.lipis.dev/flags/4x3/us.svg" alt="US Flag" className="h-4 w-6 mr-2" />
                  </span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-600">State</label>
              <motion.input 
                type="text" 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Florida"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-600">City</label>
              <motion.input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Orlando"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-600">ZIP / Post code</label>
              <motion.input 
                type="text" 
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Orlando"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 text-gray-600">Street address</label>
            <motion.input 
              type="text" 
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder="Sailor Street"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          
          <div className="flex justify-end">
            <motion.button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Pied de page */}
      <Footer />
    </div>
  );
};

export default WebflowIntegrationPage;