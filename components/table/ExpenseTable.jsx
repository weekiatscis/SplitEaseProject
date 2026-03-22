"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, SlidersHorizontalIcon, CalendarBlankIcon, ArrowsDownUpIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import AppInput from '@/components/ui/AppInput';
import { expenses as initialExpenses } from '@/lib/data/expenses';
import ExpenseRow from './ExpenseRow';
import ExpenseRowExpanded from './ExpenseRowExpanded';

export default function ExpenseTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isSorting, setIsSorting] = useState(false);

  const filteredExpenses = useMemo(() => {
    let result = [...initialExpenses];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.group.toLowerCase().includes(q) ||
          e.paidBy.toLowerCase().includes(q)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchQuery, sortConfig]);

  const handleSort = (key) => {
    setIsSorting(true);
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setTimeout(() => setIsSorting(false), 150);
  };

  const columns = [
    { key: 'name', label: 'Expense', align: 'left' },
    { key: 'group', label: 'Group', align: 'left' },
    { key: 'paidBy', label: 'Paid By', align: 'left' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'yourShare', label: 'Your Share', align: 'right' },
    { key: 'status', label: 'Status', align: 'left' },
  ];

  return (
    <section aria-label="Recent expenses" className="bg-bg-card rounded-xl border border-border shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
        <h3 className="text-base font-semibold text-text-heading">Card List</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <CalendarBlankIcon size={13} />
            This Week
          </Button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 px-5 pb-4">
        <AppInput
          variant="simple"
          inputSize="sm"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<MagnifyingGlassIcon size={15} />}
          className="flex-1 min-w-[200px]"
        />
        <Button variant="outline" size="sm">
          <SlidersHorizontalIcon size={13} />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-t border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-heading transition-colors duration-100 select-none ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  onClick={() => handleSort(col.key)}
                  aria-sort={
                    sortConfig.key === col.key
                      ? sortConfig.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowsDownUpIcon size={11} className="opacity-40" />
                  </span>
                </th>
              ))}
              <th scope="col" className="w-10" />
            </tr>
          </thead>
          <tbody
            className={`transition-opacity duration-150 ${isSorting ? 'opacity-40' : 'opacity-100'}`}
          >
            <AnimatePresence>
              {filteredExpenses.map((expense) => (
                <AnimatePresence key={expense.id}>
                  <ExpenseRow
                    expense={expense}
                    isExpanded={expandedRowId === expense.id}
                    onToggle={() =>
                      setExpandedRowId((prev) => (prev === expense.id ? null : expense.id))
                    }
                  />
                  {expandedRowId === expense.id && (
                    <ExpenseRowExpanded expense={expense} />
                  )}
                </AnimatePresence>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </section>
  );
}
