"use client";

import { motion } from 'framer-motion';
import SummaryCard from './SummaryCard';
import { summaryCards } from '@/lib/data/summaryCards';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function SummaryCardCarousel() {
  return (
    <section aria-label="Balance summary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-heading">My Cards</h3>
        <button className="text-xs text-text-secondary hover:text-primary transition-colors duration-150 px-3 py-1.5 rounded-lg border border-border hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
          View all &rarr;
        </button>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex gap-4 overflow-x-auto pb-2"
      >
        {summaryCards.map((card) => (
          <motion.div key={card.id} variants={cardVariants} className="w-[280px] shrink-0">
            <SummaryCard {...card} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}