"use client";

import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function DarkModeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <div className="flex items-center">
      <button
        onClick={toggle}
        className="flex items-center gap-1 bg-bg-primary rounded-full p-1
          focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none
          border border-border"
        aria-label="Toggle dark mode"
        aria-pressed={isDark}
      >
        <div
          className={`flex items-center justify-center py-1.5 px-2.5 rounded-full transition-all duration-200
            ${!isDark ? 'bg-bg-card text-text-heading shadow-sm' : 'text-text-muted'}`}
        >
          <Sun size={14} />
        </div>
        <div
          className={`flex items-center justify-center py-1.5 px-2.5 rounded-full transition-all duration-200
            ${isDark ? 'bg-bg-card text-text-heading shadow-sm' : 'text-text-muted'}`}
        >
          <Moon size={14} />
        </div>
      </button>
    </div>
  );
}