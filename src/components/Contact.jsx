import React, { useState } from 'react';
import antonLogo from '../assets/anton/anton-logo.png';

const Contact = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('antonstwn604@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      className="pt-24 pb-8 px-6 md:px-16 flex flex-col items-center"
    >
      <div className="relative w-full max-w-6xl group">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#143DED] blur-[120px] rounded-full opacity-30 -translate-y-1/2 pointer-events-none transition-opacity duration-700 group-hover:opacity-50"></div>
        <div className="w-full border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-2xl backdrop-saturate-[1.5] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 border-t border-white/20 rounded-3xl pointer-events-none"></div>

          <div className="relative z-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#143DED]">
                Let's Connect
              </span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold leading-[1.1] text-white mb-2">
              Ready to collaborate?
            </h2>
            <div className="flex flex-col gap-2">
              <p className="font-body text-white/70">
                Let's craft experiences that matter.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="font-body text-xs text-green-500 font-medium">
                  Available for new initiatives in Q3 2026
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center lg:justify-end items-center gap-4 md:gap-6 w-full lg:w-auto">
            <div className="flex gap-6 mr-0 md:mr-4">
              <a
                href="#"
                onClick={handleCopyEmail}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group relative"
                title="Copy Email"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-[#143DED] transition-colors"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {isCopied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#143DED] text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-lg">
                    Copied!
                  </span>
                )}
              </a>
              <a
                href="https://instagram.com/antonstwn__"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                title="Instagram"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-[#143DED] transition-colors"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>

            <a
              href="https://wa.me/6281645483272?text=Halo%20Anton,%20saya%20melihat%20portfolio%20Anda%20dan%20tertarik%20untuk%20berdiskusi%20lebih%20lanjut."
              target="_blank"
              rel="noreferrer"
              className="flex items-center w-fit gap-3 bg-[#25D366] hover:bg-white hover:text-[#05070D] transition-all duration-300 text-white rounded-full px-6 py-3 shadow-[0_0_20px_rgba(37,211,102,0.2)] group"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
              </svg>
              <span className="font-body text-sm font-bold">
                Chat on WhatsApp
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="w-full mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={antonLogo} 
            alt="Anton Setiawan Logo" 
            className="w-10 h-10 rounded-xl border border-white/10 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
          />
          <p className="font-body text-xs text-white/50">
            © 2026 Anton Setiawan. All rights reserved.
          </p>
        </div>
        <ul className="flex flex-wrap justify-center gap-6 md:gap-8 font-body text-xs text-white/70">
          {[
            'Home',
            'Work',
            'About',
            'Capabilities',
            'Experience',
            'Contact',
          ].map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#home"
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 hover:-translate-y-1 hover:bg-white/5 transition-all duration-300 outline-none"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Contact;
