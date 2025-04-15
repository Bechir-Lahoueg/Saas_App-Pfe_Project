import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Import AOS pour les animations
import AOS from 'aos';
import 'aos/dist/aos.css';

const SportFitness = () => {
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
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-green-900/30 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative text-center">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            data-aos="fade-up"
          >
            Réservation simple pour<br />services sportifs et fitness
          </h1>
          <p 
            className="text-lg md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto"
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            Coaching personnel, cours collectifs et ateliers bien-être en quelques clics.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Présentation des Services Sportifs - Design amélioré */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-4"
            data-aos="fade-up"
          >
            Nos Services Sport & Fitness
          </h2>
          <p 
            className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            Une gamme complète de services pour répondre à tous vos besoins sportifs et de remise en forme.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte Service 1 */}
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Coaching Personnel"
                className="w-full h-56 object-cover transition duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Coaching Personnel</h3>
                <p className="text-gray-600">
                  Entraînements sur mesure avec des coachs certifiés pour atteindre vos objectifs fitness.
                </p>
                <a href="/booking-sport/coaching" className="mt-4 inline-flex items-center text-green-600 font-medium hover:text-green-800">
                  Découvrir 
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
                src="https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Cours Collectifs"
                className="w-full h-56 object-cover transition duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Cours Collectifs</h3>
                <p className="text-gray-600">
                  Rejoignez nos séances de groupe dynamiques et motivantes pour tous les niveaux.
                </p>
                <a href="/booking-sport/cours" className="mt-4 inline-flex items-center text-green-600 font-medium hover:text-green-800">
                  Découvrir 
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
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Ateliers Bien-être"
                className="w-full h-56 object-cover transition duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Ateliers Bien-être</h3>
                <p className="text-gray-600">
                  Découvrez nos ateliers de yoga, méditation et nutrition pour un équilibre corps-esprit.
                </p>
                <a href="/booking-sport/bien-etre" className="mt-4 inline-flex items-center text-green-600 font-medium hover:text-green-800">
                  Découvrir 
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
            Pourquoi choisir PlanifyGo pour le sport
          </h2>
          <p 
            className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Notre plateforme offre une expérience fitness inégalée avec des fonctionnalités pensées pour votre bien-être.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Avantage 1 */}
            <div 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Horaires flexibles</h3>
              <p className="text-gray-600">Planifiez vos séances quand cela vous convient, accessible 24h/24 et 7j/7.</p>
            </div>
            {/* Avantage 2 */}
            <div 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Coachs professionnels</h3>
              <p className="text-gray-600">Tous nos entraîneurs sont certifiés avec une solide expérience dans leur domaine.</p>
            </div>
            {/* Avantage 3 */}
            <div 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Paiement sécurisé</h3>
              <p className="text-gray-600">Vos transactions sont protégées avec nos systèmes de paiement sécurisés.</p>
            </div>
            {/* Avantage 4 */}
            <div 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Programmes sur mesure</h3>
              <p className="text-gray-600">Nos séances sont adaptées pour répondre précisément à vos objectifs fitness et de santé.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types de programmes - Design amélioré */}
      <section className="py-20 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-20 bg-gray-50"></div>
        <div className="container mx-auto px-4 relative">
          <h2 
            className="text-3xl font-bold text-center mb-4"
            data-aos="fade-up"
          >
            Explorez nos programmes
          </h2>
          <p 
            className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Des programmes diversifiés pour répondre à tous vos objectifs de fitness, santé et bien-être.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Programme 1 */}
            <div 
              className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Musculation et cardio"
                className="w-full md:w-2/5 h-60 md:h-auto object-cover"
              />
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3">Musculation et cardio</h3>
                <p className="text-gray-600 mb-4">
                  Des séances intensives pour sculpter votre corps et améliorer votre endurance cardiovasculaire.
                </p>
                <a href="/booking-sport/musculation" className="inline-flex items-center text-green-600 font-medium hover:text-green-800">
                  En savoir plus 
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            {/* Programme 2 */}
            <div 
              className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img
                src="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Yoga et pilates"
                className="w-full md:w-2/5 h-60 md:h-auto object-cover"
              />
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3">Yoga et pilates</h3>
                <p className="text-gray-600 mb-4">
                  Améliorez votre flexibilité, votre posture et votre équilibre avec nos cours adaptés à tous les niveaux.
                </p>
                <a href="/booking-sport/yoga" className="inline-flex items-center text-green-600 font-medium hover:text-green-800">
                  En savoir plus 
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            {/* Programme 3 */}
            <div 
              className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <img
                src="https://images.unsplash.com/photo-1518310383802-640c2de311b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Sports collectifs"
                className="w-full md:w-2/5 h-60 md:h-auto object-cover"
              />
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3">Sports collectifs</h3>
                <p className="text-gray-600 mb-4">
                  Rejoignez nos groupes pour des séances de basket, volley, football et bien d'autres activités conviviales.
                </p>
                <a href="/booking-sport/collectifs" className="inline-flex items-center text-green-600 font-medium hover:text-green-800">
                  En savoir plus 
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            {/* Programme 4 */}
            <div 
              className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Nutrition et diététique"
                className="w-full md:w-2/5 h-60 md:h-auto object-cover"
              />
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3">Nutrition et diététique</h3>
                <p className="text-gray-600 mb-4">
                  Consultations personnalisées avec nos nutritionnistes pour optimiser votre alimentation et atteindre vos objectifs.
                </p>
                <a href="/booking-sport/nutrition" className="inline-flex items-center text-green-600 font-medium hover:text-green-800">
                  En savoir plus 
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
          backgroundImage: 'linear-gradient(rgba(22, 163, 74, 0.9), rgba(21, 128, 61, 0.95)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-50 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative text-center text-white">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            data-aos="fade-up"
          >
            Prêt(e) à transformer votre corps et votre santé ?
          </h2>
          <p 
            className="text-xl mb-8 max-w-3xl mx-auto"
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            Rejoignez des milliers de membres satisfaits et commencez votre parcours fitness dès aujourd'hui.
          </p>
          <a
            href="/booking-sport"
            className="inline-block bg-white text-green-700 font-semibold py-4 px-8 rounded-lg transition duration-300 hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 shadow"
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            Réserver une séance maintenant
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SportFitness;