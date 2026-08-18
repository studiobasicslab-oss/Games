'use client';
import { useEffect } from 'react';
import { useSpring, useTransform, motion } from 'framer-motion';

export interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  isCurrency?: boolean;
}

export default function AnimatedNumber({ value, prefix = '', suffix = '', className = '', duration = 1, isCurrency = true }: AnimatedNumberProps) {
  const spring = useSpring(value, { bounce: 0, duration: duration * 1000 });
  
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const display = useTransform(spring, (current) => {
    if (isCurrency) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(current);
    }
    return `${prefix}${Math.round(current).toLocaleString('en-IN')}${suffix}`;
  });

  return <motion.span className={className}>{display}</motion.span>;
}
