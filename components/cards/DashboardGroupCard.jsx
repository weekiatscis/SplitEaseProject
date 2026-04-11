"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SpinnerGapIcon } from '@/components/ui/icons';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useAuth } from '@/context/AuthContext';

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardGroupCard({ group }) {
  const { user } = useAuth();
  const [amountOwed, setAmountOwed] = useState(null);
  const [loading, setLoading] = useState(true);
  const members = group.GroupMembers || [];

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/expense/GetExpensesSplitSummary?GroupId=${group.Id}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((data) => {
        if (!cancelled) {
          const entry = (data || []).find((d) => d.UserId === user.UserID);
          setAmountOwed(entry ? entry.AmountOwedSum : 0);
        }
      })
      .catch(() => { if (!cancelled) setAmountOwed(0); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [group.Id, user]);

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

      {/* Amount owed */}
      <div className="mb-4">
        <p className="text-[11px] text-text-muted uppercase tracking-wide mb-0.5">
          you owe
        </p>
        {loading ? (
          <SpinnerGapIcon size={18} className="animate-spin text-text-muted mt-1" />
        ) : (
          <p className="text-2xl font-bold text-text-heading tracking-tight">
            {formatCurrency(amountOwed)}
          </p>
        )}
      </div>

      {/* View link */}
      <Link
        href={`/groups/${group.Id}`}
        className="text-xs font-medium text-primary hover:text-primary-hover transition-colors duration-150"
      >
        View expenses →
      </Link>
    </div>
  );
}
