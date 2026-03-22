'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GroupGrid from '@/components/groups/GroupGrid';

export default function GroupsPage() {
  return (
    <DashboardLayout
      title="Groups"
      subtitle="Manage your groups and shared expenses."
    >
      <div className="mb-6">
        <GroupGrid />
      </div>
    </DashboardLayout>
  );
}
