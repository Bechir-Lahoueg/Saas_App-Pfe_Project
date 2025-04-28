import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 text-gray-800 min-h-screen">
      {/* Navbar avec effet de fond translucide */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <Navbar />
      </div>

      {/* Hero Section - Design moderne avec accents colorés */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100 to-transparent"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-200/30 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl"></div>
        
        {/* Grid lines animation */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-start space-y-6">
              <div className="px-4 py-1 rounded-full bg-blue-100 border border-blue-200 backdrop-blur-sm">
                <span className="text-blue-600 text-sm font-medium tracking-wide">EXPLOREZ L'UNIVERS DES SERVICES</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600" data-aos="fade-up">
                Secteurs d'activité
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl" data-aos="fade-up" data-aos-delay="100">
                Découvrez notre sélection de professionnels qualifiés à travers notre interface moderne et intuitive
              </p>
              
              <div className="flex gap-4 mt-8" data-aos="fade-up" data-aos-delay="200">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg border border-blue-500/50 shadow-lg shadow-blue-500/20 backdrop-blur-sm transition-all duration-300 hover:shadow-blue-500/40 hover:scale-105">
                  Explorer maintenant
                </button>
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:border-blue-300 transition-all duration-300">
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle separator */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </section>

      {/* Categories Section - Design moderne avec cartes élégantes */}
      <section className="py-20 relative">
        <div className="absolute -top-40 left-1/3 w-72 h-72 bg-blue-200/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-200/10 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-t-4 border-purple-400 border-solid rounded-full animate-spin-slow"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-100 backdrop-blur-sm border border-red-200 p-6 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 space-y-4 md:space-y-0">
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-600 mb-4">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Explorer
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800" data-aos="fade-right">
                    Parcourez nos <span className="text-blue-600">secteurs d'expertise</span>
                  </h2>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm" data-aos="fade-left">
                  <span className="text-blue-600 font-semibold">{categories.length}</span>
                  <span className="text-gray-600">secteurs disponibles</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="group relative bg-white backdrop-blur-md rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-xl"
                    data-aos="zoom-in"
                    data-aos-delay={`${index * 100}`}
                  >
                    {/* Subtle glow effect on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-700 group-hover:duration-200"></div>
                    
                    {/* Image Section with overlay */}
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 z-10"></div>
                      <img
                        src={category.imageUrl || "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={category.categoryName}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      
                      {/* Subtle overlay patterns */}
                      <div className="absolute inset-0 bg-circuit-pattern opacity-30 mix-blend-overlay"></div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 right-4 z-20">
                        <span className="inline-flex items-center rounded-full bg-blue-600/80 backdrop-blur-sm border border-blue-400/30 px-3 py-1 text-xs font-medium text-white">
                          # Secteur
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6 relative z-20">
                      {/* Small decorative element */}
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4"></div>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {category.categoryName}
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-2">
                        {category.description || "Découvrez les professionnels disponibles dans ce secteur d'activité."}
                      </p>
                      
                      <a
                        href={`/secteurs/${category.categoryName.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300"
                      >
                        <span>Voir les prestataires</span>
                        <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section - Design moderne avec icônes */}
      <section className="py-24 relative bg-gradient-to-b from-gray-100 to-white">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-gray-100/50"></div>
        <div className="absolute -top-20 left-1/4 w-64 h-64 bg-blue-100/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-100/30 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-600 mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Avantages clés
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6" data-aos="fade-up">
              Une plateforme <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">d'un autre niveau</span>
            </h2>
            <p className="text-gray-600" data-aos="fade-up" data-aos-delay="100">
              Notre technologie de pointe facilite la mise en relation avec des professionnels qualifiés pour des résultats exceptionnels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="150">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 border border-blue-200 text-blue-600 mb-5">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Réservation intuitive</h3>
              <p className="text-gray-600">
                Interface moderne permettant une planification fluide et instantanée de vos rendez-vous.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-100 border border-purple-200 text-purple-600 mb-5">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Experts d'élite</h3>
              <p className="text-gray-600">
                Algorithme avancé de sélection garantissant l'accès aux meilleurs professionnels du secteur.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="250">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-600 mb-5">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Paiement sécurisé</h3>
              <p className="text-gray-600">
                Technologie avancée pour des transactions ultra-sécurisées et transparentes.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-100 border border-cyan-200 text-cyan-600 mb-5">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Réseau global</h3>
              <p className="text-gray-600">
                Accès instantané à un écosystème mondial de professionnels spécialisés et certifiés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Design moderne */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-10"></div>
        
        {/* Design elements */}
        <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 right-0 left-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100/30 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-100/30 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl" data-aos="zoom-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-sm text-blue-600 mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              <span>Technologie nouvelle génération</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6" data-aos="fade-up">
              Prêt à entrer dans la nouvelle ère des <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">services professionnels</span> ?
            </h2>
            
            <p className="text-gray-600 mb-8" data-aos="fade-up" data-aos-delay="100">
              Rejoignez notre réseau avant-gardiste et découvrez une plateforme conçue pour répondre aux exigences du futur.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
              <a href="/signup" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-105 text-center">
                Accéder à la plateforme
              </a>
              <a href="/categories" className="px-8 py-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-center">
                Consulter nos ressources
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* CSS nécessaire pour les animations et patterns */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .bg-circuit-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image:
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}