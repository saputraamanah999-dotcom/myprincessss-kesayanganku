// @ts-nocheck
/**
 * GalaxyLoveSection.tsx
 *
 * Renders the original standalone Galaxy-love-main codebase (vanilla JS + three.js)
 * inside an <iframe>. This approach preserves all the original interactions,
 * mobile responsiveness, and rendering quality without needing to port the
 * 1700+ lines of imperative three.js code into React/TypeScript.
 *
 * The galaxy files live in /public/galaxy/ and are served as static assets.
 *
 * Music has been intentionally disabled per project requirements.
 */
import React, { useState, useCallback, useRef } from "react";
import { Maximize2, Minimize2, Sparkles } from "lucide-react";

export const GalaxyLoveSection: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  return (
    <section
      id="galaksi-cinta"
      className={`galaxy-section relative transition-all duration-500 overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-black flex flex-col p-0 m-0 w-screen h-screen"
          : "w-full bg-slate-950 py-4 sm:py-8 px-2 sm:px-4"
      }`}
    >
      {/* Section Heading */}
      {!isFullscreen && (
        <div className="text-center mb-4 sm:mb-6 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 text-xs sm:text-sm font-medium tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Galaksi Cinta 3D Interaktif
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white tracking-tight mb-2">
            Sentuh{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-sky-400">
              Planetnya
            </span>{" "}
            untuk Memulai
          </h2>
          <p className="font-body text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Sebuah perjalanan kosmik yang kubuat khusus untukmu. Setiap bintang
            yang berkilau di sini adalah momen yang ingin kubagikan denganmu.
          </p>
        </div>
      )}

      <div
        className={`galaxy-canvas-wrapper relative mx-auto w-full transition-all duration-300 ${
          isFullscreen
            ? "w-full h-full flex-1"
            : "max-w-6xl aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] h-auto min-h-[360px] sm:min-h-[460px] md:min-h-[520px] rounded-2xl sm:rounded-3xl border border-blue-500/20 shadow-2xl shadow-blue-950/60 overflow-hidden bg-black"
        }`}
      >
        <iframe
          ref={iframeRef}
          src="/galaxy/index.html"
          title="Galaxy of Love — 3D Interactive"
          className="absolute inset-0 w-full h-full"
          style={{
            border: "none",
            margin: 0,
            padding: 0,
            display: "block",
            background: "#000",
            touchAction: "none",
          }}
          allow="fullscreen; accelerometer; gyroscope; magnetometer"
          loading="lazy"
        />

        {/* Loading Hint overlay (before intro starts inside iframe) */}
        <div className="galaxy-intro-overlay absolute inset-0 z-10 pointer-events-none flex items-end justify-center pb-6 sm:pb-12 px-4">
          <div className="text-center px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 max-w-[90%]">
            <p className="text-white text-sm sm:text-base font-medium tracking-wide">
              Sentuh planetnya untuk memulai perjalanan ✨
            </p>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Bisa drag untuk memutar galaksi • pinch untuk zoom
            </p>
          </div>
        </div>

        {/* Control Buttons Overlay */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-pink-400" />
            ) : (
              <Maximize2 className="w-4 h-4 text-sky-400" />
            )}
          </button>
        </div>

        {/* Author attribution — original code by Miko */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 pointer-events-none">
          <span className="text-[10px] sm:text-[11px] text-slate-400 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 font-mono">
            Create by Miko
          </span>
        </div>
      </div>
    </section>
  );
};
