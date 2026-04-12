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
    Promise.all([
      fetch(`/api/expense-summary/GetGroupExpenseSummary2?GroupId=${group.Id}`)
        .then((res) => res.ok ? res.json() : Promise.reject(res.status)),
      fetch(`/api/expense/GetExpensesSplit?GroupId=${group.Id}`)
        .then((res) => res.ok ? res.json() : Promise.reject(res.status))
        .catch(() => []),
    ])
      .then(([data, splitRows]) => {
        if (!cancelled) {
          let net = 0;
          const mySplitByExpenseId = new Map();

          const sameUser = (value) => {
            const asNum = Number(value);
            if (!Number.isNaN(asNum) && asNum === Number(user.UserID)) return true;
            if (typeof value === 'string' && typeof user.Name === 'string') {
              return value.trim().toLowerCase() === user.Name.trim().toLowerCase();
            }
            return false;
          };

          const getExpenseId = (row) => Number(row?.ExpenseId ?? row?.ExpenseID ?? row?.Id);

          (splitRows || []).forEach((row) => {
            const rowUserId = row?.UserId ?? row?.UserID ?? row?.Name;
            if (!sameUser(rowUserId)) return;
            const expenseId = getExpenseId(row);
            if (Number.isNaN(expenseId)) return;
            const amountOwed = Number(row?.AmountOwed || 0);
            // UI uses positive as "you owe" and negative as "owed to you".
            const current = mySplitByExpenseId.get(expenseId) || 0;
            mySplitByExpenseId.set(expenseId, current + (-amountOwed));
          });

          (data || []).forEach((e) => {
            const fromSplit = mySplitByExpenseId.get(Number(e.ExpenseId));
            if (fromSplit !== undefined) {
              net += fromSplit;
              return;
            }

            const sharedBy = e.SharedBy || [];
            const inSharedBy = sharedBy.includes(user.UserID);
            const isPayer = e.PaidBy === user.Name || Number(e.PaidBy) === user.UserID;
            const myShare = inSharedBy && sharedBy.length > 0 ? e.TotalAmount / sharedBy.length : 0;
            if (inSharedBy || isPayer) {
              net += isPayer ? myShare - e.TotalAmount : myShare;
            }
          });
          setAmountOwed(net);
        }
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
