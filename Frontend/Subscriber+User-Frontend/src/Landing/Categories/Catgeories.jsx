import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Catgeories() {
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
    <div className="bg-slate-50 text-gray-800 min-h-screen">
      {/* Navbar avec effet de fond au défilement */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      {/* Hero Section - Nouveau design */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 clip-hero"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
              Explorez nos secteurs d'activité
            </h1>
            <p className="text-xl text-blue-100 mb-8" data-aos="fade-up" data-aos-delay="100">
              Trouvez rapidement des professionnels qualifiés dans le domaine qui vous intéresse
            </p>
            <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Categories Section - Design moderne et compact */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold text-gray-800" data-aos="fade-right">
                  Nos secteurs d'activité
                </h2>
                <p className="text-blue-600" data-aos="fade-left">
                  {categories.length} secteurs disponibles
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-delay={`${index * 50}`}
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.imageUrl || "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={category.categoryName}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Secteur
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {category.categoryName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {category.description || "Découvrez les professionnels disponibles dans ce secteur d'activité."}
                      </p>
                      
                      <a
                        href={`/secteurs/${category.categoryName.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        <span>Voir les prestataires</span>
                        <svg className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
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

      {/* Features Section - Nouveau design avec icônes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider" data-aos="fade-up">Pourquoi nous choisir</span>
            <h2 className="text-3xl font-bold mt-2 mb-4" data-aos="fade-up" data-aos-delay="100">
              Une plateforme optimisée pour les réservations professionnelles
            </h2>
            <div className="w-16 h-1 bg-blue-600/30 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600" data-aos="fade-up" data-aos-delay="150">
              Notre plateforme facilite la mise en relation avec des professionnels qualifiés dans tous les secteurs d'activité.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg transition-all hover:bg-blue-50/50" data-aos="fade-up" data-aos-delay="200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Réservation simplifiée</h3>
              <p className="text-gray-600 text-sm">
                Planifiez vos rendez-vous en quelques clics avec notre interface intuitive.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 rounded-lg transition-all hover:bg-blue-50/50" data-aos="fade-up" data-aos-delay="250">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Experts vérifiés</h3>
              <p className="text-gray-600 text-sm">
                Tous nos prestataires sont rigoureusement sélectionnés et vérifiés.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 rounded-lg transition-all hover:bg-blue-50/50" data-aos="fade-up" data-aos-delay="300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Transactions sécurisées</h3>
              <p className="text-gray-600 text-sm">
                Réservez et payez en toute sécurité avec nos systèmes protégés.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="p-6 rounded-lg transition-all hover:bg-blue-50/50" data-aos="fade-up" data-aos-delay="350">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Large réseau d'experts</h3>
              <p className="text-gray-600 text-sm">
                Accédez à notre vaste réseau de professionnels dans divers domaines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Design moderne */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 right-0 h-20 bg-white clip-bottom-wave"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4" data-aos="fade-up">
              Commencez dès aujourd'hui
            </span>
            <h2 className="text-3xl font-bold text-white mb-4" data-aos="fade-up" data-aos-delay="100">
              Prêt(e) à réserver un service professionnel ?
            </h2>
            <p className="text-blue-100 mb-8" data-aos="fade-up" data-aos-delay="150">
              Rejoignez des milliers de clients satisfaits et trouvez l'expert qui répond à vos besoins.
            </p>
            <div className="flex flex-wrap justify-center gap-4" data-aos="zoom-in" data-aos-delay="200">
              <a href="/signup" className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                S'inscrire gratuitement
              </a>
              <a href="/categories" className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300">
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* CSS nécessaire pour les formes personnalisées */}
      <style jsx>{`
        .clip-hero {
          clip-path: polygon(0 0, 100% 80%, 100% 100%, 0% 100%);
        }
        
        .clip-bottom-wave {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 80%);
        }
        
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}
