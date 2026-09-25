import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { supabase } from '../lib/supabase';

// Komponen Kartu Pop-Out 3D (Mandiri untuk masing-masing kartu)
const PopOutCard = ({ skill, index }) => {
  // Mencari ikon dari library Lucide, gunakan HelpCircle jika typo/tidak ditemukan
  const IconComponent = LucideIcons[skill.icon] || LucideIcons.HelpCircle;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' } }
      }}
      className="group relative perspective-[1200px] w-full"
    >
      {/* KOTAK UTAMA (Mundur saat di-hover) */}
      <motion.div
        // MODIFIKASI: Padding HP dikecilkan (p-5), gap disesuaikan agar tidak luber
        className="w-full h-full flex flex-col items-start justify-between gap-4 p-5 md:gap-6 md:p-8 rounded-2xl md:rounded-3xl bg-[#080D18] md:bg-white/[0.02] border border-white/5 group-hover:border-[#143DED]/40 transition-colors duration-500 transform-style-3d cursor-pointer"
        whileHover={{ 
          rotateX: 10,
          rotateY: -10,
          scale: 0.95,
          transition: { duration: 0.4, ease: "easeOut" }
        }}
      >
        <div 
          className="absolute inset-0 bg-[#143DED]/0 group-hover:bg-[#143DED]/15 blur-2xl transition-all duration-500 rounded-2xl md:rounded-3xl pointer-events-none" 
          style={{ transform: "translateZ(-30px)" }} 
        />

        {/* IKON KEAHLIAN */}
        <div 
          className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl border border-white/10 bg-[#05070D] flex items-center justify-center text-white/50 group-hover:text-[#143DED] group-hover:border-[#143DED]/50 transition-all duration-500 shadow-lg group-hover:shadow-[0_10px_30px_rgba(20,61,237,0.5)]"
          style={{ transform: "translateZ(40px)" }}
        >
          <IconComponent strokeWidth={1.5} size={24} className="md:w-7 md:h-7" />
        </div>
        
        {/* TEKS JUDUL */}
        <div style={{ transform: "translateZ(60px)" }} className="mt-2 w-full">
          {/* MODIFIKASI: Ukuran teks HP dikecilkan (text-base), dan mengubah teks mentah \n menjadi baris baru (newline) beneran */}
          <h3 className="font-heading text-[15px] sm:text-base md:text-xl font-bold text-white/90 whitespace-pre-line leading-snug group-hover:text-white transition-colors drop-shadow-md">
            {skill.label.replace(/\\n/g, '\n')}
          </h3>
          <div className="w-0 h-[2px] bg-[#143DED] mt-3 group-hover:w-1/2 transition-all duration-500 ease-out"></div>
        </div>

      </motion.div>
    </motion.div>
  );
};

const Capabilities = () => {
  const [capabilities, setCapabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCapabilities = async () => {
      const { data } = await supabase
        .from('capabilities')
        .select('*')
        .order('id', { ascending: true });
      
      if (data) setCapabilities(data);
      setIsLoading(false);
    };
    fetchCapabilities();
  }, []);

  return (
    <section className="py-24 px-6 md:px-16 overflow-hidden relative">
      
      {/* Background Ornamen */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#143DED] blur-[150px] opacity-10 rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

      <div className="flex flex-col xl:flex-row gap-12 xl:gap-24 items-center">
        
        {/* TEKS & DESKRIPSI (Kiri) */}
        <div className="w-full xl:w-[35%] shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#143DED] animate-pulse"></div>
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-white/50">
              Core Capabilities
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold leading-[1.1] text-white mb-6">
            What I do <span className="text-[#143DED]">best.</span>
          </h2>
          <p className="font-body text-sm md:text-base text-white/60 leading-relaxed">
            Menyediakan solusi *end-to-end* dengan pendekatan multidisiplin yang memadukan logika rekayasa perangkat lunak, estetika desain visual, dan strategi multimedia interaktif.
          </p>
        </div>

        {/* GRID KARTU (Kanan) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {}
          }}
          className="w-full xl:w-[65%] grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative z-10"
        >
          {isLoading ? (
            // Animasi Loading
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-full h-48 bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse"></div>
            ))
          ) : capabilities.length === 0 ? (
            <div className="text-white/50 col-span-full">Belum ada keahlian yang ditambahkan.</div>
          ) : (
            capabilities.map((skill, index) => (
              <PopOutCard key={skill.id} skill={skill} index={index} />
            ))
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default Capabilities;