'use client';

import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  title: string;
  message: string;
  isVisible: boolean;
}

export default function Toast({ title, message, isVisible }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] max-w-xs w-full px-4"
        >
          <div className="bg-card border border-primary/30 text-text-primary px-4 py-3 md:px-6 md:py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate text-text-secondary">{title}</p>
              <p className="text-xs text-text-primary/70 truncate">{message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
