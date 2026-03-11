"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Calendar, ArrowUpDown } from 'lucide-react';
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
    <section aria-label="Recent expenses" className="bg-bg-card rounded-2xl border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
        <h3 className="text-base font-semibold text-text-heading">Card List</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-text-secondary px-3 py-1.5 rounded-lg border border-border hover:border-primary/30 hover:text-primary transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
            <Calendar size={13} />
            This Week
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 px-5 pb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-bg-primary border border-border text-sm text-text-body placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all duration-150"
          />
        </div>
        <button className="flex items-center gap-1.5 text-xs text-text-secondary px-3 py-2 rounded-lg border border-border hover:border-primary/30 hover:text-primary transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
          <SlidersHorizontal size={13} />
          Filters
        </button>
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
                    <ArrowUpDown size={11} className="opacity-40" />
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