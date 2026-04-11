import { NextRequest, NextResponse } from 'next/server';

const GROUP_API = 'https://personal-eamy64us.outsystemscloud.com/GroupService/rest/GroupAPI';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('UserId');
  const res = await fetch(`${GROUP_API}/GetGroupsByUser?UserId=${userId}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
