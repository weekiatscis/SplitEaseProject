"use client";

import Link from 'next/link';
import { UsersThreeIcon, TrashIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function GroupCard({ group, onDelete }) {
  const members = group.GroupMembers || [];

  return (
    <Link
      href={`/groups/${group.Id}`}
      className="block bg-bg-card rounded-xl border border-border
        hover:border-primary/30 transition-colors duration-150
        overflow-hidden cursor-pointer group/card"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-text-heading truncate">
              {group.GroupName}
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              Created by {group.CreatedBy}
            </p>
          </div>
          <div className="p-1.5 rounded-lg bg-primary-light text-primary shrink-0 ml-3">
            <UsersThreeIcon size={16} />
          </div>
        </div>

        {/* Member avatars */}
        <div className="flex items-center mb-4">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((name) => (
              <div
                key={name}
                title={name}
                className="w-7 h-7 rounded-full bg-primary
                  flex items-center justify-center text-white text-[9px] font-bold
                  border-2 border-bg-card"
              >
                {getInitials(name)}
              </div>
            ))}
            {members.length > 4 && (
              <div
                className="w-7 h-7 rounded-full bg-bg-primary
                  flex items-center justify-center text-text-muted text-[9px] font-bold
                  border-2 border-bg-card"
              >
                +{members.length - 4}
              </div>
            )}
          </div>
          <span className="text-xs text-text-muted ml-2.5">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border-light">
          <span className="text-xs text-text-secondary group-hover/card:text-primary transition-colors duration-150">
            View details →
          </span>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.preventDefault();
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
    </Link>
  );
}
