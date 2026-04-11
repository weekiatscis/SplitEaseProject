import { NextRequest, NextResponse } from 'next/server';

const EXPENSE_SUMMARY_API = 'https://personal-eamy64us.outsystemscloud.com/ExpenseService/rest/ExpenseSummaryAPI';

type Params = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { path } = await params;
  const search = req.nextUrl.search;
  const res = await fetch(`${EXPENSE_SUMMARY_API}/${path.join('/')}${search}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
