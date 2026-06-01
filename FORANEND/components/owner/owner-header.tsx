'use client';

import { useRouter } from 'next/navigation';
import { storage, type CurrentUser } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function OwnerHeader({
  currentUser,
}: {
  currentUser: CurrentUser;
}) {
  const router = useRouter();

  const handleLogout = () => {
    storage.clearCurrentUser();
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-[#F12711] to-[#F5AF19] border-b border-transparent shadow-lg">
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/20 backdrop-blur rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Vehicle Checkpoint</h1>
            <p className="text-sm text-white/80">Owner Tax Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-white/80">Vehicle Owner</p>
            <p className="text-base font-bold text-white">{currentUser.fullName}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="gap-2 bg-white/20 text-white hover:bg-white/30 backdrop-blur transition-all rounded-lg"
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
