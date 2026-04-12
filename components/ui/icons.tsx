'use client';

/**
 * Unified icon exports for SplitEase.
 *
 * Phosphor icons are wrapped to accept a `size` prop so they behave
 * identically to the previous icon API. Icons not available in Phosphor are
 * implemented as minimal inline SVGs.
 */

import React from 'react';
import {
  BellSimple,
  CalendarBlank,
  CheckCircle,
  CreditCard,
  DotsThree,
  FireSimple,
  GearSix,
  List,
  Moon,
  Rocket,
  SquaresFour,
  Sun,
  UsersThree,
  Wallet,
} from '@phosphor-icons/react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IconProps {
  size?: number;
  className?: string;
  /** Ignored — kept for drop-in compatibility with Phosphor icon callsites */
  weight?: string;
  [key: string]: unknown;
}

// ─── Icon wrappers (accept `size` like the previous API) ────────────────────

function wrapIcon(IconComponent: React.ComponentType<PhosphorIconProps>) {
  const Wrapped = ({ size = 20, className = '', weight: _weight, ...rest }: IconProps) =>
    React.createElement(IconComponent, { size, className, ...rest });
  return Wrapped;
}

export const BellSimpleIcon    = wrapIcon(BellSimple);
export const GearSixIcon       = wrapIcon(GearSix);
export const ListIcon          = wrapIcon(List);
export const DotsThreeIcon     = wrapIcon(DotsThree);
export const CheckCircleIcon   = wrapIcon(CheckCircle);
export const CreditCardIcon    = wrapIcon(CreditCard);
export const CalendarBlankIcon = wrapIcon(CalendarBlank);
export const SquaresFourIcon   = wrapIcon(SquaresFour);
export const UsersThreeIcon    = wrapIcon(UsersThree);
export const TrendUpIcon       = wrapIcon(FireSimple);
export const SparkleIcon       = wrapIcon(Rocket);
export const SunIcon           = wrapIcon(Sun);
export const MoonIcon          = wrapIcon(Moon);
export const WalletIcon        = wrapIcon(Wallet);

// ─── Custom SVG icons (not in duo-icons) ─────────────────────────────────────

export function SpinnerGapIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      className={`animate-spin ${className}`}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MagnifyingGlassIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="m11 11 2.5 2.5" />
    </svg>
  );
}

export function SignOutIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
      <path d="m10 11 3-3-3-3" />
      <path d="M13 8H6" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="m3 8 3.5 3.5L13 5" />
    </svg>
  );
}

export function XIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round"
      className={className} aria-hidden="true"
    >
      <path d="m4 4 8 8M12 4 4 12" />
    </svg>
  );
}

export function TrashIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M2.5 4.5h11" />
      <path d="M5.5 4.5V3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1.5" />
      <path d="M4 4.5 4.5 13h7l.5-8.5" />
    </svg>
  );
}

export function PlusIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round"
      className={className} aria-hidden="true"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="m9.5 4.5-4 3.5 4 3.5" />
    </svg>
  );
}

export function CaretDownIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="m5 6.5 3 3 3-3" />
    </svg>
  );
}

export function CaretUpIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="m5 9.5 3-3 3 3" />
    </svg>
  );
}

export function UserPlusIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <circle cx="6.5" cy="5" r="2.5" />
      <path d="M1.5 13c0-2.8 2.2-5 5-5" />
      <path d="M12 9v5M9.5 11.5h5" />
    </svg>
  );
}

export function ReceiptIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M4 1.5v13l2.5-2 2.5 2 2.5-2V1.5H4Z" />
      <path d="M7 6h2M7 9h2" />
    </svg>
  );
}

export function SlidersHorizontalIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round"
      className={className} aria-hidden="true"
    >
      <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
      <circle cx="5.5" cy="4" r="1.5" fill="var(--color-bg-card)" />
      <circle cx="10.5" cy="8" r="1.5" fill="var(--color-bg-card)" />
      <circle cx="5.5" cy="12" r="1.5" fill="var(--color-bg-card)" />
    </svg>
  );
}

export function ArrowsDownUpIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M5 3.5v9M3 10.5l2 2 2-2M11 12.5v-9M13 5.5l-2-2-2 2" />
    </svg>
  );
}

export function ShareNetworkIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <circle cx="12" cy="3.5" r="1.5" />
      <circle cx="12" cy="12.5" r="1.5" />
      <circle cx="4" cy="8" r="1.5" />
      <path d="m5.4 7.2 5.2-3M5.4 8.8l5.2 3" />
    </svg>
  );
}
