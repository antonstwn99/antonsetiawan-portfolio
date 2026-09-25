import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const PartnersMarquee = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase
        .from('partners')
        .select('*')
        .order('id', { ascending: true });
      
      if (data) setPartners(data);
    };
    fetchPartners();
  }, []);

  // Gandakan daftar agar perputaran animasi tanpa jeda kosong
  const tickerItems = [...partners, ...partners];

  if (partners.length === 0) return null; // Sembunyikan jika belum ada data

  return (
    <section className="relative w-full py-10 overflow-hidden border-y border-white/5 bg-[#05070D]/40 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[#143DED] animate-pulse"></div>
        <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-white/40">
          Trusted By & Collaborative Ecosystem
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#143DED] animate-pulse"></div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-[#05070D] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-[#05070D] to-transparent z-10" />

      <div className="flex overflow-hidden select-none">
        <div className="animate-ticker items-center gap-6 sm:gap-10">
          {tickerItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.015] hover:bg-white/[0.05] hover:border-[#143DED]/40 transition-all duration-300 group cursor-default"
            >
              {/* Bagian Ikon Kiri: Logo (jika ada) ATAU Titik Biru (jika tidak ada logo) */}
              {item.logo ? (
                <div className="w-6 h-6 md:w-7 md:h-7 shrink-0 rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1 group-hover:border-[#143DED]/50 transition-colors">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-[#143DED]/60 group-hover:bg-[#143DED] group-hover:shadow-[0_0_8px_#143DED] transition-all"></div>
              )}
              
              {/* Bagian Teks Kanan: Akan selalu muncul! */}
              <span className="font-heading text-xs md:text-sm font-medium tracking-wider text-white/50 group-hover:text-white uppercase whitespace-nowrap transition-colors">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;