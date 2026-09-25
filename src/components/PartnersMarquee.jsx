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
              // MODIFIKASI: Menyesuaikan pr-6 (padding kanan) agar teks tidak nabrak tepi rounded, flex-nowrap agar elemen tidak pecah
              className="flex items-center flex-nowrap gap-3 pl-2 pr-5 py-1.5 md:py-2 md:pl-2.5 md:pr-6 rounded-full border border-white/5 bg-white/[0.015] hover:bg-white/[0.05] hover:border-[#143DED]/40 transition-all duration-300 group cursor-default"
            >
              {item.logo ? (
                 // MODIFIKASI: Membungkus logo dengan lingkaran putih purna agar logo berlatar putih/hitam tetap estetik (tidak kaku/kotak).
                 <div className="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-full overflow-hidden bg-white flex items-center justify-center border border-white/10 group-hover:border-[#143DED]/50 transition-colors">
                    <img
                      src={item.logo}
                      alt={item.name}
                      // Memberikan padding dalam object agar logo punya ruang lega di dalam lingkaran
                      className="w-[70%] h-[70%] object-contain opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                    />
                 </div>
              ) : (
                // Padding kiri untuk menyamakan proporsi dengan yang ada logonya
                <div className="pl-3">
                   <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#143DED]/60 group-hover:bg-[#143DED] group-hover:shadow-[0_0_8px_#143DED] transition-all"></div>
                </div>
              )}
              
              {/* Teks dengan penyesuaian margin */}
              <span className="font-heading text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-white/50 group-hover:text-white uppercase whitespace-nowrap transition-colors">
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