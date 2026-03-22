"use client";

import { usePathname } from 'next/navigation';
import { WalletIcon } from '@phosphor-icons/react';
import { navigationItems } from '@/lib/data/navigation';
import NavItem from '@/components/sidebar/NavItem';

export default function LeftSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen bg-bg-sidebar border-r border-border w-[240px] fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <WalletIcon size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-text-heading leading-tight">SplitEase</h1>
          <p className="text-[10px] text-text-muted leading-tight">Split Bills Easily</p>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex-1 px-4">
        <ul className="flex flex-col gap-1 list-none p-0 m-0">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <NavItem
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href && (item.href !== '/dashboard' || item.id === 'dashboard')}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom spacer */}
      <div className="mt-auto" />
    </aside>
  );
}
