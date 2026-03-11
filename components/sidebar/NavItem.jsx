"use client";

import { motion } from 'framer-motion';

export default function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 2, backgroundColor: 'rgba(74, 108, 247, 0.06)' }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`
        flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer
        border-none outline-none bg-transparent
        focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none
        ${
          isActive
            ? 'bg-primary-light text-primary font-semibold border-l-[3px] border-l-primary'
            : 'text-text-secondary hover:text-text-heading'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
      <span>{label}</span>
    </motion.button>
  );
}