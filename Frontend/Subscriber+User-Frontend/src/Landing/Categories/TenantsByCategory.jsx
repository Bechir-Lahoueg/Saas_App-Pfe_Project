import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";

export default function TenantsByCategory() {
  const { categoryName } = useParams();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Hauteur estimée de la navbar
  const navbarHeight = 72;

  useEffect(() => {
    // Configuration du scroll-padding
    document.documentElement.style.scrollPaddingTop = `${navbarHeight}px`;
    
    // Ajout de la police Inter depuis Google Fonts
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
    
    // Appliquer la police à tout le document
    document.body.style.fontFamily = "'Inter', sans-serif";
    
    const fetchTenants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8888/auth/tenant/getTenantByCategory/${categoryName}`
        );
        setTenants(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les prestataires.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
    
    return () => {
      document.documentElement.style.scrollPaddingTop = '';
      document.body.style.fontFamily = '';
      if (fontLink.parentNode) {
        document.head.removeChild(fontLink);
      }
    };
  }, [categoryName]);

  // Filtrage des prestataires
  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { 
      duration: 2, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 overflow-hidden">
      {/* Motif de fond subtil */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      
      {/* Formes décoratives */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl z-0"></div>
      <div className="fixed bottom-20 left-10 w-60 h-60 bg-gradient-to-tr from-purple-200/20 to-blue-300/20 rounded-full blur-3xl z-0"></div>
      
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <Navbar />
      </div>

      {/* Espacement pour la navbar */}
      <div style={{ height: `${navbarHeight}px` }}></div>

      {/* Hero Section avec effet de motif */}
      <section className="relative pt-20 pb-20 bg-white z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {categoryName.replace(/-/g, " ")}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
              Trouvez les meilleurs prestataires adaptés à vos besoins
            </p>
          </motion.div>

          {/* Barre de recherche avec effet de verre */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            <div className="relative flex">
              <input
                type="text"
                placeholder="Rechercher un prestataire ou une ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Liste des prestataires */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="flex justify-center items-center py-16"
            >
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600"></div>
            </motion.div>
          ) : error ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-5">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p className="text-lg text-red-600 font-medium">{error}</p>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-5">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <p className="text-xl text-gray-600 font-medium">
                Aucun prestataire trouvé pour votre recherche.
              </p>
              <p className="text-gray-500 mt-2">Essayez avec d'autres termes ou parcourez tous les prestataires.</p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  <span className="text-blue-600 font-extrabold">{filteredTenants.length}</span>{" "}
                  prestataires disponibles
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mt-3"></div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTenants.map((t) => (
                  <motion.div
                    key={t.id}
                    variants={itemVariants}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start mb-4">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg font-extrabold text-white shadow-inner">
                          {t.businessName.charAt(0)}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                            {t.businessName}
                          </h3>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < 4 ? "text-yellow-400" : "text-gray-200"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-2 font-medium">
                              24 avis
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5 mb-5 text-sm">
                        <p className="text-gray-600 flex items-center font-medium">
                          <svg
                            className="w-4 h-4 mr-2.5 text-blue-500 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                          <span className="truncate">{t.firstName} {t.lastName}</span>
                        </p>
                        <p className="text-gray-600 flex items-center font-medium">
                          <svg
                            className="w-4 h-4 mr-2.5 text-blue-500 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                          <span className="truncate">{t.city}, {t.country}</span>
                        </p>
                        <p className="text-gray-600 flex items-center font-medium">
                          <svg
                            className="w-4 h-4 mr-2.5 text-blue-500 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            ></path>
                          </svg>
                          <span className="truncate">{t.phone}</span>
                        </p>
                      </div>

                      <div className="flex justify-between items-center mb-5 text-xs font-semibold">
                        <motion.span 
                          whileHover={pulseAnimation}
                          className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full flex items-center"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                          Disponible aujourd'hui
                        </motion.span>
                        <motion.span 
                          whileHover={pulseAnimation}
                          className="text-green-600 bg-green-50 px-3 py-1.5 rounded-full flex items-center"
                        >
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                          Répond en {"<24h"}
                        </motion.span>
                      </div>

                      <motion.a
                        href={`http://${t.subdomain}.127.0.0.1.nip.io:5173/reservation`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Réserver maintenant
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          ></path>
                        </svg>
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {filteredTenants.length > 9 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-12 text-center"
                >
                  <motion.button 
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                  >
                    Voir plus de prestataires
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f610_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-4 relative"
        >
          <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold bg-blue-50 py-1 px-3 rounded-full mb-6 inline-block">Pour les professionnels</span>
          
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Vous êtes un prestataire ?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto font-normal">
            Rejoignez notre plateforme et bénéficiez d'une visibilité
            exceptionnelle pour développer votre activité.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
              component="a"
              href="/paiement"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.href = '/paiment'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg cursor-pointer"
            >
              Créer un compte professionnel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
            >
              En savoir plus
            </motion.button>
          </div>

          <div className="mt-10 p-6 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Inscription gratuite</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Support dédié</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Commission réduite</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section avantages */}
      <section className="py-20 bg-white relative z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Des services adaptés à vos besoins</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="mb-5 h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Rapidité</h3>
                <p className="text-gray-600">Obtenez une réponse à votre demande en quelques minutes seulement</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="mb-5 h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Sécurité</h3>
                <p className="text-gray-600">Tous les prestataires sont vérifiés et évalués par nos utilisateurs</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="mb-5 h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Qualité</h3>
                <p className="text-gray-600">Des services professionnels et une satisfaction garantie</p>
              </motion.div>
            </div>
            
            <div className="pt-6 pb-8 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 blur-xl"></div>
              <div className="relative h-2 mx-auto bg-gray-100 w-2/3 md:w-1/3 rounded-full overflow-hidden mb-8 shadow-inner">
                <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-3/4 rounded-full"></div>
              </div>
              <p className="text-gray-500 italic font-medium">Plus de 10 000 utilisateurs nous font confiance</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}