import React, { useState } from "react";
import { Navbar, Footer } from "../../Landing/Index";

export default function EmailVerification() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="flex items-center justify-center flex-grow px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-extrabold text-blue-600">
            Vérifiez votre adresse e-mail
          </h1>
          <p className="mt-4 text-gray-600">
            Nous avons envoyé un code de sécurité à six chiffres à{" "}
            <b>fajaxoh834@proscrid.com</b>.<br />
            Veuillez saisir le code ci-dessous pour continuer.
          </p>
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            ))}
          </div>
          <button className="mt-6 px-6 py-3 w-full text-white text-lg font-semibold bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition">
            Vérifier et continuer
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Vous n'avez pas reçu le code ?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Renvoyer
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
