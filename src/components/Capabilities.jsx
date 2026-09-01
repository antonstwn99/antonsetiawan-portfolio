import React from 'react';
import {
  Code2,
  Terminal,
  PenTool,
  BrainCircuit,
  Video,
  Box,
} from 'lucide-react';

const Capabilities = () => {
  const skills = [
    {
      id: 1,
      label: 'Web & App\nDevelopment',
      icon: <Code2 strokeWidth={1.5} size={24} />,
    },
    {
      id: 2,
      label: 'UI/UX &\nGraphic Design',
      icon: <PenTool strokeWidth={1.5} size={24} />,
    },
    {
      id: 3,
      label: 'Video Directing\n& Animation',
      icon: <Video strokeWidth={1.5} size={24} />,
    },
    {
      id: 4,
      label: 'Social Media\nBranding',
      icon: <Terminal strokeWidth={1.5} size={24} />,
    },
    {
      id: 5,
      label: 'Game Dev\n(Unity)',
      icon: <Box strokeWidth={1.5} size={24} />,
    },
    {
      id: 6,
      label: 'AI Prompt\nEngineering',
      icon: <BrainCircuit strokeWidth={1.5} size={24} />,
    },
  ];

  return (
    <section id="capabilities" className="py-12 px-6 md:px-16 overflow-hidden">
      <div className="flex flex-col xl:flex-row items-center border border-transparent rounded-3xl bg-[#080D18] p-8 md:p-12 gap-12 group transition-all duration-500 hover:bg-white/[0.02]">
        <div className="w-full xl:w-[20%] shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#143DED]">
              Capabilities
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.1] text-white">
            What I do
            <br />
            best<span className="text-[#143DED]">.</span>
          </h2>
        </div>
        <div
          className="w-full xl:w-[80%] flex gap-8 md:gap-14 overflow-x-auto hide-scrollbar items-center pb-4 xl:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex flex-col items-start gap-4 shrink-0 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-white/10 bg-[#05070D] flex items-center justify-center text-white/50 hover:text-[#143DED] hover:border-[#143DED]/50 transition-all duration-300">
                {skill.icon}
              </div>
              <p className="font-body text-sm font-medium text-white/80 whitespace-pre-line leading-tight">
                {skill.label}
              </p>
            </div>
          ))}
          <div className="shrink-0 pl-4 md:pl-8 flex items-center">
            <a
              href="#experience"
              className="w-12 h-12 rounded-full bg-[#143DED] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(20,61,237,0.3)]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
