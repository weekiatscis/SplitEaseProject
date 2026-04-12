'use client';

import { SpinnerGapIcon } from '@/components/ui/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardGroupCard from '@/components/cards/DashboardGroupCard';
import TransactionsTable from '@/components/table/TransactionsTable';
import { useGroups } from '@/context/GroupContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { groups, loading } = useGroups();

  const firstName = user?.Name?.split(' ')[0] || 'there';

  return (
    <DashboardLayout
      title={`Welcome back, ${firstName}`}
      subtitle="Here's what's happening across your groups."
    >
      {/* My groups */}
      <section className="mb-8">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
          My groups
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <SpinnerGapIcon size={20} className="animate-spin text-text-muted" />
          </div>
        ) : groups.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-text-muted mb-3">No groups yet.</p>
            <Link
              href="/groups"
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-150"
            >
              Create your first group →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group, index) => (
              <div
                key={group.Id}
                className="animate-fade-slide-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <DashboardGroupCard group={group} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Last transactions */}
      <section className="mb-6">
        <TransactionsTable userId={user?.UserID} />
      </section>
    </DashboardLayout>
  );
}
