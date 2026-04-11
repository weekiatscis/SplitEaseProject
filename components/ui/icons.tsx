'use client';

/**
 * Unified icon exports for SplitEase.
 *
 * Duo-icons (@duo-icons/react) are wrapped to accept a `size` prop so they
 * behave identically to the Phosphor icons they replace. Icons not available
 * in duo-icons are implemented as minimal inline SVGs.
 */

import React from 'react';
import {
  Bell as DuoBell,
  Settings as DuoSettings,
  Menu as DuoMenu,
  AppDots as DuoAppDots,
  CheckCircle as DuoCheckCircle,
  CreditCard as DuoCreditCard,
  Calendar as DuoCalendar,
  Dashboard as DuoDashboard,
  User as DuoUser,
  Fire as DuoFire,
  Rocket as DuoRocket,
  Sun as DuoSun,
  Moon2 as DuoMoon,
  App as DuoApp,
} from '@duo-icons/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IconProps {
  size?: number;
  className?: string;
  /** Ignored — kept for drop-in compatibility with Phosphor icon callsites */
  weight?: string;
  [key: string]: unknown;
}

// ─── Duo-icon wrappers (accept `size` like Phosphor) ─────────────────────────

function wrapDuo(DuoIcon: React.ComponentType<Record<string, unknown>>) {
  const Wrapped = ({ size = 20, className = '', weight: _weight, ...rest }: IconProps) =>
    React.createElement(DuoIcon, { width: size, height: size, className, ...rest });
  return Wrapped;
}

export const BellSimpleIcon    = wrapDuo(DuoBell);
export const GearSixIcon       = wrapDuo(DuoSettings);
export const ListIcon          = wrapDuo(DuoMenu);
export const DotsThreeIcon     = wrapDuo(DuoAppDots);
export const CheckCircleIcon   = wrapDuo(DuoCheckCircle);
export const CreditCardIcon    = wrapDuo(DuoCreditCard);
export const CalendarBlankIcon = wrapDuo(DuoCalendar);
export const SquaresFourIcon   = wrapDuo(DuoDashboard);
export const UsersThreeIcon    = wrapDuo(DuoUser);
export const TrendUpIcon       = wrapDuo(DuoFire);
export const SparkleIcon       = wrapDuo(DuoRocket);
export const SunIcon           = wrapDuo(DuoSun);
export const MoonIcon          = wrapDuo(DuoMoon);
export const WalletIcon        = wrapDuo(DuoApp);

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
