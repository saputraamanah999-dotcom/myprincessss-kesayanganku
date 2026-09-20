import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, ChevronDown, Stars } from 'lucide-react';

interface HeroSectionProps {
  onScrollDown: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollDown }) => {
  // Floating graceful SVG flower petals and blossoms (No emojis)
  const floatingFlowers = [
    // Blue Blossom (Sakura/Cherry Blossom in gentle sky blue)
    { type: 'blossom', color: '#38bdf8', accent: '#2563eb', x: '8%', y: '16%', delay: 0, duration: 8.5, size: 36, rotate: 25 },
    // Soft Pink Blossom
    { type: 'blossom', color: '#f472b6', accent: '#db2777', x: '88%', y: '14%', delay: 1.2, duration: 9, size: 40, rotate: -35 },
    // Blue Flower Petal
    { type: 'petal', color: '#60a5fa', accent: '#1d4ed8', x: '12%', y: '72%', delay: 2.5, duration: 7.5, size: 28, rotate: 45 },
    // Pink Rose Petal
    { type: 'petal', color: '#fb7185', accent: '#e11d48', x: '86%', y: '70%', delay: 0.7, duration: 8.5, size: 30, rotate: -20 },
    // Elegant Blue Tulip Blossom
    { type: 'tulip', color: '#0ea5e9', accent: '#0369a1', x: '5%', y: '44%', delay: 3, duration: 9.5, size: 34, rotate: 15 },
    // Graceful Pink Blossom
    { type: 'blossom', color: '#fbcfe8', accent: '#ec4899', x: '78%', y: '44%', delay: 1.8, duration: 7.8, size: 34, rotate: -15 },
    // Falling Blue Petal
    { type: 'petal', color: '#93c5fd', accent: '#3b82f6', x: '62%', y: '10%', delay: 2.1, duration: 8.2, size: 24, rotate: 55 },
    // Falling Pink Petal
    { type: 'petal', color: '#f472b6', accent: '#be185d', x: '35%', y: '12%', delay: 3.5, duration: 7.8, size: 22, rotate: -40 },
  ];

  // Soft glowing starlight points
  const softSparkles = [
    { x: '22%', y: '26%', delay: 0.5 },
    { x: '74%', y: '22%', delay: 1.7 },
    { x: '16%', y: '58%', delay: 2.2 },
    { x: '84%', y: '56%', delay: 1.1 },
    { x: '50%', y: '78%', delay: 2.8 },
  ];

  return (
    <section 
      id="hero-section" 
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-blue-50/70 via-pink-50/40 to-slate-50"
    >
      {/* Soft Ambient Bokeh Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-pink-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 sm:w-[32rem] h-80 sm:h-[32rem] bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Animated SVG Flowers and Petals (NO EMOJIS) */}
      {floatingFlowers.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute pointer-events-none select-none filter drop-shadow-md z-0"
          style={{
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
          }}
          animate={{
            y: [-18, 18, -18],
            x: [-10, 10, -10],
            rotate: [item.rotate - 12, item.rotate + 18, item.rotate - 12],
            opacity: [0.45, 0.88, 0.45],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.type === 'blossom' && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id={`blossomGrad-${idx}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="55%" stopColor={item.color} />
                  <stop offset="100%" stopColor={item.accent} />
                </radialGradient>
              </defs>
              <g>
                <path d="M 50,50 C 40,18 60,18 50,5 Z" fill={`url(#blossomGrad-${idx})`} transform="rotate(0 50 50)" />
                <path d="M 50,50 C 40,18 60,18 50,5 Z" fill={`url(#blossomGrad-${idx})`} transform="rotate(72 50 50)" />
                <path d="M 50,50 C 40,18 60,18 50,5 Z" fill={`url(#blossomGrad-${idx})`} transform="rotate(144 50 50)" />
                <path d="M 50,50 C 40,18 60,18 50,5 Z" fill={`url(#blossomGrad-${idx})`} transform="rotate(216 50 50)" />
                <path d="M 50,50 C 40,18 60,18 50,5 Z" fill={`url(#blossomGrad-${idx})`} transform="rotate(288 50 50)" />
                <circle cx="50" cy="50" r="7.5" fill="#fef08a" />
                <circle cx="50" cy="50" r="3.5" fill="#f59e0b" />
              </g>
            </svg>
          )}

          {item.type === 'petal' && (
            <svg viewBox="0 0 60 80" className="w-full h-full">
              <defs>
                <linearGradient id={`petalGrad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="40%" stopColor={item.color} />
                  <stop offset="100%" stopColor={item.accent} />
                </linearGradient>
              </defs>
              <path
                d="M 30,5 C 55,20 55,60 30,75 C 5,60 5,20 30,5 Z"
                fill={`url(#petalGrad-${idx})`}
              />
              <path
                d="M 30,12 Q 30,45 30,68"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          )}

          {item.type === 'tulip' && (
            <svg viewBox="0 0 60 70" className="w-full h-full">
              <defs>
                <linearGradient id={`tulipGrad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#bae6fd" />
                  <stop offset="50%" stopColor={item.color} />
                  <stop offset="100%" stopColor={item.accent} />
                </linearGradient>
              </defs>
              <path
                d="M 30,10 C 14,24 10,48 30,62 C 50,48 46,24 30,10 Z"
                fill={`url(#tulipGrad-${idx})`}
              />
              <path
                d="M 16,28 C 22,18 28,15 30,32 C 24,45 18,44 16,28 Z"
                fill="#38bdf8"
                opacity="0.85"
              />
              <path
                d="M 44,28 C 38,18 32,15 30,32 C 36,45 42,44 44,28 Z"
                fill="#0284c7"
                opacity="0.85"
              />
            </svg>
          )}
        </motion.div>
      ))}

      {/* Subtle Star Sparkles */}
      {softSparkles.map((sp, idx) => (
        <motion.div
          key={idx}
          className="absolute pointer-events-none w-2 h-2 rounded-full bg-blue-400/50 shadow-[0_0_8px_#38bdf8]"
          style={{ left: sp.x, top: sp.y }}
          animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.25, 0.75, 0.25] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: sp.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Main Content Container */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center pt-8 sm:pt-0">
        {/* Sweet Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-blue-200 shadow-sm shadow-blue-500/10 text-blue-700 text-xs sm:text-sm font-medium mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Sebuah Ruang Khusus Hanya Untukmu</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
        </motion.div>

        {/* Romantic Cursive Subheading */}
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-romantic text-3xl sm:text-5xl md:text-6xl text-blue-600 mb-2 sm:mb-3 drop-shadow-sm"
        >
          Untuk Nia Tersayang...
        </motion.p>

        {/* Elegant Display Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-6"
        >
          Ada Sesuatu Yang Ingin{' '}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-pink-500">
            Kusampaikan
            <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full opacity-60"></span>
          </span>
        </motion.h1>

        {/* Heartfelt Introduction Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="font-body text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-10 px-2"
        >
          Dari sekian banyak warna di dunia, biru kesukaanmu selalu mengingatkanku pada ketenangan yang kurasakan saat bersamamu. 
          Website ini kurangkai khusus untuk mengungkapkan isi hatiku yang paling tulus.
        </motion.p>

        {/* Action Button to Scroll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            id="hero-explore-btn"
            onClick={onScrollDown}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-pink-500 text-white font-medium text-base sm:text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/45 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Buka Pesan Hatiku
              <Heart className="w-5 h-5 text-white fill-white transition-transform group-hover:scale-125" />
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-700 via-sky-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
          </button>
        </motion.div>
      </div>

      {/* Animated Bounce Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer select-none group"
        onClick={onScrollDown}
      >
        <span className="text-xs tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors uppercase font-medium">
          Gulir ke Bawah
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-9 h-9 rounded-full bg-white/90 border border-blue-200/80 shadow-sm flex items-center justify-center text-blue-600 group-hover:border-blue-400 group-hover:shadow-md transition-all"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};
