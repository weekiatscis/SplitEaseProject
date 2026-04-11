import { NextRequest, NextResponse } from 'next/server';

const GROUP_API = 'https://personal-eamy64us.outsystemscloud.com/GroupService/rest/GroupAPI';

export async function DELETE(req: NextRequest) {
  const groupId = req.nextUrl.searchParams.get('GroupId');
  const res = await fetch(`${GROUP_API}/DeleteGroup?GroupId=${groupId}`, { method: 'DELETE' });
  return new NextResponse(null, { status: res.status });
}
