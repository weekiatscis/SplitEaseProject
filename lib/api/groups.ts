export interface GroupResponse {
  Id: number;
  GroupName: string;
  CreatedBy: string;
}

export interface GroupMemberResponse {
  Id: number;
  GroupName: string;
  CreatedBy: string;
  GroupMembers: string[];
}

export interface CreateGroupRequest {
  GroupName: string;
  CreatedBy: number;
}

export interface AddMemberRequest {
  GroupId: number;
  UserIdList: number[];
}

export interface UpdateGroupRequest {
  GroupName: string;
  GroupId: number;
}

export interface DeleteMemberRequest {
  GroupId: number;
  UserId: number;
}

export interface GroupListItem {
  GroupId: number;
  GroupName: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_GROUP_API_BASE_URL;

export async function getGroupsByUser(userId: number): Promise<GroupListItem[]> {
  const res = await fetch(`${API_BASE_URL}/GetGroupsByUser?UserId=${userId}`);
  if (!res.ok) throw new Error(`GetGroupsByUser failed with status ${res.status}`);
  return res.json();
}

export async function getGroup(groupId: number): Promise<GroupResponse> {
  const res = await fetch(`${API_BASE_URL}/GetGroup?GroupId=${groupId}`);
  if (!res.ok) throw new Error(`GetGroup failed with status ${res.status}`);
  return res.json();
}

export async function getGroupMember(groupId: number): Promise<GroupMemberResponse> {
  const res = await fetch(`${API_BASE_URL}/GetGroupMember?GroupId=${groupId}`);
  if (!res.ok) throw new Error(`GetGroupMember failed with status ${res.status}`);
  return res.json();
}

export async function createGroup(name: string, createdBy: number): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/groups/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ GroupName: name, CreatedBy: createdBy } satisfies CreateGroupRequest),
  });
  if (!res.ok) throw new Error(`CreateGroup failed with status ${res.status}`);
  return res.json();
}

export async function addMember(groupId: number, userIdList: number[]): Promise<number[]> {
  const res = await fetch(`${API_BASE_URL}/groups/addMember`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ GroupId: groupId, UserIdList: userIdList } satisfies AddMemberRequest),
  });
  if (!res.ok) throw new Error(`AddMember failed with status ${res.status}`);
  return res.json();
}

export async function updateGroup(groupId: number, name: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/UpdateGroup`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ GroupId: groupId, GroupName: name } satisfies UpdateGroupRequest),
  });
  if (!res.ok) throw new Error(`UpdateGroup failed with status ${res.status}`);
  return res.json();
}

export async function deleteGroup(groupId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/DeleteGroup?GroupId=${groupId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`DeleteGroup failed with status ${res.status}`);
}

export async function deleteGroupMember(groupId: number, userId: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/DeleteGroupMember`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ GroupId: groupId, UserId: userId } satisfies DeleteMemberRequest),
  });
  if (!res.ok) throw new Error(`DeleteGroupMember failed with status ${res.status}`);
  return res.json();
}
