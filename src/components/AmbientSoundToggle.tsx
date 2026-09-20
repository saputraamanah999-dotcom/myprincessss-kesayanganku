import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, Heart } from 'lucide-react';

export const AmbientSoundToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const notes = [
    261.63, // C4
    329.63, // E4
    392.00, // G4
    493.88, // B4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
  ];

  const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 261.63, 329.63, 392.00], // Fmaj7
    [196.00, 246.94, 293.66, 392.00], // G
  ];

  const playChime = (freq: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 2.3);
  };

  const startMusicLoop = () => {
    let chordIndex = 0;
    let noteInChord = 0;

    const tick = () => {
      if (!isPlayingRef.current) return;

      const currentChord = chords[chordIndex];
      const freq = currentChord[noteInChord];
      // subtle octave variation
      const octaveMultiplier = Math.random() > 0.4 ? 1 : 1.5;
      playChime(freq * octaveMultiplier);

      noteInChord++;
      if (noteInChord >= currentChord.length) {
        noteInChord = 0;
        chordIndex = (chordIndex + 1) % chords.length;
      }

      const nextDelay = 420 + Math.floor(Math.random() * 200);
      timerRef.current = window.setTimeout(tick, nextDelay);
    };

    tick();
  };

  const toggleMusic = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }

    if (isPlaying) {
      isPlayingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      startMusicLoop();
    }
  };

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        id="toggle-ambient-music-btn"
        onClick={toggleMusic}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/85 backdrop-blur-md shadow-lg shadow-blue-500/15 border border-blue-200/80 hover:border-blue-400 hover:bg-white text-blue-900 transition-all duration-300 transform hover:scale-105 active:scale-95 group text-sm font-medium"
        title={isPlaying ? "Jeda Musik Romantis" : "Putar Musik Romantis"}
      >
        <span className="relative flex h-3 w-3 items-center justify-center">
          {isPlaying && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-blue-600' : 'bg-slate-400'}`}></span>
        </span>
        
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
        )}

        <span className="text-xs sm:text-sm font-medium tracking-wide">
          {isPlaying ? "Lagu Romantis Sedang Diputar" : "Sentuh untuk Musik Romantis"}
        </span>

        <Heart className={`w-3.5 h-3.5 ${isPlaying ? 'text-pink-500 fill-pink-500 animate-bounce' : 'text-slate-300'}`} />
      </button>
    </div>
  );
};
