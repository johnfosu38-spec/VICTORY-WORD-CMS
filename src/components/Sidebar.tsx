import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Wallet, 
  Calendar, 
  Settings, 
  LogOut,
  ChevronRight,
  Church,
  ClipboardCheck,
  CreditCard,
  LayoutGrid,
  Baby,
  MessageSquare,
  PlayCircle
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { UserProfile } from '../types';

interface SidebarProps {
  profile: UserProfile | null;
}

export default function Sidebar({ profile }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/', roles: ['super_admin', 'pastor', 'secretary', 'treasurer', 'dept_head', 'member'] },
    { name: 'Members', icon: Users, path: '/members', roles: ['super_admin', 'pastor', 'secretary', 'dept_head'] },
    { name: 'Attendance', icon: ClipboardCheck, path: '/attendance', roles: ['super_admin', 'pastor', 'secretary', 'dept_head'] },
    { name: 'Finance', icon: Wallet, path: '/finance', roles: ['super_admin', 'pastor', 'treasurer'] },
    { name: 'Expenses', icon: CreditCard, path: '/expenses', roles: ['super_admin', 'pastor', 'treasurer'] },
    { name: 'Events', icon: Calendar, path: '/events', roles: ['super_admin', 'pastor', 'secretary', 'member'] },
    { name: 'Departments', icon: LayoutGrid, path: '/departments', roles: ['super_admin', 'pastor', 'dept_head'] },
    { name: 'Sunday School', icon: Baby, path: '/sunday-school', roles: ['super_admin', 'pastor', 'secretary', 'dept_head', 'member'] },
    { name: 'Communication', icon: MessageSquare, path: '/communication', roles: ['super_admin', 'pastor', 'secretary'] },
    { name: 'Media', icon: PlayCircle, path: '/media', roles: ['super_admin', 'pastor', 'secretary', 'member'] },
  ];

  const filteredMenu = menuItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <aside className="hidden w-64 flex-col border-r border-app-border bg-white md:flex">
      <div className="flex h-16 items-center px-6 border-b border-app-border">
        <Church className="h-8 w-8 text-primary" />
        <span className="ml-3 text-lg font-bold text-app-text truncate">Victory Word</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center group px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-app-text-light hover:bg-slate-50 hover:text-primary'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-app-border">
        <button
          onClick={() => auth.signOut()}
          className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-app-text-light rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
