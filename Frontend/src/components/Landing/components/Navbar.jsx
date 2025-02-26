import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white py-4 px-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0052FF] rounded-full flex items-center justify-center text-white font-bold text-lg">F</div>
          <span className="text-xl font-semibold text-[#1A1A1A]">FlowPay</span>
        </div>

        {/* Navigation links */}
        <div className="hidden md:flex gap-8">
          <a href="#" className="no-underline text-[#4D4D4D] text-sm font-medium transition-colors duration-200 hover:text-[#0052FF]">Enterprise</a>
          <a href="#" className="no-underline text-[#4D4D4D] text-sm font-medium transition-colors duration-200 hover:text-[#0052FF]">Industries</a>
          <a href="#" className="no-underline text-[#4D4D4D] text-sm font-medium transition-colors duration-200 hover:text-[#0052FF]">Features</a>
          <a href="#" className="no-underline text-[#4D4D4D] text-sm font-medium transition-colors duration-200 hover:text-[#0052FF]">Pricing</a>
          <a href="#" className="no-underline text-[#4D4D4D] text-sm font-medium transition-colors duration-200 hover:text-[#0052FF]">Resources</a>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4 sm:gap-2">
          <button className="bg-transparent border-none text-[#0052FF] text-sm font-medium cursor-pointer py-2 px-4 sm:px-3 hover:text-[#003CC5]" onClick={() => window.location.href='/connexion'}>Log in</button>
          <button className="bg-[#0052FF] text-white border-none rounded-md py-2 px-4 sm:px-3 text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-[#003CC5]" onClick={() => window.location.href='/inscription'}>Get Started</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;