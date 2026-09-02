import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

// Import semua komponen yang sudah kita potong
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SelectedWork from './components/SelectedWork';
import About from './components/About';
import Capabilities from './components/Capabilities';
import Experience from './components/Experience';
import Process from './components/Process';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  // Inisialisasi Smooth Scrolling (Lenis) & Navigasi
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement)
            lenis.scrollTo(targetElement, { offset: -80, duration: 1.5 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="app-wrapper bg-[#05070D] text-white font-body selection:bg-[#143DED] selection:text-white md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <Navigation />
      <MusicPlayer />
      <main>
        <Hero />
        <SelectedWork />
        <About />
        <Capabilities />
        <Experience />
        <Process />
        <Achievements />
        <Contact />
      </main>
    </div>
  );
}
