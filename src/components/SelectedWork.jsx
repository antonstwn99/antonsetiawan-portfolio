import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECT_DATABASE } from '../data/portfolioData';

const SelectedWork = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Mengekstrak semua kategori unik dari database secara otomatis
  const categories = ['All', ...new Set(PROJECT_DATABASE.map(item => item.category))];

  // Logika Filter: Jika "All" tampilkan semua (atau 5 jika tidak showAll), jika kategori spesifik tampilkan semua yang cocok
  const filteredProjects = activeCategory === 'All'
    ? PROJECT_DATABASE
    : PROJECT_DATABASE.filter(project => project.category === activeCategory);

  const displayedProjects = (showAll || activeCategory !== 'All')
    ? filteredProjects
    : filteredProjects.slice(0, 5);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeProject]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      // Dinamis: Geser 80vw di HP, atau 400px di Desktop
      const scrollAmount = window.innerWidth < 768 ? window.innerWidth * 0.8 : 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="work"
      className="py-24 pl-6 md:pl-16 overflow-hidden flex flex-col xl:flex-row gap-12 md:gap-20"
    >
      <div className="w-full xl:w-1/4 flex flex-col justify-between shrink-0 pr-6 xl:pr-0">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#143DED]"></div>
            <span className="font-body text-xs font-semibold tracking-widest uppercase text-white/50">
              Selected Work
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold leading-[1.1] text-white mb-8">
            Digital products
            <br />
            that solve <span className="text-[#143DED]">real</span>
            <br />
            problems.
          </h2>
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center w-fit gap-3 bg-transparent border-none p-0 cursor-pointer text-white/70 hover:text-[#143DED] transition-colors duration-300 outline-none rounded-full"
          >
            <span className="font-body text-sm font-medium">
              {showAll ? 'Show less projects' : 'View all projects'}
            </span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#143DED] transition-all duration-300">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${
                  showAll ? 'rotate-180' : 'group-hover:translate-x-0.5'
                }`}
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </button>

          {/* Deretan Tombol Kategori Dinamis */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  // Otomatis kembalikan scroll ke paling kiri saat filter diganti
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-body font-medium transition-all duration-300 outline-none ${
                  activeCategory === category
                    ? 'bg-[#143DED] text-white border border-[#143DED] shadow-[0_0_15px_rgba(20,61,237,0.4)]'
                    : 'bg-transparent text-white/50 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* mt-16 diubah ke mt-6 agar jarak antara filter dan panah lebih seimbang */}
        <div className="hidden xl:flex gap-4 mt-6">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 hover:border-white/50 transition-all duration-300 group outline-none"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform duration-300"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 hover:border-white/50 transition-all duration-300 group outline-none"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-8 pr-6 md:pr-16 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence>
          {displayedProjects.map((project, index) => (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, width: 0, margin: 0 }}
              transition={{ duration: 0.4 }}
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group block relative w-[280px] md:w-[380px] shrink-0 snap-start rounded-2xl md:rounded-3xl overflow-hidden bg-[#080D18] cursor-pointer hover:bg-white/[0.05] border border-transparent transition-all duration-500 outline-none text-left"
              data-cursor="VIEW"
            >
              <div className="w-full aspect-[4/3] bg-[#05070D] relative overflow-hidden">
                {/* Futuristic Hologram Skeleton Background */}
                <div className="absolute inset-0 bg-[#080D18] z-0 overflow-hidden flex items-center justify-center">
                  <motion.div 
                    animate={{ y: ['-100%', '100%'] }} 
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} 
                    className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-transparent via-[#143DED]/20 to-transparent" 
                  />
                  <div className="text-[#143DED]/40 font-mono text-[10px] tracking-widest transition-transform duration-700 group-hover:scale-110 group-hover:opacity-0 flex flex-col items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="animate-pulse">
                      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                    </svg>
                    [ RENDERING ASSET ]
                  </div>
                </div>
                <img
                  // Membaca gambar dari portfolioData.js, fallback ke gambar placeholder jika belum diisi
                  src={project.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                  alt={project.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-50 md:opacity-30 group-hover:opacity-80 transition-all duration-700 scale-100 md:scale-105 group-hover:scale-100 z-10 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/90 via-[#05070D]/40 to-transparent backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end pb-8 gap-4 text-center z-20">
                  <span className="text-white font-body text-sm font-bold tracking-widest uppercase translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                    View Case Study
                  </span>
                  <div className="flex flex-wrap justify-center gap-2 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 delay-75 px-4">
                    {project.tools?.map((tool, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-white border border-white/20 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                {index === 0 && (
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 border border-[#143DED]/50 bg-[#143DED]/20 backdrop-blur-md px-3 py-1 rounded-full text-[#143DED] text-[10px] font-bold tracking-wider uppercase z-10">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8 flex items-end justify-between border-t border-white/5 bg-transparent">
                <div>
                  <h3 className="font-heading text-xl md:text-2xl font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="font-body text-sm text-white/50">
                    {project.category}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="font-body text-xs text-white/50">
                    {project.year}
                  </span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/5 transition-all duration-300">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#05070D]/90 backdrop-blur-md"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-[1.3] border border-white/10 w-full max-w-3xl rounded-3xl p-6 md:p-12 relative overflow-y-auto overflow-x-hidden max-h-[85vh] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent="true"
              >
              <div className="absolute inset-0 border-t border-white/20 rounded-3xl pointer-events-none"></div>
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition-transform hover:rotate-90 outline-none rounded-full p-1 duration-300 bg-[#05070D]/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none z-10"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
              <span className="text-[#143DED] text-xs font-semibold tracking-widest uppercase mb-3 block mt-2 md:mt-0 pr-8">
                {activeProject.category} • {activeProject.year}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                {activeProject.title}
              </h3>
              <p className="font-body text-white/80 text-sm md:text-lg mb-8 leading-relaxed max-w-2xl">
                {activeProject.description ||
                  'Detailed case study coming soon.'}
              </p>
              <div className="mb-8 md:mb-10">
                <h4 className="text-white/50 text-xs tracking-widest uppercase mb-4">
                  Core Tools & Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProject.tools?.map((tool, i) => (
                    <span
                      key={i}
                      className="text-xs md:text-sm font-medium text-white/90 bg-white/5 border border-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {/* Tombol Link Eksternal hanya muncul jika Anda menambahkan properti "link: '...'" di portfolioData.js */}
                {activeProject.link && (
                  <a
                    href={activeProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#143DED] text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-sm font-bold hover:bg-white hover:text-[#05070D] transition-all duration-300 shadow-[0_0_15px_rgba(20,61,237,0.4)]"
                  >
                    Visit Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                )}
                <button
                  onClick={() => setActiveProject(null)}
                  className="inline-flex items-center gap-3 bg-white/10 text-white border border-white/20 px-6 md:px-8 py-2 md:py-3 rounded-full text-sm font-bold hover:bg-white hover:text-[#05070D] transition-all duration-300"
                >
                  Close Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SelectedWork;
