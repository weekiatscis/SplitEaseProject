"use client";

import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { CheckIcon, XIcon } from '@phosphor-icons/react';

export default function ExpenseRowExpanded({ expense }) {
  return (
    <motion.tr
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <td colSpan={7} className="px-4 py-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="py-3 px-2"
        >
          <p className="text-xs font-semibold text-text-heading mb-2">Split Breakdown</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {expense.splits.map((split, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-bg-primary rounded-lg px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-text-heading">{split.name}</p>
                  <p className="text-[11px] text-text-muted">{formatCurrency(split.amount)}</p>
                </div>
                {split.paid ? (
                  <CheckIcon size={14} className="text-success" />
                ) : (
                  <XIcon size={14} className="text-danger" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </td>
    </motion.tr>
  );
}