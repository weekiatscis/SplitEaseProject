import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import StatusBadge from './StatusBadge';

export default function ExpenseRow({ expense, isExpanded, onToggle }) {
  return (
    <tr
      onClick={onToggle}
      className="cursor-pointer hover:bg-primary-light transition-colors duration-100
        border-b border-border-light"
    >
      <td className="px-4 py-3 text-sm text-text-heading font-medium">{expense.name}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{expense.group}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{expense.paidBy}</td>
      <td className="px-4 py-3 text-sm text-text-heading font-medium text-right">
        {formatCurrency(expense.amount)}
      </td>
      <td className="px-4 py-3 text-sm text-text-heading font-medium text-right">
        {formatCurrency(expense.yourShare)}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={expense.status} />
      </td>
      <td className="px-4 py-3 text-text-muted">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="p-1 rounded hover:bg-primary-light transition-colors duration-100
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </td>
    </tr>
  );
}
