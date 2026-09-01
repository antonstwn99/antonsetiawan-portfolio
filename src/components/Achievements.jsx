import React from 'react';
import { motion } from 'framer-motion';
import { ACHIEVEMENTS_DATA } from '../data/portfolioData';

const Achievements = () => {
  return (
    <section className="py-12 px-6 md:px-16 overflow-hidden">
      <div className="flex flex-col xl:flex-row gap-12 xl:gap-24">
        <div className="w-full xl:w-[25%] shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#143DED]">
              Recognition
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.1] text-white">
            Awards &<br />
            <span className="text-[#143DED]">Certifications.</span>
          </h2>
        </div>
        <div className="w-full xl:w-[75%] flex flex-col gap-4 relative z-10">
          {ACHIEVEMENTS_DATA.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-[#080D18] border border-white/5 hover:border-[#143DED]/30 hover:bg-white/[0.02] transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#05070D] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#143DED]/50 transition-colors">
                  {item.type === 'Achievement' ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#143DED"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#143DED"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-white mb-1 group-hover:text-[#143DED] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-white/50">
                    {item.issuer}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 pl-14 md:pl-0">
                <span className="font-body text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-white/70 border border-white/10">
                  {item.year}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
