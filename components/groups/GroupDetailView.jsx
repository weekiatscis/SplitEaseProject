"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  UserPlusIcon,
  ReceiptIcon,
  CreditCardIcon,
  TrashIcon,
  SpinnerGapIcon,
  CheckIcon,
  CheckCircleIcon,
} from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import AddExpensePanel from './AddExpensePanel';
import { useGroups } from '@/context/GroupContext';
import { useAuth } from '@/context/AuthContext';
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
  const [splitsMap, setSplitsMap] = useState({});
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [summaryVersion, setSummaryVersion] = useState(0);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const [isPayingAll, setIsPayingAll] = useState(false);
  const [payAllSuccess, setPayAllSuccess] = useState(false);
  const [payAllError, setPayAllError] = useState('');

  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [addMemberError, setAddMemberError] = useState('');

  const [involvementMap, setInvolvementMap] = useState({}); // { [ExpenseId]: Set<UserId> }

  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  const members = group?.GroupMembers || [];

  // Fetch expenses and user splits in parallel
  useEffect(() => {
    if (!groupId || !currentUser) return;
    let cancelled = false;
    setLoadingExpenses(true);
    setPayAllSuccess(false);
    Promise.all([
      fetch(`/api/expense/GetGroupSummary?GroupId=${groupId}`)
        .then((res) => res.ok ? res.json() : Promise.reject(res.status)),
      fetch(`/api/expense-summary/GetGroupExpenseSummary2?GroupId=${groupId}`)
        .then((res) => res.ok ? res.json() : Promise.reject(res.status)),
    ])
      .then(([summary, summary2]) => {
        if (cancelled) return;
        setExpenses(summary || []);
        const map = {};
        const involvement = {};
        (summary2 || []).forEach((e) => {
          const sharedBy = e.SharedBy || [];
          involvement[e.ExpenseId] = new Set(sharedBy);

          const inSharedBy = sharedBy.includes(currentUser.UserID);
          const isPayer =
            e.PaidBy === currentUser.Name ||
            Number(e.PaidBy) === currentUser.UserID;
          const myShare = inSharedBy && sharedBy.length > 0
            ? e.TotalAmount / sharedBy.length
            : 0;

          if (inSharedBy || isPayer) {
            // negative = get back (shown green +), positive = owe (shown red)
            map[e.ExpenseId] = isPayer ? myShare - e.TotalAmount : myShare;
          }
        });
        setSplitsMap(map);
        setInvolvementMap(involvement);
      })
      .catch(() => { if (!cancelled) { setExpenses([]); setSplitsMap({}); setInvolvementMap({}); } })
      .finally(() => { if (!cancelled) setLoadingExpenses(false); });
    return () => { cancelled = true; };
  }, [groupId, summaryVersion, currentUser]);

  // Fetch all users (needed for name resolution and add member panel)
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    setLoadingUsers(true);
    fetch(`/api/users/GetAllUsers?UserId=${currentUser.UserID}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((users) => { if (!cancelled) setAllUsers(users); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingUsers(false); });
    return () => { cancelled = true; };
  }, [currentUser]);

  const resolveUserName = (paidBy) => {
    const id = Number(paidBy);
    if (!isNaN(id)) {
      if (currentUser && id === currentUser.UserID) return currentUser.Name;
      const found = allUsers.find((u) => u.UserId === id);
      if (found) return found.Name;
    }
    return paidBy;
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
      const res = await fetch(`/api/expense/DeleteExpense?ExpenseId=${expenseId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`DeleteExpense failed with status ${res.status}`);
      setSummaryVersion((v) => v + 1);
    } catch (err) {
      console.error('Failed to delete expense:', err);
    } finally {
      setDeletingExpenseId(null);
    }
  };

  const handlePayAll = async () => {
    const outstanding = Object.entries(splitsMap)
      .filter(([, amount]) => amount > 0)
      .map(([expenseId, amount]) => ({ ExpenseId: Number(expenseId), Amount: amount }));

    if (outstanding.length === 0) return;

    setIsPayingAll(true);
    setPayAllError('');
    setPayAllSuccess(false);
    try {
      await Promise.all(
        outstanding.map(({ ExpenseId, Amount }) =>
          fetch('/api/pay-expense', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ GroupId: groupId, ExpenseId, UserId: currentUser.UserID, Amount }),
          }).then((res) => {
            if (!res.ok) throw new Error(`Payment failed for expense ${ExpenseId}`);
          })
        )
      );
      setPayAllSuccess(true);
      setSummaryVersion((v) => v + 1);
    } catch (err) {
      setPayAllError(err instanceof Error ? err.message : 'Failed to pay expenses');
    } finally {
      setIsPayingAll(false);
    }
  };

  const totalOwed = Object.values(splitsMap).reduce((sum, v) => sum + v, 0);
  const hasOutstanding = totalOwed > 0;

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
    <div className="w-full">
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
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[8px] font-bold">
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
              <p className="text-xs text-text-muted py-1">All available users are already members.</p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                {availableToAdd.map((user) => {
                  const isSelected = selectedUsers.includes(user.UserId);
                  return (
                    <button
                      key={user.UserId}
                      onClick={() => toggleUserSelection(user.UserId)}
                      className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-left text-xs transition-colors duration-150
                        ${isSelected
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : 'hover:bg-bg-primary text-text-body border border-transparent'
                        }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold
                        ${isSelected ? 'bg-primary text-white' : 'bg-primary/15 text-text-heading'}`}>
                        {isSelected ? <CheckIcon size={12} /> : getInitials(user.Name)}
                      </div>
                      <span className="font-medium">{user.Name}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {addMemberError && <p className="text-[11px] text-danger mt-2">{addMemberError}</p>}
            {availableToAdd.length > 0 && (
              <Button
                onClick={handleAddMembers}
                disabled={selectedUsers.length === 0 || isAddingMembers}
                size="sm"
                className="w-full mt-2.5"
              >
                {isAddingMembers ? (
                  <><SpinnerGapIcon size={12} className="animate-spin" />Adding...</>
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
          <h3 className="text-sm font-semibold text-text-heading">Expenses</h3>
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
            <p className="text-xs text-text-muted">No expenses yet. Add one to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {(() => {
              const memberColumns = members.map((name) => {
                const user = allUsers.find((u) => u.Name.toLowerCase() === name.toLowerCase());
                const isMe = user?.UserId === currentUser?.UserID;
                return { name, userId: user?.UserId ?? null, isMe };
              });
              return (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider py-2 pr-4">Description</th>
                      <th className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider py-2 pr-4">Paid By</th>
                      <th className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider py-2 pr-4">Date</th>
                      <th className="text-right text-[11px] font-medium text-text-muted uppercase tracking-wider py-2 pr-4">Total</th>
                      <th className="text-right text-[11px] font-medium text-text-muted uppercase tracking-wider py-2 pr-4">Your Share</th>
                      {memberColumns.map((m) => (
                        <th key={m.name} className={`text-center text-[11px] font-medium uppercase tracking-wider py-2 px-2 ${m.isMe ? 'bg-primary/10 text-primary' : 'text-text-muted'}`}>
                          {m.isMe ? '(You)' : m.name.split(' ')[0]}
                        </th>
                      ))}
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e) => (
                      <tr key={e.ExpenseId} className="border-b border-border-light last:border-0">
                        <td className="py-2.5 pr-4 text-text-heading font-medium">{e.Description || 'Untitled'}</td>
                        <td className="py-2.5 pr-4 text-text-secondary">{resolveUserName(e.PaidBy)}</td>
                        <td className="py-2.5 pr-4 text-text-muted text-xs">{e.Date || '—'}</td>
                        <td className="py-2.5 pr-4 text-right text-text-heading font-medium">{formatCurrency(e.TotalAmount)}</td>
                        <td className="py-2.5 pr-4 text-right font-medium">
                          {(() => {
                            const amt = splitsMap[e.ExpenseId];
                            if (amt == null) return <span className="text-text-muted">—</span>;
                            if (amt === 0) return <span className="text-success text-xs">Settled</span>;
                            if (amt < 0) return (
                              <span className="text-success">
                                +{formatCurrency(Math.abs(amt))}
                              </span>
                            );
                            return <span className="text-danger">{formatCurrency(amt)}</span>;
                          })()}
                        </td>
                        {memberColumns.map((m) => (
                          <td key={m.name} className={`py-2.5 px-2 text-center ${m.isMe ? 'bg-primary/5' : ''}`}>
                            {m.userId != null && involvementMap[e.ExpenseId]?.has(m.userId)
                              ? <CheckIcon size={13} className="text-success mx-auto" />
                              : <span className="text-text-muted text-xs">—</span>
                            }
                          </td>
                        ))}
                        <td className="py-2.5 pl-2">
                          <button
                            onClick={() => handleDeleteExpense(e.ExpenseId)}
                            disabled={deletingExpenseId === e.ExpenseId}
                            className="p-1 rounded text-text-muted hover:text-danger transition-colors duration-150 disabled:opacity-40"
                            title="Delete expense"
                          >
                            {deletingExpenseId === e.ExpenseId
                              ? <SpinnerGapIcon size={12} className="animate-spin" />
                              : <TrashIcon size={12} />
                            }
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {expenses.length > 1 && (
                    <tfoot>
                      <tr className="border-t border-border">
                        <td colSpan={3 + memberColumns.length} className="py-2.5 pr-4 text-xs font-medium text-text-secondary">
                          {expenses.length} expenses
                        </td>
                        <td className="py-2.5 pr-4 text-right text-sm font-semibold text-text-heading">
                          {formatCurrency(expenses.reduce((sum, e) => sum + e.TotalAmount, 0))}
                        </td>
                        <td className={`py-2.5 text-right text-sm font-semibold ${totalOwed < 0 ? 'text-success' : 'text-danger'}`}>
                          {totalOwed < 0 ? `+${formatCurrency(Math.abs(totalOwed))}` : formatCurrency(totalOwed)}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  )}
                </table>
              );
            })()}
          </div>
        )}

        {/* Pay All */}
        {!loadingExpenses && expenses && expenses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border-light">
            {payAllSuccess ? (
              <div className="flex items-center gap-2 justify-center py-2 text-success text-sm font-medium">
                <CheckCircleIcon size={16} weight="fill" />
                All expenses paid!
              </div>
            ) : (
              <>
                {payAllError && <p className="text-[11px] text-danger mb-2 text-center">{payAllError}</p>}
                <Button
                  onClick={handlePayAll}
                  disabled={isPayingAll || !hasOutstanding}
                  className="w-full"
                >
                  {isPayingAll ? (
                    <><SpinnerGapIcon size={14} className="animate-spin" />Processing payments...</>
                  ) : (
                    <><CreditCardIcon size={14} />
                      {hasOutstanding ? `Pay All — ${formatCurrency(totalOwed)}` : 'Nothing to pay'}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
