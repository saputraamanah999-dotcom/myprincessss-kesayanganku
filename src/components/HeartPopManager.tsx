import React, { useEffect, useState } from 'react';

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  driftX: number;
  text?: string;
}

const SWEET_WHISPERS = [
  "Deg-degan... 💓",
  "Salting nih 😍",
  "Nia manis banget 🥰",
  "Senyummu candu ✨",
  "Hatiku buat kamu 💙",
  "Cantik pol! 🌸",
  "Bikin senyum-senyum terus ihh🤍",
];

const HEART_COLORS = [
  "#f43f5e", // Rose
  "#ec4899", // Pink
  "#38bdf8", // Sky Blue
  "#a855f7", // Purple
  "#fb7185", // Coral
  "#60a5fa", // Blue
];

// Audio Context for sweet chime
let audioCtx: AudioContext | null = null;

function playSweetPopSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Gentle melodic notes (E5 to A5)
    const notes = [659.25, 783.99, 880.0, 1046.5];
    const freq = notes[Math.floor(Math.random() * notes.length)];

    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch {
    // Graceful fallback if autoplay policy restricts
  }
}

export const triggerHeartHapticAndPop = (e?: React.MouseEvent | MouseEvent, customX?: number, customY?: number) => {
  // 1. Haptic Vibration feedback
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([18, 30, 25]);
    } catch {
      // Ignored
    }
  }

  // 2. Sweet soft chime
  playSweetPopSound();

  // 3. Dispatch custom event for visual floating particles
  const x = customX ?? (e ? e.clientX : window.innerWidth / 2);
  const y = customY ?? (e ? e.clientY : window.innerHeight / 2);

  window.dispatchEvent(
    new CustomEvent('nia-heart-pop', {
      detail: { x, y }
    })
  );
};

export const HeartPopManager: React.FC = () => {
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  useEffect(() => {
    // Global listener for custom pop events
    const handlePopEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      const { x, y } = customEvent.detail || { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      const batchId = Date.now();
      const newItems: FloatingParticle[] = [];

      // Generate 4-5 mini floating heart sparks
      const count = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        newItems.push({
          id: batchId + i + Math.random(),
          x: x + (Math.random() * 28 - 14),
          y: y + (Math.random() * 20 - 10),
          color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
          size: 14 + Math.floor(Math.random() * 12),
          rotation: (Math.random() * 40 - 20),
          driftX: (Math.random() * 60 - 30),
        });
      }

      // Add a sweet whisper message on click
      if (Math.random() > 0.3) {
        newItems.push({
          id: batchId + 999 + Math.random(),
          x: x,
          y: y - 24,
          color: '#ec4899',
          size: 13,
          rotation: 0,
          driftX: 0,
          text: SWEET_WHISPERS[Math.floor(Math.random() * SWEET_WHISPERS.length)],
        });
      }

      setParticles(prev => [...prev.slice(-30), ...newItems]);

      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newItems.some(n => n.id === p.id)));
      }, 1500);
    };

    window.addEventListener('nia-heart-pop', handlePopEvent);

    // Document-level delegated click listener for any heart element
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const heartEl = target.closest(
        '[data-heart], .lucide-heart, button[title*="hati" i], button[aria-label*="hati" i], .heart-pop-trigger'
      ) as HTMLElement | null;

      if (heartEl) {
        // Trigger Pop animation on the element itself
        heartEl.classList.remove('animate-heart-pop');
        // Force reflow
        void heartEl.offsetWidth;
        heartEl.classList.add('animate-heart-pop');

        triggerHeartHapticAndPop(e);
      }
    };

    document.addEventListener('click', handleDocumentClick, { passive: true });

    return () => {
      window.removeEventListener('nia-heart-pop', handlePopEvent);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <style>{`
        @keyframes heartPopScale {
          0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(244,63,94,0)); }
          30% { transform: scale(1.45) rotate(-6deg); filter: drop-shadow(0 0 10px rgba(244,63,94,0.7)); }
          55% { transform: scale(0.92) rotate(4deg); }
          75% { transform: scale(1.12) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-heart-pop {
          animation: heartPopScale 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
          transition: color 0.2s ease, fill 0.2s ease;
        }
        @keyframes burstDrift {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.6) rotate(0deg);
          }
          50% {
            opacity: 0.95;
            transform: translate(var(--drift-x), -35px) scale(1.15) rotate(var(--rot));
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--drift-x) * 1.4), -70px) scale(0.7) rotate(calc(var(--rot) * 1.5));
          }
        }
        @keyframes whisperFade {
          0% {
            opacity: 0;
            transform: translate(-50%, 0) scale(0.85);
          }
          25% {
            opacity: 1;
            transform: translate(-50%, -15px) scale(1.04);
          }
          80% {
            opacity: 0.9;
            transform: translate(-50%, -35px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -48px) scale(0.9);
          }
        }
      `}</style>

      {particles.map(p => {
        if (p.text) {
          return (
            <div
              key={p.id}
              className="absolute font-body font-semibold text-xs tracking-wide px-2.5 py-1 rounded-full bg-white/95 text-pink-600 shadow-lg border border-pink-200/80 backdrop-blur-sm whitespace-nowrap select-none pointer-events-none"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                animation: 'whisperFade 1.4s ease-out forwards',
              }}
            >
              {p.text}
            </div>
          );
        }

        return (
          <div
            key={p.id}
            className="absolute select-none pointer-events-none"
            style={
              {
                left: `${p.x}px`,
                top: `${p.y}px`,
                '--drift-x': `${p.driftX}px`,
                '--rot': `${p.rotation}deg`,
                animation: 'burstDrift 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
              } as React.CSSProperties
            }
          >
            <svg
              viewBox="0 0 24 24"
              width={p.size}
              height={p.size}
              fill={p.color}
              stroke="#ffffff"
              strokeWidth="1.2"
              className="drop-shadow-sm"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

// Convenient wrapper component for any Heart icon or button
export const HeartPop: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ children, className = '', onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    triggerHeartHapticAndPop(e);
    if (onClick) onClick(e);
  };

  return (
    <span
      data-heart="true"
      onClick={handleClick}
      className={`inline-flex items-center justify-center cursor-pointer transition-transform select-none heart-pop-trigger ${className}`}
    >
      {children}
    </span>
  );
};
