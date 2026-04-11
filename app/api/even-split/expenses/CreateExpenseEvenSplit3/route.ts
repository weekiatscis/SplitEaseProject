import { NextRequest, NextResponse } from 'next/server';

const EVEN_SPLIT_API = 'https://personal-eamy64us.outsystemscloud.com/ExpenseService/rest/EvenExpenseSplitAPI';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${EVEN_SPLIT_API}/expenses/CreateExpenseEvenSplit3`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
