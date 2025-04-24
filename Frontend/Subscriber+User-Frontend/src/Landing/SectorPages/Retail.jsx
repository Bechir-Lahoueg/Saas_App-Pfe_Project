// pages/Home.jsx
import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Home = () => {
  return (
    <div className="bg-white text-gray-800">
      <Navbar />

      {/* Section Héroïque */}
      <section className="bg-pink-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Prenez soin de vous, réservez en ligne
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Coiffure, esthétique, bien-être — tout à portée de clic.
          </p>
          <a
            href="/booking"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Réserver maintenant
          </a>
        </div>
      </section>

      {/* Présentation des Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte Service 1 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src="/images/coiffure.jpg"
                alt="Coiffure"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Coiffure</h3>
              <p className="text-gray-600">
                Coupes, colorations et coiffures pour toutes les occasions.
              </p>
            </div>
            {/* Carte Service 2 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src="/images/esthetique.jpg"
                alt="Esthétique"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Esthétique</h3>
              <p className="text-gray-600">
                Soins du visage, épilation et maquillage professionnel.
              </p>
            </div>
            {/* Carte Service 3 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src="/images/bien-etre.jpg"
                alt="Bien-être"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Bien-être</h3>
              <p className="text-gray-600">
                Massages relaxants et soins du corps pour votre détente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages Clients */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Ce que disent nos clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Témoignage 1 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">
                "Service exceptionnel et personnel très professionnel. Je
                recommande vivement !"
              </p>
              <h4 className="font-semibold">Sophie M.</h4>
            </div>
            {/* Témoignage 2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">
                "Une expérience de bien-être inoubliable. Je reviendrai sans
                hésiter."
              </p>
              <h4 className="font-semibold">Karim L.</h4>
            </div>
            {/* Témoignage 3 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">
                "Facilité de réservation en ligne et services de qualité. Très
                satisfait."
              </p>
              <h4 className="font-semibold">Nadia T.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Appel à l'Action */}
      <section className="bg-pink-500 py-12">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt(e) à réserver votre moment de détente ?
          </h2>
          <a
            href="/booking"
            className="inline-block bg-white text-pink-500 font-semibold py-3 px-6 rounded-lg transition duration-300 hover:bg-gray-100"
          >
            Réserver maintenant
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
