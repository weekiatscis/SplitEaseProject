"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet } from 'lucide-react';
import { useState } from 'react';
import { navigationItems } from '@/lib/data/navigation';
import NavItem from '@/components/sidebar/NavItem';

import PremiumCard from '@/components/sidebar/PremiumCard';

export default function MobileNav({ isOpen, onClose }) {
  const [activeNav, setActiveNav] = useState('expenses');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-0 top-0 h-screen w-[280px] bg-bg-sidebar border-r border-border z-50 flex flex-col md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <Wallet size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-text-heading leading-tight">SplitEase</h1>
                  <p className="text-[10px] text-text-muted leading-tight">Split Bills Easily</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-secondary hover:bg-primary-light
                  focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav aria-label="Mobile navigation" className="flex-1 px-3 overflow-y-auto">
              <ul className="flex flex-col gap-0.5 list-none p-0 m-0">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <NavItem
                      icon={item.icon}
                      label={item.label}
                      isActive={activeNav === item.id}
                      onClick={() => {
                        setActiveNav(item.id);
                        onClose();
                      }}
                    />
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto">
              <div className="mt-2">
                <PremiumCard />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}