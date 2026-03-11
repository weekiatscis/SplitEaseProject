"use client";

import { useState } from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
import DarkModeToggle from '@/components/sidebar/DarkModeToggle';

export default function Header({ onMenuToggle }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [bellWiggle, setBellWiggle] = useState(false);
  const triggerBellWiggle = () => {
    setBellWiggle(true);
    setTimeout(() => setBellWiggle(false), 400);
  };

  return (
    <header className="flex items-center justify-between gap-4 mb-6">
      {/* Left: menu button (mobile) + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-primary-light
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-text-heading">Expenses</h2>
          <p className="text-sm text-text-secondary">Here&apos;s your overview this month.</p>
        </div>
      </div>

      {/* Right: search + icons + avatar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:block relative">
          <Search
            size={16}
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-150
              ${searchFocused ? 'text-primary' : 'text-text-muted'}`}
          />
          <input
            type="text"
            placeholder="Search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`
              pl-9 pr-4 py-2.5 rounded-xl bg-bg-card border border-border text-sm text-text-body
              placeholder:text-text-muted outline-none
              transition-all duration-200 ease-out
              focus:border-primary focus:ring-2 focus:ring-primary/15
              ${searchFocused ? 'w-80' : 'w-52'}
            `}
          />
        </div>

        {/* Dark mode toggle */}
        <DarkModeToggle />

        {/* Notifications */}
        <button
          onClick={triggerBellWiggle}
          className={`relative p-2.5 rounded-xl bg-bg-card border border-border text-text-secondary
            hover:text-text-heading hover:border-primary/30
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none
            ${bellWiggle ? 'animate-wiggle' : ''}`}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        <button
          className="p-2.5 rounded-xl bg-bg-card border border-border text-text-secondary
            hover:text-text-heading hover:border-primary/30
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>

        <div className="flex items-center gap-2.5 ml-2">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-semibold text-text-heading leading-tight">Benjamin</p>
            <p className="text-[11px] text-text-muted leading-tight">Newyork, USA</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-gradient-purple-start flex items-center justify-center text-white text-xs font-bold">
            B
          </div>
        </div>
      </div>
    </header>
  );
}