'use client';

import { X, Check, Clock, RefreshCw, MessageCircle, Share2, Info, ListChecks } from 'lucide-react';
import { Service, SiteData } from '@/lib/data';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

const FALLBACK_IMAGE = 'https://picsum.photos/seed/sia/800/600';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
  contactData: SiteData['contact'];
  onShowToast: (title: string, message: string) => void;
}

export default function ServiceModal({ service, onClose, contactData, onShowToast }: ServiceModalProps) {
  if (!service) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const requestServiceQuote = () => {
    const message = `Olá! Vi no portfólio o serviço *${service.title}* e gostaria de um orçamento personalizado.\n\nCategoria: ${service.category}\nInvestimento a partir de: ${formatCurrency(service.price)}\n\nPoderia me passar mais informações?`;
    window.open(`https://wa.me/${contactData.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    onShowToast('Redirecionando...', 'Abrindo WhatsApp');
  };

  const shareService = () => {
    const url = window.location.href;
    const text = `Confira o serviço *${service.title}* da SIA Site Criative! ${formatCurrency(service.price)}`;
    
    if (navigator.share) {
      navigator.share({ title: service.title, text: text, url: url });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      onShowToast('Link copiado!', 'Compartilhe com quem precisar');
    }
  };

  return (
    <AnimatePresence>
      {service && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/95 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="service-detail-modal rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden"
          >
            <div className="relative h-48 md:h-72 bg-dark flex-shrink-0">
              <Image 
                src={service.image || FALLBACK_IMAGE} 
                alt={service.title || 'Serviço'}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"></div>
              <button 
                onClick={onClose}
                className="absolute top-3 right-3 md:top-4 md:right-4 bg-dark/80 hover:bg-dark text-primary w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-10 border border-primary/30"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 right-3 md:right-6">
                <span className="tag text-[10px] md:text-xs px-3 py-1.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                  {service.category}
                </span>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-black italic text-text-secondary uppercase leading-tight">
                  {service.title}
                </h2>
              </div>
            </div>
            
            <div className="modal-body p-4 md:p-8 overflow-y-auto">
              <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-bold text-text-secondary mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 md:w-5 md:h-5 text-primary" /> Sobre o Serviço
                  </h3>
                  <p className="text-text-primary/80 text-sm md:text-base leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <h3 className="text-base md:text-lg font-bold text-text-secondary mb-3 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 md:w-5 md:h-5 text-primary" /> O que está incluído
                  </h3>
                  <ul className="space-y-2 md:space-y-3 text-text-primary/80 text-sm md:text-base mb-6">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="lg:w-80 flex-shrink-0">
                  <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-6 lg:sticky lg:top-0">
                    <div className="mb-4">
                      <span className="text-text-primary/60 text-xs md:text-sm uppercase tracking-wider block mb-1">Investimento a partir de</span>
                      <span className="text-2xl md:text-4xl font-black text-primary">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                      <div className="flex items-center gap-3 text-text-primary/70 text-xs md:text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 text-text-primary/70 text-xs md:text-sm">
                        <RefreshCw className="w-4 h-4 text-primary" />
                        <span>{service.revisions}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={requestServiceQuote}
                      className="w-full btn-primary py-3 md:py-4 rounded-xl font-black uppercase italic flex items-center justify-center gap-2 mb-3 text-sm md:text-base"
                    >
                      <MessageCircle className="w-5 h-5" /> Solicitar Orçamento
                    </button>
                    
                    <button 
                      onClick={shareService}
                      className="w-full btn-secondary py-2.5 md:py-3 rounded-xl font-bold uppercase text-xs md:text-sm flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" /> Compartilhar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
