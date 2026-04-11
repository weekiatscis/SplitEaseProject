import { NextRequest, NextResponse } from 'next/server';

const EXPENSE_API = 'https://personal-eamy64us.outsystemscloud.com/ExpenseService/rest/ExpenseAPI';

type Params = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { path } = await params;
  const search = req.nextUrl.search;
  const res = await fetch(`${EXPENSE_API}/${path.join('/')}${search}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { path } = await params;
  const body = await req.json();
  const res = await fetch(`${EXPENSE_API}/${path.join('/')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { path } = await params;
  const search = req.nextUrl.search;
  const res = await fetch(`${EXPENSE_API}/${path.join('/')}${search}`, { method: 'DELETE' });
  return new NextResponse(null, { status: res.status });
}
