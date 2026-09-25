import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

// ==========================================
// 1. KOMPONEN KARTU 3D (Untuk Bagian Pendidikan)
// ==========================================
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [7, -7]);
  const rotateY = useTransform(x, [0, 1], [-7, 7]);

  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${useTransform(x, v => v * 100)}% ${useTransform(y, v => v * 100)}%, rgba(20,61,237,0.15) 0%, transparent 60%)`;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      style={{ rotateX: isHovered ? springX : 0, rotateY: isHovered ? springY : 0, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full group ${className}`}
    >
      <div className="relative z-10 w-full h-full transform-style-3d">{children}</div>
      {isHovered && <motion.div style={{ background: glareBackground }} className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300 hidden md:block" />}
    </motion.div>
  );
};

// ==========================================
// 2. KOMPONEN UTAMA EXPERIENCE
// ==========================================
const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [expRes, eduRes] = await Promise.all([
        supabase.from('experience').select('*').order('id', { ascending: true }),
        supabase.from('education').select('*').order('id', { ascending: true })
      ]);
      if (expRes.data) setExperiences(expRes.data);
      if (eduRes.data) setEducation(eduRes.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const totalExp = experiences.length;
  const activeExp = experiences[activeIndex];

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % totalExp);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + totalExp) % totalExp);

  const handleDragEnd = (e, { offset }) => {
    if (offset.x < -40) nextSlide();
    else if (offset.x > 40) prevSlide();
  };

  const getCardStyles = (index) => {
    let diff = index - activeIndex;
    if (totalExp > 0) {
      if (diff > Math.floor(totalExp / 2)) diff -= totalExp;
      if (diff < -Math.floor(totalExp / 2)) diff += totalExp;
    }

    // MODIFIKASI 1: Jarak renggang di desktop (xOffset) diperlebar drastis menjadi 350px
    const xOffset = isMobile ? 110 : 350; 
    const yOffset = isMobile ? 15 : 50;   
    const rotateBase = isMobile ? 8 : 12; 

    if (diff === 0) {
      return { x: 0, y: 0, scale: 1, zIndex: 10, rotateZ: 0, opacity: 1, filter: 'brightness(100%)' };
    } else if (diff === 1) {
      return { x: xOffset, y: yOffset, scale: 0.85, zIndex: 5, rotateZ: rotateBase, opacity: 0.85, filter: 'brightness(45%)' };
    } else if (diff === -1) {
      return { x: -xOffset, y: yOffset, scale: 0.85, zIndex: 5, rotateZ: -rotateBase, opacity: 0.85, filter: 'brightness(45%)' };
    } else {
      return { x: diff > 0 ? xOffset * 1.5 : -xOffset * 1.5, y: yOffset * 2, scale: 0.6, zIndex: 1, rotateZ: diff > 0 ? rotateBase * 2 : -rotateBase * 2, opacity: 0, filter: 'brightness(10%)' };
    }
  };

  return (
    // MODIFIKASI 2: Flex-col gap-16 memisahkan Edukasi (atas) dan Experience (bawah)
    <section id="experience" className="py-24 px-6 md:px-16 overflow-hidden flex flex-col gap-16 md:gap-24">
      
      {/* ==============================================
          BAGIAN ATAS: EDUCATION (Layout 2 Kolom)
          ============================================== */}
      <div className="flex flex-col xl:flex-row gap-12 xl:gap-24">
        {/* Judul Kiri */}
        <div className="w-full xl:w-[25%] shrink-0 relative xl:sticky xl:top-24 mb-4 xl:mb-0 z-20 h-fit">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#143DED]">Journey</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.1] text-white">
            Milestones<br />that <span className="text-[#143DED]">shaped me.</span>
          </h2>
        </div>
        
        {/* Konten Edukasi Kanan */}
        <div className="w-full xl:w-[75%]">
          <div className="relative">
            <h3 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#143DED]"></span> Academic Background
            </h3>
            <div className="grid grid-cols-1 gap-8 relative z-10">
              {isLoading ? (
                <div className="h-40 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse"></div>
              ) : (
                education.map((item, index) => (
                  <TiltCard key={`edu-${index}`}>
                    <div className="flex flex-col h-full relative bg-gradient-to-r from-white/[0.03] to-transparent p-6 md:p-8 rounded-2xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#143DED] blur-[80px] opacity-20 pointer-events-none" style={{ transform: "translateZ(-10px)" }}></div>
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-[#143DED] to-cyan-500 text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl uppercase tracking-wider shadow-lg flex items-center gap-2" style={{ transform: "translateZ(30px)" }}>
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>
                        IPK: {item.gpa}
                      </div>
                      <div className="flex items-start gap-4 mb-5 relative pt-2" style={{ transform: "translateZ(40px)" }}>
                        {item.logo && (
                          <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-transparent flex items-center justify-center shadow-lg bg-black">
                            <img src={item.logo} alt={item.institution} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 pt-1 pr-16 md:pr-20">
                          <h3 className="font-heading text-lg md:text-xl font-bold text-white leading-tight mb-1.5">{item.degree}</h3>
                          <p className="font-body text-sm font-semibold text-[#143DED]">{item.institution}</p>
                        </div>
                      </div>
                      <p className="font-body text-xs text-white/50 uppercase tracking-widest mb-4" style={{ transform: "translateZ(20px)" }}>{item.year}</p>
                      <div className="flex items-start gap-3 mt-2" style={{ transform: "translateZ(30px)" }}>
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg></div>
                        <p className="font-body text-sm md:text-base text-white/80 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  </TiltCard>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* ==============================================
          BAGIAN BAWAH: EXPERIENCE (Full Width / Tengah)
          ============================================== */}
      {/* MODIFIKASI 3: Dikeluarkan dari kolom 75% agar berada di TENGAH secara presisi */}
      <div className="w-full flex flex-col items-center justify-center relative">
        <h3 className="font-heading text-lg md:text-2xl font-bold text-white mb-10 md:mb-16 flex items-center justify-center gap-3 w-full">
          <span className="w-2 h-2 rounded-full bg-[#143DED]"></span> Professional Experience
        </h3>
        
        {isLoading ? (
            <div className="h-64 w-full max-w-4xl rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse"></div>
        ) : experiences.length === 0 ? (
            <div className="text-white/50">Belum ada pengalaman kerja.</div>
        ) : (
          <div className="flex flex-col items-center w-full">
            
            {/* WADAH KORSEL MELINGKAR */}
            {/* MODIFIKASI 4: Ketinggian ruang korsel (h-[500px]) di desktop diperbesar */}
            <div className="relative w-full max-w-6xl h-[260px] md:h-[500px] flex items-center justify-center perspective-[1200px]">
              
              {/* Cahaya Latar Belakang */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-[#143DED] blur-[120px] opacity-20 pointer-events-none rounded-full"></div>

              {experiences.map((item, index) => {
                const styles = getCardStyles(index);
                const isActive = index === activeIndex;

                return (
                  <motion.div
                    key={item.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={handleDragEnd}
                    onClick={() => setActiveIndex(index)}
                    initial={false}
                    animate={styles}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    // MODIFIKASI 5: Ukuran kartu desktop SANGAT BESAR (w-[320px] h-[440px])
                    className={`absolute w-[180px] h-[240px] md:w-[320px] md:h-[440px] rounded-3xl overflow-hidden border ${isActive ? 'border-[#143DED]/50 cursor-grab active:cursor-grabbing shadow-[0_20px_50px_rgba(20,61,237,0.3)] bg-gradient-to-b from-white/[0.08] to-[#143DED]/15 backdrop-blur-md' : 'border-white/10 cursor-pointer shadow-lg bg-[#080D18] backdrop-blur-md'}`}
                  >
                    <div className="p-5 md:p-8 flex flex-col items-center text-center h-full justify-center">
                      {item.logo ? (
                        // MODIFIKASI 6: Padding dihapus, overflow-hidden ditambah, dan object-cover untuk logo!
                        <div className="w-16 h-16 md:w-28 md:h-28 rounded-2xl bg-white/[0.03] border border-white/10 mb-5 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                          <img src={item.logo} alt={item.title} className="w-full h-full object-cover" draggable="false" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 md:w-28 md:h-28 rounded-2xl bg-white/[0.03] border border-white/10 mb-5 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                          <span className="text-2xl md:text-5xl font-bold text-[#143DED]">{item.title.charAt(0)}</span>
                        </div>
                      )}
                      <h3 className="font-heading text-base md:text-2xl font-bold text-white mb-2 leading-tight">{item.title}</h3>
                      <p className="font-body text-[10px] md:text-sm text-[#143DED] uppercase tracking-widest">{item.year}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* TEKS DETAIL PENGALAMAN */}
            <div className="mt-8 max-w-2xl text-center min-h-[120px] px-4">
              <AnimatePresence mode="wait">
                {activeExp && (
                  <motion.div
                    key={activeExp.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-heading text-xl md:text-3xl font-bold text-white mb-3 drop-shadow-md">{activeExp.role}</h4>
                    <p className="font-body text-sm md:text-base text-white/70 leading-relaxed">{activeExp.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* NAVIGASI PANAH BAWAH */}
            <div className="flex items-center gap-6 mt-2">
              <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors outline-none"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg></button>
              <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors outline-none"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></button>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;