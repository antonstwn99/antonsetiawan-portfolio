import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

// Komponen Kartu 3D Flip (Mandiri untuk setiap kartu)
const FlipCard = ({ item, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative w-full h-[220px] cursor-pointer group perspective-[1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)} // Fallback untuk sentuhan di HP
    >
      <motion.div
        className="w-full h-full relative transform-style-3d shadow-lg rounded-2xl"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* SISI DEPAN (FRONT) */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center backface-hidden group-hover:border-[#143DED]/40 transition-colors"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-14 h-14 rounded-full bg-[#05070D] border border-white/10 flex items-center justify-center shrink-0 mb-5 shadow-[0_0_15px_rgba(20,61,237,0.15)] group-hover:shadow-[0_0_20px_rgba(20,61,237,0.4)] transition-shadow">
            {item.type === 'Achievement' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#143DED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#143DED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            )}
          </div>
          <h3 className="font-heading text-lg font-bold text-white leading-snug">
            {item.title}
          </h3>
          <p className="font-body text-[10px] text-white/40 uppercase tracking-widest mt-3">
            {item.type}
          </p>
        </div>

        {/* SISI BELAKANG (BACK) */}
        <div 
          className="absolute inset-0 w-full h-full bg-[#143DED] border border-[#143DED] rounded-2xl p-6 flex flex-col items-center justify-center text-center backface-hidden shadow-[0_0_30px_rgba(20,61,237,0.3)]"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-full h-full flex flex-col items-center justify-between border border-white/20 rounded-xl p-4 bg-[#05070D]/20 backdrop-blur-sm">
            <span className="font-body text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
              {item.year}
            </span>
            
            <div className="w-full">
              <p className="font-body text-[10px] text-white/70 uppercase tracking-widest mb-1">Issued By</p>
              <p className="font-heading text-base md:text-lg font-bold text-white leading-tight">
                {item.issuer}
              </p>
            </div>
            
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data } = await supabase
        .from('achievements')
        .select('*')
        .order('id', { ascending: false });
      
      if (data) setAchievements(data);
      setIsLoading(false);
    };
    fetchAchievements();
  }, []);

  return (
    <section className="py-20 px-6 md:px-16 overflow-hidden">
      <div className="flex flex-col xl:flex-row gap-12 xl:gap-24 items-start">
        
        {/* BAGIAN KIRI: JUDUL */}
        <div className="w-full xl:w-[25%] shrink-0 sticky top-24">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#143DED]">
              Recognition
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.1] text-white">
            Awards &<br />
            <span className="text-[#143DED]">Certifications.</span>
          </h2>
          <p className="font-body text-sm text-white/50 mt-6 max-w-sm">
            Arahkan kursor atau sentuh kartu untuk melihat detail penghargaan dan institusi penerbit.
          </p>
        </div>
        
        {/* BAGIAN KANAN: GRID KARTU FLIP */}
        <div className="w-full xl:w-[75%] relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1, 2, 3].map(i => <div key={i} className="w-full h-[220px] bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-white/50 text-sm">Belum ada data penghargaan.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((item, index) => (
                <FlipCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Achievements;