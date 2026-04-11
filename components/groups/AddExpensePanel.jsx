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

  // Default: all members are selected for the split
  const [sharedBy, setSharedBy] = useState(() => memberUsers.map((u) => u.UserId));

  const toggleMember = (userId) => {
    setSharedBy((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
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

  const handleSubmit = async () => {
    setError('');

    if (!description.trim()) { setError('Please enter a description'); return; }
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) { setError('Please enter a valid amount'); return; }
    if (!paidBy) { setError('Please select who paid'); return; }
    if (sharedBy.length === 0) { setError('Select at least one person to split with'); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/even-split/expenses/CreateExpenseEvenSplit3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          GroupId: group.Id,
          AmountOwed: parsedAmount,
          Description: description.trim(),
          PaidBy: Number(paidBy),
          SharedBy: sharedBy,
        }),
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
          {splitResult.map((split) => {
            const owes = split.AmountOwed < 0;
            return (
              <div
                key={split.UserId}
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

        {/* Split among */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
              Split among
            </p>
            {perPersonShare !== null && (
              <span className="text-[11px] text-text-muted">
                {formatCurrency(perPersonShare)} / person
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto">
            {memberUsers.map((u) => {
              const selected = sharedBy.includes(u.UserId);
              return (
                <button
                  key={u.UserId}
                  type="button"
                  onClick={() => toggleMember(u.UserId)}
                  className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-left text-xs transition-colors duration-150
                    ${selected
                      ? 'bg-primary/10 border border-primary/25 text-primary'
                      : 'bg-bg-card border border-transparent text-text-body hover:bg-bg-primary'
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0
                    ${selected ? 'bg-primary text-white' : 'bg-primary/15 text-text-heading'}`}>
                    {selected ? <CheckIcon size={10} /> : getInitials(u.Name)}
                  </div>
                  <span className="font-medium">{u.Name}</span>
                  {u.UserId === currentUser?.UserID && (
                    <span className="text-[10px] text-text-muted ml-auto">You</span>
                  )}
                </button>
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
