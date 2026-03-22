'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import LeftSidebar from '@/components/dashboard/LeftSidebar';
import Header from '@/components/dashboard/Header';
import MobileNav from '@/components/dashboard/MobileNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="relative min-h-screen font-sans">
        {/* Background layer */}
        <div className="fixed inset-0 z-0 bg-bg-primary" />

        {/* Left sidebar - desktop */}
        <LeftSidebar />

        {/* Mobile nav drawer */}
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* Main layout */}
        <div className="relative z-[2] md:ml-[240px]">
          <main className="px-6 md:px-8 py-8 w-full">
            <Header
              onMenuToggle={() => setMobileNavOpen(true)}
              title={title}
              subtitle={subtitle}
            />

            {children}
          </main>
        </div>

      </div>
    </ThemeProvider>
  );
}
