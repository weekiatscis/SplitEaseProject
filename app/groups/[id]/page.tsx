'use client';

import { use } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
// @ts-ignore - JSX component
import GroupDetailView from '@/components/groups/GroupDetailView';

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <DashboardLayout
      title="Group Details"
      subtitle="View and manage this group."
    >
      <GroupDetailView groupId={Number(id)} />
    </DashboardLayout>
  );
}
