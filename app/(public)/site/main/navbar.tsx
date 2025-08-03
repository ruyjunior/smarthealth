'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import Logo from "@/app/components/ui/logoApp";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={
      `fixed w-full top-0 z-50 transition-all duration-300 
      ${isScrolled ? 'bg-gradient-to-br from-blue-100 to-blue-900 shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center p-4">
        <Logo w={20} h={20} dw={20} dh={20} />

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-6 text-white text-lg font-semibold">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Login</Link>
        </div>

        {/* Botão Menu Mobile */}
        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-[#020d1f] text-white text-lg font-semibold py-4 flex flex-col items-center space-y-4">
          <Link href="/" onClick={toggleMenu}>Home</Link>
          <Link href="/dashboard" onClick={toggleMenu}>Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;