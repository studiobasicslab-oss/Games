'use client';
import { motion } from 'framer-motion';

export interface BadgeProps {
  icon: string;
  label: string;
  isNew?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function Badge({ icon, label, isNew = false, size = 'md', color = 'text-amber-400' }: BadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-4xl'
  };

  return (
    <motion.div 
      className="flex flex-col items-center gap-2"
      initial={isNew ? { scale: 0.5, rotate: -10, opacity: 0 } : false}
      animate={isNew ? { scale: 1, rotate: 0, opacity: 1 } : false}
      transition={{ type: "spring", bounce: 0.5 }}
    >
      <div className={`relative flex items-center justify-center rounded-full bg-slate-800 border-2 border-white/10 shadow-lg ${sizeClasses[size]}`}>
        {isNew && (
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-400/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
        <span className={color}>{icon}</span>
      </div>
      <span className="text-xs font-semibold text-slate-300 text-center uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}
