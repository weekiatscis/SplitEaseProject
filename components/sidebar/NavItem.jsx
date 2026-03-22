"use client";

import Link from 'next/link';

export default function NavItem({ icon: Icon, label, href, isActive, onClick }) {
  return (
    <Link href={href || '#'} onClick={onClick}>
      <div
        className={`
          flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm cursor-pointer
          border-none outline-none transition-colors duration-150
          focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none
          ${
            isActive
              ? 'bg-primary-light text-primary font-semibold'
              : 'text-text-secondary hover:text-text-heading hover:bg-primary/5'
          }
        `}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
        <span>{label}</span>
      </div>
    </Link>
  );
}
