'use client';

import { SpinnerGapIcon } from '@phosphor-icons/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardGroupCard from '@/components/cards/DashboardGroupCard';
import TransactionsTable from '@/components/table/TransactionsTable';
import { useGroups } from '@/context/GroupContext';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { groups, loading } = useGroups();

  // Extract first name for greeting
  const firstName = user?.Name?.split(' ')[0] || 'there';

  return (
    <DashboardLayout
      title={`Welcome back, ${firstName}!`}
      subtitle=""
    >
      {/* My groups */}
      <section className="mb-8">
        <h3 className="text-base font-semibold text-text-heading mb-4">
          My groups
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <SpinnerGapIcon size={20} className="animate-spin text-text-muted" />
          </div>
        ) : groups.length === 0 ? (
          <p className="text-sm text-text-muted py-6">
            No groups yet. Create one from the Groups page.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <DashboardGroupCard key={group.Id} group={group} />
            ))}
          </div>
        )}
      </section>

      {/* Last transactions */}
      <section className="mb-6">
        <TransactionsTable />
      </section>
    </DashboardLayout>
  );
}
