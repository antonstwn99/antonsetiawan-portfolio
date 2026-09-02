import React, { useRef, useState, useEffect } from 'react';
import antonUngu from '../assets/anton/anton-ungu.png';
import antonBiru from '../assets/anton/anton-biru.png';

const InteractivePortrait = () => {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const pointerPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  const handlePointerMove = (e) => {
    // PointerEvent di React secara otomatis memiliki clientX dan clientY (baik untuk Mouse maupun Layar Sentuh)
    pointerPos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    // Jika tidak sedang di-hover, matikan mesin render untuk menghemat baterai & CPU
    if (!isHovered) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return;
    }

    const updateMask = () => {
      if (containerRef.current && maskRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        
        // Kalkulasi posisi X dan Y dilakukan SEKARANG (60x per detik)
        // Ini mengimbangi pergerakan animasi melayang (float) dari parent
        const x = ((pointerPos.current.x - rect.left) / rect.width) * 100;
        const y = ((pointerPos.current.y - rect.top) / rect.height) * 100;
        
        maskRef.current.style.WebkitMaskImage = `radial-gradient(circle 180px at ${x}% ${y}%, black 20%, transparent 100%)`;
        maskRef.current.style.maskImage = `radial-gradient(circle 180px at ${x}% ${y}%, black 20%, transparent 100%)`;
      }
      rafId.current = requestAnimationFrame(updateMask);
    };

    // Mulai mesin render
    rafId.current = requestAnimationFrame(updateMask);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={(e) => {
        // Tangkap kordinat awal agar topeng tidak melompat dari pojok
        pointerPos.current = { x: e.clientX, y: e.clientY };
        setIsHovered(true);
      }}
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