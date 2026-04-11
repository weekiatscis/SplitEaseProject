import { NextRequest, NextResponse } from 'next/server';

const GROUPMEMBER_API = 'https://personal-eamy64us.outsystemscloud.com/GroupService/rest/GroupMemberAPI';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${GROUPMEMBER_API}/groups/addMember`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
