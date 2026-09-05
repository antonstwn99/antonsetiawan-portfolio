import React from 'react';
import { PARTNERS_DATA } from '../data/portfolioData';

const PartnersMarquee = () => {
  // Gandakan daftar agar perputaran animasi tanpa jeda kosong (-50% translation)
  const tickerItems = [...PARTNERS_DATA, ...PARTNERS_DATA];

  return (
    <section className="relative w-full py-10 overflow-hidden border-y border-white/5 bg-[#05070D]/40 backdrop-blur-sm">
      {/* Label Header Kecil */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[#143DED] animate-pulse"></div>
        <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-white/40">
          Trusted By & Collaborative Ecosystem
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#143DED] animate-pulse"></div>
      </div>

      {/* Gradien Fade di Tepi Layar Kiri & Kanan */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-[#05070D] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-[#05070D] to-transparent z-10" />

      {/* Container Marquee */}
      <div className="flex overflow-hidden select-none">
        <div className="animate-ticker items-center gap-6 sm:gap-10">
          {tickerItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.015] hover:bg-white/[0.05] hover:border-[#143DED]/40 transition-all duration-300 group cursor-default"
            >
              {item.logo ? (
                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-5 md:h-6 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#143DED]/60 group-hover:bg-[#143DED] group-hover:shadow-[0_0_8px_#143DED] transition-all"></div>
                  <span className="font-heading text-xs md:text-sm font-medium tracking-wider text-white/50 group-hover:text-white uppercase whitespace-nowrap transition-colors">
                    {item.name}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;