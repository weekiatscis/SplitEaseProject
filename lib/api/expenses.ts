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

export interface GroupBalanceSummary {
  GroupId: number;
  Balances: { UserId: number; NetAmount: number }[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPENSE_API_BASE_URL;

export async function createExpense(
  groupId: number,
  amount: number,
  description: string,
  paidBy: number
): Promise<ExpenseSplitResult[]> {
  const res = await fetch(`${API_BASE_URL}/expenses/create`, {
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

export async function getGroupSummary(groupId: number): Promise<GroupBalanceSummary> {
  const res = await fetch(`${API_BASE_URL}/groups/${groupId}/summary`);
  if (!res.ok) throw new Error(`GetGroupSummary failed with status ${res.status}`);
  return res.json();
}

export async function deleteExpense(expenseId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/DeleteExpense?ExpenseId=${expenseId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`DeleteExpense failed with status ${res.status}`);
}
