"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UsersThreeIcon, ArrowRightIcon, TrashIcon, UserPlusIcon, XIcon, SpinnerGapIcon, CheckIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { availableUsers } from '@/lib/data/users';
import { useGroups } from '@/context/GroupContext';

// Generate initials from a name string
function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function GroupCard({ group, index = 0, onDelete }) {
  const { addMemberToGroup } = useGroups();
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const members = group.GroupMembers || [];

  // Filter out users already in the group
  const availableToAdd = availableUsers.filter(
    (u) => !members.some((m) => m.toLowerCase() === u.name.toLowerCase())
  );

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;

    setIsAdding(true);
    setAddError('');
    try {
      await addMemberToGroup(group.Id, selectedUsers);
      setSelectedUsers([]);
      setShowAddMember(false);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add members');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="
        bg-bg-card rounded-xl border border-border
        shadow-sm
        overflow-hidden cursor-default
      "
    >
      {/* Accent line */}
      <div className="h-1 bg-primary" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-base font-semibold text-text-heading">{group.GroupName}</h4>
            <p className="text-xs text-text-secondary mt-0.5">
              Created by {group.CreatedBy}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-primary-light text-primary">
            <UsersThreeIcon size={18} />
          </div>
        </div>

        {/* Member avatars */}
        <div className="flex items-center mb-4">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((name) => (
              <div
                key={name}
                title={name}
                className="w-8 h-8 rounded-full bg-primary
                  flex items-center justify-center text-white text-[10px] font-bold
                  border-2 border-bg-card"
              >
                {getInitials(name)}
              </div>
            ))}
            {members.length > 4 && (
              <div
                className="w-8 h-8 rounded-full bg-bg-primary
                  flex items-center justify-center text-text-muted text-[10px] font-bold
                  border-2 border-bg-card"
              >
                +{members.length - 4}
              </div>
            )}
          </div>
          <span className="text-xs text-text-muted ml-3">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Add member panel */}
        <AnimatePresence>
          {showAddMember && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3 overflow-hidden"
            >
              <div className="bg-bg-primary rounded-lg p-3 border border-border-light">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-text-heading">Add Members</p>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => { setShowAddMember(false); setSelectedUsers([]); setAddError(''); }}
                  >
                    <XIcon size={14} />
                  </Button>
                </div>

                {availableToAdd.length === 0 ? (
                  <p className="text-xs text-text-muted py-2">All available users are already members.</p>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto">
                    {availableToAdd.map((user) => {
                      const isSelected = selectedUsers.includes(user.id);
                      return (
                        <button
                          key={user.id}
                          onClick={() => toggleUserSelection(user.id)}
                          className={`
                            flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-left text-xs
                            transition-colors duration-150
                            ${isSelected
                              ? 'bg-primary/10 text-primary border border-primary/30'
                              : 'hover:bg-bg-card text-text-body border border-transparent'
                            }
                          `}
                        >
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2
                            ${isSelected
                              ? 'bg-primary text-white border-primary'
                              : 'bg-primary/20 text-text-heading border-bg-card'
                            }
                          `}>
                            {isSelected ? <CheckIcon size={12} /> : getInitials(user.name)}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {addError && (
                  <p className="text-[11px] text-danger mt-2">{addError}</p>
                )}

                {availableToAdd.length > 0 && (
                  <Button
                    onClick={handleAddMembers}
                    disabled={selectedUsers.length === 0 || isAdding}
                    size="sm"
                    className="w-full mt-2.5"
                  >
                    {isAdding ? (
                      <>
                        <SpinnerGapIcon size={12} className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      `Add ${selectedUsers.length} member${selectedUsers.length !== 1 ? 's' : ''}`
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border-light">
          <div className="flex items-center gap-3">
            <Button variant="link" size="xs" className="group/link">
              View Details
              <ArrowRightIcon size={13} className="transition-transform duration-150 group-hover/link:translate-x-0.5" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddMember((prev) => !prev);
                setSelectedUsers([]);
                setAddError('');
              }}
              title="Add members"
            >
              <UserPlusIcon size={13} />
              Add
            </Button>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(group.Id);
              }}
              className="text-text-muted hover:text-danger"
            >
              <TrashIcon size={13} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
