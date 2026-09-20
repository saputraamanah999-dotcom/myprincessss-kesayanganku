import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, MessageCircle, PartyPopper, ArrowRight, Smile, CheckCircle2 } from 'lucide-react';

export const ConfessionQuestionSection: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0 });
  const [funnyMessage, setFunnyMessage] = useState('');
  const [yesScale, setYesScale] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const funnyDodgeReplies = [
    "Eits, gak kena! 😜",
    "Tombol ini licin banget lari ke sana kemari! 🏃‍♂️💨",
    "Yakin tega mau mikir dulu? 🥺",
    "Pilihan terbaik ada di tombol 'Ya' loh! 💕",
    "Tombol ini menolak diklik hihi 🙈",
    "Hati bilang iya, masa mau mikir dulu? 💙",
    "Udah jangan mikir-mikir lagi, Nia... ✨",
  ];

  // Trigger grand fireworks and heart confetti blast
  const triggerConfettiExplosion = () => {
    const duration = 4.5 * 1000;
    const animationEnd = Date.now() + duration;

    const defaults = {
      startVelocity: 35,
      spread: 360,
      ticks: 70,
      zIndex: 9999,
      colors: ['#2563eb', '#38bdf8', '#ec4899', '#f472b6', '#ffffff', '#fbbf24'],
    };

    const interval: number = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Fireworks from left and right edges
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.15, y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.85, y: Math.random() - 0.2 },
      });
      // Center star burst
      confetti({
        ...defaults,
        particleCount: 30,
        shapes: ['circle'],
        origin: { x: 0.5, y: 0.5 },
      });
    }, 250);
  };

  const handleYesClick = () => {
    setAccepted(true);
    triggerConfettiExplosion();
  };

  // Playful dodging algorithm
  const handleDodge = () => {
    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);

    // Pick gentle random position within safe mobile bounds
    const maxDistanceX = 45;
    const maxDistanceY = 35;
    const randomX = (Math.random() - 0.5) * maxDistanceX * 2;
    const randomY = (Math.random() - 0.5) * maxDistanceY * 2;

    setDodgeOffset({ x: randomX, y: randomY });
    setFunnyMessage(funnyDodgeReplies[nextCount % funnyDodgeReplies.length]);

    // Keep scale subtle and clean so it never overflows mobile screens
    setYesScale(prev => Math.min(prev + 0.02, 1.08));
  };

  const waNumber = "6285858922037";
  const defaultWaMessage = encodeURIComponent("Hai... aku sudah membaca semua isi websitemu, dan aku menerima kamu 💙✨");
  const waUrl = `https://wa.me/${waNumber}?text=${defaultWaMessage}`;

  return (
    <section 
      id="pertanyaan-utama" 
      ref={containerRef}
      className="py-24 sm:py-36 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-pink-50/50 to-blue-100/70"
    >
      {/* Soft Romantic Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[48rem] h-96 sm:h-[48rem] bg-gradient-to-tr from-blue-300/30 via-pink-300/30 to-sky-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        
        <AnimatePresence mode="wait">
          {!accepted ? (
            /* Question View */
            <motion.div
              key="question-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 shadow-sm border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6">
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-bounce" />
                Pertanyaan Dari Lubuk Hati
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              </div>

              {/* Main Confession Question */}
              <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                Nia, apakah kamu{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-pink-500">
                  menerima aku?
                </span>
              </h2>

              <p className="font-body text-slate-600 text-base sm:text-xl max-w-lg mb-12">
                Aku ingin memulai perjalanan yang indah bersamamu, menjagamu, dan membuatmu tersenyum setiap hari.
              </p>

              {/* Action Buttons Area - Fully Responsive for Mobile & Desktop */}
              <div className="relative w-full max-w-lg mx-auto min-h-[90px] flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-4 px-2">
                
                {/* "YA" Button (Elegantly proportioned, fits iPhone & Android screens cleanly) */}
                <motion.button
                  id="btn-accept-yes"
                  onClick={handleYesClick}
                  style={{ transform: `scale(${yesScale})` }}
                  className="relative z-20 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-pink-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group whitespace-nowrap max-w-[90vw]"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white transition-transform group-hover:scale-110" />
                  <span>Ya, Aku Menerima Kamu</span>
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
                </motion.button>

                {/* "PIKIR DULU" Dodging Button (Playful, responsive & bounded) */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    x: dodgeOffset.x,
                    y: dodgeOffset.y,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <button
                    id="btn-think-first"
                    onMouseEnter={handleDodge}
                    onTouchStart={handleDodge}
                    onClick={handleDodge}
                    className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/95 backdrop-blur-md text-slate-600 border border-slate-300 font-medium text-xs sm:text-sm shadow-sm hover:bg-slate-50 transition-colors select-none cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Pikir Dulu</span>
                    <span className="text-xs sm:text-sm">🤔</span>
                  </button>
                </motion.div>

              </div>

              {/* Funny Toast Feedback when Dodged */}
              {funnyMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 px-4 py-2 rounded-xl bg-pink-100/90 text-pink-700 text-xs sm:text-sm font-medium border border-pink-200 inline-flex items-center gap-2 shadow-sm"
                >
                  <Smile className="w-4 h-4 text-pink-500" />
                  <span>{funnyMessage}</span>
                </motion.div>
              )}

            </motion.div>
          ) : (
            /* Celebration Success View with WhatsApp CTA */
            <motion.div
              key="celebration-view"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-14 shadow-2xl border-2 border-blue-300 shadow-blue-500/20 max-w-xl mx-auto flex flex-col items-center"
            >
              {/* Celebration Icon */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-blue-600 via-sky-400 to-pink-400 p-1 shadow-xl shadow-blue-500/30 mb-6 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <PartyPopper className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-bounce" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Jawaban Diterima Dengan Bahagia
              </div>

              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                Terima Kasih Banyak,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">
                  Nia!
                </span>{' '}
                💙
              </h3>

              <p className="font-body text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                Kamu baru saja membuat hari ini menjadi momen paling membahagiakan dalam hidupku. 
                Janji untuk selalu menjaga dan menyayangimu dengan sepenuh hati.
              </p>

              {/* WHATSAPP CTA BUTTON AS REQUESTED:
                  "Setelah klik "Ya", muncul tombol "Chat aku sekarang 💌" yang redirect ke https://wa.me/6285858922037
                  Desain tombol dengan icon WhatsApp, animasi pulse agar menarik perhatian" */}
              <div className="w-full flex flex-col items-center gap-3">
                <a
                  id="wa-cta-button"
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group w-full sm:w-auto inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg sm:text-xl shadow-xl shadow-[#25D366]/40 hover:shadow-2xl hover:shadow-[#25D366]/60 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 animate-pulse"
                >
                  {/* Glowing Radar Pulse Effect Behind Button */}
                  <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 blur-md transition-opacity -z-10 animate-ping" style={{ animationDuration: '2.5s' }}></span>

                  {/* Official WhatsApp SVG Icon */}
                  <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.934 3.016.934 3.181 0 5.768-2.587 5.768-5.766.001-3.181-2.586-5.768-5.768-5.768zm7.399 5.767c-.001 4.08-3.32 7.4-7.399 7.4-1.258 0-2.483-.323-3.567-.936l-3.964 1.04 1.058-3.864c-.694-1.139-1.06-2.464-1.06-3.821.002-4.081 3.321-7.4 7.4-7.4 4.079 0 7.398 3.319 7.399 7.401zm1.57 0c0-4.945-4.025-8.97-8.97-8.97-4.944 0-8.969 4.025-8.969 8.97 0 1.57.409 3.09 1.189 4.437l-1.261 4.603 4.712-1.236c1.296.711 2.766 1.087 4.279 1.087 4.944 0 8.97-4.025 8.97-8.97z" />
                  </svg>

                  <span>Cinta Sejatimu Ada disini💌</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>

                <span className="text-xs text-slate-400 mt-2">
                  Nomor: +62 858-5892-2037
                </span>

                {/* Re-trigger Confetti Button */}
                <button
                  onClick={triggerConfettiExplosion}
                  className="mt-4 text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Nyalakan Kembang Api Lagi 🎉
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
