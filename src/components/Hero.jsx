import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import InteractivePortrait from './InteractivePortrait';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]);
  const opacityGrid = useTransform(scrollY, [0, 600], [0.03, 0]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 pt-32 md:pt-24 overflow-hidden max-w-7xl mx-auto w-full"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div
          style={{ y: y1 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 md:left-[10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#143DED] blur-[100px] md:blur-[150px] opacity-20 mix-blend-screen rounded-full"
        />
        <motion.div
          style={{ y: y2 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 md:right-[5%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] bg-[#3B82F6] blur-[100px] md:blur-[120px] opacity-15 mix-blend-screen rounded-[40%_60%_70%_30%]"
        />
        <motion.div
          style={{
            opacity: opacityGrid,
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          className="absolute inset-0"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          staggerChildren: 0.2,
        }}
        className="relative z-10 w-full md:w-[55%] flex flex-col items-start mt-8 md:mt-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-3 mb-6 md:mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-[#143DED] animate-pulse"></div>
          <span className="font-body text-[#143DED] text-xs font-semibold tracking-widest uppercase border border-[#143DED]/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
            Multimedia Engineer & Strategist
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-[3.5rem] sm:text-6xl md:text-[7.5rem] font-bold leading-[0.9] tracking-tight mb-6 md:mb-8 text-white"
        >
          Anton
          <br />
          Setiawan<span className="text-[#143DED]">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-white/70 text-sm md:text-base max-w-[460px] mb-10 leading-relaxed font-normal"
        >
          Saya merancang dan membangun ekosistem digital. Memadukan estetika desain visual, logika rekayasa perangkat lunak, dan strategi multimedia untuk menciptakan solusi teknologi yang terukur dan berdampak nyata.
        </motion.p>

        {/* CTA Button */}
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          href="#work"
          className="group flex items-center w-fit gap-4 bg-transparent border border-white/20 hover:border-white/50 pl-2 pr-6 py-2 rounded-full transition-all duration-300 mb-10 outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#143DED] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(20,61,237,0.4)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
          <span className="font-body text-sm font-medium text-white group-hover:text-[#143DED] transition-colors duration-300">
            Explore My World
          </span>
        </motion.a>

        {/* Quick Summary Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex items-center gap-6 md:gap-10 border-t border-white/10 pt-6 w-full max-w-[420px]"
        >
          <div>
            <h4 className="font-heading text-2xl font-bold text-white">4+</h4>
            <p className="font-body text-[10px] text-white/50 uppercase tracking-widest">
              Years Exp.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-2xl font-bold text-white">15+</h4>
            <p className="font-body text-[10px] text-white/50 uppercase tracking-widest">
              Projects
            </p>
          </div>
          <div>
            <h4 className="font-heading text-2xl font-bold text-white">4</h4>
            <p className="font-body text-[10px] text-white/50 uppercase tracking-widest">
              Ventures Built
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative z-10 w-full md:w-[45%] mt-16 md:mt-0"
      >
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <InteractivePortrait />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
