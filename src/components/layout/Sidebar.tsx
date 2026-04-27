import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Upload,
  FileText,
  ClipboardList,
  BookOpen,
} from 'lucide-react';

const teacherLinks = [
  { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teacher/upload', icon: Upload, label: 'Upload Content' },
  { to: '/teacher/content', icon: FileText, label: 'My Content' },
];

const principalLinks = [
  { to: '/principal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/principal/pending', icon: ClipboardList, label: 'Pending Approvals' },
  { to: '/principal/all', icon: BookOpen, label: 'All Content' },
];

export function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === 'TEACHER' ? teacherLinks : principalLinks;

  return (
    <aside className="w-56 border-r bg-background flex-shrink-0 hidden md:block">
      <nav className="p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
