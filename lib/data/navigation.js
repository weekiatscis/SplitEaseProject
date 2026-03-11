import {
  LayoutDashboard,
  Users,
  Receipt,
  ArrowLeftRight,
  Clock,
  Bell,
  MessageSquare,
} from 'lucide-react';

export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'settlements', label: 'Settlements', icon: ArrowLeftRight },
  { id: 'activity', label: 'Activity', icon: Clock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];
