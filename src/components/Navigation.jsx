import React, { useState, useEffect } from 'react';
import antonLogo from '../assets/anton/anton-logo.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full flex justify-between items-center px-6 py-4 md:px-16 md:py-4 z-50 transition-all duration-500 border-b ${
          isOpen
            ? 'bg-[#05070D] border-transparent'
            : 'bg-[#05070D]/40 backdrop-blur-md backdrop-saturate-150 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
        }`}
      >
        <a
          href="#home"
          className="relative z-50 flex items-center group outline-none"
        >
          <img 
            src={antonLogo} 
            alt="Anton Logo" 
            className="w-10 h-10 md:w-12 md:h-12 rounded-[12px] object-cover border border-white/10 group-hover:border-[#143DED] shadow-lg group-hover:shadow-[0_0_15px_rgba(20,61,237,0.5)] transition-all duration-300" 
          />
        </a>

        <ul className="hidden md:flex gap-8 text-white font-body text-sm">
          {[
            'home',
            'work',
            'about',
            'capabilities',
            'experience',
            'contact',
          ].map((item, i) => (
            <li key={item}>
              <a
                href={`#${item}`}
                className="group relative hover:text-white transition-colors capitalize py-1 block"
              >
                <span className="text-[#143DED] text-xs mr-1 opacity-70 group-hover:opacity-100 transition-opacity">0{i + 1}</span>{' '}
                {item}
                {/* Indikator Pil Cahaya Desktop */}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#143DED] to-cyan-400 rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-[0_0_12px_rgba(20,61,237,0.8)]"></span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 relative z-50">
          <a
            href="https://wa.me/6281645483272?text=Halo%20Anton,%20saya%20melihat%20portfolio%20Anda%20dan%20tertarik%20untuk%20berdiskusi%20lebih%20lanjut."
            target="_blank"
            rel="noreferrer"
            className="hidden md:block text-white text-xs font-body border border-white/20 hover:border-white/50 hover:bg-white/5 rounded-full px-4 py-2 transition-all"
          >
            Hire Me
          </a>
          <button
            className="md:hidden text-white outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#143DED] focus-visible:outline-offset-4 rounded-sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#05070D] z-40 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <ul className="flex flex-col gap-8 text-white font-heading text-2xl items-center text-center">
          {[
            'home',
            'work',
            'about',
            'capabilities',
            'experience',
            'contact',
          ].map((item, i) => (
            <li key={item}>
              <a
                href={`#${item}`}
                className="hover:text-white transition-colors capitalize relative group"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-[#143DED] text-sm mr-2 opacity-70">0{i + 1}</span>{' '}
                {item}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-[#143DED] to-transparent transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>
        
        {/* Tombol Hire Me (WhatsApp) di Layar Mobile */}
        <a
          href="https://wa.me/6281645483272?text=Halo%20Anton,%20saya%20melihat%20portfolio%20Anda%20dan%20tertarik%20untuk%20berdiskusi%20lebih%20lanjut."
          target="_blank"
          rel="noreferrer"
          className="mt-12 flex items-center gap-3 bg-gradient-to-r from-[#143DED] to-cyan-500 hover:scale-105 transition-all duration-300 text-white rounded-full px-8 py-3 shadow-[0_0_20px_rgba(20,61,237,0.4)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
          <span className="font-body text-sm font-bold">Chat on WhatsApp</span>
        </a>
      </div>
    </>
  );
};

export default Navigation;
