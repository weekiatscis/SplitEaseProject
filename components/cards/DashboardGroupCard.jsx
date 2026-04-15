"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
    fetch(`/api/balance/GetBalances?GroupId=${group.Id}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((balances) => {
        if (cancelled) return;
        // Amounts I owe (I am UserId)
        const iOwe = (balances || [])
          .filter((b) => b.UserId === user.UserID)
          .reduce((sum, b) => sum + Number(b.AmountOwedTo), 0);
        // Amounts owed to me (I am UserId2)
        const owedToMe = (balances || [])
          .filter((b) => b.UserId2 === user.UserID)
          .reduce((sum, b) => sum + Number(b.AmountOwedTo), 0);
        // Positive = I owe, negative = owed to me
        setAmountOwed(iOwe - owedToMe);
      })
      .catch(() => { if (!cancelled) setAmountOwed(0); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [group.Id, user]);

  const isOwed = amountOwed !== null && amountOwed < 0;
  const isOwing = amountOwed !== null && amountOwed > 0;
  const isSettled = amountOwed !== null && amountOwed === 0;

  return (
    <Link href={`/groups/${group.Id}`} className="block card-interactive">
      <div className="bg-bg-card rounded-xl border border-border p-5 flex flex-col gap-5">

        {/* Balance — primary visual anchor */}
        <div>
          {loading ? (
            <div className="flex flex-col gap-2">
              <div className="h-7 w-28 rounded-md bg-border animate-pulse" />
              <div className="h-3 w-16 rounded bg-border animate-pulse" />
            </div>
          ) : (
            <div>
              <p className={`text-2xl font-bold tracking-tight leading-none ${
                isOwed ? 'text-success' : isOwing ? 'text-danger' : 'text-text-muted'
              }`}>
                {isOwed
                  ? `+${formatCurrency(Math.abs(amountOwed))}`
                  : isSettled
                  ? '—'
                  : formatCurrency(amountOwed)}
              </p>
              <p className="text-xs text-text-muted mt-1.5">
                {isOwed ? 'owed to you' : isOwing ? 'you owe' : 'settled up'}
              </p>
            </div>
          )}
        </div>

        {/* Group name + members — secondary */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-heading truncate mr-3">
            {group.GroupName}
          </p>
          <div className="flex -space-x-1.5 shrink-0">
            {members.slice(0, 4).map((name) => (
              <div
                key={name}
                title={name}
                className="w-6 h-6 rounded-full bg-primary
                  flex items-center justify-center text-white text-[8px] font-bold
                  border-2 border-bg-card"
              >
                {getInitials(name)}
              </div>
            ))}
            {members.length > 4 && (
              <div
                className="w-6 h-6 rounded-full bg-bg-primary
                  flex items-center justify-center text-text-muted text-[8px] font-bold
                  border-2 border-bg-card"
              >
                +{members.length - 4}
              </div>
            )}
          </div>
        </div>

      </div>
    </Link>
  );
}
