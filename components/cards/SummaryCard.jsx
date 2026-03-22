"use client";

import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function SummaryCard({ label, amount, subtitle, gradient, prefix = '' }) {
  return (
    <div
      className={`
        relative p-5 rounded-xl bg-gradient-to-br ${gradient}
        text-white overflow-hidden cursor-default
        shadow-sm
      `}
    >
      <p className="text-xs font-medium opacity-80 mb-1">{label}</p>
      <p className="text-2xl font-bold mb-1 tracking-tight">
        {prefix}
        {formatCurrency(amount)}
      </p>
      <p className="text-[11px] opacity-70">{subtitle}</p>
    </div>
  );
}
