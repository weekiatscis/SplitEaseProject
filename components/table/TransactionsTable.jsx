"use client";

import { DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { expenses } from '@/lib/data/expenses';

export default function TransactionsTable() {
  return (
    <section className="bg-bg-card rounded-xl border border-border">
      <div className="p-5 pb-1">
        <h3 className="text-base font-semibold text-text-heading">
          Last transactions
        </h3>
        <p className="text-sm text-text-muted mt-0.5">
          Check your last transactions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light">
              <th className="text-left text-xs font-medium text-primary py-3 px-5">
                Description
              </th>
              <th className="text-left text-xs font-medium text-primary py-3 px-4">
                Method
              </th>
              <th className="text-left text-xs font-medium text-primary py-3 px-4">
                Date
              </th>
              <th className="text-left text-xs font-medium text-primary py-3 px-4">
                Amount
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const isPositive = expense.paidBy === 'You';
              return (
                <tr
                  key={expense.id}
                  className="border-b border-border-light last:border-0
                    hover:bg-bg-primary/50 transition-colors duration-100"
                >
                  <td className="py-3.5 px-5 text-text-heading font-medium">
                    {expense.name}
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary">
                    {expense.group}
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary">
                    {expense.date}
                  </td>
                  <td className={`py-3.5 px-4 font-medium ${
                    isPositive ? 'text-success' : 'text-text-heading'
                  }`}>
                    {isPositive ? '+' : '-'}{formatCurrency(expense.amount)}
                  </td>
                  <td className="py-3.5 pr-4">
                    <button
                      className="p-1 rounded text-text-muted hover:text-text-heading
                        transition-colors duration-150"
                    >
                      <DotsThreeVerticalIcon size={16} weight="bold" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
