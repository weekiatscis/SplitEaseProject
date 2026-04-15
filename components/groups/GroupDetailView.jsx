"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  MagnifyingGlassIcon,
  XIcon,
} from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import AddExpensePanel from './AddExpensePanel';
import DeleteGroupModal from './DeleteGroupModal';
import DeleteExpenseModal from './DeleteExpenseModal';
import ProcessingPaymentModal from './ProcessingPaymentModal';
import { useGroups } from '@/context/GroupContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils/formatCurrency';

function getInitials(name) {
  return String(name)
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function pickErrorText(payload) {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  if (typeof payload !== 'object') return '';

  const candidates = [
    payload.error,
    payload.message,
    payload.Message,
    payload.Error,
    payload.ErrorMessage,
    payload.description,
    payload.Description,
    payload.detail,
    payload.details,
    payload.reason,
  ];

  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }

  return '';
}

function mapPaymentErrorMessage(status, rawText) {
  const text = String(rawText || '').toLowerCase();
  if (
    text.includes('insufficient') ||
    text.includes('not enough') ||
    text.includes('insufficent') ||
    (text.includes('balance') && text.includes('low')) ||
    text.includes('unable to debit') ||
    text.includes('not sufficient')
  ) {
    return 'Payment failed: insufficient balance. Please top up and try again.';
  }

  if (text.includes('timeout') || text.includes('timed out')) {
    return 'Payment request timed out. Please try again.';
  }

  if (status >= 500) {
    return 'Payment service is temporarily unavailable. Please try again shortly.';
  }

  if (status === 401 || status === 403) {
    return 'Payment authorization failed. Please sign in again and retry.';
  }

  if (rawText && String(rawText).trim()) {
    return `Payment failed: ${String(rawText).trim()}`;
  }

  return `Payment failed (${status})`;
}

async function getPaymentErrorMessage(res) {
  let payload;
  try {
    payload = await res.clone().json();
  } catch {
    payload = null;
  }

  const fromJson = pickErrorText(payload);
  if (fromJson) return mapPaymentErrorMessage(res.status, fromJson);

  let text = '';
  try {
    text = (await res.text()) || '';
  } catch {
    text = '';
  }

  return mapPaymentErrorMessage(res.status, text);
}

