import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { supabase } from '../lib/supabase';

// KOMPONEN PEMBUNGKUS KARTU 3D (Sangat Ringan, aktif saat di-hover)
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0.5); // Posisi X kursor (0 sampai 1)
  const y = useMotionValue(0.5); // Posisi Y kursor (0 sampai 1)

  // Maksimal kemiringan 7 derajat agar terlihat elegan dan tidak lebay
  const rotateX = useTransform(y, [0, 1], [7, -7]);
  const rotateY = useTransform(x, [0, 1], [-7, 7]);

  // Menggunakan pegas (spring) agar pergerakannya mulus (smooth), tidak patah-patah
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  // Membuat template gradient untuk efek pantulan cahaya hologram (Glare)
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${useTransform(x, v => v * 100)}% ${useTransform(y, v => v * 100)}%, rgba(20,61,237,0.15) 0%, transparent 60%)`;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Kembalikan ke tengah saat mouse pergi
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      style={{
        rotateX: isHovered ? springX : 0,
        rotateY: isHovered ? springY : 0,
        transformPerspective: 1000,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full group ${className}`}
    >
      {/* Konten Asli Kartu */}
      <div className="relative z-10 w-full h-full transform-style-3d">
        {children}
      </div>

      {/* Efek Pantulan Cahaya (Glare) - Hanya muncul saat di-hover */}
      {isHovered && (
        <motion.div
          style={{ background: glareBackground }}
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300 hidden md:block"
        />
      )}
    </motion.div>
  );
};

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <section id="experience" className="py-24 px-6 md:px-16 overflow-hidden">
      <div className="flex flex-col xl:flex-row gap-12 xl:gap-24">
        
        {/* JUDUL KIRI */}
        <div className="w-full xl:w-[25%] shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#143DED]">Journey</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.1] text-white">
            Milestones<br />that <span className="text-[#143DED]">shaped me.</span>
          </h2>
        </div>
        
        <div className="w-full xl:w-[75%] flex flex-col gap-16 mt-8 xl:mt-0">
          
          {/* ==============================================
              EDUCATION SECTION
              ============================================== */}
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
                      
                      {/* Background Aksen Biru */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#143DED] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none" style={{ transform: "translateZ(-10px)" }}></div>
                      
                      {/* Badge IPK (Maju ke depan sedikit) */}
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-[#143DED] to-cyan-500 text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl uppercase tracking-wider shadow-lg flex items-center gap-2" style={{ transform: "translateZ(30px)" }}>
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>
                        IPK: {item.gpa}
                      </div>
                      
                      {/* Logo dan Judul */}
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
                      
                      {/* Deskripsi */}
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

          {/* ==============================================
              EXPERIENCE SECTION
              ============================================== */}
          <div className="relative">
            <h3 className="font-heading text-lg font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#143DED]"></span> Professional Experience
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {isLoading ? (
                 <div className="col-span-full h-32 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse"></div>
              ) : (
                experiences.map((item, index) => (
                  <TiltCard key={`exp-${index}`} className="h-full">
                    <div className="flex flex-col h-full bg-[#080D18] md:bg-white/[0.02] p-6 rounded-2xl border border-white/5 hover:border-[#143DED]/30 transition-colors shadow-lg">
                      
                      {/* Logo dan Jabatan */}
                      <div className="flex items-start gap-4 mb-5" style={{ transform: "translateZ(30px)" }}>
                        {item.logo && (
                          <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-transparent flex items-center justify-center shadow-lg">
                             <img src={item.logo} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 pt-0.5">
                          <h3 className="font-heading text-xl font-bold text-[#143DED] leading-tight mb-1.5">{item.year}</h3>
                          <p className="font-body text-sm md:text-base font-bold text-white mb-1">{item.title}</p>
                          <p className="font-body text-[10px] text-white/50 uppercase tracking-widest">{item.role}</p>
                        </div>
                      </div>

                      <p className="font-body text-sm text-white/70 leading-relaxed mt-auto" style={{ transform: "translateZ(20px)" }}>{item.desc}</p>
                    </div>
                  </TiltCard>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;