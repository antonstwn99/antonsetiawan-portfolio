import React, { useState, useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsDesktop(window.innerWidth > 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    if (!isDesktop) return;

    const onMouseMove = (e) => {
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      if (!isVisible) setIsVisible(true);
    };
    const onMouseOver = (e) => {
      const interactiveElement = e.target.closest('[data-cursor]');
      setCursorText(
        interactiveElement ? interactiveElement.getAttribute('data-cursor') : ''
      );
    };
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isDesktop, isVisible]);

  if (!isDesktop) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        transition: 'opacity 0.3s',
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-150 ease-out"
        style={{ transform: cursorText ? 'scale(1)' : 'scale(0)' }}
      >
        {cursorText && (
          <div className="bg-white text-[#05070D] font-body text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {cursorText}
          </div>
        )}
      </div>
      <div
        className="w-2.5 h-2.5 bg-white rounded-full mix-blend-difference transition-transform duration-150 ease-out"
        style={{ transform: cursorText ? 'scale(0)' : 'scale(1)' }}
      ></div>
    </div>
  );
};

export default CustomCursor;
