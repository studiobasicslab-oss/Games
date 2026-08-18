'use client';
import { motion } from 'framer-motion';

export interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string | number;
}

export default function ProgressRing({ progress, size = 120, strokeWidth = 8, color = 'stroke-emerald-400', label, value }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="stroke-white/10"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={`${color}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {(label !== undefined || value !== undefined) && (
        <div className="absolute flex flex-col items-center justify-center text-center">
          {value !== undefined && <span className="text-xl font-bold text-slate-100">{value}</span>}
          {label !== undefined && <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>}
        </div>
      )}
    </div>
  );
}
