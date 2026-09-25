import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const SelectedWork = () => {
  const [activeProject, setActiveProject] = useState(null); // Untuk Modal Case Study
  const [activeCategory, setActiveCategory] = useState('All');
  
  // State Data
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // FETCH DATA
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });
      if (data) setProjects(data);
      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  // Kunci scroll saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeProject]);

  // Ekstrak kategori & Filter Data
  const categories = ['All', ...new Set(projects.flatMap(item => 
    Array.isArray(item.category) ? item.category : [item.category]
  ))];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => 
        Array.isArray(project.category) 
          ? project.category.includes(activeCategory) 
          : project.category === activeCategory
      );

  // Reset Carousel ke 0 setiap kali kategori diganti
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // =========================================
  // LOGIKA 3D COVER FLOW CAROUSEL
  // =========================================
  const nextSlide = () => {
    if (currentIndex < filteredProjects.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleDragEnd = (event, info) => {
    // Toleransi swipe (jika ditarik lebih dari 50px)
    if (info.offset.x < -50) nextSlide();
    else if (info.offset.x > 50) prevSlide();
  };

  // Menghitung posisi tiap kartu berdasarkan currentIndex
  const getCardStyles = (index) => {
    const diff = index - currentIndex;
    // Jarak geser (offset) untuk desktop vs mobile
    const offset = window.innerWidth < 768 ? 65 : 50; 
    
    if (diff === 0) {
      // KARTU TENGAH (AKTIF)
      return { x: '0%', scale: 1, zIndex: 10, opacity: 1, rotateY: 0, filter: 'brightness(100%)' };
    } else if (diff === 1) {
      // KARTU KANAN 1
      return { x: `${offset}%`, scale: 0.8, zIndex: 5, opacity: 0.6, rotateY: -15, filter: 'brightness(30%)' };
    } else if (diff === -1) {
      // KARTU KIRI 1
      return { x: `-${offset}%`, scale: 0.8, zIndex: 5, opacity: 0.6, rotateY: 15, filter: 'brightness(30%)' };
    } else if (diff > 1) {
      // SEMBUNYI DI KANAN
      return { x: `${offset + 30}%`, scale: 0.6, zIndex: 1, opacity: 0, rotateY: -25 };
    } else if (diff < -1) {
      // SEMBUNYI DI KIRI
      return { x: `-${offset + 30}%`, scale: 0.6, zIndex: 1, opacity: 0, rotateY: 25 };
    }
  };

  // Ambil data proyek yang sedang aktif di tengah
  const currentItem = filteredProjects[currentIndex];

  return (
    <section id="work" className="py-24 px-6 md:px-16 overflow-hidden flex flex-col items-center">
      
      {/* HEADER & FILTER */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#143DED]"></div>
            <span className="font-body text-xs font-semibold tracking-widest uppercase text-white/50">Selected Work</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold leading-[1.1] text-white">
            Digital products<br />that solve <span className="text-[#143DED]">real</span> problems.
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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

      {/* =========================================
          3D CAROUSEL SECTION
          ========================================= */}
      <div className="w-full max-w-6xl relative perspective-[1200px] flex flex-col items-center mt-4">
        
        {/* Kontainer Kartu Gambar */}
        <div className="relative w-full h-[250px] sm:h-[400px] md:h-[500px] flex items-center justify-center transform-style-3d">
          {isLoading ? (
            <div className="w-[80%] md:w-[60%] h-[80%] bg-white/5 rounded-3xl animate-pulse border border-white/10 flex items-center justify-center">
              <span className="text-[#143DED] text-xs font-mono tracking-widest">LOADING ASSETS...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-white/50 text-sm">Tidak ada proyek di kategori ini.</div>
          ) : (
            filteredProjects.map((project, index) => {
              const styles = getCardStyles(index);
              const isActive = index === currentIndex;

              return (
                <motion.div
                  key={project.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  initial={false}
                  animate={styles}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    // Jika klik kartu samping, bawa ke tengah. Jika klik kartu tengah, tidak terjadi apa-apa
                    if (index > currentIndex) nextSlide();
                    else if (index < currentIndex) prevSlide();
                  }}
                  className={`absolute w-[85%] md:w-[55%] aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden bg-[#05070D] border ${isActive ? 'border-white/20 shadow-[0_20px_50px_rgba(20,61,237,0.3)] cursor-grab active:cursor-grabbing' : 'border-transparent cursor-pointer'}`}
                >
                  <img
                    src={project.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    draggable="false" // Cegah browser mengira ini drag gambar biasa
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-transparent opacity-60"></div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* =========================================
            DYNAMIC TEXT SECTION (Hanya untuk item aktif)
            ========================================= */}
        <div className="w-full max-w-2xl mt-8 flex flex-col items-center text-center px-4 relative min-h-[160px]">
          {/* Tombol Panah Kiri/Kanan (Desktop & Tablet) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full flex justify-between px-2 md:-mx-12 pointer-events-none">
            <button onClick={prevSlide} disabled={currentIndex === 0} className={`pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-[#05070D]/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 ${currentIndex === 0 ? 'opacity-0' : 'opacity-100 hover:bg-white/10 hover:border-white/50'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button onClick={nextSlide} disabled={currentIndex === filteredProjects.length - 1} className={`pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-[#05070D]/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 ${currentIndex === filteredProjects.length - 1 ? 'opacity-0' : 'opacity-100 hover:bg-white/10 hover:border-white/50'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {currentItem && (
              <motion.div
                key={currentItem.id} // Kunci penting agar teks berefek fade in/out tiap ganti proyek
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center w-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  {currentItem.featured && <span className="bg-[#143DED]/20 text-[#143DED] border border-[#143DED]/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Featured</span>}
                  <span className="text-white/50 text-xs font-body font-medium">
                    {Array.isArray(currentItem.category) ? currentItem.category.join(' & ') : currentItem.category} • {currentItem.year}
                  </span>
                </div>
                
                <h3 className="font-heading text-2xl md:text-4xl font-bold text-white mb-6">
                  {currentItem.title}
                </h3>

                <button onClick={() => setActiveProject(currentItem)} className="group flex items-center gap-3 bg-[#143DED] hover:bg-white text-white hover:text-[#05070D] transition-colors duration-300 px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(20,61,237,0.3)]">
                  <span>View Case Study</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* =========================================
          MODAL DETAIL PROYEK
          ========================================= */}
      <AnimatePresence>
        {activeProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#05070D]/90 backdrop-blur-md" onClick={() => setActiveProject(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-[1.3] border border-white/10 w-full max-w-3xl rounded-3xl p-6 md:p-12 relative overflow-y-auto overflow-x-hidden max-h-[85vh] shadow-[0_8px_32px_rgba(0,0,0,0.4)]" onClick={(e) => e.stopPropagation()} data-lenis-prevent="true">
              <div className="absolute inset-0 border-t border-white/20 rounded-3xl pointer-events-none"></div>
              
              {/* Gambar Cover di Modal */}
              <div className="w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-8 border border-white/10">
                 <img src={activeProject.image} alt={activeProject.title} className="w-full h-full object-cover" />
              </div>

              <button onClick={() => setActiveProject(null)} className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition-transform hover:rotate-90 outline-none rounded-full p-1 duration-300 bg-[#05070D]/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none z-10"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>
              
              <span className="text-[#143DED] text-xs font-semibold tracking-widest uppercase mb-3 block mt-2 md:mt-0 pr-8">
                {Array.isArray(activeProject.category) ? activeProject.category.join(' & ') : activeProject.category} • {activeProject.year}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{activeProject.title}</h3>
              <p className="font-body text-white/80 text-sm md:text-base mb-8 leading-relaxed max-w-2xl">{activeProject.description || 'Detailed case study coming soon.'}</p>
              
              <div className="mb-8 md:mb-10">
                <h4 className="text-white/50 text-xs tracking-widest uppercase mb-4">Core Tools & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {activeProject.tools?.map((tool, i) => (
                    <span key={i} className="text-xs font-medium text-white/90 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{tool}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                {activeProject.link && (
                  <a href={activeProject.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#143DED] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white hover:text-[#05070D] transition-all duration-300 shadow-[0_0_15px_rgba(20,61,237,0.4)]">
                    Visit Project <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                )}
                <button onClick={() => setActiveProject(null)} className="inline-flex items-center gap-3 bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white hover:text-[#05070D] transition-all duration-300">Close Window</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SelectedWork;