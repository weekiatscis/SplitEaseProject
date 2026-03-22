"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  getGroupsByUser,
  getGroupMember,
  createGroup as apiCreateGroup,
  deleteGroup as apiDeleteGroup,
  addMember as apiAddMember,
  type GroupMemberResponse,
} from '@/lib/api/groups';
import { useAuth } from '@/context/AuthContext';

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
      const uniqueGroupIds = [...new Set(groupList.map((g) => g.GroupId))];

      if (uniqueGroupIds.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }

      // Fetch full group details (with members) for each group
      const results = await Promise.allSettled(
        uniqueGroupIds.map((id) => getGroupMember(id))
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
