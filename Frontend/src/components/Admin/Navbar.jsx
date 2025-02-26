import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Base</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">10-06-2025 - 10-10-2025</span>
      </div>
    </nav>
  );
};

export default Navbar;