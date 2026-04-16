import { Bell, Search, User as UserIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile | null;
}

export default function Header({ profile }: HeaderProps) {
  return (
    <header className="h-16 border-b border-app-border bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex-1 max-w-lg md:block hidden">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-light group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search records..."
            className="w-full bg-slate-50 border-transparent rounded-xl py-2 pl-10 pr-4 text-sm focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none border transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-app-text-light hover:text-primary rounded-xl hover:bg-slate-50 relative transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-secondary rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-app-border pl-4 ml-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-app-text">{profile?.displayName}</p>
            <p className="text-[10px] text-app-text-light uppercase tracking-widest font-bold">{profile?.role.replace('_', ' ')}</p>
          </div>
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="User" className="h-9 w-9 rounded-full border border-app-border shadow-sm" referrerPolicy="no-referrer" />
          ) : (
            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-app-border">
              <UserIcon className="h-5 w-5 text-app-text-light" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
