import React, { useState } from 'react';
import { triggerHeartHapticAndPop } from './HeartPopManager.tsx';

interface NiaBloomingGardenSvgProps {
  className?: string;
}

export const NiaBloomingGardenSvg: React.FC<NiaBloomingGardenSvgProps> = ({ className = '' }) => {
  const [clickHearts, setClickHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800;
    const y = ((e.clientY - rect.top) / rect.height) * 600;

    const newHeart = { id: Date.now() + Math.random(), x, y };
    setClickHearts(prev => [...prev.slice(-12), newHeart]);

    // Also trigger haptic & sound
    triggerHeartHapticAndPop(e, e.clientX, e.clientY);

    setTimeout(() => {
      setClickHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1800);
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto select-none ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        width="800"
        height="600"
        role="img"
        aria-label="Bunga untuk Nia Sayaanggku"
        onClick={handleSvgClick}
        className="w-full h-auto cursor-pointer drop-shadow-md"
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          background: '#ffe9f2',
          borderRadius: '28px',
        }}
      >
        <title>Nia Sayaanggku - Bunga Cinta</title>
        <desc>
          Bunga mekar yang bergoyang smooth dan lembut bersama kupu-kupu terbang anggun serta pelangi warna-warni untuk Nia Sayaanggku
        </desc>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Quicksand:wght@500;700&display=swap');
          .sway-main { animation: sway 6s ease-in-out infinite; transform-box: view-box; transform-origin: 400px 535px; }
          .sway-left { animation: swaySide 7.4s ease-in-out infinite; transform-box: view-box; transform-origin: 260px 533px; animation-delay: -2.4s; }
          .sway-right { animation: swaySide 6.6s ease-in-out infinite; transform-box: view-box; transform-origin: 545px 533px; animation-delay: -3.8s; }
          @keyframes sway { 0%, 100% { transform: rotate(-2.4deg); } 50% { transform: rotate(2.4deg); } }
          @keyframes swaySide { 0%, 100% { transform: rotate(-3.2deg); } 50% { transform: rotate(3.2deg); } }
          .head-breathe { animation: breathe 4.2s ease-in-out infinite; transform-box: view-box; transform-origin: 400px 195px; }
          @keyframes breathe { 0%, 100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.045) rotate(1.3deg); } }
          .mini-breathe { animation: breathe2 4.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
          @keyframes breathe2 { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
          .wing-left { transform-box: fill-box; transform-origin: 96% 50%; animation: flapL .5s ease-in-out infinite alternate; }
          .wing-right { transform-box: fill-box; transform-origin: 4% 50%; animation: flapR .5s ease-in-out infinite alternate; }
          .bf2 .wing-left, .bf2 .wing-right { animation-duration: .42s; }
          .bf3 .wing-left, .bf3 .wing-right { animation-duration: .36s; }
          @keyframes flapL { from { transform: perspective(260px) rotateY(16deg) scaleX(1); } to { transform: perspective(260px) rotateY(-74deg) scaleX(.3); } }
          @keyframes flapR { from { transform: perspective(260px) rotateY(-16deg) scaleX(1); } to { transform: perspective(260px) rotateY(74deg) scaleX(.3); } }
          .bob1 { transform-box: fill-box; transform-origin: center; animation: bob1 2.4s ease-in-out infinite; }
          @keyframes bob1 { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-10px) rotate(4deg); } }
          .bob2 { transform-box: fill-box; transform-origin: center; animation: bob2 2s ease-in-out infinite; }
          @keyframes bob2 { 0%, 100% { transform: translateY(0) rotate(4deg); } 50% { transform: translateY(-9px) rotate(-4deg); } }
          .bob3 { transform-box: fill-box; transform-origin: center; animation: bob1 1.9s ease-in-out infinite; }
          .rb { animation: rbShimmer 3.6s ease-in-out infinite; }
          .rb1 { animation-delay: 0s; } .rb2 { animation-delay: -.6s; } .rb3 { animation-delay: -1.2s; }
          .rb4 { animation-delay: -1.8s; } .rb5 { animation-delay: -2.4s; } .rb6 { animation-delay: -3s; }
          @keyframes rbShimmer { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
          .text-float { animation: textFloat 4.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
          @keyframes textFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
          .sparkle { animation: twinkle 2.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
          .sparkle.d2 { animation-delay: -.7s; } .sparkle.d3 { animation-delay: -1.4s; } .sparkle.d4 { animation-delay: -1.9s; } .sparkle.d5 { animation-delay: -.4s; }
          .sparkle.d6 { animation-delay: -1.1s; } .sparkle.d7 { animation-delay: -2.2s; } .sparkle.d8 { animation-delay: -1.7s; }
          @keyframes twinkle { 0%, 100% { opacity: .15; transform: scale(.5) rotate(0deg); } 50% { opacity: 1; transform: scale(1.18) rotate(28deg); } }
          .cloud { animation: drift 16s ease-in-out infinite alternate; }
          .cloud2 { animation: drift 22s ease-in-out infinite alternate-reverse; }
          @keyframes drift { from { transform: translateX(-22px); } to { transform: translateX(22px); } }
          .pulse { animation: pulse 2.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
          @keyframes pulse { 0%, 100% { opacity: .65; transform: scale(1); } 50% { opacity: 1; transform: scale(1.14); } }
          .leaf-sway { animation: leafWave 4.4s ease-in-out infinite; transform-box: fill-box; transform-origin: 0% 50%; }
          @keyframes leafWave { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2.6deg); } }
        `}</style>

        <defs>
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#aedcff" />
            <stop offset="28%" stopColor="#d8ecff" />
            <stop offset="54%" stopColor="#ffd9e8" />
            <stop offset="78%" stopColor="#fff0e6" />
            <stop offset="100%" stopColor="#fff9e8" />
          </linearGradient>

          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".95" />
            <stop offset="40%" stopColor="#fff6c8" stopOpacity=".7" />
            <stop offset="100%" stopColor="#fff6c8" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="vignette" cx="50%" cy="45%" r="75%">
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ff8fb5" stopOpacity=".18" />
          </radialGradient>

          <linearGradient id="groundGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8be0a1" />
            <stop offset="35%" stopColor="#4fc06f" />
            <stop offset="100%" stopColor="#1d7a3c" />
          </linearGradient>

          <linearGradient id="stemGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2ecc71" />
            <stop offset="50%" stopColor="#1a8a4a" />
            <stop offset="100%" stopColor="#0f5a2d" />
          </linearGradient>

          <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7bf09a" />
            <stop offset="50%" stopColor="#2fb95a" />
            <stop offset="100%" stopColor="#14652f" />
          </linearGradient>

          <linearGradient id="petalOuter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffc9da" />
            <stop offset="45%" stopColor="#ff8fb1" />
            <stop offset="100%" stopColor="#ff4d8a" />
          </linearGradient>

          <linearGradient id="petalInner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff5f9" />
            <stop offset="40%" stopColor="#ffb3cd" />
            <stop offset="100%" stopColor="#ff6a9e" />
          </linearGradient>

          <linearGradient id="petalLeft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#efe6ff" />
            <stop offset="100%" stopColor="#9a7bff" />
          </linearGradient>

          <linearGradient id="petalRight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff0d8" />
            <stop offset="100%" stopColor="#ff9a6a" />
          </linearGradient>

          <radialGradient id="centerGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fff9a0" />
            <stop offset="30%" stopColor="#ffe93a" />
            <stop offset="60%" stopColor="#ffb700" />
            <stop offset="100%" stopColor="#ff7b00" />
          </radialGradient>

          <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff3d7f" />
            <stop offset="50%" stopColor="#d81b60" />
            <stop offset="100%" stopColor="#9b30ff" />
          </linearGradient>

          <linearGradient id="wingOrange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd166" />
            <stop offset="45%" stopColor="#ff7b1c" />
            <stop offset="100%" stopColor="#ff2e7f" />
          </linearGradient>

          <linearGradient id="wingBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8f1ff" />
            <stop offset="45%" stopColor="#6a8cff" />
            <stop offset="100%" stopColor="#c86bff" />
          </linearGradient>

          <linearGradient id="wingYellow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffcc2" />
            <stop offset="55%" stopColor="#ffd93a" />
            <stop offset="100%" stopColor="#ff9d3a" />
          </linearGradient>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
            <feFlood floodColor="#ffffff" floodOpacity=".9" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="textGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#ffffff" floodOpacity="1" />
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#ff4d8a" floodOpacity=".55" />
          </filter>

          <filter id="flowerShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#5a0a2a" floodOpacity=".28" />
          </filter>

          <filter id="bfGlow" x="-45%" y="-45%" width="190%" height="190%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#3a1050" floodOpacity=".3" />
          </filter>
        </defs>

        {/* Sky Background */}
        <rect x="0" y="0" width="800" height="600" rx="28" fill="url(#skyGradient)" />

        {/* Sun Glow */}
        <circle cx="650" cy="105" r="95" fill="url(#sunGlow)" />
        <circle cx="650" cy="105" r="42" fill="#fffbe0" opacity=".95" />

        {/* Clouds */}
        <g className="cloud" opacity=".85">
          <ellipse cx="180" cy="135" rx="62" ry="22" fill="white" opacity=".9" />
          <ellipse cx="220" cy="125" rx="48" ry="20" fill="white" opacity=".9" />
          <ellipse cx="145" cy="125" rx="36" ry="16" fill="white" opacity=".85" />
        </g>
        <g className="cloud2" opacity=".8">
          <ellipse cx="540" cy="75" rx="55" ry="18" fill="white" opacity=".85" />
          <ellipse cx="580" cy="68" rx="38" ry="15" fill="white" />
        </g>

        {/* Birds Flying */}
        <g stroke="#6b5a6b" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".6">
          <path d="M108,250 Q116,242 124,250 Q132,242 140,250" />
          <path d="M150,232 Q156,226 162,232 Q168,226 174,232" />
        </g>

        {/* Ambient Bokeh */}
        <g opacity=".35">
          <circle cx="120" cy="200" r="18" fill="white" />
          <circle cx="700" cy="200" r="14" fill="white" />
          <circle cx="620" cy="380" r="22" fill="#ffcade" />
          <circle cx="110" cy="430" r="16" fill="#ffcade" />
          <circle cx="400" cy="140" r="10" fill="white" />
        </g>

        {/* Shimmering Rainbow */}
        <path d="M94,505 A306,306 0 0 1 706,505" stroke="#ffffff" strokeWidth="70" fill="none" strokeLinecap="round" opacity=".14" />
        <path className="rb rb1" d="M66,505 A334,334 0 0 1 734,505" stroke="#ff5a76" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path className="rb rb2" d="M77,505 A323,323 0 0 1 723,505" stroke="#ff9e42" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path className="rb rb3" d="M88,505 A312,312 0 0 1 712,505" stroke="#ffd93a" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path className="rb rb4" d="M99,505 A301,301 0 0 1 701,505" stroke="#5fd068" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path className="rb rb5" d="M110,505 A290,290 0 0 1 690,505" stroke="#4fa8ff" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path className="rb rb6" d="M121,505 A279,279 0 0 1 679,505" stroke="#b06bff" strokeWidth="12" fill="none" strokeLinecap="round" />

        {/* Glowing Rainbow Sparks Traveling along Arch */}
        <g filter="url(#softGlow)">
          <circle r="6" fill="#ff5a76" opacity=".9">
            <animateMotion dur="7s" repeatCount="indefinite" path="M66,505 A334,334 0 0 1 734,505" />
            <animate attributeName="opacity" values="1;.55;1" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle r="5" fill="#ffd93a" opacity=".9">
            <animateMotion dur="7s" begin="-1.75s" repeatCount="indefinite" path="M88,505 A312,312 0 0 1 712,505" />
            <animate attributeName="opacity" values="1;.55;1" dur="1.5s" begin="-.5s" repeatCount="indefinite" />
          </circle>
          <circle r="5" fill="#4fa8ff" opacity=".9">
            <animateMotion dur="7s" begin="-3.5s" repeatCount="indefinite" path="M110,505 A290,290 0 0 1 690,505" />
            <animate attributeName="opacity" values="1;.55;1" dur="1.7s" begin="-1s" repeatCount="indefinite" />
          </circle>
          <circle r="3.5" fill="#b06bff" opacity=".9">
            <animateMotion dur="7s" begin="-5.25s" repeatCount="indefinite" path="M121,505 A279,279 0 0 1 679,505" />
            <animate attributeName="opacity" values="1;.55;1" dur="1.4s" begin="-.8s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Meadow Ground */}
        <ellipse cx="160" cy="492" rx="190" ry="58" fill="#b8e6c3" opacity=".6" />
        <ellipse cx="640" cy="495" rx="200" ry="60" fill="#b8e6c3" opacity=".55" />
        <path d="M0,502 Q200,472 400,492 T800,502 L800,600 L0,600 Z" fill="url(#groundGradient)" />
        <ellipse cx="400" cy="548" rx="320" ry="38" fill="#0a4a22" opacity=".22" />
        <g opacity=".5">
          <ellipse cx="180" cy="540" rx="48" ry="10" fill="#1d7a3c" />
          <ellipse cx="620" cy="545" rx="55" ry="11" fill="#1d7a3c" />
          <ellipse cx="400" cy="560" rx="70" ry="12" fill="#145c2c" />
        </g>

        {/* Left Lavender Flower (Sway Left) */}
        <g className="sway-left">
          <path d="M260,532 C255,470 252,400 265,335" stroke="url(#stemGradient)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M258,470 C220,462 190,442 176,412 C212,408 246,426 258,470 Z" fill="url(#leafGradient)" stroke="#14652f" strokeWidth="1.5" />
          <path d="M258,445 C272,420 300,405 328,402 C320,428 295,445 258,445 Z" fill="url(#leafGradient)" stroke="#14652f" strokeWidth="1.5" opacity=".9" />
          <g transform="translate(265,312)">
            <g className="mini-breathe" filter="url(#flowerShadow)">
              <ellipse cx="0" cy="-48" rx="20" ry="44" fill="url(#petalLeft)" stroke="#7a5cff" strokeWidth="1.5" />
              <ellipse cx="0" cy="-48" rx="20" ry="44" fill="url(#petalLeft)" stroke="#7a5cff" strokeWidth="1.5" transform="rotate(36)" />
              <ellipse cx="0" cy="-48" rx="20" ry="44" fill="url(#petalLeft)" stroke="#7a5cff" strokeWidth="1.5" transform="rotate(72)" />
              <ellipse cx="0" cy="-48" rx="20" ry="44" fill="url(#petalLeft)" stroke="#7a5cff" strokeWidth="1.5" transform="rotate(108)" />
              <ellipse cx="0" cy="-48" rx="20" ry="44" fill="url(#petalLeft)" stroke="#7a5cff" strokeWidth="1.5" transform="rotate(144)" />
              <ellipse cx="0" cy="-48" rx="20" ry="44" fill="url(#petalLeft)" stroke="#7a5cff" strokeWidth="1.5" transform="rotate(180)" />
              <ellipse cx="0" cy="-48" rx="20" ry="44" fill="url(#petalLeft)" stroke="#7a5cff" strokeWidth="1.5" transform="rotate(216)" />
              <ellipse cx="0" cy="-48" rx="20" ry="44" fill="url(#petalLeft)" stroke="#7a5cff" strokeWidth="1.5" transform="rotate(252)" />
              <ellipse cx="0" cy="-48" rx="20" ry="44" fill="url(#petalLeft)" stroke="#7a5cff" strokeWidth="1.5" transform="rotate(288)" />
              <ellipse cx="0" cy="-48" rx="20" ry="44" fill="url(#petalLeft)" stroke="#7a5cff" strokeWidth="1.5" transform="rotate(324)" />
              <circle r="20" fill="url(#centerGrad)" stroke="#e67e00" strokeWidth="2" />
              <circle cx="0" cy="-8" r="4" fill="#fff36b" stroke="#ff7b00" strokeWidth=".8" />
              <circle cx="7" cy="-3" r="4" fill="#fff36b" stroke="#ff7b00" strokeWidth=".8" />
              <circle cx="5" cy="6" r="4" fill="#fff36b" stroke="#ff7b00" strokeWidth=".8" />
              <circle cx="-5" cy="6" r="4" fill="#fff36b" stroke="#ff7b00" strokeWidth=".8" />
              <circle cx="-7" cy="-3" r="4" fill="#fff36b" stroke="#ff7b00" strokeWidth=".8" />
            </g>
          </g>
        </g>

        {/* Right Warm Peach Flower (Sway Right) */}
        <g className="sway-right">
          <path d="M545,532 C550,470 552,395 540,330" stroke="url(#stemGradient)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M547,465 C585,457 615,437 629,407 C593,403 559,421 547,465 Z" fill="url(#leafGradient)" stroke="#14652f" strokeWidth="1.5" />
          <g transform="translate(540,308)">
            <g className="mini-breathe" filter="url(#flowerShadow)">
              <ellipse cx="0" cy="-46" rx="19" ry="42" fill="url(#petalRight)" stroke="#e67e3a" strokeWidth="1.5" />
              <ellipse cx="0" cy="-46" rx="19" ry="42" fill="url(#petalRight)" stroke="#e67e3a" strokeWidth="1.5" transform="rotate(40)" />
              <ellipse cx="0" cy="-46" rx="19" ry="42" fill="url(#petalRight)" stroke="#e67e3a" strokeWidth="1.5" transform="rotate(80)" />
              <ellipse cx="0" cy="-46" rx="19" ry="42" fill="url(#petalRight)" stroke="#e67e3a" strokeWidth="1.5" transform="rotate(120)" />
              <ellipse cx="0" cy="-46" rx="19" ry="42" fill="url(#petalRight)" stroke="#e67e3a" strokeWidth="1.5" transform="rotate(160)" />
              <ellipse cx="0" cy="-46" rx="19" ry="42" fill="url(#petalRight)" stroke="#e67e3a" strokeWidth="1.5" transform="rotate(200)" />
              <ellipse cx="0" cy="-46" rx="19" ry="42" fill="url(#petalRight)" stroke="#e67e3a" strokeWidth="1.5" transform="rotate(240)" />
              <ellipse cx="0" cy="-46" rx="19" ry="42" fill="url(#petalRight)" stroke="#e67e3a" strokeWidth="1.5" transform="rotate(280)" />
              <ellipse cx="0" cy="-46" rx="19" ry="42" fill="url(#petalRight)" stroke="#e67e3a" strokeWidth="1.5" transform="rotate(320)" />
              <circle r="19" fill="url(#centerGrad)" stroke="#e67e00" strokeWidth="2" />
              <circle cx="0" cy="-7" r="3.8" fill="#fff36b" stroke="#ff7b00" strokeWidth=".8" />
              <circle cx="6" cy="0" r="3.8" fill="#fff36b" stroke="#ff7b00" strokeWidth=".8" />
              <circle cx="0" cy="7" r="3.8" fill="#fff36b" stroke="#ff7b00" strokeWidth=".8" />
              <circle cx="-6" cy="0" r="3.8" fill="#fff36b" stroke="#ff7b00" strokeWidth=".8" />
            </g>
          </g>
        </g>

        {/* Center Main Majestic Blooming Flower */}
        <g className="sway-main">
          <path d="M400,535 C395,450 405,350 400,255" stroke="url(#stemGradient)" strokeWidth="12" fill="none" strokeLinecap="round" />
          <g className="leaf-sway">
            <path d="M398,452 C340,442 290,412 270,362 C330,357 385,392 398,452 Z" fill="url(#leafGradient)" stroke="#14652f" strokeWidth="2" />
            <path d="M395,445 C355,425 320,400 295,372" stroke="#eafff0" strokeWidth="2" opacity=".6" fill="none" />
          </g>
          <g className="leaf-sway" style={{ animationDelay: '-2s', transformOrigin: '100% 50%' }}>
            <path d="M402,420 C460,410 510,380 530,330 C470,325 415,360 402,420 Z" fill="url(#leafGradient)" stroke="#14652f" strokeWidth="2" />
            <path d="M405,413 C445,395 475,375 500,350" stroke="#eafff0" strokeWidth="2" opacity=".6" fill="none" />
          </g>
          <ellipse cx="400" cy="248" rx="58" ry="18" fill="#5a0a2a" opacity=".18" />

          {/* Blooming Head Petals with Breathing scale */}
          <g className="head-breathe" filter="url(#flowerShadow)">
            <path d="M400,200 C375,170 360,130 365,85 C367,65 375,50 400,42 C425,50 433,65 435,85 C440,130 425,170 400,200 Z" fill="url(#petalOuter)" stroke="#e7447d" strokeWidth="2" strokeLinejoin="round" />
            <path d="M400,200 C375,170 360,130 365,85 C367,65 375,50 400,42 C425,50 433,65 435,85 C440,130 425,170 400,200 Z" fill="url(#petalOuter)" stroke="#e7447d" strokeWidth="2" strokeLinejoin="round" transform="rotate(45 400 200)" />
            <path d="M400,200 C375,170 360,130 365,85 C367,65 375,50 400,42 C425,50 433,65 435,85 C440,130 425,170 400,200 Z" fill="url(#petalOuter)" stroke="#e7447d" strokeWidth="2" strokeLinejoin="round" transform="rotate(90 400 200)" />
            <path d="M400,200 C375,170 360,130 365,85 C367,65 375,50 400,42 C425,50 433,65 435,85 C440,130 425,170 400,200 Z" fill="url(#petalOuter)" stroke="#e7447d" strokeWidth="2" strokeLinejoin="round" transform="rotate(135 400 200)" />
            <path d="M400,200 C375,170 360,130 365,85 C367,65 375,50 400,42 C425,50 433,65 435,85 C440,130 425,170 400,200 Z" fill="url(#petalOuter)" stroke="#e7447d" strokeWidth="2" strokeLinejoin="round" transform="rotate(180 400 200)" />
            <path d="M400,200 C375,170 360,130 365,85 C367,65 375,50 400,42 C425,50 433,65 435,85 C440,130 425,170 400,200 Z" fill="url(#petalOuter)" stroke="#e7447d" strokeWidth="2" strokeLinejoin="round" transform="rotate(225 400 200)" />
            <path d="M400,200 C375,170 360,130 365,85 C367,65 375,50 400,42 C425,50 433,65 435,85 C440,130 425,170 400,200 Z" fill="url(#petalOuter)" stroke="#e7447d" strokeWidth="2" strokeLinejoin="round" transform="rotate(270 400 200)" />
            <path d="M400,200 C375,170 360,130 365,85 C367,65 375,50 400,42 C425,50 433,65 435,85 C440,130 425,170 400,200 Z" fill="url(#petalOuter)" stroke="#e7447d" strokeWidth="2" strokeLinejoin="round" transform="rotate(315 400 200)" />

            <g stroke="white" strokeWidth="2.5" opacity=".5" strokeLinecap="round" fill="none">
              <path d="M400,185 L400,68" />
              <path d="M400,185 L400,68" transform="rotate(45 400 200)" />
              <path d="M400,185 L400,68" transform="rotate(90 400 200)" />
              <path d="M400,185 L400,68" transform="rotate(135 400 200)" />
              <path d="M400,185 L400,68" transform="rotate(180 400 200)" />
              <path d="M400,185 L400,68" transform="rotate(225 400 200)" />
              <path d="M400,185 L400,68" transform="rotate(270 400 200)" />
              <path d="M400,185 L400,68" transform="rotate(315 400 200)" />
            </g>

            {/* Inner layered petals */}
            <path d="M400,200 C388,182 380,160 382,135 C383,118 390,105 400,100 C410,105 417,118 418,135 C420,160 412,182 400,200 Z" fill="url(#petalInner)" stroke="#ff5a95" strokeWidth="1.5" transform="rotate(22.5 400 200)" />
            <path d="M400,200 C388,182 380,160 382,135 C383,118 390,105 400,100 C410,105 417,118 418,135 C420,160 412,182 400,200 Z" fill="url(#petalInner)" stroke="#ff5a95" strokeWidth="1.5" transform="rotate(67.5 400 200)" />
            <path d="M400,200 C388,182 380,160 382,135 C383,118 390,105 400,100 C410,105 417,118 418,135 C420,160 412,182 400,200 Z" fill="url(#petalInner)" stroke="#ff5a95" strokeWidth="1.5" transform="rotate(112.5 400 200)" />
            <path d="M400,200 C388,182 380,160 382,135 C383,118 390,105 400,100 C410,105 417,118 418,135 C420,160 412,182 400,200 Z" fill="url(#petalInner)" stroke="#ff5a95" strokeWidth="1.5" transform="rotate(157.5 400 200)" />
            <path d="M400,200 C388,182 380,160 382,135 C383,118 390,105 400,100 C410,105 417,118 418,135 C420,160 412,182 400,200 Z" fill="url(#petalInner)" stroke="#ff5a95" strokeWidth="1.5" transform="rotate(202.5 400 200)" />
            <path d="M400,200 C388,182 380,160 382,135 C383,118 390,105 400,100 C410,105 417,118 418,135 C420,160 412,182 400,200 Z" fill="url(#petalInner)" stroke="#ff5a95" strokeWidth="1.5" transform="rotate(247.5 400 200)" />
            <path d="M400,200 C388,182 380,160 382,135 C383,118 390,105 400,100 C410,105 417,118 418,135 C420,160 412,182 400,200 Z" fill="url(#petalInner)" stroke="#ff5a95" strokeWidth="1.5" transform="rotate(292.5 400 200)" />
            <path d="M400,200 C388,182 380,160 382,135 C383,118 390,105 400,100 C410,105 417,118 418,135 C420,160 412,182 400,200 Z" fill="url(#petalInner)" stroke="#ff5a95" strokeWidth="1.5" transform="rotate(337.5 400 200)" />

            {/* Glowing Golden Core */}
            <circle cx="400" cy="195" r="34" fill="#7a1f2a" opacity=".25" />
            <circle className="pulse" cx="400" cy="193" r="30" fill="url(#centerGrad)" stroke="#e67e00" strokeWidth="2.5" />
            <g fill="#fff36b" stroke="#ff7b00" strokeWidth="1">
              <circle cx="400" cy="173" r="5" />
              <circle cx="410" cy="175.5" r="5" />
              <circle cx="418" cy="183" r="5" />
              <circle cx="420" cy="193" r="5" />
              <circle cx="418" cy="203" r="5" />
              <circle cx="410" cy="210.5" r="5" />
              <circle cx="400" cy="213" r="5" />
              <circle cx="390" cy="210.5" r="5" />
              <circle cx="382" cy="203" r="5" />
              <circle cx="380" cy="193" r="5" />
              <circle cx="382" cy="183" r="5" />
              <circle cx="390" cy="175.5" r="5" />
            </g>
            <ellipse cx="390" cy="183" rx="10" ry="6" fill="white" opacity=".65" />
          </g>
        </g>

        {/* Lawn Grass Tufts */}
        <g fill="#2a9d4a" opacity=".95">
          <path d="M315,560 Q320,535 332,525 Q328,543 336,560 Z" />
          <path d="M335,562 Q345,534 358,528 Q353,545 360,562 Z" />
          <path d="M450,562 Q460,535 473,528 Q468,545 474,562 Z" />
          <path d="M470,560 Q478,538 492,532 Q486,548 492,560 Z" />
          <path d="M210,555 Q218,535 230,530 Q226,544 232,556 Z" />
          <path d="M580,555 Q588,535 600,530 Q596,544 602,556 Z" />
        </g>

        {/* Falling Petals Motion */}
        <g opacity=".9">
          <animateMotion dur="7s" repeatCount="indefinite" path="M400,220 C370,300 430,350 390,450 C375,485 360,515 365,545" />
          <ellipse rx="12" ry="8" fill="#ffb3cd" stroke="#ff6a9e" strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3.5s" repeatCount="indefinite" />
          </ellipse>
        </g>
        <g opacity=".85">
          <animateMotion dur="8.5s" begin="-3s" repeatCount="indefinite" path="M400,200 C440,280 380,340 420,460 C430,490 445,520 440,545" />
          <ellipse rx="10" ry="7" fill="#ffd0e2" stroke="#ff6a9e" strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="4s" repeatCount="indefinite" />
          </ellipse>
        </g>
        <g opacity=".8">
          <animateMotion dur="6.5s" begin="-1.2s" repeatCount="indefinite" path="M265,315 C240,370 280,420 250,500" />
          <ellipse rx="9" ry="6.5" fill="#d8c8ff" stroke="#9a7bff" strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          </ellipse>
        </g>
        <g opacity=".8">
          <animateMotion dur="7.8s" begin="-2s" repeatCount="indefinite" path="M545,305 C570,370 530,420 560,500" />
          <ellipse rx="9" ry="6.5" fill="#ffe0b8" stroke="#ff9a6a" strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="3.2s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Floating Hearts Rising Upward */}
        <g transform="translate(345,400)">
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0; 18 -80; -8 -160" dur="6s" repeatCount="indefinite" />
            <path d="M0,0 C0,-6 -8,-9 -13,-4 C-18,1 -11,11 0,18 C11,11 18,1 13,-4 C8,-9 0,-6 0,0 Z" fill="#ff5a95">
              <animate attributeName="opacity" values="0;1;1;0" dur="6s" repeatCount="indefinite" />
            </path>
          </g>
        </g>
        <g transform="translate(460,380) scale(.8)">
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0; -18 -70; 10 -150" dur="5s" begin="-2s" repeatCount="indefinite" />
            <path d="M0,0 C0,-6 -8,-9 -13,-4 C-18,1 -11,11 0,18 C11,11 18,1 13,-4 C8,-9 0,-6 0,0 Z" fill="#ff2e7f">
              <animate attributeName="opacity" values="0;1;1;0" dur="5s" begin="-2s" repeatCount="indefinite" />
            </path>
          </g>
        </g>
        <g transform="translate(400,300) scale(.65)">
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0; 10 -60; 0 -130" dur="4.5s" begin="-1s" repeatCount="indefinite" />
            <path d="M0,0 C0,-6 -8,-9 -13,-4 C-18,1 -11,11 0,18 C11,11 18,1 13,-4 C8,-9 0,-6 0,0 Z" fill="#b030ff">
              <animate attributeName="opacity" values="0;1;1;0" dur="4.5s" begin="-1s" repeatCount="indefinite" />
            </path>
          </g>
        </g>

        {/* Trail particles following butterfly paths */}
        <circle r="5" fill="#ff9ebb" opacity=".8">
          <animateMotion dur="12s" begin="-11.2s" repeatCount="indefinite" path="M85,380 C150,260 250,190 380,155 C510,120 650,165 700,270 C745,365 650,465 500,475 C350,485 175,475 85,380 Z" />
          <animate attributeName="opacity" values=".8;.15;.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle r="3.2" fill="#ffd166" opacity=".8">
          <animateMotion dur="12s" begin="-10.4s" repeatCount="indefinite" path="M85,380 C150,260 250,190 380,155 C510,120 650,165 700,270 C745,365 650,465 500,475 C350,485 175,475 85,380 Z" />
        </circle>
        <circle r="2.4" fill="#fff7a0" opacity=".85">
          <animateMotion dur="12s" begin="-9.6s" repeatCount="indefinite" path="M85,380 C150,260 250,190 380,155 C510,120 650,165 700,270 C745,365 650,465 500,475 C350,485 175,475 85,380 Z" />
        </circle>
        <circle r="3" fill="#8be9ff" opacity=".8">
          <animateMotion dur="12s" begin="-5.2s" repeatCount="indefinite" path="M180,420 C250,320 350,380 450,300 C550,220 650,300 600,400 C550,500 350,520 250,480 C210,460 170,450 180,420 Z" />
        </circle>

        {/* Butterfly 1 (Orange monarch flying across) */}
        <g>
          <animateMotion dur="12s" repeatCount="indefinite" rotate="auto" path="M85,380 C150,260 250,190 380,155 C510,120 650,165 700,270 C745,365 650,465 500,475 C350,485 175,475 85,380 Z" />
          <g transform="rotate(90)">
            <g className="bob1">
              <g transform="scale(1.2)" filter="url(#bfGlow)">
                <g className="wing-left">
                  <path d="M-4,-2 C-28,-36 -72,-44 -86,-16 C-96,6 -68,24 -40,22 C-20,20 -8,10 -4,-2 Z" fill="url(#wingOrange)" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M-6,16 C-32,22 -52,38 -44,54 C-37,67 -16,58 -4,34 C-2,26 -4,20 -6,16 Z" fill="url(#wingOrange)" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
                  <circle cx="-62" cy="-8" r="9" fill="white" opacity=".95" />
                  <circle cx="-48" cy="-18" r="5.5" fill="white" />
                  <circle cx="-36" cy="-24" r="3.5" fill="white" />
                  <circle cx="-30" cy="38" r="5" fill="white" opacity=".9" />
                  <circle cx="-62" cy="-8" r="3" fill="#1a1a1a" />
                </g>
                <g className="wing-right">
                  <path d="M4,-2 C28,-36 72,-44 86,-16 C96,6 68,24 40,22 C20,20 8,10 4,-2 Z" fill="url(#wingOrange)" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M6,16 C32,22 52,38 44,54 C37,67 16,58 4,34 C2,26 4,20 6,16 Z" fill="url(#wingOrange)" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
                  <circle cx="62" cy="-8" r="9" fill="white" opacity=".95" />
                  <circle cx="48" cy="-18" r="5.5" fill="white" />
                  <circle cx="36" cy="-24" r="3.5" fill="white" />
                  <circle cx="30" cy="38" r="5" fill="white" opacity=".9" />
                  <circle cx="62" cy="-8" r="3" fill="#1a1a1a" />
                </g>
                <ellipse cx="0" cy="10" rx="6.5" ry="28" fill="#222" />
                <circle cx="0" cy="-22" r="8" fill="#222" />
                <path d="M-3,-28 Q-12,-44 -22,-46" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M3,-28 Q12,-44 22,-46" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="-22" cy="-46" r="3" fill="#222" />
                <circle cx="22" cy="-46" r="3" fill="#222" />
              </g>
            </g>
          </g>
        </g>

        {/* Butterfly 2 (Blue morpho fluttering) */}
        <g className="bf2">
          <animateMotion dur="12s" begin="-6s" repeatCount="indefinite" rotate="auto" path="M180,420 C250,320 350,380 450,300 C550,220 650,300 600,400 C550,500 350,520 250,480 C210,460 170,450 180,420 Z" />
          <g transform="rotate(90)">
            <g className="bob2">
              <g transform="scale(.95)" filter="url(#bfGlow)">
                <g className="wing-left">
                  <path d="M-3,0 C-22,-28 -62,-32 -68,-8 C-72,10 -45,22 -3,12 Z" fill="url(#wingBlue)" stroke="#2a2a6a" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M-3,14 C-25,18 -38,32 -30,42 C-22,50 -6,38 -1,18 Z" fill="url(#wingBlue)" stroke="#2a2a6a" strokeWidth="2.5" strokeLinejoin="round" />
                  <circle cx="-45" cy="0" r="7" fill="white" opacity=".9" />
                  <circle cx="-32" cy="-10" r="4" fill="#ff8ad8" />
                  <circle cx="-20" cy="28" r="4" fill="white" opacity=".9" />
                </g>
                <g className="wing-right">
                  <path d="M3,0 C22,-28 62,-32 68,-8 C72,10 45,22 3,12 Z" fill="url(#wingBlue)" stroke="#2a2a6a" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M3,14 C25,18 38,32 30,42 C22,50 6,38 1,18 Z" fill="url(#wingBlue)" stroke="#2a2a6a" strokeWidth="2.5" strokeLinejoin="round" />
                  <circle cx="45" cy="0" r="7" fill="white" opacity=".9" />
                  <circle cx="32" cy="-10" r="4" fill="#ff8ad8" />
                  <circle cx="20" cy="28" r="4" fill="white" opacity=".9" />
                </g>
                <ellipse cx="0" cy="8" rx="5.5" ry="22" fill="#23234d" />
                <circle cx="0" cy="-16" r="6.5" fill="#23234d" />
                <path d="M-2,-20 Q-8,-32 -16,-34" stroke="#23234d" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M2,-20 Q8,-32 16,-34" stroke="#23234d" strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </g>

        {/* Butterfly 3 (Yellow fairy butterfly dancing high) */}
        <g className="bf3">
          <animateMotion dur="6s" begin="-1.5s" repeatCount="indefinite" rotate="auto" path="M280,140 C320,100 420,95 480,125 C540,155 500,195 430,195 C360,195 240,180 280,140 Z" />
          <g transform="rotate(90)">
            <g className="bob3">
              <g transform="scale(.62)" filter="url(#bfGlow)">
                <g className="wing-left">
                  <ellipse cx="-28" cy="-6" rx="30" ry="22" fill="url(#wingYellow)" stroke="#7a4a00" strokeWidth="3" />
                  <ellipse cx="-22" cy="22" rx="18" ry="14" fill="url(#wingYellow)" stroke="#7a4a00" strokeWidth="3" />
                  <circle cx="-30" cy="-8" r="5" fill="#ff5a95" />
                </g>
                <g className="wing-right">
                  <ellipse cx="28" cy="-6" rx="30" ry="22" fill="url(#wingYellow)" stroke="#7a4a00" strokeWidth="3" />
                  <ellipse cx="22" cy="22" rx="18" ry="14" fill="url(#wingYellow)" stroke="#7a4a00" strokeWidth="3" />
                  <circle cx="30" cy="-8" r="5" fill="#ff5a95" />
                </g>
                <ellipse cx="0" cy="6" rx="5" ry="20" fill="#4a2a00" />
                <circle cx="0" cy="-16" r="6" fill="#4a2a00" />
                <path d="M-2,-21 Q-7,-31 -13,-33" stroke="#4a2a00" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M2,-21 Q7,-31 13,-33" stroke="#4a2a00" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="-13" cy="-33" r="2.2" fill="#4a2a00" />
                <circle cx="13" cy="-33" r="2.2" fill="#4a2a00" />
              </g>
            </g>
          </g>
        </g>

        {/* Floating Romantic Title Banner */}
        <g className="text-float" filter="url(#textGlow)">
          <ellipse cx="400" cy="88" rx="265" ry="50" fill="white" opacity=".38" />
          <path d="M400,52 C398,45 388,43 384,49 C380,55 387,63 400,70 C413,63 420,55 416,49 C412,43 402,45 400,52 Z" fill="#ff2e7f" stroke="white" strokeWidth="1.5" />
          <text
            x="400"
            y="112"
            textAnchor="middle"
            fontFamily="'Great Vibes','Pacifico','Brush Script MT','Segoe Script',cursive"
            fontSize="70"
            fontWeight="700"
            fill="url(#textGrad)"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
            paintOrder="stroke"
          >
            Nia Sayaanggku
          </text>
          <text
            x="400"
            y="136"
            textAnchor="middle"
            fontFamily="'Quicksand','Segoe UI',sans-serif"
            fontSize="13.5"
            letterSpacing="3.5"
            fontWeight="700"
            fill="#8a0044"
          >
            ✦ MEKAR TERINDAH DI HATIKU ✦
          </text>
          <path d="M225,145 Q400,175 575,145" stroke="#ff5a95" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".85" />
          <path d="M400,150 C400,145 393,143 390,147 C387,151 392,157 400,162 C408,157 413,151 410,147 C407,143 400,145 400,150 Z" fill="#ff2e7f" stroke="white" strokeWidth="1" />
        </g>

        {/* Twinkling Sparkles Across Sky & Garden */}
        <g fill="white">
          <g transform="translate(150,280) scale(.9)"><path className="sparkle" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(650,330) scale(1.1)"><path className="sparkle d2" fill="#fff7a0" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(480,220) scale(.7)"><path className="sparkle d3" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(320,240) scale(.8)"><path className="sparkle d4" fill="#ffd6e8" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(590,180) scale(.9)"><path className="sparkle d5" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(200,180) scale(.7)"><path className="sparkle d2" fill="#fff7a0" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(400,60) scale(.6)"><path className="sparkle" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(720,430) scale(.8)"><path className="sparkle d3" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(184,289) scale(.75)"><path className="sparkle d6" fill="#ffe45c" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(616,289) scale(.75)"><path className="sparkle d7" fill="#8be9ff" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(298,236) scale(.6)"><path className="sparkle d8" fill="#ffb3cd" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
          <g transform="translate(502,236) scale(.6)"><path className="sparkle d6" fill="#cfe6ff" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" /></g>
        </g>

        {/* Dynamic Click Hearts Effect */}
        {clickHearts.map(h => (
          <g key={h.id} transform={`translate(${h.x}, ${h.y})`}>
            <path
              d="M0,-12 C-8,-20 -20,-12 -20,-2 C-20,9 -4,18 0,22 C4,18 20,9 20,-2 C20,-12 8,-20 0,-12 Z"
              fill="#ff2e7f"
              stroke="#ffffff"
              strokeWidth="2"
              opacity="0.95"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0; 0 -45; 0 -85"
                dur="1.4s"
                repeatCount="1"
              />
              <animateTransform
                attributeName="transform"
                type="scale"
                additive="sum"
                values="0.5; 1.25; 0.9; 0.4"
                dur="1.4s"
                repeatCount="1"
              />
              <animate
                attributeName="opacity"
                values="1; 1; 0"
                dur="1.4s"
                repeatCount="1"
              />
            </path>
          </g>
        ))}

        {/* Vignette & Elegant Border Frame */}
        <rect x="0" y="0" width="800" height="600" rx="28" fill="url(#vignette)" pointerEvents="none" />
        <rect x="6" y="6" width="788" height="588" rx="22" fill="none" stroke="white" strokeWidth="3" opacity=".7" pointerEvents="none" />
      </svg>
    </div>
  );
};
