"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

const GROUP_API = '/api/groups';

export interface GroupMemberResponse {
  Id: number;
  GroupName: string;
  CreatedBy: string;
  GroupMembers: string[];
}

async function getGroupsByUser(userId: number) {
  const res = await fetch(`${GROUP_API}/GetGroupsByUser?UserId=${userId}`);
  if (!res.ok) throw new Error(`GetGroupsByUser failed with status ${res.status}`);
  return res.json();
}

async function getGroupMember(groupId: number): Promise<GroupMemberResponse> {
  const res = await fetch(`${GROUP_API}/GetGroupMember?GroupId=${groupId}`);
  if (!res.ok) throw new Error(`GetGroupMember failed with status ${res.status}`);
  return res.json();
}

async function apiCreateGroup(name: string, createdBy: number): Promise<number> {
  const res = await fetch(`${GROUP_API}/groups/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ GroupName: name, CreatedBy: createdBy }),
  });
  if (!res.ok) throw new Error(`CreateGroup failed with status ${res.status}`);
  return res.json();
}

async function apiDeleteGroup(groupId: number): Promise<void> {
  const res = await fetch(`${GROUP_API}/DeleteGroup?GroupId=${groupId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DeleteGroup failed with status ${res.status}`);
}

async function apiAddMember(groupId: number, userIdList: number[]): Promise<void> {
  const res = await fetch(`${GROUP_API}/groups/addMember`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ GroupId: groupId, UserIdList: userIdList }),
  });
  if (!res.ok) throw new Error(`AddMember failed with status ${res.status}`);
}

interface GroupContextType {
  groups: GroupMemberResponse[];
  loading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  createNewGroup: (name: string, createdByUserId: number) => Promise<void>;
  removeGroup: (groupId: number) => Promise<void>;
  addMemberToGroup: (groupId: number, userIds: number[]) => Promise<void>;
}

const GroupContext = createContext<GroupContextType | null>(null);

export function GroupProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupMemberResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get all group IDs for the current user from the API
      const groupList = await getGroupsByUser(user.UserID);

      // Deduplicate by GroupId in case the API returns duplicates
      const uniqueGroupIds = [...new Set(groupList.map((g: { GroupId: number }) => g.GroupId))];

      if (uniqueGroupIds.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }

      // Fetch full group details (with members) for each group
      const results = await Promise.allSettled(
        uniqueGroupIds.map((id) => getGroupMember(id as number))
      );

      const fetchedGroups: GroupMemberResponse[] = [];
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          fetchedGroups.push(result.value);
        }
      });

      setGroups(fetchedGroups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createNewGroup = useCallback(async (name: string, createdByUserId: number) => {
    const newGroupId = await apiCreateGroup(name, createdByUserId);

    // Fetch the full group data
    const groupData = await getGroupMember(newGroupId);
    setGroups((prev) => [...prev, groupData]);
  }, []);

  const removeGroup = useCallback(async (groupId: number) => {
    await apiDeleteGroup(groupId);
    setGroups((prev) => prev.filter((g) => g.Id !== groupId));
  }, []);

  const addMemberToGroup = useCallback(async (groupId: number, userIds: number[]) => {
    await apiAddMember(groupId, userIds);

    // Refetch the group to get updated member list
    const updatedGroup = await getGroupMember(groupId);
    setGroups((prev) => prev.map((g) => (g.Id === groupId ? updatedGroup : g)));
  }, []);

  return (
    <GroupContext.Provider value={{ groups, loading, error, fetchGroups, createNewGroup, removeGroup, addMemberToGroup }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (!context) throw new Error('useGroups must be used within GroupProvider');
  return context;
}
