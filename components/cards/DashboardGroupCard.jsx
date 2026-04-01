"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import { getGroupSummary } from '@/lib/api/expenses';
import { formatCurrency } from '@/lib/utils/formatCurrency';

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardGroupCard({ group }) {
  const [totalExpense, setTotalExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const members = group.GroupMembers || [];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getGroupSummary(group.Id)
      .then((data) => {
        if (!cancelled) {
          const total = (data || []).reduce((sum, e) => sum + e.TotalAmount, 0);
          setTotalExpense(total);
        }
      })
      .catch(() => { if (!cancelled) setTotalExpense(0); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [group.Id]);

  return (
    <div className="bg-bg-card rounded-xl border border-border p-5 flex flex-col justify-between">
      {/* Group name */}
      <h4 className="text-base font-semibold text-text-heading mb-3">
        {group.GroupName}
      </h4>

      {/* Member avatars */}
      <div className="flex -space-x-1.5 mb-4">
        {members.slice(0, 5).map((name) => (
          <div
            key={name}
            title={name}
            className="w-7 h-7 rounded-full bg-primary
              flex items-center justify-center text-white text-[9px] font-bold
              border-2 border-bg-card"
          >
            {getInitials(name)}
          </div>
        ))}
        {members.length > 5 && (
          <div
            className="w-7 h-7 rounded-full bg-bg-primary
              flex items-center justify-center text-text-muted text-[9px] font-bold
              border-2 border-bg-card"
          >
            +{members.length - 5}
          </div>
        )}
      </div>

      {/* Total expense */}
      <div className="mb-4">
        <p className="text-[11px] text-text-muted uppercase tracking-wide mb-0.5">
          total expense
        </p>
        {loading ? (
          <SpinnerGapIcon size={18} className="animate-spin text-text-muted mt-1" />
        ) : (
          <p className="text-2xl font-bold text-text-heading tracking-tight">
            {formatCurrency(totalExpense)}
          </p>
        )}
      </div>

      {/* View link */}
      <Link
        href={`/groups/${group.Id}`}
        className="text-xs font-semibold text-text-secondary uppercase tracking-wider
          hover:text-text-heading transition-colors duration-150"
      >
        View Group Expense
      </Link>
    </div>
  );
}
