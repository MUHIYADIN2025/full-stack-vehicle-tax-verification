'use client';

import { useRouter } from 'next/navigation';
import { storage, type CurrentUser } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';

export default function AdminHeader({
  currentUser,
  onMenuClick,
}: {
  currentUser: CurrentUser;
  onMenuClick: () => void;
}) {
  const router = useRouter();

  const handleLogout = () => {
    storage.clearAll();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
          >
            <Menu size={20} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Vehicle Checkpoint System</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-600">Welcome back</p>
            <p className="text-sm font-semibold text-slate-900">{currentUser.fullName}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="gap-2 bg-slate-200 text-slate-900 hover:bg-slate-300 transition-colors"
            size="sm"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
