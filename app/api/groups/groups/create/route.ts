import { NextRequest, NextResponse } from 'next/server';

const GROUP_API = 'https://personal-eamy64us.outsystemscloud.com/GroupService/rest/GroupAPI';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${GROUP_API}/groups/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
