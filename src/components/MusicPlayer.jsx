import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setShowPopup(true);
      // Sembunyikan hologram setelah 4 detik
      setTimeout(() => setShowPopup(false), 4000);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[90] flex items-end gap-4 pointer-events-none">
      
      {/* Tombol Play/Pause */}
      <button 
        onClick={togglePlay}
        className="pointer-events-auto relative w-12 h-12 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#143DED]/50 transition-all duration-300 group outline-none shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        data-cursor={isPlaying ? "PAUSE" : "PLAY AUDIO"}
      >
        {/* Efek Glow saat menyala */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full bg-[#143DED] blur-md opacity-30 animate-pulse"></div>
        )}
        
        {/* Ikon Waveform Interaktif */}
        <div className="relative z-10 flex items-center gap-[2px] h-4">
          <motion.div animate={{ height: isPlaying ? ['4px', '16px', '6px', '12px'] : '4px' }} transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }} className={`w-1 rounded-full ${isPlaying ? 'bg-[#143DED]' : 'bg-white/50 group-hover:bg-white'}`}></motion.div>
          <motion.div animate={{ height: isPlaying ? ['8px', '4px', '14px', '4px'] : '8px' }} transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }} className={`w-1 rounded-full ${isPlaying ? 'bg-cyan-400' : 'bg-white/50 group-hover:bg-white'}`}></motion.div>
          <motion.div animate={{ height: isPlaying ? ['14px', '8px', '16px', '8px'] : '4px' }} transition={{ repeat: Infinity, duration: 0.4, ease: 'easeInOut' }} className={`w-1 rounded-full ${isPlaying ? 'bg-[#143DED]' : 'bg-white/50 group-hover:bg-white'}`}></motion.div>
        </div>
      </button>

      {/* Hologram Pop-Up Now Playing */}
      <AnimatePresence>
        {(showPopup || isPlaying) && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pointer-events-auto bg-gradient-to-r from-[#05070D]/90 to-[#080D18]/90 backdrop-blur-md border border-white/10 pl-4 pr-6 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 mb-1"
          >
            {/* Spinning Vinyl Record */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/20 flex items-center justify-center relative shadow-[0_0_10px_rgba(20,61,237,0.5)]"
            >
              <div className="w-2 h-2 rounded-full bg-[#143DED]"></div>
              {/* Vinyl Grooves */}
              <div className="absolute inset-1 rounded-full border border-white/10"></div>
            </motion.div>
            
            <div className="flex flex-col">
              <span className="font-body text-[8px] text-[#143DED] font-bold uppercase tracking-widest mb-0.5">
                Now Playing
              </span>
              <span className="font-body text-xs text-white/90 font-medium whitespace-nowrap">
              The Weeknd ft Kendrick Lamar - Pray For Me
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elemen Audio (Hidden) */}
      <audio 
        ref={audioRef} 
        loop 
        preload="none"
        // Ganti src ini dengan file MP3 Anda nanti
        src="/ambient-music.mp3" 
      />
    </div>
  );
};

export default MusicPlayer;