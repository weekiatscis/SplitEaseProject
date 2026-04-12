"use client";

import { useState, useEffect } from 'react';
import { SpinnerGapIcon } from '@/components/ui/icons';
import { formatCurrency } from '@/lib/utils/formatCurrency';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function DirectionBadge({ received }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
        received
          ? 'bg-success/10 text-success'
          : 'bg-danger/10 text-danger'
      }`}
    >
      {received ? (
        <>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
            <path d="M4 7V1M1 4l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Received
        </>
      ) : (
        <>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
            <path d="M4 1v6M7 4L4 7 1 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sent
        </>
      )}
    </span>
  );
}

export default function TransactionsTable({ userId }) {
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/payment/GetTransactionByUserId?UserId=${userId}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((data) => { if (!cancelled) setTransactions(data || []); })
      .catch(() => { if (!cancelled) setTransactions([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  return (
    <section className="bg-bg-card rounded-xl border border-border">
      <div className="px-5 py-4 border-b border-border-light">
        <h3 className="text-sm font-semibold text-text-heading">Last transactions</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <SpinnerGapIcon size={18} className="animate-spin text-text-muted" />
        </div>
      ) : !transactions || transactions.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-text-muted">No transactions yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-border-light">
          {transactions.map((tx, i) => {
            const received = tx.ReceivedBy === userId;
            return (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-primary/50 transition-colors duration-100"
              >
                {/* Direction indicator dot */}
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                    received ? 'bg-success/10' : 'bg-danger/10'
                  }`}
                >
                  {received ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-success" style={{stroke: 'var(--color-success, #22c55e)'}}/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M7 3v8M11 7l-4 4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{stroke: 'var(--color-danger, #ef4444)'}}/>
                    </svg>
                  )}
                </div>

                {/* Description + group */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-heading truncate">
                    {tx.Description || 'Payment'}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5 truncate">
                    {tx.Name || `Group #${tx.GroupId}`}
                  </p>
                </div>

                {/* Direction badge — hidden on very small screens */}
                <div className="hidden sm:block shrink-0">
                  <DirectionBadge received={received} />
                </div>

                {/* Date */}
                <p className="text-[11px] text-text-muted shrink-0 hidden md:block w-24 text-right">
                  {formatDate(tx.DateTime)}
                </p>

                {/* Amount */}
                <p className={`text-sm font-semibold tabular-nums shrink-0 w-20 text-right ${
                  received ? 'text-success' : 'text-danger'
                }`}>
                  {received ? '+' : '−'}{formatCurrency(tx.Amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
