'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage, type CurrentUser } from '@/lib/storage';
import OfficerHeader from '@/components/officer/officer-header';
import OfficerVerificationPanel from '@/components/officer/officer-verification-panel';

export default function OfficerDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user || user.role !== 'officer') {
      router.push('/');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col">
      <OfficerHeader currentUser={currentUser} />
      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Officer Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Assigned Checkpoint: <span className="font-semibold text-[#F12711]">{currentUser.checkpointName}</span>
          </p>
          <OfficerVerificationPanel />
        </div>
      </main>
    </div>
  );
}
