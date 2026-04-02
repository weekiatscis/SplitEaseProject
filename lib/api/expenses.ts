export interface CreateExpenseRequest {
  GroupId: number;
  Amount: number;
  Description: string;
  paidBy: number;
}

export interface ExpenseSplitResult {
  UserId: number;
  AmountOwed: number;
}

export interface GroupExpenseItem {
  ExpenseId: number;
  Description: string;
  TotalAmount: number;
  PaidBy: string;
  Date: string;
}

export interface PayExpenseRequest {
  GroupId: number;
  ExpenseId: number;
  UserId: number;
  Amount: number;
  Note?: string;
}

const EXPENSE_API_BASE_URL = process.env.NEXT_PUBLIC_EXPENSE_API_BASE_URL;
const PAY_EXPENSE_API_URL = process.env.NEXT_PUBLIC_PAY_EXPENSE_API_URL;

export async function createExpense(
  groupId: number,
  amount: number,
  description: string,
  paidBy: number
): Promise<ExpenseSplitResult[]> {
  const res = await fetch(`${EXPENSE_API_BASE_URL}/expenses/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      GroupId: groupId,
      Amount: amount,
      Description: description,
      paidBy: paidBy,
    } satisfies CreateExpenseRequest),
  });
  if (!res.ok) throw new Error(`CreateExpense failed with status ${res.status}`);
  return res.json();
}

export async function getGroupSummary(groupId: number): Promise<GroupExpenseItem[]> {
  const res = await fetch(`${EXPENSE_API_BASE_URL}/GetGroupSummary?GroupId=${groupId}`);
  if (!res.ok) throw new Error(`GetGroupSummary failed with status ${res.status}`);
  return res.json();
}

export async function deleteExpense(expenseId: number): Promise<void> {
  const res = await fetch(`${EXPENSE_API_BASE_URL}/DeleteExpense?ExpenseId=${expenseId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`DeleteExpense failed with status ${res.status}`);
}

export async function payExpense(payload: PayExpenseRequest): Promise<void> {
  if (!PAY_EXPENSE_API_URL) {
    throw new Error('Set NEXT_PUBLIC_PAY_EXPENSE_API_URL in .env.local to enable expense payments.');
  }

  const res = await fetch(PAY_EXPENSE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`PayExpense failed with status ${res.status}`);
  }
}
