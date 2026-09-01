import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { SKILL_METRICS } from '../data/portfolioData';
import mascotGlb from '../assets/anton/antons-mascot.glb';

// Komponen Pembaca File GLB
const AntonMascotModel = () => {
  const { scene } = useGLTF(mascotGlb);
  const meshRef = useRef();

  // Animasi mengambang dan menatap lambat
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(t / 2.5) / 4; // Rotasi kiri-kanan lambat
    meshRef.current.rotation.z = Math.sin(t / 2) / 15;
    meshRef.current.position.y = Math.sin(t / 1.5) / 10;
  });

  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
      <primitive ref={meshRef} object={scene} scale={1.8} position={[0, -1.2, 0]} />
    </Float>
  );
};

// PRE-LOAD Model agar tidak lambat
useGLTF.preload(mascotGlb);

const About = () => {
  return (
    <section
      id="about"
      className="py-24 px-6 md:px-16 flex flex-col lg:flex-row items-center lg:items-stretch xl:items-center justify-between gap-12 lg:gap-6 xl:gap-8 overflow-hidden relative"
    >
      {/* KIRI: Teks & Skill Tags */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-[32%] flex flex-col items-start text-left relative z-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#143DED]"></div>
          <span className="font-body text-xs font-semibold tracking-widest uppercase text-white/50">
            About Me
          </span>
        </div>
        <h2 className="font-heading text-4xl md:text-5xl font-bold leading-[1.1] text-white mb-6">
          I blend <span className="text-[#143DED]">creativity</span>
          <br />
          with technology<span className="text-[#143DED]">.</span>
        </h2>
        <p className="font-body text-white/70 text-sm md:text-base mb-8 leading-relaxed">
          Saya adalah Mahasiswa Program Studi Teknologi Rekayasa Multimedia di
          Politeknik Hasnur. Keterampilan saya mencakup desain grafis, web/app
          development, UI/UX, video directing, animasi, hingga AI Prompting.
          Saya merancang ekosistem digital dan memimpin tim dari fase ideasi
          hingga implementasi teknis.
        </p>

        {/* Hard & Soft Skills Labels */}
        <div className="mb-8 w-full">
          <div className="mb-5">
            <h4 className="font-body text-[10px] text-[#143DED] font-bold uppercase tracking-widest mb-3">
              Hard Skills & Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Desain Grafis',
                'Brand Identity',
                'UI/UX Design',
                'Programming & Dev',
                'Web Development',
                'App Development',
                'Game Dev (Unity)',
                'Video Production',
                'Animation',
                'AI Prompting',
                'Data Visualisasi',
                'React',
                'Figma',
              ].map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] sm:text-xs font-medium bg-[#143DED]/10 text-[#143DED] px-3 py-1.5 rounded-md border border-[#143DED]/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-body text-[10px] text-white/50 uppercase tracking-widest mb-3">
              Soft Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Communication',
                'Professional Ethics',
                'Public Speaking',
                'Problem Solving',
                'Critical Thinking',
                'Teamwork',
                'Adaptability',
                'Task Management',
                'Creative Thinking',
              ].map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] sm:text-xs font-medium bg-white/5 text-white/80 px-3 py-1.5 rounded-md border border-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <a
          href="#experience"
          className="group flex items-center w-fit gap-4 bg-transparent border border-white/20 hover:border-white/50 pl-6 pr-2 py-2 rounded-full transition-all duration-300"
        >
          <span className="font-body text-sm font-medium text-white group-hover:text-[#143DED] transition-colors duration-300">
            More about me
          </span>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#143DED]/10 transition-colors duration-300">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:stroke-[#143DED] transition-colors duration-300"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </a>
      </motion.div>

      {/* TENGAH: Animasi GLB Maskot 3D */}
      <div 
        className="w-full lg:w-[36%] flex justify-center py-10 relative lg:self-center aspect-square md:aspect-[4/5] lg:aspect-square group cursor-none outline-none"
        data-cursor="3D MASCOT"
      >
        {/* Latar Belakang Cahaya Aura Canggih */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#143DED] blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full animate-pulse pointer-events-none" />
        
        {/* Lingkaran Orbit Tipis (Menjaga Vibe Tech) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-700">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="absolute w-[240px] sm:w-[300px] xl:w-[380px] h-[240px] sm:h-[300px] xl:h-[380px] rounded-full border border-[#143DED]/20 border-dashed" />
        </div>

        {/* Kanvas 3D Objek Wajah */}
        <div className="relative z-10 w-full h-full">
        <Canvas 
            camera={{ position: [0, 0, 5.5], fov: 45 }}
            dpr={[1, 1.5]} 
            performance={{ min: 0.5 }}
          >
            <ambientLight intensity={0.8} />
            <spotLight position={[5, 10, 10]} angle={0.25} penumbra={1} intensity={2} color="#ffffff" />
            <spotLight position={[-10, -5, 5]} angle={0.5} penumbra={1} intensity={1} color="#143DED" />
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              minPolarAngle={Math.PI / 2.5} 
              maxPolarAngle={Math.PI / 1.5}
            />
            
            <AntonMascotModel />
            
            <Environment preset="city" />
            
            {/* OPTIMASI: frames={1} mencegah render ulang bayangan setiap detik */}
            <ContactShadows 
              position={[0, -2.5, 0]} 
              opacity={0.4} 
              scale={15} 
              blur={2.5} 
              far={4} 
              frames={1} 
              resolution={256} 
            />
          </Canvas>
        </div>
      </div>

      {/* KANAN: Bento Boxes & Radar Chart */}
      <div className="w-full lg:w-[32%] flex flex-col gap-6 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Freelance\nExperience', value: 'Since\n2022' },
            { label: 'Ventures &\nStartups', value: '4+ Tech\nProducts' },
            { label: 'Focus &\nExpertise', value: 'Visual &\nSystems' },
            { label: 'Creative\nEcosystem', value: 'Digital\nBranding' },
          ].map((box, i) => (
            <div
              key={i}
              className="relative group bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.1)] rounded-2xl p-5 flex flex-col justify-between aspect-square hover:bg-white/[0.06] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 border-t border-white/10 rounded-2xl pointer-events-none"></div>
              <p className="font-body text-xs text-white/50 whitespace-pre-line">
                {box.label}
              </p>
              <h3 className="font-heading text-xl xl:text-2xl text-white font-medium whitespace-pre-line">
                {box.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Grafik Radar ditaruh di kolom kanan untuk menyeimbangkan layout */}
        <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex-grow flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="font-body text-[10px] text-[#143DED] uppercase tracking-widest font-bold">
              Competency Radar
            </h4>
            <span className="flex h-2 w-2" title="Live Data Stream">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#143DED] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#143DED]"></span>
            </span>
          </div>
          <div className="flex-grow min-h-[220px] w-full cursor-crosshair">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="55%"
                data={SKILL_METRICS}
              >
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fill: 'rgba(255,255,255,0.6)',
                    fontSize: 10,
                    fontFamily: 'Plus Jakarta Sans',
                    fontWeight: 500,
                  }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#080D18',
                    borderColor: 'rgba(20,61,237,0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    backdropFilter: 'blur(10px)',
                  }}
                  itemStyle={{ color: '#143DED', fontWeight: 'bold' }}
                  formatter={(value) => [`${value}%`, 'Proficiency']}
                />
                <Radar
                  name="Proficiency"
                  dataKey="A"
                  stroke="#143DED"
                  strokeWidth={2}
                  fill="#143DED"
                  fillOpacity={0.4}
                  activeDot={{
                    r: 5,
                    fill: '#fff',
                    stroke: '#143DED',
                    strokeWidth: 2,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;