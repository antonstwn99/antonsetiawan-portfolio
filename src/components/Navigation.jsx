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
                className="hover:text-[#143DED] transition-colors capitalize"
              >
                <span className="text-[#143DED] text-xs mr-1">0{i + 1}</span>{' '}
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 relative z-50">
          <a
            href="#contact"
            className="hidden md:block text-white text-xs font-body border border-white/20 hover:border-white/50 hover:bg-white/5 rounded-full px-4 py-2 transition-all"
          >
            Hire Me
          </a>
          <button
            className="md:hidden text-white outline-none"
            onClick={() => setIsOpen(!isOpen)}
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
                className="hover:text-[#143DED] transition-colors capitalize"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-[#143DED] text-sm mr-2">0{i + 1}</span>{' '}
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navigation;
