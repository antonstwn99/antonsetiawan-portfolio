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
              {/* Bagian Ikon Kiri: Logo Bersih (jika ada) ATAU Titik Biru (jika tidak ada logo) */}
              {item.logo ? (
                 <img
                    src={item.logo}
                    alt={item.name}
                    // Menghilangkan kotak, menggunakan ukuran fixed, dan memberikan efek filter natural
                    className="h-6 w-auto md:h-7 object-contain opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 shrink-0"
                 />
              ) : (
                <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#143DED]/60 group-hover:bg-[#143DED] group-hover:shadow-[0_0_8px_#143DED] transition-all"></div>
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