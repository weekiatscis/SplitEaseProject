'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, type Variants } from 'framer-motion';
import { ThemeProvider } from '@/context/ThemeContext';
import LeftSidebar from '@/components/dashboard/LeftSidebar';
import Header from '@/components/dashboard/Header';
import RightSidebar from '@/components/dashboard/RightSidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import SummaryCardCarousel from '@/components/cards/SummaryCardCarousel';
import ExpenseTable from '@/components/table/ExpenseTable';
import SpendingTrendsChart from '@/components/charts/SpendingTrendsChart';
import BeamsBackground from '@/components/backgrounds/BeamsBackground';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay, ease: 'easeOut' as const },
  }),
};

export default function DashboardPage() {
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
        <BeamsBackground className="fixed inset-0 z-[1]" intensity="subtle" />

        {/* Left sidebar - desktop */}
        <LeftSidebar />

        {/* Mobile nav drawer */}
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* Main layout */}
        <div className="relative z-[2] md:ml-[240px] xl:mr-[280px]">
          <main className="px-4 md:px-6 py-6 w-full">
            <motion.div variants={sectionVariants} initial="hidden" animate="show" custom={0}>
              <Header onMenuToggle={() => setMobileNavOpen(true)} />
            </motion.div>

            <motion.div variants={sectionVariants} initial="hidden" animate="show" custom={0.1} className="mb-6">
              <SummaryCardCarousel />
            </motion.div>

            <motion.div variants={sectionVariants} initial="hidden" animate="show" custom={0.2} className="mb-6">
              <ExpenseTable />
            </motion.div>

            <motion.div variants={sectionVariants} initial="hidden" animate="show" custom={0.3} className="mb-6">
              <SpendingTrendsChart />
            </motion.div>

            {/* Right sidebar content on medium screens (below xl) */}
            <div className="xl:hidden">
              <motion.div variants={sectionVariants} initial="hidden" animate="show" custom={0.4}>
                <RightSidebar />
              </motion.div>
            </div>
          </main>
        </div>

        {/* Right sidebar - desktop (xl+) */}
        <div className="hidden xl:block fixed right-0 top-0 z-[2] w-[280px] h-screen overflow-y-auto border-l border-border bg-bg-sidebar">
          <motion.div variants={sectionVariants} initial="hidden" animate="show" custom={0.3}>
            <RightSidebar />
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
}
