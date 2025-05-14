import React from 'react'
import planifygoLogo from "/LogoPlanifygoPNG.png";


export default function Navbar() {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center overflow-hidden">
              <a href="/reservation" className="flex items-center">
                <img 
                  src={planifygoLogo} 
                  alt="PlanifyGo Logo" 
                  className="h-12" // Augmenté de h-16 à h-32 pour doubler la taille
                  style={{ 
                    objectFit: "contain", 
                    transform: "scale(2)", 
                    transformOrigin: "left center",
                    marginRight: "2rem" // Compensation pour l'agrandissement
                  }} 
                />
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="/reservation"
                className="border-transparent text-gray-500 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Page d'accueil
              </a>
              <a
                href="/reservation/historique"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Mes Reservations
              </a>
            </div>
          </div>
        </div>
      </nav>
    );    
  
}

