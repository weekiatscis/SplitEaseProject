"use client";

import { usePathname } from 'next/navigation';
import { WalletIcon } from '@/components/ui/icons';
import { navigationItems } from '@/lib/data/navigation';
import NavItem from '@/components/sidebar/NavItem';
import { useAuth } from '@/context/AuthContext';

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function LeftSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col h-screen bg-bg-sidebar border-r border-border w-[240px] fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div>
          <h1 className="text-[20px] font-bold font-display text-text-heading leading-tight pb-2">SplitEase</h1>
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

      {/* User anchor */}
      {user && (
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(user.Name || 'U')}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-heading truncate leading-tight">{user.Name}</p>
              <p className="text-[11px] text-text-muted truncate leading-tight">{user.Email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
