import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Terminal,
  PenTool,
  BrainCircuit,
  Video,
  Box,
} from 'lucide-react';

const Capabilities = () => {
  const skills = [
    {
      id: 1,
      label: 'Web & App\nDevelopment',
      icon: <Code2 strokeWidth={1.5} size={24} />,
    },
    {
      id: 2,
      label: 'UI/UX &\nGraphic Design',
      icon: <PenTool strokeWidth={1.5} size={24} />,
    },
    {
      id: 3,
      label: 'Video Directing\n& Animation',
      icon: <Video strokeWidth={1.5} size={24} />,
    },
    {
      id: 4,
      label: 'Social Media\nBranding',
      icon: <Terminal strokeWidth={1.5} size={24} />,
    },
    {
      id: 5,
      label: 'Game Dev\n(Unity)',
      icon: <Box strokeWidth={1.5} size={24} />,
    },
    {
      id: 6,
      label: 'AI Prompt\nEngineering',
      icon: <BrainCircuit strokeWidth={1.5} size={24} />,
    },
  ];

  return (
    <section id="capabilities" className="py-12 px-6 md:px-16 overflow-hidden">
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center border border-white/5 rounded-3xl bg-[#080D18] p-6 sm:p-8 md:p-12 gap-8 xl:gap-12 transition-all duration-500 hover:border-white/10">
        
        {/* Header Section: Di Mobile sejajar horizontal dengan tombol navigasi */}
        <div className="w-full xl:w-[22%] shrink-0 flex items-start justify-between xl:block">
          <div>
            <div className="flex items-center gap-3 mb-2 md:mb-3">
              <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#143DED]">
                Capabilities
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.1] text-white">
              What I do
              <br />
              best<span className="text-[#143DED]">.</span>
            </h2>
          </div>

          {/* Tombol navigasi cepat khusus Mobile (posisi rapi di sudut kanan atas) */}
          <a
            href="#experience"
            className="xl:hidden w-11 h-11 rounded-full bg-[#143DED] flex items-center justify-center text-white hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(20,61,237,0.4)] shrink-0 mt-1"
            aria-label="View experience journey"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>

        {/* List Keahlian: Grid 2 Kolom di Mobile, Grid 3 Kolom di Tablet, Baris Horizontal di Desktop */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
            hidden: {}
          }}
          className="w-full xl:w-[78%] grid grid-cols-2 sm:grid-cols-3 xl:flex xl:flex-row gap-3 sm:gap-4 xl:gap-12 items-stretch xl:items-center xl:overflow-x-auto hide-scrollbar"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
              }}
              className="flex flex-col items-start justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#143DED]/40 hover:bg-white/[0.04] xl:p-0 xl:bg-transparent xl:border-none transition-all duration-300 cursor-pointer group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl border border-white/10 bg-[#05070D] flex items-center justify-center text-white/60 group-hover:text-[#143DED] group-hover:border-[#143DED]/50 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                {skill.icon}
              </div>
              <p className="font-body text-xs sm:text-sm font-medium text-white/90 whitespace-pre-line leading-snug group-hover:text-white transition-colors">
                {skill.label}
              </p>
            </motion.div>
          ))}

          {/* Tombol navigasi di Desktop (tetap di ujung kanan) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }
            }}
            className="hidden xl:flex shrink-0 pl-4 items-center"
          >
            <a
              href="#experience"
              className="w-12 h-12 rounded-full bg-[#143DED] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(20,61,237,0.4)]"
              aria-label="View experience journey"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Capabilities;
