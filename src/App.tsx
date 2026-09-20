import React from 'react';
import { RomanticHeader } from './components/RomanticHeader.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { PhotoGallery } from './components/PhotoGallery.tsx';
import { GalaxyLoveSection } from './components/GalaxyLoveSection.tsx';
import { LoveLetterSection } from './components/LoveLetterSection.tsx';
import { ConfessionQuestionSection } from './components/ConfessionQuestionSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AmbientSoundToggle } from './components/AmbientSoundToggle.tsx';
import { HeartPopManager } from './components/HeartPopManager.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

export default function App() {
  const handleScrollToContent = () => {
    const target = document.getElementById('galeri-foto');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative selection:bg-blue-200 selection:text-blue-900 font-body">
      {/* Top Sticky Navigation */}
      <RomanticHeader />

      <main>
        {/* 1. Landing / Hero Section */}
        <HeroSection onScrollDown={handleScrollToContent} />

        {/* 2. Galeri Foto Nia */}
        <PhotoGallery />

        {/* 3. Galaxy of Love 3D Experience */}
        <ErrorBoundary>
          <GalaxyLoveSection />
        </ErrorBoundary>

        {/* 4. Surat Cinta Interaktif & Typewriter */}
        <LoveLetterSection />

        {/* 5. Pertanyaan Utama & WhatsApp CTA */}
        <ConfessionQuestionSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Ambient Romantic Music Box Floating Button */}
      <AmbientSoundToggle />

      {/* Global Interactive Heart Pop & Haptic FX Manager */}
      <HeartPopManager />
    </div>
  );
}
