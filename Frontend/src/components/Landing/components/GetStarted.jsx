import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96">
          <div className="w-full h-full border-t-2 border-r-2 border-[#E5F0FF] rounded-tr-full"></div>
        </div>
        
        <div className="absolute bottom-0 left-1/4 w-96 h-96">
          <div className="w-full h-full border-b-2 border-l-2 border-[#E5F0FF] rounded-bl-full"></div>
        </div>
        
        <div className="absolute top-1/4 right-0 w-64 h-64">
          <div className="w-full h-full border-2 border-dashed border-[#E5F0FF] rounded-full opacity-30"></div>
        </div>
        
        <div className="absolute bottom-1/4 left-0 w-64 h-64">
          <div className="w-full h-full border-2 border-dashed border-[#E5F0FF] rounded-full opacity-30"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="text-center max-w-3xl mx-auto z-10">
        <h1 className="text-5xl font-bold mb-2 text-[#1A1A1A]">
          Online Booking System for
        </h1>
        <div className="text-4xl font-bold mb-8">
          <span className="text-[#1A75FF]">
            all service based
            <br />
            industries
          </span>
        </div>
        
        <p className="text-[#4D4D4D] mb-12 text-lg px-4 leading-relaxed">
          Simply define your services and providers, display their availability, and you will have clients
          <br />
          both old and new making bookings 24/7.
        </p>
        
        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button className="py-2.5 px-8 rounded-md font-medium text-sm bg-[#1A75FF] text-white border-none transition-all duration-200 ease-in-out hover:bg-[#0052CC] cursor-pointer">
            Get Started
          </button>
          <button className="py-2.5 px-8 rounded-md font-medium text-sm bg-white text-[#1A75FF] border border-[#1A75FF] transition-all duration-200 ease-in-out hover:bg-[#F5F5F5] cursor-pointer">
            See How It Works
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;