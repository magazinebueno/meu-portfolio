'use client';

import { X, MessageCircle, Mail, Phone, Copy, ArrowRight } from 'lucide-react';
import { SiteData } from '@/lib/data';
import { motion, AnimatePresence } from 'motion/react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SiteData;
  onShowToast: (title: string, message: string) => void;
}

export default function ContactModal({ isOpen, onClose, data, onShowToast }: ContactModalProps) {
  const copyPhone = () => {
    navigator.clipboard.writeText(data.contact.phone);
    onShowToast('Copiado!', 'Número de telefone copiado');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="bg-card border border-primary/20 rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-primary/60 hover:text-primary w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-black italic text-text-secondary mb-2">Fale Conosco</h3>
              <p className="text-text-primary/60 text-xs md:text-sm">Escolha como prefere entrar em contato</p>
            </div>
            
            <div className="space-y-3">
              <a 
                href={`https://wa.me/${data.contact.whatsapp}?text=Olá!%20Gostaria%20de%20um%20orçamento%20para%20...`} 
                target="_blank" 
                className="flex items-center gap-3 md:gap-4 bg-green-600 hover:bg-green-700 text-white p-3 md:p-4 rounded-xl transition-all group"
              >
                <MessageCircle className="w-6 h-6" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-bold text-sm md:text-base">WhatsApp</div>
                  <div className="text-xs opacity-90 truncate">Resposta rápida</div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <a 
                href={`mailto:${data.contact.email}`} 
                className="flex items-center gap-3 md:gap-4 bg-card border border-primary/20 hover:border-primary/40 text-text-primary p-3 md:p-4 rounded-xl transition-all group"
              >
                <Mail className="w-6 h-6 text-primary" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-bold text-sm md:text-base">E-mail</div>
                  <div className="text-xs text-text-primary/60 truncate">{data.contact.email}</div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <button 
                onClick={copyPhone}
                className="w-full flex items-center gap-3 md:gap-4 bg-card border border-primary/20 hover:border-primary/40 text-text-primary p-3 md:p-4 rounded-xl transition-all group"
              >
                <Phone className="w-6 h-6 text-primary" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-bold text-sm md:text-base">Telefone</div>
                  <div className="text-xs text-text-primary/60">{data.contact.phone}</div>
                </div>
                <Copy className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
