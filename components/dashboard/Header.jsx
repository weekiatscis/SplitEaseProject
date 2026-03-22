"use client";

import { useState } from 'react';
import { MagnifyingGlassIcon, BellSimpleIcon, GearSixIcon, ListIcon, SignOutIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import DarkModeToggle from '@/components/sidebar/DarkModeToggle';
import { useAuth } from '@/context/AuthContext';

export default function Header({ onMenuToggle, title = 'Expenses', subtitle = "Here's your overview this month." }) {
  const { user, logout } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="flex items-center justify-between gap-4 mb-6">
      {/* Left: menu button (mobile) + title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <ListIcon size={20} />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-text-heading">{title}</h2>
          <p className="text-sm text-text-secondary">{subtitle}</p>
        </div>
      </div>

      {/* Right: search + icons + avatar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:block relative">
          <MagnifyingGlassIcon
            size={16}
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-150
              ${searchFocused ? 'text-primary' : 'text-text-muted'}`}
          />
          <input
            type="text"
            placeholder="Search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="
              w-64 pl-9 pr-4 py-2 rounded-lg bg-bg-card border border-border text-sm text-text-body
              placeholder:text-text-muted outline-none
              transition-colors duration-150
              focus:border-primary focus:ring-2 focus:ring-primary/15
            "
          />
        </div>

        {/* Dark mode toggle */}
        <DarkModeToggle />

        {/* Notifications */}
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-lg"
          aria-label="Notifications"
        >
          <BellSimpleIcon size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          aria-label="Settings"
        >
          <GearSixIcon size={18} />
        </Button>

        <div className="relative ml-2">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            onBlur={() => setTimeout(() => setShowProfileMenu(false), 150)}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="text-right hidden lg:block">
              <p className="text-sm font-semibold text-text-heading leading-tight">{user?.Name ?? 'User'}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {user?.Name ? user.Name.charAt(0) : 'U'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-text-heading truncate">{user?.Name ?? 'User'}</p>
                <p className="text-xs text-text-muted truncate">{user?.Email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors duration-150 cursor-pointer"
              >
                <SignOutIcon size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
