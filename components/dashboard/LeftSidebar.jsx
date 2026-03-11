"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { navigationItems } from '@/lib/data/navigation';
import NavItem from '@/components/sidebar/NavItem';
import DarkModeToggle from '@/components/sidebar/DarkModeToggle';


const navVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function LeftSidebar() {
  const [activeNav, setActiveNav] = useState('expenses');

  return (
    <aside className="hidden md:flex flex-col h-screen bg-bg-sidebar border-r border-border w-[240px] fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
          <Wallet size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-text-heading leading-tight">SplitEase</h1>
          <p className="text-[10px] text-text-muted leading-tight">Split Bills Easily</p>
        </div>
      </div>

      {/* Menu label */}
      <p className="px-5 pt-2 pb-2 text-[11px] font-medium text-text-muted uppercase tracking-wider">
        Menu
      </p>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex-1 px-3">
        <motion.ul
          variants={navVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-0.5 list-none p-0 m-0"
        >
          {navigationItems.map((item) => (
            <motion.li key={item.id} variants={navItemVariants}>
              <NavItem
                icon={item.icon}
                label={item.label}
                isActive={activeNav === item.id}
                onClick={() => setActiveNav(item.id)}
              />
            </motion.li>
          ))}
        </motion.ul>
      </nav>

      {/* Bottom section */}
      <div className="mt-auto">
        <DarkModeToggle />
      </div>
    </aside>
  );
}