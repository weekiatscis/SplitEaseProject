"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  UserPlusIcon,
  ReceiptIcon,
  TrashIcon,
  SpinnerGapIcon,
  XIcon,
  CheckIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import AddExpensePanel from './AddExpensePanel';
import { useGroups } from '@/context/GroupContext';
import { useAuth } from '@/context/AuthContext';
import { getAllUsers } from '@/lib/api/auth';
import { getGroupSummary, deleteExpense } from '@/lib/api/expenses';
import { formatCurrency } from '@/lib/utils/formatCurrency';

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function GroupDetailView({ groupId }) {
  const router = useRouter();
  const { groups, addMemberToGroup, removeGroup } = useGroups();
  const { user: currentUser } = useAuth();

  const group = groups.find((g) => g.Id === groupId);

  const [expenses, setExpenses] = useState(null);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [summaryVersion, setSummaryVersion] = useState(0);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [addMemberError, setAddMemberError] = useState('');

  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  const members = group?.GroupMembers || [];

  // Fetch expenses
  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;
    setLoadingExpenses(true);
    getGroupSummary(groupId)
      .then((data) => { if (!cancelled) setExpenses(data || []); })
      .catch(() => { if (!cancelled) setExpenses([]); })
      .finally(() => { if (!cancelled) setLoadingExpenses(false); });
    return () => { cancelled = true; };
  }, [groupId, summaryVersion]);

  // Fetch all users on mount (needed for name resolution in expense table)
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    setLoadingUsers(true);
    getAllUsers(currentUser.UserID)
      .then((users) => { if (!cancelled) setAllUsers(users); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingUsers(false); });
    return () => { cancelled = true; };
  }, [currentUser]);

  // Resolve a user ID (string or number) to a display name
  const resolveUserName = (paidBy) => {
    const id = Number(paidBy);
    if (!isNaN(id)) {
      if (currentUser && id === currentUser.UserID) return currentUser.Name;
      const found = allUsers.find((u) => u.UserId === id);
      if (found) return found.Name;
    }
    return paidBy; // fallback to raw value if not resolvable
  };

  const availableToAdd = allUsers.filter(
    (u) => !members.some((m) => m.toLowerCase() === u.Name.toLowerCase())
  );

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;
    setIsAddingMembers(true);
    setAddMemberError('');
    try {
      await addMemberToGroup(groupId, selectedUsers);
      setSelectedUsers([]);
      setShowAddMember(false);
    } catch (err) {
      setAddMemberError(err instanceof Error ? err.message : 'Failed to add members');
    } finally {
      setIsAddingMembers(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm('Delete this group? This cannot be undone.')) return;
    try {
      await removeGroup(groupId);
      router.push('/groups');
    } catch (err) {
      console.error('Failed to delete group:', err);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    setDeletingExpenseId(expenseId);
    try {
      await deleteExpense(expenseId);
      setSummaryVersion((v) => v + 1);
    } catch (err) {
      console.error('Failed to delete expense:', err);
    } finally {
      setDeletingExpenseId(null);
    }
  };

  // Loading / not found states
  if (!group) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-text-muted">Group not found.</p>
        <Link href="/groups" className="text-sm text-primary hover:underline mt-2 inline-block">
          ← Back to groups
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Back link */}
      <Link
        href="/groups"
        className="inline-flex items-center gap-1.5 text-xs text-text-secondary
          hover:text-text-heading transition-colors duration-150 mb-5"
      >
        <ArrowLeftIcon size={12} />
        Groups
      </Link>

      {/* Group header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-heading">
            {group.GroupName}
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Created by {group.CreatedBy}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteGroup}
          className="text-text-muted hover:text-danger"
        >
          <TrashIcon size={14} />
          Delete
        </Button>
      </div>

      {/* ── Members Section ── */}
      <section className="bg-bg-card rounded-xl border border-border p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-heading">
            Members <span className="text-text-muted font-normal">{members.length}</span>
          </h3>
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setShowAddMember((prev) => !prev);
              setShowAddExpense(false);
              setSelectedUsers([]);
              setAddMemberError('');
            }}
          >
            <UserPlusIcon size={12} />
            Add
          </Button>
        </div>

        {/* Member list */}
        <div className="flex flex-wrap gap-2">
          {members.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-bg-primary"
            >
              <div
                className="w-6 h-6 rounded-full bg-primary
                  flex items-center justify-center text-white text-[8px] font-bold"
              >
                {getInitials(name)}
              </div>
              <span className="text-xs text-text-body">{name}</span>
            </div>
          ))}
        </div>

        {/* Add member panel */}
        {showAddMember && (
          <div className="mt-3 pt-3 border-t border-border-light">
            {loadingUsers ? (
              <div className="flex items-center justify-center py-3">
                <SpinnerGapIcon size={16} className="animate-spin text-text-muted" />
              </div>
            ) : availableToAdd.length === 0 ? (
              <p className="text-xs text-text-muted py-1">
                All available users are already members.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                {availableToAdd.map((user) => {
                  const isSelected = selectedUsers.includes(user.UserId);
                  return (
                    <button
                      key={user.UserId}
                      onClick={() => toggleUserSelection(user.UserId)}
                      className={`
                        flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-left text-xs
                        transition-colors duration-150
                        ${isSelected
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : 'hover:bg-bg-primary text-text-body border border-transparent'
                        }
                      `}
                    >
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold
                        ${isSelected
                          ? 'bg-primary text-white'
                          : 'bg-primary/15 text-text-heading'
                        }
                      `}>
                        {isSelected ? <CheckIcon size={12} /> : getInitials(user.Name)}
                      </div>
                      <span className="font-medium">{user.Name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {addMemberError && (
              <p className="text-[11px] text-danger mt-2">{addMemberError}</p>
            )}

            {availableToAdd.length > 0 && (
              <Button
                onClick={handleAddMembers}
                disabled={selectedUsers.length === 0 || isAddingMembers}
                size="sm"
                className="w-full mt-2.5"
              >
                {isAddingMembers ? (
                  <>
                    <SpinnerGapIcon size={12} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  `Add ${selectedUsers.length} member${selectedUsers.length !== 1 ? 's' : ''}`
                )}
              </Button>
            )}
          </div>
        )}
      </section>

      {/* ── Expenses Section ── */}
      <section className="bg-bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-heading">
            Expenses
          </h3>
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setShowAddExpense((prev) => !prev);
              setShowAddMember(false);
            }}
          >
            <ReceiptIcon size={12} />
            Add Expense
          </Button>
        </div>

        {/* Add expense panel */}
        {showAddExpense && (
          <div className="mb-4">
            {loadingUsers ? (
              <div className="bg-bg-primary rounded-lg p-3 border border-border-light flex items-center justify-center py-6">
                <SpinnerGapIcon size={16} className="animate-spin text-text-muted" />
              </div>
            ) : (
              <AddExpensePanel
                group={group}
                allUsers={allUsers}
                onClose={() => setShowAddExpense(false)}
                onExpenseAdded={() => setSummaryVersion((v) => v + 1)}
              />
            )}
          </div>
        )}

        {/* Expense table */}
        {loadingExpenses ? (
          <div className="flex items-center justify-center py-8">
            <SpinnerGapIcon size={18} className="animate-spin text-text-muted" />
          </div>
        ) : !expenses || expenses.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-text-muted">
              No expenses yet. Add one to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider py-2 pr-4">
                    Description
                  </th>
                  <th className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider py-2 pr-4">
                    Paid By
                  </th>
                  <th className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider py-2 pr-4">
                    Date
                  </th>
                  <th className="text-right text-[11px] font-medium text-text-muted uppercase tracking-wider py-2">
                    Amount
                  </th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr
                    key={e.ExpenseId}
                    className="border-b border-border-light last:border-0"
                  >
                    <td className="py-2.5 pr-4 text-text-heading font-medium">
                      {e.Description || 'Untitled'}
                    </td>
                    <td className="py-2.5 pr-4 text-text-secondary">
                      {resolveUserName(e.PaidBy)}
                    </td>
                    <td className="py-2.5 pr-4 text-text-muted text-xs">
                      {e.Date || '—'}
                    </td>
                    <td className="py-2.5 text-right text-text-heading font-medium">
                      {formatCurrency(e.TotalAmount)}
                    </td>
                    <td className="py-2.5 pl-2">
                      <button
                        onClick={() => handleDeleteExpense(e.ExpenseId)}
                        disabled={deletingExpenseId === e.ExpenseId}
                        className="p-1 rounded text-text-muted hover:text-danger
                          transition-colors duration-150 disabled:opacity-40"
                        title="Delete expense"
                      >
                        {deletingExpenseId === e.ExpenseId ? (
                          <SpinnerGapIcon size={12} className="animate-spin" />
                        ) : (
                          <TrashIcon size={12} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {expenses.length > 1 && (
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={3} className="py-2.5 pr-4 text-xs font-medium text-text-secondary">
                      {expenses.length} expenses
                    </td>
                    <td className="py-2.5 text-right text-sm font-semibold text-text-heading">
                      {formatCurrency(expenses.reduce((sum, e) => sum + e.TotalAmount, 0))}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
