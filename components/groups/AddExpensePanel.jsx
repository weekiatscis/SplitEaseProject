"use client";

import { useState } from 'react';
import { SpinnerGapIcon, CheckCircleIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import AppInput from '@/components/ui/AppInput';
import { createExpense } from '@/lib/api/expenses';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function AddExpensePanel({ group, allUsers, onClose, onExpenseAdded }) {
  const { user: currentUser } = useAuth();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUser?.UserID ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [splitResult, setSplitResult] = useState(null);

  const members = group.GroupMembers || [];

  // getAllUsers may exclude the current user, so ensure they're included
  const allUsersWithSelf = currentUser
    ? [
        { UserId: currentUser.UserID, Name: currentUser.Name, Email: currentUser.Email },
        ...allUsers.filter((u) => u.UserId !== currentUser.UserID),
      ]
    : allUsers;

  // Map group member names to user objects for the dropdown
  const memberUsers = allUsersWithSelf.filter((u) =>
    members.some((m) => m.toLowerCase() === u.Name.toLowerCase())
  );

  const resolveUserName = (userId) => {
    const found = allUsersWithSelf.find((u) => u.UserId === userId);
    return found ? found.Name : `User ${userId}`;
  };

  const handleSubmit = async () => {
    setError('');

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!paidBy) {
      setError('Please select who paid');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createExpense(group.Id, parsedAmount, description.trim(), Number(paidBy));
      setSplitResult(result);
      onExpenseAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show split result after successful creation
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
          <span className="font-medium text-text-heading">{description}</span> — {formatCurrency(parseFloat(amount))}
        </p>

        <div className="flex flex-col gap-1">
          {splitResult.map((split) => (
            <div
              key={split.UserId}
              className="flex items-center justify-between px-2 py-1.5 rounded-md bg-bg-card text-xs"
            >
              <span className="text-text-body">{resolveUserName(split.UserId)}</span>
              <span className="font-medium text-text-heading">{formatCurrency(split.AmountOwed)}</span>
            </div>
          ))}
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
          className="
            w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-xs text-text-body
            outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
          "
        >
          <option value="">Who paid?</option>
          {memberUsers.map((u) => (
            <option key={u.UserId} value={u.UserId}>
              {u.Name}{u.UserId === currentUser?.UserID ? ' (You)' : ''}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-[11px] text-danger mt-2">{error}</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        size="sm"
        className="w-full mt-2.5"
      >
        {isSubmitting ? (
          <>
            <SpinnerGapIcon size={12} className="animate-spin" />
            Adding...
          </>
        ) : (
          'Add Expense'
        )}
      </Button>
    </div>
  );
}
