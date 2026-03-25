"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SpinnerGapIcon, UsersThreeIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import AppInput from '@/components/ui/AppInput';
import { useGroups } from '@/context/GroupContext';
import { useAuth } from '@/context/AuthContext';
import GroupCard from './GroupCard';

export default function GroupGrid() {
  const { groups, loading, error, createNewGroup, removeGroup } = useGroups();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleCreate = async () => {
    if (!newGroupName.trim()) {
      setCreateError('Please enter a group name');
      return;
    }
    if (!user?.UserID) {
      setCreateError('You must be logged in');
      return;
    }

    setIsCreating(true);
    setCreateError('');
    try {
      await createNewGroup(newGroupName.trim(), user.UserID);
      setNewGroupName('');
      setShowCreateForm(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (groupId) => {
    try {
      await removeGroup(groupId);
    } catch (err) {
      console.error('Failed to delete group:', err);
    }
  };

  return (
    <section aria-label="Your groups">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-text-heading">Your Groups</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            {loading ? 'Loading...' : `${groups.length} group${groups.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowCreateForm(true)}>
          <PlusIcon size={13} />
          New Group
        </Button>
      </div>

      {/* Create group form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-bg-card rounded-xl border border-border shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-text-heading">Create New Group</h4>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => { setShowCreateForm(false); setCreateError(''); }}
                >
                  <XIcon size={16} />
                </Button>
              </div>
              <div className="flex gap-3">
                <AppInput
                  variant="simple"
                  inputSize="sm"
                  placeholder="Group name"
                  value={newGroupName}
                  onChange={(e) => { setNewGroupName(e.target.value); setCreateError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  error={!!createError}
                  autoFocus
                  className="flex-1"
                />
                <Button
                  onClick={handleCreate}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <SpinnerGapIcon size={14} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </Button>
              </div>
              {createError && (
                <p className="text-[11px] text-danger mt-2">{createError}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {error && (
        <div className="bg-danger-bg text-danger rounded-xl p-5 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <SpinnerGapIcon size={24} className="animate-spin text-primary" />
        </div>
      )}

      {/* Empty state */}
      {!loading && groups.length === 0 && (
        <div className="bg-bg-card rounded-xl border border-border shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-4">
            <UsersThreeIcon size={24} className="text-primary" />
          </div>
          <h4 className="text-base font-semibold text-text-heading mb-1">No groups yet</h4>
          <p className="text-sm text-text-secondary mb-4">
            Create your first group to start splitting expenses with friends.
          </p>
          <Button variant="link" onClick={() => setShowCreateForm(true)}>
            <PlusIcon size={15} />
            Create a group
          </Button>
        </div>
      )}

      {/* Group cards grid */}
      {!loading && groups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.map((group, index) => (
            <div key={group.Id}>
              <GroupCard group={group} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
