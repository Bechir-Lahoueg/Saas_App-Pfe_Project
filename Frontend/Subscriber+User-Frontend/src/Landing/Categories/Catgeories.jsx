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
    <div className="bg-white text-gray-800">
      {/* Navbar avec effet de fond au défilement */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <Navbar />
      </div>

      {/* Spacer - Élément pour créer le décalage sous la navbar */}
      <div className="h-[80px] bg-gray-50 "></div>

      {/* Présentation des Services Professionnels - Design amélioré */}
      <section className="py-20 bg-white relative ">
        <div className="absolute top-0 left-0 w-full h-20 bg-white"></div>
        <div className="container mx-auto px-4 relative">
          <h2
            className="text-3xl font-bold text-center mb-4"
            data-aos="fade-up"
          >
            Secteurs d'activité disponibles
          </h2>
          <p
            className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Trouvez et réservez facilement des services professionnels dans ces
            différents secteurs.
          </p>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">
                Chargement des catégories...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={`${(index + 1) * 100}`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt={category.categoryName}
                    className="w-full md:w-2/5 h-60 md:h-auto object-cover"
                  />
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="text-xl font-semibold mb-3">
                      {category.categoryName}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <a
                      href={`/secteurs/${category.categoryName
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                    >
                      Consulter les prestataires
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-4"
            data-aos="fade-up"
          >
            Services Professionnels Disponibles
          </h2>
          <p
            className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Réservez facilement ces services professionnels proposés par des
            experts qualifiés dans leur domaine.
          </p>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">
                Chargement des catégories...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt={category.categoryName}
                    className="w-full h-56 object-cover transition duration-300 hover:scale-105"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">
                      {category.categoryName}
                    </h3>
                    <p className="text-gray-600">{category.description}</p>
                    <a
                      href={`/booking-industries/${category.categoryName
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="mt-4 inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                    >
                      Réserver
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section> */}

      {/* Avantages - Design amélioré avec icônes et cards */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-4"
            data-aos="fade-up"
          >
            Pourquoi choisir PlanifyGo pour vos réservations professionnelles
          </h2>
          <p
            className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Notre plateforme facilite la mise en relation avec des
            professionnels qualifiés dans tous les secteurs d'activité.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Avantage 1 */}
            <div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Réservation simplifiée
              </h3>
              <p className="text-gray-600">
                Planifiez vos rendez-vous rapidement avec une interface
                intuitive accessible à tout moment.
              </p>
            </div>
            {/* Avantage 2 */}
            <div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Experts vérifiés</h3>
              <p className="text-gray-600">
                Tous les prestataires sur notre plateforme sont sélectionnés et
                vérifiés pour des services de qualité.
              </p>
            </div>
            {/* Avantage 3 */}
            <div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Transactions sécurisées
              </h3>
              <p className="text-gray-600">
                Réservez et payez en toute sécurité avec nos systèmes de
                paiement protégés et fiables.
              </p>
            </div>
            {/* Avantage 4 */}
            <div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg
                  className="h-8 w-8 text-blue-600"
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
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Large réseau d'experts
              </h3>
              <p className="text-gray-600">
                Accédez à notre vaste réseau de professionnels couvrant tous les
                secteurs d'activité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Appel à l'Action - Design amélioré */}
      <section
        className="relative py-16 overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37, 99, 235, 0.9), rgba(29, 78, 216, 0.95)), url("https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-50 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative text-center text-white">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            data-aos="fade-up"
          >
            Prêt(e) à réserver un service professionnel ?
          </h2>
          <p
            className="text-xl mb-8 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Rejoignez des milliers de clients satisfaits et trouvez l'expert qui
            répond à vos besoins professionnels.
          </p>
          {/* <a
            href="/booking-industries"
            className="inline-block bg-white text-blue-700 font-semibold py-4 px-8 rounded-lg transition duration-300 hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 shadow"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Explorer nos services
          </a> */}
        </div>
      </section>

      <Footer />
    </div>
  );
}
