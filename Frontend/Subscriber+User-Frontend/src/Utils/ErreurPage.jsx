import React, { useState, useEffect } from 'react';

const Error404Page = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position for parallax effect
      const x = (window.innerWidth / 2 - e.clientX) / 25;
      const y = (window.innerHeight / 2 - e.clientY) / 25;
      setPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-900 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 opacity-30 rounded-full -translate-y-1/4 translate-x-1/4 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 opacity-30 rounded-full translate-y-1/4 -translate-x-1/4 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-400 opacity-30 rounded-full -translate-x-1/4 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Floating particles */}
      <div className="absolute w-4 h-4 bg-white opacity-20 rounded-full top-1/4 left-1/3 animate-float"></div>
      <div className="absolute w-6 h-6 bg-white opacity-10 rounded-full bottom-1/4 right-1/3 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute w-3 h-3 bg-white opacity-15 rounded-full top-2/3 right-1/4 animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute w-2 h-2 bg-white opacity-25 rounded-full bottom-1/3 left-1/4 animate-float" style={{animationDelay: '3s'}}></div>
      
      {/* Error card with parallax effect */}
      <div 
        className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-md z-10 flex flex-col items-center border border-white border-opacity-20 transition-all duration-300 hover:shadow-blue-400/30"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 404 Error illustration */}
        <div className="relative w-64 h-64 mb-6">
          {/* Abstract 404 design */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 select-none animate-pulse">404</span>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-40 h-40 border-4 border-blue-500 rounded-full animate-spin-slow"></div>
              <div className="absolute w-32 h-32 border-4 border-purple-500 rounded-full animate-reverse-spin"></div>
            </div>
          </div>
          
          {/* Small broken link illustration */}
          <div className="absolute bottom-4 right-4 flex">
            <div className="w-6 h-3 border-2 border-gray-400 rounded-l-full"></div>
            <div className="w-6 h-3 border-2 border-gray-400 rounded-r-full ml-2 rotate-12 translate-y-1"></div>
          </div>
        </div>
        
        {/* Error message */}
        <h2 className="text-2xl font-light text-white mb-2">Oops! Page non trouvée</h2>
        <p className="text-blue-100 text-center mb-6">
          La page que vous recherchez semble avoir été égarée dans le cyberespace.
        </p>
        
        {/* Back button with hover effect */}
        <button 
          className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 ${isHovering ? 'translate-y-0' : 'translate-y-0'}`}
        >
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Retour au Dashboard
          </div>
        </button>
        
        {/* Additional navigation options */}
        <div className="mt-6 flex justify-center space-x-4">
          <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">Accueil</a>
          <span className="text-blue-300">•</span>
          <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">Aide</a>
          <span className="text-blue-300">•</span>
          <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">Contact</a>
        </div>
      </div>
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Error404Page;