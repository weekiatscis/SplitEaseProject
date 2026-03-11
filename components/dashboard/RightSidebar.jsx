import ExpenseBreakdownChart from '@/components/charts/ExpenseBreakdownChart';
import AddExpenseForm from '@/components/forms/AddExpenseForm';

export default function RightSidebar() {
  return (
    <aside className="flex flex-col gap-6 p-5">
      <div className="bg-bg-card rounded-2xl border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5">
        <ExpenseBreakdownChart />
      </div>
      <div className="bg-bg-card rounded-2xl border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5">
        <AddExpenseForm />
      </div>
    </aside>
  );
}
