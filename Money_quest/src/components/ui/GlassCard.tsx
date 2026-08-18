'use client';
import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan' | 'none';
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hover = false, glow = 'none', onClick, ...props }: GlassCardProps) {
  const glowClasses = {
    emerald: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-500/30',
    amber: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-500/30',
    rose: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:border-rose-500/30',
    purple: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:border-purple-500/30',
    cyan: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:border-cyan-500/30',
    none: ''
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${glow !== 'none' ? glowClasses[glow] : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
