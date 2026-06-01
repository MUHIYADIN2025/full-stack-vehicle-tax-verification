'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage, type CurrentUser } from '@/lib/storage';
import OwnerHeader from '@/components/owner/owner-header';
import OwnerVehiclePanel from '@/components/owner/owner-vehicle-panel';

export default function VehicleOwnerDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user || user.role !== 'vehicleOwner') {
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
      <OwnerHeader currentUser={currentUser} />
      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">My Vehicles</h1>
          <OwnerVehiclePanel currentUserId={currentUser.id} />
        </div>
      </main>
    </div>
  );
}
