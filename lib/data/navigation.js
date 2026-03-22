import {
  SquaresFourIcon,
  UsersThreeIcon,
  ReceiptIcon,
  ArrowsLeftRightIcon,
  ClockCounterClockwiseIcon,
  BellSimpleIcon,
  ChatCircleIcon,
} from '@phosphor-icons/react';

export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: SquaresFourIcon, href: '/dashboard' },
  { id: 'groups', label: 'Groups', icon: UsersThreeIcon, href: '/groups' },
  { id: 'expenses', label: 'Expenses', icon: ReceiptIcon, href: '/dashboard' },
  { id: 'settlements', label: 'Settlements', icon: ArrowsLeftRightIcon, href: '/dashboard' },
  { id: 'activity', label: 'Activity', icon: ClockCounterClockwiseIcon, href: '/dashboard' },
  { id: 'notifications', label: 'Notifications', icon: BellSimpleIcon, href: '/dashboard' },
  { id: 'messages', label: 'Messages', icon: ChatCircleIcon, href: '/dashboard' },
];
