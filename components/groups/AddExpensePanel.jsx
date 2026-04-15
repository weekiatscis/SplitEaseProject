"use client";

import { useState } from 'react';
import { SpinnerGapIcon, CheckCircleIcon, XIcon, CheckIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import AppInput from '@/components/ui/AppInput';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils/formatCurrency';

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AddExpensePanel({ group, allUsers, onClose, onExpenseAdded }) {
  const { user: currentUser } = useAuth();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUser?.UserID ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [splitResult, setSplitResult] = useState(null);
  const [splitType, setSplitType] = useState('even'); // 'even' | 'dollar' | 'percent'
  const [memberAmounts, setMemberAmounts] = useState({});
  const [memberPercents, setMemberPercents] = useState({});

  const members = group.GroupMembers || [];

  const allUsersWithSelf = currentUser
    ? [
        { UserId: currentUser.UserID, Name: currentUser.Name, Email: currentUser.Email },
        ...allUsers.filter((u) => u.UserId !== currentUser.UserID),
      ]
    : allUsers;

  const memberUsers = allUsersWithSelf.filter((u) =>
    members.some((m) => m.toLowerCase() === u.Name.toLowerCase())
  );

  const [sharedBy, setSharedBy] = useState(() => memberUsers.map((u) => u.UserId));

  const toggleMember = (userId) => {
    setSharedBy((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
    setMemberAmounts((prev) => { const next = { ...prev }; delete next[userId]; return next; });
    setMemberPercents((prev) => { const next = { ...prev }; delete next[userId]; return next; });
  };

  const resolveUserName = (userId) => {
    const found = allUsersWithSelf.find((u) => u.UserId === userId);
    return found ? found.Name : `User ${userId}`;
  };

  const parsedAmount = parseFloat(amount);
  const perPersonShare =
    sharedBy.length > 0 && !isNaN(parsedAmount) && parsedAmount > 0
      ? parsedAmount / sharedBy.length
      : null;

  const dollarTotal = sharedBy.reduce((sum, uid) => sum + (parseFloat(memberAmounts[uid]) || 0), 0);
  const percentTotal = sharedBy.reduce((sum, uid) => sum + (parseFloat(memberPercents[uid]) || 0), 0);

  const handleSubmit = async () => {
    setError('');

    if (!description.trim()) { setError('Please enter a description'); return; }
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) { setError('Please enter a valid amount'); return; }
    if (!paidBy) { setError('Please select who paid'); return; }
    if (sharedBy.length === 0) { setError('Select at least one person to split with'); return; }

    if (splitType === 'dollar') {
      if (Math.abs(dollarTotal - parsedAmount) > 0.01) {
        setError(`Individual amounts must sum to ${formatCurrency(parsedAmount)} (currently ${formatCurrency(dollarTotal)})`);
        return;
      }
    }

    if (splitType === 'percent') {
      if (Math.abs(percentTotal - 100) > 0.01) {
        setError(`Percentages must sum to 100% (currently ${percentTotal.toFixed(1)}%)`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let url, body;

      if (splitType === 'even') {
        url = '/api/even-split/ExpenseEvenSplitting';
        body = {
          GroupId: group.Id,
          AmountOwed: parsedAmount,
          Description: description.trim(),
          PaidBy: Number(paidBy),
          SharedBy: sharedBy,
        };
      } else if (splitType === 'dollar') {
        url = '/api/uneven-split/expenses/UnevenSplitByDollar';
        body = {
          GroupId: group.Id,
          Amount: parsedAmount,
          Description: description.trim(),
          PaidBy: Number(paidBy),
          SharedByAndAmount: sharedBy.map((uid) => ({
            UserId: uid,
            Amount: parseFloat(memberAmounts[uid]) || 0,
          })),
        };
      } else {
        url = '/api/uneven-split/expenses/UnevenSplitByPercentage';
        body = {
          GroupId: group.Id,
          Amount: parsedAmount,
          Description: description.trim(),
          PaidBy: Number(paidBy),
          SharedByAndPercent: sharedBy.map((uid) => ({
            UserId: uid,
            Percent: parseFloat(memberPercents[uid]) || 0,
          })),
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`CreateExpense failed with status ${res.status}`);
      const result = await res.json();
      setSplitResult(result);
      onExpenseAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (splitResult) {
    return (
      <div className="bg-bg-primary rounded-lg p-3 border border-border-light">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <CheckCircleIcon size={16} weight="fill" className="text-success" />
            <p className="text-xs font-semibold text-success">Expense Added</p>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={onClose}>
            <XIcon size={14} />
          </Button>
        </div>

        <p className="text-xs text-text-secondary mb-2">
          <span className="font-medium text-text-heading">{description}</span> — {formatCurrency(parsedAmount)}
        </p>

        <div className="flex flex-col gap-1">
          {(Array.isArray(splitResult) ? splitResult : []).map((split, i) => {
            const owes = split.AmountOwed > 0;
            return (
              <div
                key={`${split.UserId}-${i}`}
                className="flex items-center justify-between px-2 py-1.5 rounded-md bg-bg-card text-xs"
              >
                <span className="text-text-body">{resolveUserName(split.UserId)}</span>
                <div className="flex items-center gap-1.5">
                  <span className={owes ? 'text-danger' : 'text-success'}>
                    {owes ? 'owes' : 'gets back'}
                  </span>
                  <span className={`font-medium ${owes ? 'text-danger' : 'text-success'}`}>
                    {formatCurrency(Math.abs(split.AmountOwed))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary rounded-lg p-3 border border-border-light">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-text-heading">Add Expense</p>
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <XIcon size={14} />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <AppInput
          variant="simple"
          inputSize="sm"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <AppInput
          variant="simple"
          inputSize="sm"
          type="number"
          placeholder="Amount"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-xs text-text-body outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        >
          <option value="">Who paid?</option>
          {memberUsers.map((u) => (
            <option key={u.UserId} value={u.UserId}>
              {u.Name}{u.UserId === currentUser?.UserID ? ' (You)' : ''}
            </option>
          ))}
        </select>

        {/* Split type selector */}
        <div>
          <p className="text-[11px] font-medium text-text-muted uppercase tracking-wide mb-1.5">
            Split type
          </p>
          <div className="flex gap-1">
            {[
              { key: 'even', label: 'Even' },
              { key: 'dollar', label: 'By $' },
              { key: 'percent', label: 'By %' },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSplitType(opt.key)}
                className={`flex-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150
                  ${splitType === opt.key
                    ? 'bg-primary/10 border border-primary/25 text-primary'
                    : 'bg-bg-card border border-transparent text-text-body hover:bg-bg-primary'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Split among */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
              Split among
            </p>
            {splitType === 'even' && perPersonShare !== null && (
              <span className="text-[11px] text-text-muted">
                {formatCurrency(perPersonShare)} / person
              </span>
            )}
            {splitType === 'dollar' && parsedAmount > 0 && (
              <span className={`text-[11px] ${Math.abs(dollarTotal - parsedAmount) < 0.01 ? 'text-success' : 'text-text-muted'}`}>
                {formatCurrency(dollarTotal)} / {formatCurrency(parsedAmount)}
              </span>
            )}
            {splitType === 'percent' && (
              <span className={`text-[11px] ${Math.abs(percentTotal - 100) < 0.01 ? 'text-success' : 'text-text-muted'}`}>
                {percentTotal.toFixed(1)}% / 100%
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto">
            {memberUsers.map((u) => {
              const selected = sharedBy.includes(u.UserId);
              return (
                <div key={u.UserId} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleMember(u.UserId)}
                    className={`flex items-center gap-2 flex-1 px-2.5 py-1.5 rounded-md text-left text-xs transition-colors duration-150
                      ${selected
                        ? 'bg-primary/10 border border-primary/25 text-primary'
                        : 'bg-bg-card border border-transparent text-text-body hover:bg-bg-primary'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0
                      ${selected ? 'bg-primary text-white' : 'bg-primary/15 text-text-heading'}`}>
                      {selected ? <CheckIcon size={10} /> : getInitials(u.Name)}
                    </div>
                    <span className="font-medium truncate">{u.Name}</span>
                    {u.UserId === currentUser?.UserID && (
                      <span className="text-[10px] text-text-muted ml-auto">You</span>
                    )}
                  </button>

                  {selected && splitType === 'dollar' && (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="$0.00"
                      value={memberAmounts[u.UserId] || ''}
                      onChange={(e) => setMemberAmounts((prev) => ({ ...prev, [u.UserId]: e.target.value }))}
                      className="w-20 px-2 py-1.5 rounded-md bg-bg-card border border-border text-xs text-text-body text-right outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  )}
                  {selected && splitType === 'percent' && (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="0%"
                      value={memberPercents[u.UserId] || ''}
                      onChange={(e) => setMemberPercents((prev) => ({ ...prev, [u.UserId]: e.target.value }))}
                      className="w-16 px-2 py-1.5 rounded-md bg-bg-card border border-border text-xs text-text-body text-right outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {error && <p className="text-[11px] text-danger mt-2">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || sharedBy.length === 0}
        size="sm"
        className="w-full mt-2.5"
      >
        {isSubmitting ? (
          <><SpinnerGapIcon size={12} className="animate-spin" />Adding...</>
        ) : (
          'Add Expense'
        )}
      </Button>
    </div>
  );
}
