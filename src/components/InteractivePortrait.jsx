import React, { useRef, useState, useEffect } from 'react';
import antonUngu from '../assets/anton/anton-ungu.png';
import antonBiru from '../assets/anton/anton-biru.png';

const InteractivePortrait = () => {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const pointerPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  // Ekstrak fungsi update agar bisa dipanggil seketika saat kursor bergerak (Zero Latency)
  const updateMask = (clientX, clientY) => {
    if (!containerRef.current || !maskRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    maskRef.current.style.WebkitMaskImage = `radial-gradient(circle 180px at ${x}% ${y}%, black 20%, transparent 100%)`;
    maskRef.current.style.maskImage = `radial-gradient(circle 180px at ${x}% ${y}%, black 20%, transparent 100%)`;
  };

  const handlePointerMove = (e) => {
    pointerPos.current = { x: e.clientX, y: e.clientY };
    // UPDATE INSTAN! Eksekusi langsung tanpa menunggu frame berikutnya
    updateMask(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!isHovered) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return;
    }

    const loop = () => {
      // UPDATE LOOP: Menjaga topeng tetap sinkron saat mouse/jari DIAM tapi gambar terus melayang
      updateMask(pointerPos.current.x, pointerPos.current.y);
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={(e) => {
        pointerPos.current = { x: e.clientX, y: e.clientY };
        updateMask(e.clientX, e.clientY);
        setIsHovered(true);
      }}
      onPointerLeave={() => setIsHovered(false)}
      // Tangkap momen jari MENYENTUH (meski diam) secara instan di layar sentuh
      onPointerDown={(e) => {
        pointerPos.current = { x: e.clientX, y: e.clientY };
        updateMask(e.clientX, e.clientY);
        setIsHovered(true);
      }}
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
          opacity: isHovered ? 1 : 0
          // KUNCI PERBAIKAN: WebkitMaskImage DIHAPUS dari sini agar React tidak me-reset posisinya ke tengah setiap kali disentuh!
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