export default function GroupDetailView({ groupId }) {
  const router = useRouter();
  const { groups, addMemberToGroup, removeGroup } = useGroups();
  const { user: currentUser } = useAuth();

  const group = groups.find((g) => g.Id === groupId);

  const [expenses, setExpenses] = useState(null);
  const [splitsMap, setSplitsMap] = useState({});
  const [sharedByMap, setSharedByMap] = useState({});
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [summaryVersion, setSummaryVersion] = useState(0);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const [balances, setBalances] = useState(null);
  const [loadingBalances, setLoadingBalances] = useState(true);

  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [addMemberError, setAddMemberError] = useState('');

  const [payingKey, setPayingKey] = useState(null);
  const [payError, setPayError] = useState('');

  const [txHistory, setTxHistory] = useState(null);
  const [loadingTxHistory, setLoadingTxHistory] = useState(true);

  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [pendingDeleteExpenseId, setPendingDeleteExpenseId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingGroup, setIsDeletingGroup] = useState(false);

  const members = group?.GroupMembers || [];

  useEffect(() => {
    if (!groupId || !currentUser) return;
    let cancelled = false;
    setLoadingExpenses(true);
    Promise.all([
      fetch(`/api/expense-summary/GetGroupExpenseSummary2?GroupId=${groupId}`)
        .then((res) => res.ok ? res.json() : Promise.reject(res.status)),
      fetch(`/api/expense/GetExpensesSplit?GroupId=${groupId}`)
        .then((res) => res.ok ? res.json() : Promise.reject(res.status))
        .catch(() => []),
    ])
      .then(([summary2, splitRows]) => {
        if (cancelled) return;
        setExpenses(summary2 || []);
        const map = {};
        const sbMap = {};

        const sameUser = (value) => {
          const asNum = Number(value);
          if (!Number.isNaN(asNum) && asNum === Number(currentUser.UserID)) return true;
          if (typeof value === 'string' && typeof currentUser.Name === 'string') {
            return value.trim().toLowerCase() === currentUser.Name.trim().toLowerCase();
          }
          return false;
        };
        const getExpenseId = (row) => Number(row?.ExpensesId ?? row?.ExpenseId ?? row?.ExpenseID);

        const mySplitByExpenseId = new Map();
        (splitRows || []).forEach((row) => {
          const rowUserId = row?.UserId ?? row?.UserID ?? row?.Name;
          if (!sameUser(rowUserId)) return;
          const expenseId = getExpenseId(row);
          if (Number.isNaN(expenseId)) return;
          const amountOwed = Number(row?.AmountOwed || 0);
          const current = mySplitByExpenseId.get(expenseId) || 0;
          mySplitByExpenseId.set(expenseId, current + amountOwed);
        });

        (summary2 || []).forEach((e) => {
          const sharedBy = e.SharedBy || [];
          sbMap[e.ExpenseId] = sharedBy;

          const fromSplit = mySplitByExpenseId.get(Number(e.ExpenseId));
          if (fromSplit !== undefined) {
            map[e.ExpenseId] = fromSplit;
            return;
          }

          const inSharedBy = sharedBy.includes(currentUser.UserID);
          const isPayer =
            e.PaidBy === currentUser.Name ||
            Number(e.PaidBy) === currentUser.UserID;
          const myShare = inSharedBy && sharedBy.length > 0
            ? e.TotalAmount / sharedBy.length
            : 0;
          if (inSharedBy || isPayer) {
            map[e.ExpenseId] = isPayer ? myShare - e.TotalAmount : myShare;
          }
        });
        setSplitsMap(map);
        setSharedByMap(sbMap);
      })
      .catch(() => { if (!cancelled) { setExpenses([]); setSplitsMap({}); } })
      .finally(() => { if (!cancelled) setLoadingExpenses(false); });
    return () => { cancelled = true; };
  }, [groupId, summaryVersion, currentUser]);

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

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;
    setLoadingTxHistory(true);
    fetch(`/api/payment/GetTransactionByGroupId?GroupId=${groupId}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((data) => { if (!cancelled) setTxHistory(data || []); })
      .catch(() => { if (!cancelled) setTxHistory([]); })
      .finally(() => { if (!cancelled) setLoadingTxHistory(false); });
    return () => { cancelled = true; };
  }, [groupId, summaryVersion]);

  const resolveUserName = (paidBy) => {
    const id = Number(paidBy);
    if (!isNaN(id)) {
      if (currentUser && id === currentUser.UserID) return 'You';
      const found = allUsers.find((u) => u.UserId === id);
      if (found) return found.Name;
    }
    return paidBy;
  };

  const availableToAdd = allUsers.filter(
    (u) => !members.some((m) => m.toLowerCase() === u.Name.toLowerCase())
  );
  const filteredUsers = memberSearch.trim()
    ? availableToAdd.filter((u) => u.Name.toLowerCase().includes(memberSearch.toLowerCase()))
    : availableToAdd;

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
      setMemberSearch('');
    } catch (err) {
      setAddMemberError(err instanceof Error ? err.message : 'Failed to add members');
    } finally {
      setIsAddingMembers(false);
    }
  };

  const handlePay = async (b) => {
    const key = `${b.UserId}_${b.UserId2}`;
    setPayingKey(key);
    setPayError('');
    try {
      const payer = allUsers.find((u) => u.UserId === currentUser.UserID);
      const recipient = allUsers.find((u) => u.UserId === b.UserId2);
      const res = await fetch('/api/payment/CreditTransfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          GroupId: groupId,
          PayeeId: currentUser.UserID,
          PayeePhoneNumber: payer?.PhoneNumber || '',
          PayeeCountryCode: '+65',
          Beneficiary: {
            Name: resolveUserName(b.UserId2),
            Id: b.UserId2,
            PhoneNumber: recipient?.PhoneNumber || '',
            CountryCode: '+65',
            TransactionAmount: b.AmountOwedTo,
            Description: 'Group expense settlement',
          },
        }),
      });
      if (!res.ok) {
        const message = await getPaymentErrorMessage(res);
        throw new Error(message);
      }
      setSummaryVersion((v) => v + 1);
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPayingKey(null);
    }
  };

  const handleDeleteGroup = () => setShowDeleteModal(true);

  const handleConfirmDelete = async () => {
    setIsDeletingGroup(true);
    try {
      await removeGroup(groupId);
      router.push('/groups');
    } catch (err) {
      console.error('Failed to delete group:', err);
      setIsDeletingGroup(false);
    }
  };

  const handleDeleteExpense = (expenseId) => {
    setPendingDeleteExpenseId(expenseId);
  };

  const handleConfirmDeleteExpense = async () => {
    const expenseId = pendingDeleteExpenseId;
    setDeletingExpenseId(expenseId);
    try {
      const res = await fetch(`/api/expense/DeleteExpense?ExpenseId=${expenseId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`DeleteExpense failed with status ${res.status}`);
      setSummaryVersion((v) => v + 1);
    } catch (err) {
      console.error('Failed to delete expense:', err);
    } finally {
      setDeletingExpenseId(null);
      setPendingDeleteExpenseId(null);
    }
  };

  useEffect(() => {
    if (!groupId || !currentUser) return;
    let cancelled = false;
    setLoadingBalances(true);
    fetch(`/api/balance/GetBalances?GroupId=${groupId}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((data) => { if (!cancelled) setBalances(data || []); })
      .catch(() => { if (!cancelled) setBalances([]); })
      .finally(() => { if (!cancelled) setLoadingBalances(false); });
    return () => { cancelled = true; };
  }, [groupId, summaryVersion, currentUser]);

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
        className="inline-flex items-center gap-1.5 text-xs text-text-muted
          hover:text-text-heading transition-colors duration-150 mb-6"
      >
        <ArrowLeftIcon size={12} />
        Groups
      </Link>

      {/* ── Page title ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold font-display text-text-heading leading-tight">
            {group.GroupName}
          </h2>
          <p className="text-xs text-text-muted mt-1">
            {members.length} member{members.length !== 1 ? 's' : ''}
            {!loadingExpenses && expenses && expenses.length > 0 && (
              <> · {expenses.length} expense{expenses.length !== 1 ? 's' : ''}</>
            )}
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

      {/* ── Balance summary ── */}
      {loadingBalances ? (
        <div className="flex items-center gap-2 mb-6 text-text-muted text-xs">
          <SpinnerGapIcon size={13} className="animate-spin" />
          Loading balances…
        </div>
      ) : balances && balances.length === 0 ? (
        <div className="flex items-center gap-2 mb-6 text-success text-sm font-medium">
          <CheckCircleIcon size={15} weight="fill" />
          All settled up in this group.
        </div>
      ) : balances && balances.length > 0 ? (() => {
        const iOwe = balances.filter((b) => b.UserId === currentUser?.UserID);
        const owedToMe = balances.filter((b) => b.UserId2 === currentUser?.UserID);
        if (iOwe.length === 0 && owedToMe.length === 0) return null;
        return (
          <div className="bg-bg-card rounded-xl border border-border mb-6 overflow-hidden">
            <div className="px-5 py-3 border-b border-border-light">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Balances</h3>
            </div>
            {payError && <p className="text-[11px] text-danger px-5 pt-2">{payError}</p>}
            <div className="divide-y divide-border-light">
              {iOwe.map((b, i) => {
                const key = `${b.UserId}_${b.UserId2}`;
                const isPaying = payingKey === key;
                return (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-xs text-text-muted">You owe</p>
                    <p className="text-sm font-medium text-text-heading">{resolveUserName(b.UserId2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-danger tabular-nums">
                      {formatCurrency(b.AmountOwedTo)}
                    </span>
                    <Button size="sm" onClick={() => handlePay(b)} disabled={isPaying}>
                      {isPaying ? (
                        <><SpinnerGapIcon size={13} className="animate-spin" />Processing…</>
                      ) : (
                        <><CreditCardIcon size={13} />Pay {formatCurrency(b.AmountOwedTo)}</>
                      )}
                    </Button>
                  </div>
                </div>
                );
              })}
              {owedToMe.map((b, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-xs text-text-muted">Owes you</p>
                    <p className="text-sm font-medium text-text-heading">{resolveUserName(b.UserId)}</p>
                  </div>
                  <span className="text-sm font-semibold text-success tabular-nums">
                    +{formatCurrency(b.AmountOwedTo)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })() : null}

      {/* ── Members — lightweight row ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Members
          </h3>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              setShowAddMember((prev) => !prev);
              setShowAddExpense(false);
              setSelectedUsers([]);
              setAddMemberError('');
              setMemberSearch('');
            }}
            className="text-text-muted hover:text-primary"
          >
            <UserPlusIcon size={12} />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {members.map((name) => (
            <div
              key={name}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-card border border-border"
            >
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[8px] font-bold">
                {getInitials(name)}
              </div>
              <span className="text-xs text-text-body">{name}</span>
            </div>
          ))}
        </div>

        {showAddMember && (
          <div className="mt-3 border border-border rounded-xl overflow-hidden bg-bg-card">
            {loadingUsers ? (
              <div className="flex items-center justify-center py-6">
                <SpinnerGapIcon size={16} className="animate-spin text-text-muted" />
              </div>
            ) : availableToAdd.length === 0 ? (
              <p className="text-xs text-text-muted px-3 py-3">All users are already members.</p>
            ) : (
              <>
                {/* Search */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border-light">
                  <MagnifyingGlassIcon size={12} className="text-text-muted shrink-0" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search members…"
                    className="text-xs flex-1 bg-transparent outline-none text-text-body placeholder:text-text-muted"
                    autoFocus
                  />
                  {memberSearch && (
                    <button
                      onClick={() => setMemberSearch('')}
                      className="text-text-muted hover:text-text-body transition-colors"
                    >
                      <XIcon size={12} />
                    </button>
                  )}
                </div>

                {/* User list */}
                <div className="max-h-[180px] overflow-y-auto divide-y divide-border-light">
                  {filteredUsers.length === 0 ? (
                    <p className="text-xs text-text-muted text-center py-4">
                      No users match &ldquo;{memberSearch}&rdquo;
                    </p>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelected = selectedUsers.includes(user.UserId);
                      return (
                        <button
                          key={user.UserId}
                          onClick={() => toggleUserSelection(user.UserId)}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-bg-primary/60 transition-colors duration-100"
                        >
                          <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold transition-colors duration-100
                            ${isSelected ? 'bg-primary text-white' : 'bg-primary/12 text-text-heading'}`}>
                            {isSelected ? <CheckIcon size={11} /> : getInitials(user.Name)}
                          </div>
                          <span className="text-xs font-medium text-text-body flex-1">{user.Name}</span>
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                {addMemberError && (
                  <p className="text-[11px] text-danger px-3 pt-2">{addMemberError}</p>
                )}
                <div className="flex items-center justify-between px-3 py-2.5 border-t border-border-light">
                  <span className="text-[11px] text-text-muted">
                    {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : 'Select members to add'}
                  </span>
                  <Button
                    onClick={handleAddMembers}
                    disabled={selectedUsers.length === 0 || isAddingMembers}
                    size="sm"
                  >
                    {isAddingMembers ? (
                      <><SpinnerGapIcon size={12} className="animate-spin" />Adding…</>
                    ) : (
                      `Add ${selectedUsers.length || ''}`
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Expenses ── */}
      <section className="bg-bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
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
            Add expense
          </Button>
        </div>

        {showAddExpense && (
          <div className="px-5 py-4 border-b border-border-light">
            {loadingUsers ? (
              <div className="flex items-center justify-center py-6">
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

        {loadingExpenses ? (
          <div className="flex items-center justify-center py-12">
            <SpinnerGapIcon size={18} className="animate-spin text-text-muted" />
          </div>
        ) : !expenses || expenses.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center gap-2">
            <Image src="/noExpense.webp" alt="No expenses" width={120} height={120} className="opacity-80" />
            <p className="text-sm text-text-muted">No expenses yet.</p>
            <button
              onClick={() => setShowAddExpense(true)}
              className="text-xs text-primary hover:text-primary-hover transition-colors duration-150"
            >
              Add the first one →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider py-3 px-5">Description</th>
                  <th className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider py-3 px-4">Paid by</th>
                  <th className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider py-3 px-4 hidden md:table-cell">Split with</th>
                  <th className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider py-3 px-4 hidden sm:table-cell">Date</th>
                  <th className="text-right text-[11px] font-medium text-text-muted uppercase tracking-wider py-3 px-4">Total</th>
                  <th className="text-right text-[11px] font-medium text-text-muted uppercase tracking-wider py-3 px-5">Your share</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => {
                  const shareAmt = splitsMap[e.ExpenseId];
                  return (
                    <tr key={e.ExpenseId} className="border-b border-border-light last:border-0 hover:bg-bg-primary/50 transition-colors duration-100">
                      <td className="py-3.5 px-5 text-text-heading font-medium">
                        {e.Description || 'Untitled'}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary text-xs">
                        {resolveUserName(e.PaidBy)}
                      </td>
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-0.5">
                          {(sharedByMap[e.ExpenseId] || []).map((uid) => {
                            const name = resolveUserName(uid);
                            const displayName = name === 'You' ? (currentUser?.Name || 'You') : name;
                            return (
                              <div key={uid} className="relative group/avatar">
                                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[8px] font-bold text-text-heading cursor-default">
                                  {getInitials(displayName)}
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-gray-900 text-white text-[10px] whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 pointer-events-none transition-opacity duration-150 z-20">
                                  {displayName}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                </div>
                              </div>
                            );
                          })}
                          {!(sharedByMap[e.ExpenseId]?.length) && (
                            <span className="text-xs text-text-muted">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-text-muted text-xs hidden sm:table-cell">
                        {e.Date || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-text-secondary text-xs tabular-nums">
                        {formatCurrency(e.TotalAmount)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-semibold tabular-nums">
                        {shareAmt == null ? (
                          <span className="text-text-muted font-normal text-xs">—</span>
                        ) : shareAmt === 0 ? (
                          <span className="text-text-muted font-normal text-xs">Settled</span>
                        ) : shareAmt < 0 ? (
                          <span className="text-success">+{formatCurrency(Math.abs(shareAmt))}</span>
                        ) : (
                          <span className="text-danger">{formatCurrency(shareAmt)}</span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4">
                        <button
                          onClick={() => handleDeleteExpense(e.ExpenseId)}
                          disabled={deletingExpenseId === e.ExpenseId}
                          className="p-1 rounded text-text-muted hover:text-danger transition-colors duration-150 disabled:opacity-40"
                        >
                          {deletingExpenseId === e.ExpenseId
                            ? <SpinnerGapIcon size={12} className="animate-spin" />
                            : <TrashIcon size={12} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Payment History ── */}
      <section className="bg-bg-card rounded-xl border border-border mt-6">
        <div className="px-5 py-4 border-b border-border-light">
          <h3 className="text-sm font-semibold text-text-heading">Payment History</h3>
        </div>
        {loadingTxHistory ? (
          <div className="flex items-center justify-center py-10">
            <SpinnerGapIcon size={18} className="animate-spin text-text-muted" />
          </div>
        ) : !txHistory || txHistory.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-text-muted">No payments made yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {[...txHistory]
              .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime))
              .slice(0, 10)
              .map((tx, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-xs font-medium text-text-heading">
                      {resolveUserName(tx.PaidBy)} paid {resolveUserName(tx.ReceivedBy)}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {tx.DateTime ? new Date(tx.DateTime).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-text-heading tabular-nums">
                    {formatCurrency(tx.Amount)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </section>

      <ProcessingPaymentModal open={payingKey !== null} />

      <DeleteExpenseModal
        open={pendingDeleteExpenseId !== null}
        onClose={() => setPendingDeleteExpenseId(null)}
        onConfirm={handleConfirmDeleteExpense}
        expenseName={expenses?.find((e) => e.ExpenseId === pendingDeleteExpenseId)?.Description || 'This expense'}
        isDeleting={deletingExpenseId !== null}
      />

      <DeleteGroupModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        groupName={group.GroupName}
        isDeleting={isDeletingGroup}
      />

    </div>
  );
}
