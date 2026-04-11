import { NextRequest, NextResponse } from 'next/server';

const GROUPMEMBER_API = 'https://personal-eamy64us.outsystemscloud.com/GroupService/rest/GroupMemberAPI';

export async function GET(req: NextRequest) {
  const groupId = req.nextUrl.searchParams.get('GroupId');
  const res = await fetch(`${GROUPMEMBER_API}/GetGroupMember?GroupId=${groupId}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
