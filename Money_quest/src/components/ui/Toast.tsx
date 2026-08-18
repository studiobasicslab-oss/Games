'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast as ToastType } from '@/types';
import { X, CheckCircle, AlertTriangle, XCircle, Info, Trophy } from 'lucide-react';

export interface ToastProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  error: <XCircle className="w-5 h-5 text-rose-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  achievement: <Trophy className="w-5 h-5 text-purple-400" />
};

const styles = {
  success: 'border-emerald-500/20 bg-emerald-500/10',
  warning: 'border-amber-500/20 bg-amber-500/10',
  error: 'border-rose-500/20 bg-rose-500/10',
  info: 'border-blue-500/20 bg-blue-500/10',
  achievement: 'border-purple-500/50 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
};

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md pointer-events-auto ${styles[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium text-slate-200">{toast.message}</p>
            <button onClick={() => onDismiss(toast.id)} className="ml-2 text-slate-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
