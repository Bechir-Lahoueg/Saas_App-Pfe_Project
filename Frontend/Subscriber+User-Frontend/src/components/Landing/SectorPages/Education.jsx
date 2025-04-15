import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Import AOS pour les animations
import AOS from 'aos';
import 'aos/dist/aos.css';

const Education = () => {
  // Initialiser AOS pour les animations au défilement
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* Navbar avec effet de fond au défilement */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <Navbar />
      </div>
      
      {/* Spacer - Élément pour créer le décalage sous la navbar */}
      <div className="h-[80px]"></div>

      {/* Section Héroïque améliorée */}
      <section 
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/30 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative text-center">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            data-aos="fade-up"
          >
            Réservation simple pour<br />services éducatifs
          </h1>
          <p 
            className="text-lg md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto"
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            Réservez des cours particuliers, formations professionnelles et ateliers éducatifs en quelques clics.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Présentation des Services Éducatifs - Design amélioré */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-4"
            data-aos="fade-up"
          >
            Services Éducatifs Disponibles
          </h2>
          <p 
            className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            Réservez facilement ces services éducatifs proposés par des professionnels qualifiés.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte Service 1 */}
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Cours Particuliers"
                className="w-full h-56 object-cover transition duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Cours Particuliers</h3>
                <p className="text-gray-600">
                  Réservez des séances de soutien scolaire dans toutes les matières avec des tuteurs expérimentés.
                </p>
                <a href="/booking-education/cours" className="mt-4 inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  Réserver 
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            {/* Carte Service 2 */}
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Formations Professionnelles"
                className="w-full h-56 object-cover transition duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Formations Professionnelles</h3>
                <p className="text-gray-600">
                  Trouvez et réservez des formations certifiantes adaptées au marché du travail.
                </p>
                <a href="/booking-education/formations" className="mt-4 inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  Réserver 
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            {/* Carte Service 3 */}
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Ateliers Créatifs"
                className="w-full h-56 object-cover transition duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Ateliers Créatifs</h3>
                <p className="text-gray-600">
                  Réservez des places pour des ateliers artistiques et créatifs pour tous les âges.
                </p>
                <a href="/booking-education/ateliers" className="mt-4 inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  Réserver 
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages - Design amélioré avec icônes et cards */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-4"
            data-aos="fade-up"
          >
            Pourquoi choisir PlanifyGo pour vos réservations éducatives
          </h2>
          <p 
            className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Notre plateforme facilite la mise en relation avec des professionnels de l'éducation qualifiés.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Avantage 1 */}
            <div 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Réservation flexible</h3>
              <p className="text-gray-600">Planifiez des séances quand cela vous convient, avec un système accessible 24h/24 et 7j/7.</p>
            </div>
            {/* Avantage 2 */}
            <div 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Prestataires vérifiés</h3>
              <p className="text-gray-600">Tous les prestataires sur notre plateforme sont vérifiés pour garantir des services de qualité.</p>
            </div>
            {/* Avantage 3 */}
            <div 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Paiement sécurisé</h3>
              <p className="text-gray-600">Réservez et payez en toute sécurité avec nos systèmes de paiement protégés.</p>
            </div>
            {/* Avantage 4 */}
            <div 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Comparaison facile</h3>
              <p className="text-gray-600">Comparez facilement les profils, disponibilités et tarifs des différents prestataires éducatifs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types de formations - Design amélioré */}
      <section className="py-20 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-20 bg-gray-50"></div>
        <div className="container mx-auto px-4 relative">
          <h2 
            className="text-3xl font-bold text-center mb-4"
            data-aos="fade-up"
          >
            Catégories de services éducatifs
          </h2>
          <p 
            className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Trouvez et réservez facilement des services éducatifs dans ces différentes catégories.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Catégorie 1 */}
            <div 
              className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Langues étrangères"
                className="w-full md:w-2/5 h-60 md:h-auto object-cover"
              />
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3">Langues étrangères</h3>
                <p className="text-gray-600 mb-4">
                  Réservez des cours d'anglais, espagnol, chinois et autres langues avec des professeurs qualifiés.
                </p>
                <a href="/booking-education/langues" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  Voir les disponibilités 
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            {/* Catégorie 2 */}
            <div 
              className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img
                src="https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Informatique et technologie"
                className="w-full md:w-2/5 h-60 md:h-auto object-cover"
              />
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3">Informatique et technologie</h3>
                <p className="text-gray-600 mb-4">
                  Réservez des cours de programmation, design web, et autres compétences technologiques.
                </p>
                <a href="/booking-education/informatique" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  Voir les disponibilités 
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            {/* Catégorie 3 */}
            <div 
              className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Soutien scolaire"
                className="w-full md:w-2/5 h-60 md:h-auto object-cover"
              />
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3">Soutien scolaire</h3>
                <p className="text-gray-600 mb-4">
                  Réservez des séances de soutien en mathématiques, français, sciences pour élèves de tous niveaux.
                </p>
                <a href="/booking-education/soutien" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  Voir les disponibilités 
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            {/* Catégorie 4 */}
            <div 
              className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <img
                src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Développement personnel"
                className="w-full md:w-2/5 h-60 md:h-auto object-cover"
              />
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3">Développement personnel</h3>
                <p className="text-gray-600 mb-4">
                  Réservez des sessions de coaching en gestion du temps, communication, leadership et plus.
                </p>
                <a href="/booking-education/developpement" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  Voir les disponibilités 
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appel à l'Action - Design amélioré */}
      <section 
        className="relative py-16 overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(37, 99, 235, 0.9), rgba(29, 78, 216, 0.95)), url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-50 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative text-center text-white">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            data-aos="fade-up"
          >
            Prêt(e) à réserver votre prochaine session éducative ?
          </h2>
          <p 
            className="text-xl mb-8 max-w-3xl mx-auto"
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            Rejoignez des milliers d'utilisateurs satisfaits et trouvez le service éducatif qui vous correspond.
          </p>
          <a
            href="/booking-education"
            className="inline-block bg-white text-blue-700 font-semibold py-4 px-8 rounded-lg transition duration-300 hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 shadow"
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            Explorer les services disponibles
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Education;