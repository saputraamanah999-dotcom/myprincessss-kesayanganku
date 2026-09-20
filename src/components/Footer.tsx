import React from 'react';
import { Heart, ArrowUp, Stars } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 px-4 sm:px-6 bg-slate-900 text-white relative overflow-hidden border-t border-blue-900/40">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <p className="font-heading text-xl font-bold flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span>Untuk Nia</span>
            <span className="text-blue-400">💙</span>
          </p>
          <p className="font-body text-xs sm:text-sm text-slate-400">
            Dibuat dengan segenap ketulusan rasa cinta dan harapan terbaik.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-medium transition-colors border border-blue-500/20"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
