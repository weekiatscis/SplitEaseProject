"use client";

import Link from 'next/link';
import { TrashIcon } from '@/components/ui/icons';
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
        hover:border-primary/30 cursor-pointer group/card card-interactive"
    >
      <div className="p-5">
        {/* Header row: name + optional delete */}
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-semibold text-text-heading truncate leading-snug">
              {group.GroupName}
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              by {group.CreatedBy}
            </p>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(group.Id);
              }}
              className="text-text-muted hover:text-danger ml-2 shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150"
            >
              <TrashIcon size={13} />
            </Button>
          )}
        </div>

        {/* Members */}
        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-1.5">
            {members.slice(0, 5).map((name) => (
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
            {members.length > 5 && (
              <div
                className="w-7 h-7 rounded-full bg-bg-primary
                  flex items-center justify-center text-text-muted text-[9px] font-bold
                  border-2 border-bg-card"
              >
                +{members.length - 5}
              </div>
            )}
          </div>
          <span className="text-xs text-text-muted">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}
