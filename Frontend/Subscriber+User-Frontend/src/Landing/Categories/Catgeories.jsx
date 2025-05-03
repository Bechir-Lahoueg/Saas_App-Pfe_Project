import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";

export default function Categories() {
  const [categories, setCategories] = useState([]);
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

    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/auth/category/getall"
        );
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setLoading(false);
      }
    };

    fetchCategories();
    
    return () => {
      document.documentElement.style.scrollPaddingTop = '';
      document.body.style.fontFamily = '';
      if (fontLink.parentNode) {
        document.head.removeChild(fontLink);
      }
    };
  }, []);

  // Filtrage des catégories
  const filteredCategories = categories.filter(
    (category) => 
      !searchTerm || 
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <section className="relative pt-24 pb-20 bg-white z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Secteurs d'activité
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
              Découvrez notre sélection de professionnels qualifiés à travers notre interface moderne et intuitive
            </p>
          </motion.div>

          {/* Barre de recherche avec effet de verre */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="relative flex">
              <input
                type="text"
                placeholder="Rechercher un secteur d'activité..."
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

      {/* Liste des catégories */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
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
          ) : filteredCategories.length === 0 ? (
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
                Aucun secteur trouvé pour votre recherche.
              </p>
              <p className="text-gray-500 mt-2">Essayez avec d'autres termes.</p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  <span className="text-blue-600 font-extrabold">{filteredCategories.length}</span>{" "}
                  secteurs disponibles
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mt-3"></div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filteredCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
                    onClick={() => window.location.href = `/secteurs/${category.categoryName}`}
                  >
                    {/* Overlay de hover pour effet interactif */}
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300 z-10 pointer-events-none"></div>
                    
                    {/* Image Section avec overlay amélioré */}
                    <div className="relative h-44 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-70 z-10"></div>
                      <img
                        src={category.imageUrl || "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={category.categoryName}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      
                      {/* Motif overlay et effet de brillance */}
                      <div className="absolute inset-0 bg-circuit-pattern opacity-30 mix-blend-overlay"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Badge catégorie */}
                      <div className="absolute top-3 right-3 z-20">
                        <span className="inline-flex items-center rounded-full bg-blue-600/90 backdrop-blur-sm border border-blue-400/30 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          Secteur
                        </span>
                      </div>
                      
                      {/* Titre dans l'image pour un effet premium */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <h3 className="text-lg font-bold text-white mb-0 drop-shadow-md">
                          {category.categoryName}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-3 group-hover:w-20 transition-all duration-300"></div>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
                        {category.description || "Découvrez les professionnels disponibles dans ce secteur d'activité."}
                      </p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                          Professionnels disponibles
                        </span>
                        <span className="flex items-center text-blue-600 font-medium text-sm group-hover:text-indigo-600 transition-colors">
                          Voir plus
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </span>
                      </div>
                      
                      {/* Indicateur interactif au survol */}
                      <div className="h-0.5 mt-4 bg-gray-100 overflow-hidden">
                        <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-28 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f610_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-6 relative"
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
      <section className="py-28 bg-white relative z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Une plateforme d'un autre niveau</h2>
            
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
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Réservation intuitive</h3>
                <p className="text-gray-600">Interface moderne permettant une planification fluide et instantanée de vos rendez-vous</p>
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
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Experts d'élite</h3>
                <p className="text-gray-600">Algorithme avancé de sélection garantissant l'accès aux meilleurs professionnels du secteur</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="mb-5 h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Paiement sécurisé</h3>
                <p className="text-gray-600">Technologie avancée pour des transactions ultra-sécurisées et transparentes</p>
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

      {/* CSS nécessaire pour les animations et patterns */}
      <style jsx>{`
        .bg-circuit-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}