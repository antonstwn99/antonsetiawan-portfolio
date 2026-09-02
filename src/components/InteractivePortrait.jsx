import React, { useRef, useState } from 'react';
import antonUngu from '../assets/anton/anton-ungu.png';
import antonBiru from '../assets/anton/anton-biru.png';

const InteractivePortrait = () => {
  const containerRef = useRef(null);
  const maskRef = useRef(null); // Ref baru untuk memanipulasi topeng langsung
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e) => {
    if (!containerRef.current || !maskRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    // DIRECT DOM MANIPULATION: Tidak memicu React re-render, 100x lebih ringan!
    maskRef.current.style.WebkitMaskImage = `radial-gradient(circle 180px at ${x}% ${y}%, black 20%, transparent 100%)`;
    maskRef.current.style.maskImage = `radial-gradient(circle 180px at ${x}% ${y}%, black 20%, transparent 100%)`;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className="relative w-full max-w-[480px] aspect-[4/5] mx-auto md:mr-0 group cursor-none outline-none rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-2xl backdrop-saturate-[2] shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
      data-cursor="TOUCH"
    >
      {/* 1. LAYER BAWAH */}
      <img 
        src={antonUngu} 
        alt="Anton Ungu" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      />

      {/* 2. LAYER ATAS (X-Ray) */}
      <div 
        ref={maskRef}
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          WebkitMaskImage: `radial-gradient(circle 180px at 50% 50%, black 20%, transparent 100%)`,
          maskImage: `radial-gradient(circle 180px at 50% 50%, black 20%, transparent 100%)`
        }}
      >
        <img 
          src={antonBiru} 
          alt="Anton Biru" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>

      {/* Metadata Label */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10 pointer-events-none">
        <div className="bg-[#05070D]/80 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-xl transition-all duration-300 group-hover:border-[#143DED]/30">
          <p className="font-body text-[10px] text-white/50 uppercase tracking-widest mb-1">
            Dynamic Portrait
          </p>
          <p className="font-body text-xs font-semibold text-white">
            Anton Setiawan
          </p>
        </div>
        <div className={`font-body text-[10px] uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full transition-all duration-500 bg-[#05070D]/50 backdrop-blur-sm text-white ${isHovered ? 'bg-[#143DED]/80 border-[#143DED]' : ''}`}>
          {isHovered ? 'Revealed' : 'Hover Me'}
        </div>
      </div>
    </div>
  );
};

export default InteractivePortrait;