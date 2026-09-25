import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import antonLogo from '../assets/anton/anton-logo.png';

// ==========================================
// KOMPONEN MAGNETIC BUTTON (Inti dari Efek Tarikan Kursor)
// ==========================================
const Magnetic = ({ children, className, href, onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // Kekuatan magnet (0.3 berarti tertarik 30% ke arah kursor)
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-block ${className}`}
      href={href}
      onClick={onClick}
      target={href ? "_blank" : undefined}
      rel={href ? "noreferrer" : undefined}
    >
      {children}
    </Tag>
  );
};

const Contact = () => {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef(null);
  
  // State Data CMS
  const [settings, setSettings] = useState({
    email: 'antonstwn604@gmail.com',
    instagram: 'https://instagram.com/antonstwn__',
    whatsapp: 'https://wa.me/6281645483272',
    linkedin: 'https://linkedin.com/in/antonsetiawan'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('email, instagram, whatsapp, linkedin').eq('id', 1).single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleCopyEmail = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(settings.email);
      setIsCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6 md:px-16 overflow-hidden bg-[#05070D]">
      {/* Ornamen Background */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#143DED]/50 to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#143DED] blur-[150px] opacity-10 rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#143DED] animate-pulse"></div>
          <span className="font-body text-xs font-semibold tracking-widest uppercase text-white/50">What's Next?</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="font-heading text-5xl md:text-7xl lg:text-[6rem] font-bold text-white leading-none mb-8 tracking-tight">
          Let's build <span className="text-[#143DED] italic">together.</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="font-body text-white/60 text-sm md:text-base max-w-lg mx-auto mb-16 leading-relaxed">
          Punya ide proyek, peluang kolaborasi, atau sekadar ingin menyapa? Jangan ragu untuk menghubungi saya. Pintu *inbox* saya selalu terbuka!
        </motion.p>

        {/* TOMBOL MAGNETIK UTAMA */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-6 mb-24">
          
          <Magnetic href={settings.whatsapp} className="group flex items-center gap-3 bg-white text-[#05070D] rounded-full px-8 py-4 hover:bg-[#143DED] hover:text-white transition-colors duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(20,61,237,0.4)]">
            <span className="font-body font-bold">Start a Project</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-45 transition-transform duration-300"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Magnetic>

          <Magnetic onClick={handleCopyEmail} className="group flex items-center gap-3 bg-transparent border border-white/20 text-white rounded-full px-8 py-4 hover:border-white/60 transition-colors duration-300 cursor-pointer">
            <span className="font-body font-medium">{isCopied ? 'Email Copied!' : settings.email}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </Magnetic>
          
        </motion.div>

        {/* FOOTER & SOSIAL MEDIA MAGNETIK */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="w-full pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img src={antonLogo} alt="Anton Logo" className="w-10 h-10 rounded-xl opacity-80" />
            <div className="text-left">
              <h4 className="font-heading text-sm font-bold text-white">Anton Setiawan</h4>
              <p className="font-body text-[10px] text-white/50 tracking-widest uppercase">Multimedia Engineer</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Magnetic href={settings.instagram} className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/60 hover:text-[#143DED] hover:border-[#143DED]/50 transition-colors group">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </Magnetic>
            <Magnetic href={settings.linkedin} className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/60 hover:text-[#143DED] hover:border-[#143DED]/50 transition-colors group">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </Magnetic>
          </div>

          <div className="flex items-center gap-4 text-xs font-body text-white/40">
            <span>© {new Date().getFullYear()}</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <a href="/admin" className="hover:text-white transition-colors uppercase tracking-widest font-bold">Sys.Admin</a>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Contact;