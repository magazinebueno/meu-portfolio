'use client';

import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/data';
import Image from 'next/image';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-dark/50 border-y border-primary/20 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-primary text-xs font-black uppercase tracking-widest mb-2 block">Depoimentos</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black italic text-text-secondary">O que dizem nossos clientes</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-6 relative h-full flex flex-col">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                  <Image 
                    src={t.image} 
                    alt={t.name}
                    fill
                    className="rounded-full object-cover border-2 border-primary"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-text-secondary text-sm md:text-base truncate">{t.name}</h4>
                  <p className="text-xs text-text-primary/60 truncate">{t.company}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-2 md:mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-text-primary/80 text-xs md:text-sm leading-relaxed italic flex-1">&quot;{t.text}&quot;</p>
              <Quote className="absolute top-4 right-4 md:top-6 md:right-6 text-primary/20 w-8 h-8 md:w-10 md:h-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
