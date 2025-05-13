import React, { useState } from 'react';
import { Link } from 'wouter';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full gradient-bg">
      <div className="container mx-auto px-4 py-5">
        <nav className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-2xl">
              TranscribeAI
            </Link>
          </div>
          
          <div className={`${!isMenuOpen ? 'hidden' : 'flex flex-col absolute top-16 right-4 bg-primary p-4 rounded-md shadow-lg space-y-4 w-48 z-50'} md:flex md:static md:flex-row md:items-center md:space-x-8 md:bg-transparent md:p-0 md:shadow-none md:w-auto md:space-y-0`}>
            <a href="#features" className="text-white hover:text-gray-200 transition-colors">Features</a>
            <a href="#pricing" className="text-white hover:text-gray-200 transition-colors">Pricing</a>
            <a href="#support" className="text-white hover:text-gray-200 transition-colors">Support</a>
            <a href="#login" className="text-white hover:text-gray-200 transition-colors">Login</a>
            <a href="#signup" className="bg-accent hover:bg-opacity-90 transition-colors text-white py-2 px-4 rounded-md font-medium">Sign Up Free</a>
          </div>
          
          <button onClick={toggleMenu} className="md:hidden text-white text-xl">
            <i className="fas fa-bars"></i>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
