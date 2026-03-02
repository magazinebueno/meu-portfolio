'use client';

import { motion } from 'motion/react';
import { Rocket, MessageCircle } from 'lucide-react';
import { SiteData } from '@/lib/data';

interface HeroProps {
  data: SiteData;
  onOpenContact: () => void;
}

export default function Hero({ data, onOpenContact }: HeroProps) {
  return (
    <section id="home" className="hero-gradient min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/60 to-dark"></div>
      
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-5xl mx-auto w-full px-4"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/40 text-primary text-xs font-black px-5 py-2.5 rounded-full mb-8 uppercase tracking-widest backdrop-blur-sm">
          <Rocket className="w-3 h-3" /> <span>{data.hero.tagline}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic text-white mb-6 select-none leading-none tracking-tighter">
          <span className="text-gradient block mb-2">{data.hero.title1}</span>
          <span className="text-text-secondary uppercase tracking-tighter">{data.hero.title2}</span>
        </h1>
        
        <p className="mt-6 text-text-primary/80 max-w-2xl mx-auto font-medium text-base md:text-lg lg:text-xl leading-relaxed px-4">
          {data.hero.description}
        </p>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a href="#portfolio" className="btn-primary px-8 md:px-10 py-4 md:py-5 rounded-2xl shadow-2xl uppercase italic flex items-center gap-3 text-base md:text-lg">
            <Rocket className="w-5 h-5" /> <span>{data.hero.btn1}</span>
          </a>
          <button 
            onClick={onOpenContact}
            className="glass-panel hover:bg-primary/10 text-primary font-black px-8 md:px-10 py-4 md:py-5 rounded-2xl border border-primary/30 transition-all uppercase italic text-base md:text-lg backdrop-blur-md"
          >
            <MessageCircle className="w-5 h-5 mr-2 inline" /> <span>{data.hero.btn2}</span>
          </button>
        </div>
        
        <div className="mt-16 flex justify-center gap-6 md:gap-8 text-text-primary/60 flex-wrap">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-black text-primary mb-1">{data.stats.projects}</div>
            <div className="text-xs uppercase tracking-wider text-text-secondary">Projetos</div>
          </div>
          <div className="w-px bg-primary/20 hidden md:block"></div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-black text-primary mb-1">{data.stats.clients}</div>
            <div className="text-xs uppercase tracking-wider text-text-secondary">Clientes</div>
          </div>
          <div className="w-px bg-primary/20 hidden md:block"></div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-black text-primary mb-1">{data.stats.rating}</div>
            <div className="text-xs uppercase tracking-wider text-text-secondary">Avaliação</div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/50"
      >
        <Rocket className="w-8 h-8 rotate-180" />
      </motion.div>
    </section>
  );
}
