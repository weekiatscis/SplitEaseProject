"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircleIcon,
  CreditCardIcon,
  SpinnerGapIcon,
  XIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import AppInput from '@/components/ui/AppInput';
import { payExpense } from '@/lib/api/expenses';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function PayExpensePanel({ group, expenses, allUsers, onClose, onPaid }) {
  const { user: currentUser } = useAuth();
  const [selectedExpenseId, setSelectedExpenseId] = useState(expenses[0]?.ExpenseId ? String(expenses[0].ExpenseId) : '');
  const [userId, setUserId] = useState(currentUser?.UserID ? String(currentUser.UserID) : '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSucceed, setDidSucceed] = useState(false);

  const members = group.GroupMembers || [];

  const allUsersWithSelf = currentUser
    ? [
        { UserId: currentUser.UserID, Name: currentUser.Name, Email: currentUser.Email },
        ...allUsers.filter((u) => u.UserId !== currentUser.UserID),
      ]
    : allUsers;

  const memberUsers = useMemo(
    () => allUsersWithSelf.filter((u) =>
      members.some((memberName) => memberName.toLowerCase() === u.Name.toLowerCase())
    ),
    [allUsersWithSelf, members]
  );

  const selectedExpense = useMemo(
    () => expenses.find((expense) => String(expense.ExpenseId) === selectedExpenseId),
    [expenses, selectedExpenseId]
  );

  useEffect(() => {
    if (!selectedExpense) return;
    setAmount(String(selectedExpense.TotalAmount));
  }, [selectedExpense]);

  const handleSubmit = async () => {
    setError('');

    if (!selectedExpense) {
      setError('Please choose an expense to pay.');
      return;
    }

    if (!userId) {
      setError('Please choose who is making the payment.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      await payExpense({
        GroupId: group.Id,
        ExpenseId: selectedExpense.ExpenseId,
        UserId: Number(userId),
        Amount: parsedAmount,
        Note: note.trim() || undefined,
      });
      setDidSucceed(true);
      onPaid?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pay expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (didSucceed && selectedExpense) {
    return (
      <div className="bg-bg-primary rounded-lg p-3 border border-border-light">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <CheckCircleIcon size={16} weight="fill" className="text-success" />
            <p className="text-xs font-semibold text-success">Payment Submitted</p>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={onClose}>
            <XIcon size={14} />
          </Button>
        </div>

        <p className="text-xs text-text-secondary">
          <span className="font-medium text-text-heading">{selectedExpense.Description || 'Untitled expense'}</span>
          {' '}for {formatCurrency(parseFloat(amount))}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary rounded-lg p-3 border border-border-light">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <CreditCardIcon size={14} className="text-primary" />
          <p className="text-xs font-semibold text-text-heading">Pay Expense</p>
        </div>
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <XIcon size={14} />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <select
          value={selectedExpenseId}
          onChange={(e) => setSelectedExpenseId(e.target.value)}
          className="
            w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-xs text-text-body
            outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
          "
        >
          <option value="">Choose an expense</option>
          {expenses.map((expense) => (
            <option key={expense.ExpenseId} value={expense.ExpenseId}>
              {(expense.Description || 'Untitled expense')} - {formatCurrency(expense.TotalAmount)}
            </option>
          ))}
        </select>

        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="
            w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-xs text-text-body
            outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
          "
        >
          <option value="">Who is paying?</option>
          {memberUsers.map((member) => (
            <option key={member.UserId} value={member.UserId}>
              {member.Name}{member.UserId === currentUser?.UserID ? ' (You)' : ''}
            </option>
          ))}
        </select>

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

        <AppInput
          variant="simple"
          inputSize="sm"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {selectedExpense && (
        <p className="mt-2 text-[11px] text-text-muted">
          Paying for <span className="text-text-heading font-medium">{selectedExpense.Description || 'Untitled expense'}</span>
          {' '}created on {selectedExpense.Date || 'an unknown date'}.
        </p>
      )}

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
            Paying...
          </>
        ) : (
          'Pay Expense'
        )}
      </Button>
    </div>
  );
}
