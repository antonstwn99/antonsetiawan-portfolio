import React from 'react';
import { motion } from 'framer-motion';

const Process = () => {
  const steps = [
    {
      id: '01',
      title: 'Discover',
      desc: 'Memahami kebutuhan, tujuan, permasalahan, dan konteks proyek sebelum menentukan solusi.',
    },
    {
      id: '02',
      title: 'Research',
      desc: 'Melakukan riset dan eksplorasi untuk menemukan insight, referensi, serta pendekatan yang paling relevan.',
    },
    {
      id: '03',
      title: 'Plan',
      desc: 'Menyusun konsep, strategi, struktur, dan prioritas pekerjaan agar proses pengembangan berjalan terarah.',
    },
    {
      id: '04',
      title: 'Create',
      desc: 'Mengubah konsep menjadi desain, produk digital, konten, atau solusi yang dapat digunakan dan dikembangkan.',
    },
    {
      id: '05',
      title: 'Refine',
      desc: 'Melakukan evaluasi, testing, revisi, dan penyempurnaan berdasarkan kebutuhan serta feedback.',
    },
    {
      id: '06',
      title: 'Deliver',
      desc: 'Menghasilkan output akhir yang siap digunakan dengan memperhatikan kualitas, fungsionalitas, dan tujuan.',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 overflow-hidden bg-[#080D18]/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#143DED]"></div>
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-white/50">
              Methodology
            </span>
            <div className="w-2 h-2 rounded-full bg-[#143DED]"></div>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold leading-[1.1] text-white">
            How I <span className="text-[#143DED]">work.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#143DED]/30 hover:bg-white/[0.04] transition-all duration-300 group"
            >
              <span className="font-heading text-5xl font-bold text-white/5 group-hover:text-[#143DED]/20 transition-colors mb-6 block">
                {step.id}
              </span>
              <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-[#143DED] transition-colors">
                {step.title}
              </h3>
              <p className="font-body text-sm text-white/60 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
