'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { CareerTrack } from '@/types';

const careerOptions = [
  {
    track: CareerTrack.IT,
    name: 'Software Engineering',
    icon: '💻',
    salary: '₹40,000/mo',
    description: 'Build tech products, high growth potential',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
  },
  {
    track: CareerTrack.Finance,
    name: 'Finance & Banking',
    icon: '📊',
    salary: '₹35,000/mo',
    description: 'Manage money, understand markets deeply',
    color: 'from-emerald-500/20 to-green-500/20',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
  },
  {
    track: CareerTrack.Marketing,
    name: 'Marketing & Sales',
    icon: '📢',
    salary: '₹28,000/mo',
    description: 'Creative campaigns, variable bonuses',
    color: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-400',
  },
  {
    track: CareerTrack.Consulting,
    name: 'Consulting',
    icon: '🎯',
    salary: '₹50,000/mo',
    description: 'Strategy & problem solving, highest start',
    color: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
  },
  {
    track: CareerTrack.Government,
    name: 'Government / PSU',
    icon: '🏛️',
    salary: '₹32,000/mo',
    description: 'Job security, steady growth, pension benefits',
    color: 'from-amber-500/20 to-yellow-500/20',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
  },
  {
    track: CareerTrack.Healthcare,
    name: 'Healthcare',
    icon: '🏥',
    salary: '₹40,000/mo',
    description: 'Serve society, respected career path',
    color: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
  },
  {
    track: CareerTrack.Creative,
    name: 'Design & Creative',
    icon: '🎨',
    salary: '₹25,000/mo',
    description: 'Express creativity, freelance potential',
    color: 'from-fuchsia-500/20 to-pink-500/20',
    borderColor: 'border-fuchsia-500/30',
    textColor: 'text-fuchsia-400',
  },
  {
    track: CareerTrack.Teaching,
    name: 'Teaching & Academia',
    icon: '📚',
    salary: '₹22,000/mo',
    description: 'Shape minds, meaningful work-life balance',
    color: 'from-teal-500/20 to-cyan-500/20',
    borderColor: 'border-teal-500/30',
    textColor: 'text-teal-400',
  },
];

