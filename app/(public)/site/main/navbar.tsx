'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import Logo from '@/app/components/ui/logo';

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
    setIsOpen((current) => !current);
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-r from-blue-900/95 to-blue-700/90 shadow-lg backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        <Logo src="/images/logos/logoApp.png" alt="Smart Health" size="md" priority />

        <div className="hidden items-center gap-6 text-lg font-semibold text-white md:flex">
          <Link href="/" className="transition hover:text-blue-200">
            Home
          </Link>
          <Link href="/dashboard" className="transition hover:text-blue-200">
            Login
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none md:hidden"
          aria-label="Abrir menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-sky-950/90 py-4 text-lg font-semibold text-white md:hidden">
          <div className="container mx-auto flex flex-col items-center gap-4">
            <Link href="/" onClick={toggleMenu} className="transition hover:text-blue-200">
              Home
            </Link>
            <Link href="/dashboard" onClick={toggleMenu} className="transition hover:text-blue-200">
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
