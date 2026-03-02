'use client';

import { useState } from 'react';
import { Search, XCircle, ArrowRight, Clock, Paintbrush } from 'lucide-react';
import { Service } from '@/lib/data';
import Image from 'next/image';

interface PortfolioProps {
  services: Service[];
  onOpenService: (service: Service) => void;
  onOpenContact: () => void;
}

const CATEGORIES = ['Todos', 'Sites', 'Identidade Visual', 'Social Media', 'Marketing'];

export default function Portfolio({ services, onOpenService, onOpenContact }: PortfolioProps) {
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const filteredServices = services.filter(s => {
    const matchesCategory = filter === 'Todos' || s.category === filter;
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                         s.description.toLowerCase().includes(search.toLowerCase()) ||
                         s.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div id="portfolio" className="min-h-screen bg-[#0a1929] py-12 md:py-20">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-xl border-b border-primary/20 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Paintbrush className="text-dark w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-text-secondary">
                  <span className="text-primary">SIA</span> CRIATIVE
                </h1>
                <p className="text-[10px] text-text-primary/60 font-bold uppercase tracking-widest">Portfólio de Serviços</p>
              </div>
            </div>
            <button 
              onClick={onOpenContact}
              className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/40 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm uppercase transition-all flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" /> <span className="hidden sm:inline">Orçamento</span>
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 w-5 h-5" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar serviços (ex: site, logo, social media...)" 
              className="w-full input-field p-3 md:p-4 pl-12 rounded-xl outline-none text-sm"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          <nav className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`category-pill ${filter === cat ? 'active' : 'bg-card text-text-primary/70'} px-4 md:px-6 py-2.5 md:py-3 rounded-xl whitespace-nowrap font-bold text-xs md:text-sm flex-shrink-0`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black italic text-text-secondary mb-2">Nossos Serviços</h2>
            <p className="text-text-primary/70 text-sm md:text-base">Soluções criativas para sua marca crescer</p>
          </div>
          <span className="bg-card border border-primary/20 text-primary text-xs px-4 py-2 rounded-full font-bold">
            {filteredServices.length} serviço{filteredServices.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredServices.map(s => (
            <div 
              key={s.id}
              className="service-card rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer" 
              onClick={() => onOpenService(s)}
            >
              <div className="relative h-44 md:h-56 bg-dark flex-shrink-0 overflow-hidden">
                <Image 
                  src={s.image} 
                  alt={s.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80"></div>
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <span className="tag text-[10px] px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider">
                    {s.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 price-tag px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-sm md:text-lg transform group-hover:scale-110 transition-transform">
                  {formatCurrency(s.price)}
                </div>
              </div>
              
              <div className="card-content p-4 md:p-6 flex-1 flex flex-col">
                <h3 className="font-black text-base md:text-lg lg:text-xl text-text-secondary mb-2 md:mb-3 uppercase tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {s.title}
                </h3>
                <p className="text-text-primary/70 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 leading-relaxed flex-1">
                  {s.description}
                </p>
                
                <div className="card-footer flex items-center justify-between mt-auto pt-4 border-t border-primary/15">
                  <div className="flex items-center gap-2 text-text-primary/50 text-xs">
                    <Clock className="w-3 h-3 text-primary/60" />
                    <span className="truncate max-w-[100px] md:max-w-[120px]">{s.duration}</span>
                  </div>
                  <span className="text-primary text-xs md:text-sm font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all flex-shrink-0">
                    Ver detalhes <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-16 md:py-20">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-card border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="w-10 h-10 md:w-12 md:h-12 text-primary/40" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-text-secondary mb-2">Nenhum serviço encontrado</h3>
            <p className="text-text-primary/60 text-sm">Tente buscar com outros termos ou categorias</p>
          </div>
        )}
      </main>
    </div>
  );
}