const difficultyOptions = [
  {
    value: 'easy' as const,
    name: 'Easy',
    icon: '🌱',
    description: 'Stable salary, few emergencies, higher returns, low inflation',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    value: 'normal' as const,
    name: 'Normal',
    icon: '⚖️',
    description: 'Realistic economy, salaries, inflation, and market cycles',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    value: 'hard' as const,
    name: 'Hard',
    icon: '🔥',
    description: 'Job loss, high inflation, medical emergencies, market crashes',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
];

const floatingIcons = ['💰', '📈', '🏦', '💎', '🪙', '📊', '💳', '🏠', '🚗', '📱', '✈️', '🎓'];

export default function HomePage() {
  const [step, setStep] = useState<'landing' | 'difficulty' | 'career'>('landing');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [selectedCareer, setSelectedCareer] = useState<CareerTrack | null>(null);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const currentMonth = useGameStore((s) => s.currentMonth);
  const router = useRouter();

  const hasSave = currentMonth > 1;

  const handleStart = () => {
    if (selectedCareer) {
      startNewGame(selectedDifficulty, selectedCareer);
      router.push('/game');
    }
  };

  const handleContinue = () => {
    router.push('/game');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Floating background icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-[0.06]"
            initial={{
              x: `${(i * 8.3) % 100}%`,
              y: `${(i * 13.7) % 100}%`,
            }}
            animate={{
              y: [`${(i * 13.7) % 100}%`, `${((i * 13.7) + 15) % 100}%`, `${(i * 13.7) % 100}%`],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Logo & Title */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-8"
              >
                <div className="text-7xl mb-4">💰</div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                  <span className="gradient-text">Money</span>{' '}
                  <span className="text-white">Quest</span>
                </h1>
                <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                  Master personal finance through life simulation.
                  Start at 22. Build wealth. Retire rich.
                </p>
              </motion.div>

              {/* Stats preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-6 mb-10 text-sm"
              >
                {[
                  { label: 'Starting Age', value: '22', icon: '🎂' },
                  { label: 'Starting Savings', value: '₹5L', icon: '💵' },
                  { label: 'Goal', value: 'Retire Rich', icon: '🏆' },
                ].map((stat) => (
                  <div key={stat.label} className="glass px-4 py-3 flex items-center gap-2">
                    <span className="text-lg">{stat.icon}</span>
                    <div className="text-left">
                      <div className="text-xs text-slate-500">{stat.label}</div>
                      <div className="font-bold text-slate-200">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('difficulty')}
                  className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
                >
                  🎮 New Game
                </motion.button>

                {hasSave && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleContinue}
                    className="px-8 py-3 glass glass-hover text-slate-300 font-medium rounded-xl"
                  >
                    ▶️ Continue Game
                  </motion.button>
                )}

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/leaderboard" className="px-8 py-3 text-emerald-400 border border-emerald-500/30 font-medium rounded-xl hover:bg-emerald-500/10 transition-colors inline-block text-center w-full">
                    🏆 View Global Leaderboard
                  </Link>
                </motion.div>
              </motion.div>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto"
              >
                {[
                  { icon: '📈', label: 'Invest & Grow' },
                  { icon: '🎲', label: 'Life Events' },
                  { icon: '🏆', label: 'Achievements' },
                  { icon: '📊', label: 'Real Finance' },
                ].map((feature) => (
                  <div key={feature.label} className="glass px-3 py-2 text-center text-sm">
                    <div className="text-xl mb-1">{feature.icon}</div>
                    <div className="text-slate-400 text-xs">{feature.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {step === 'difficulty' && (
            <motion.div
              key="difficulty"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setStep('landing')}
                className="text-slate-500 hover:text-slate-300 mb-6 flex items-center gap-2 text-sm transition-colors"
              >
                ← Back
              </button>

              <h2 className="text-3xl font-bold mb-2">Choose Difficulty</h2>
              <p className="text-slate-400 mb-8">How challenging should your financial journey be?</p>

              <div className="grid gap-4">
                {difficultyOptions.map((diff) => (
                  <motion.button
                    key={diff.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDifficulty(diff.value)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      selectedDifficulty === diff.value
                        ? `${diff.bg} border-opacity-100 ring-1 ring-${diff.color.replace('text-', '')}/30`
                        : 'glass border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{diff.icon}</span>
                      <span className={`font-bold text-lg ${selectedDifficulty === diff.value ? diff.color : 'text-slate-200'}`}>
                        {diff.name}
                      </span>
                      {selectedDifficulty === diff.value && (
                        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 ml-11">{diff.description}</p>
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep('career')}
                className="mt-8 w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25"
              >
                Continue →
              </motion.button>
            </motion.div>
          )}

          {step === 'career' && (
            <motion.div
              key="career"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setStep('difficulty')}
                className="text-slate-500 hover:text-slate-300 mb-6 flex items-center gap-2 text-sm transition-colors"
              >
                ← Back
              </button>

              <h2 className="text-3xl font-bold mb-2">Choose Your Career</h2>
              <p className="text-slate-400 mb-8">This determines your starting salary and growth trajectory</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {careerOptions.map((career) => (
                  <motion.button
                    key={career.track}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCareer(career.track)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedCareer === career.track
                        ? `bg-gradient-to-br ${career.color} ${career.borderColor} ring-1 ring-white/10`
                        : 'glass border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{career.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${selectedCareer === career.track ? career.textColor : 'text-slate-200'}`}>
                            {career.name}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{career.salary}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{career.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                disabled={!selectedCareer}
                className={`mt-8 w-full py-4 font-bold rounded-2xl shadow-lg transition-all ${
                  selectedCareer
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {selectedCareer ? '🚀 Start Your Journey' : 'Select a career to continue'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
