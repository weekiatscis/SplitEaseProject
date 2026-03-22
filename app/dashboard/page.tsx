'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SummaryCardCarousel from '@/components/cards/SummaryCardCarousel';
import ExpenseTable from '@/components/table/ExpenseTable';
import SpendingTrendsChart from '@/components/charts/SpendingTrendsChart';

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Expenses"
      subtitle="Here's your overview this month."
    >
      <div className="mb-6">
        <SummaryCardCarousel />
      </div>

      <div className="mb-6">
        <ExpenseTable />
      </div>

      <div className="mb-6">
        <SpendingTrendsChart />
      </div>
    </DashboardLayout>
  );
}
