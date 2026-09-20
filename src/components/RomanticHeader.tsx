import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Menu, X } from 'lucide-react';

export const RomanticHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-md shadow-blue-500/5 border-b border-blue-100 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Name */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-sky-400 to-pink-400 p-0.5 shadow-sm">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-blue-600 fill-blue-600 transition-transform group-hover:scale-125" />
            </div>
          </div>
          <span className="font-romantic text-2xl sm:text-3xl text-blue-700 tracking-wide">
            Untuk Nia
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => scrollTo('galeri-foto')}
            className="hover:text-blue-600 transition-colors"
          >
            Galeri Foto
          </button>
          <button
            onClick={() => scrollTo('galaksi-cinta')}
            className="hover:text-blue-600 transition-colors flex items-center gap-1 text-blue-700 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            Galaksi Cinta
          </button>
          <button
            onClick={() => scrollTo('surat-cinta')}
            className="hover:text-blue-600 transition-colors"
          >
            Surat Cinta
          </button>
          <button
            onClick={() => scrollTo('pertanyaan-utama')}
            className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 transition-all text-xs font-semibold uppercase tracking-wider"
          >
            Pertanyaan Utama 💌
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-xl bg-white/80 border border-blue-200 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-blue-100 shadow-xl px-6 py-5 flex flex-col gap-4 text-sm font-medium text-slate-700 animate-fadeIn">
          <button
            onClick={() => scrollTo('galeri-foto')}
            className="text-left py-1 text-slate-700 hover:text-blue-600"
          >
            Galeri Foto
          </button>
          <button
            onClick={() => scrollTo('galaksi-cinta')}
            className="text-left py-1 text-blue-700 font-semibold flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            Galaksi Cinta
          </button>
          <button
            onClick={() => scrollTo('surat-cinta')}
            className="text-left py-1 text-slate-700 hover:text-blue-600"
          >
            Surat Cinta
          </button>
          <button
            onClick={() => scrollTo('pertanyaan-utama')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold text-center shadow-md"
          >
            Buka Pertanyaan Utama 💌
          </button>
        </div>
      )}
    </header>
  );
};
