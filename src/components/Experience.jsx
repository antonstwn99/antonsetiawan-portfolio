import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

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
        <div className="w-full xl:w-[25%] shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#143DED]">Journey</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.1] text-white">
            Milestones<br />that <span className="text-[#143DED]">shaped me.</span>
          </h2>
        </div>
        <div className="w-full xl:w-[75%] flex flex-col gap-12 mt-8 xl:mt-0">
          
          {/* EDUCATION SECTION */}
          <div className="relative">
            <h3 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#143DED]"></span> Academic Background
            </h3>
            <div className="grid grid-cols-1 gap-6 relative z-10">
              {isLoading ? (
                <div className="h-32 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse"></div>
              ) : (
                education.map((item, index) => (
                  <motion.div key={`edu-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6 }} className="flex flex-col group relative bg-gradient-to-r from-[#143DED]/10 to-transparent p-6 md:p-8 rounded-2xl border border-[#143DED]/20 hover:border-[#143DED]/50 transition-colors overflow-hidden shadow-[0_8px_32px_rgba(20,61,237,0.1)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#143DED] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-[#143DED] to-cyan-500 text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl uppercase tracking-wider shadow-lg flex items-center gap-2">
                      <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>
                      IPK: {item.gpa}
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">{item.degree}</h3>
                    <p className="font-body text-sm font-bold text-[#143DED] mb-1">{item.institution}</p>
                    <p className="font-body text-xs text-white/50 uppercase tracking-widest mb-4">{item.year}</p>
                    <div className="flex items-start gap-3 mt-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg></div>
                      <p className="font-body text-sm md:text-base text-white/80 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="w-full h-[1px] bg-white/10 my-2 md:my-0"></div>

          {/* EXPERIENCE SECTION */}
          <div className="relative">
            <h3 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#143DED]"></span> Professional Experience
            </h3>
            <div className="absolute top-[60px] left-0 w-full h-[1px] bg-gradient-to-r from-[#143DED]/10 via-[#143DED]/50 to-transparent hidden md:block"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 relative z-10">
              {isLoading ? (
                 <div className="col-span-full h-32 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse"></div>
              ) : (
                experiences.map((item, index) => (
                  <motion.div key={`exp-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: index * 0.1 }} className="flex flex-col group relative bg-[#080D18] md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none border border-white/5 md:border-none hover:bg-white/[0.02] md:hover:bg-transparent transition-colors">
                    <div className="hidden md:flex w-3 h-3 rounded-full bg-[#05070D] border-2 border-[#143DED] mb-6 relative group-hover:scale-150 group-hover:bg-[#143DED] transition-all duration-500">
                      <div className="absolute inset-[-4px] rounded-full border border-[#143DED]/30 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                    </div>
                    <div className="md:hidden w-8 h-[1px] bg-[#143DED]/50 mb-4"></div>
                    <h3 className="font-heading text-xl md:text-2xl font-semibold text-[#143DED] mb-2">{item.year}</h3>
                    <p className="font-body text-sm font-bold text-white mb-1">{item.title}</p>
                    <p className="font-body text-xs text-white/50 uppercase tracking-widest mb-3">{item.role}</p>
                    <p className="font-body text-sm text-white/70 leading-relaxed">{item.desc}</p>
                  </motion.div>
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