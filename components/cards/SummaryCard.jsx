"use client";

import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { CreditCard } from 'lucide-react';

export default function SummaryCard({ label, amount, subtitle, gradient, prefix = '', lastFour }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative p-5 rounded-2xl bg-gradient-to-br ${gradient}
        text-white overflow-hidden cursor-default
        shadow-[0_2px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]
        transition-shadow duration-200
      `}
    >
      {/* Decorative elements */}
      <div className="absolute top-3 right-4 opacity-60">
        <CreditCard size={28} />
      </div>

      <p className="text-xs font-medium opacity-80 mb-1">{label}</p>
      <p className="text-2xl font-bold mb-1 tracking-tight">
        {prefix}
        {formatCurrency(amount)}
      </p>
      <p className="text-[11px] opacity-70">{subtitle}</p>

      {/* Card number dots */}
      <div className="flex items-center gap-3 mt-4 text-[11px] opacity-50">
        <span>****</span>
        <span>****</span>
        <span>****</span>
        <span>{lastFour}</span>
      </div>
    </motion.div>
  );
}