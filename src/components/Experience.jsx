import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE_DATA } from '../data/portfolioData';

const Experience = () => {
  return (
    <section id="experience" className="py-24 px-6 md:px-16 overflow-hidden">
      <div className="flex flex-col xl:flex-row gap-12 xl:gap-24">
        <div className="w-full xl:w-[25%] shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#143DED]">
              Journey
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.1] text-white">
            Milestones
            <br />
            that <span className="text-[#143DED]">shaped me.</span>
          </h2>
        </div>
        <div className="w-full xl:w-[75%] relative flex flex-col justify-center mt-8 xl:mt-0">
          <div className="absolute top-[24px] left-0 w-full h-[1px] bg-gradient-to-r from-[#143DED]/10 via-[#143DED]/50 to-transparent hidden md:block"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 relative z-10">
            {EXPERIENCE_DATA.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col group relative bg-[#080D18] md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none border border-white/5 md:border-none hover:bg-white/[0.02] md:hover:bg-transparent transition-colors"
              >
                <div className="hidden md:flex w-3 h-3 rounded-full bg-[#05070D] border-2 border-[#143DED] mb-6 relative group-hover:scale-150 group-hover:bg-[#143DED] transition-all duration-500">
                  <div className="absolute inset-[-4px] rounded-full border border-[#143DED]/30 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                </div>
                <div className="md:hidden w-8 h-[1px] bg-[#143DED]/50 mb-4"></div>
                <h3 className="font-heading text-xl md:text-2xl font-semibold text-[#143DED] mb-2">
                  {item.year}
                </h3>
                <p className="font-body text-sm font-bold text-white mb-1">
                  {item.title}
                </p>
                <p className="font-body text-xs text-white/50 uppercase tracking-widest mb-3">
                  {item.role}
                </p>
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
