import React, { useState } from 'react';
import { Navbar, Footer } from '../../components/Landing/Index';
import { motion } from 'framer-motion';

const WebflowLoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
        
        {/* Colonne de droite avec le formulaire de connexion */}
        <motion.div 
          variants={fadeInVariants}
          className="w-full md:w-3/5 bg-white p-8 rounded-xl shadow-md border border-gray-100"
        >
          <motion.h2 
            variants={fadeInVariants}
            className="text-2xl font-bold mb-6 text-gray-800"
          >
            Login information
          </motion.h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Your name</label>
              <motion.input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="What is your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Email</label>
              <motion.input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="eg.company@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Password</label>
              <motion.div className="relative">
                <motion.input 
                  type={passwordVisible ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  whileFocus={{ scale: 1.01 }}
                />
                <button 
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {passwordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </motion.div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-600">
                I agree to the provisions of the <a href="#" className="text-blue-600 hover:underline">Terms And Conditions</a> & <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
          </div>
          
          <div className="mt-8">
            <motion.button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!formData.agreeTerms}
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

export default WebflowLoginPage;