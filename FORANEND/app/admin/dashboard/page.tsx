'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage, type CurrentUser } from '@/lib/storage';
import AdminHeader from '@/components/admin/admin-header';
import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminDashboardPage from '@/components/admin/pages/admin-dashboard';
import RegisterOwnerPage from '@/components/admin/pages/register-owner';
import RegisterOfficerPage from '@/components/admin/pages/register-officer';
import RegisterVehiclePage from '@/components/admin/pages/register-vehicle';
import ManageCheckpointsPage from '@/components/admin/pages/manage-checkpoints';
import VehicleListPage from '@/components/admin/pages/vehicle-list';
import CheckpointListPage from '@/components/admin/pages/checkpoint-list';
import VerificationLogsPage from '@/components/admin/pages/verification-logs';
import ExpiredAlertsPage from '@/components/admin/pages/expired-alerts';
import ResolvedAlertsPage from '@/components/admin/pages/resolved-alerts';

export type AdminPage = 'dashboard' | 'register-owner' | 'register-officer' | 'register-vehicle' | 'manage-checkpoints' | 'checkpoint-list' | 'vehicle-list' | 'verification-logs' | 'expired-alerts' | 'resolved-alerts';

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          currentUser={currentUser}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto">
          <PageRenderer currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </main>
      </div>
    </div>
  );
}

function PageRenderer({ 
  currentPage,
  setCurrentPage 
}: { 
  currentPage: AdminPage;
  setCurrentPage: (page: AdminPage) => void;
}) {
  switch (currentPage) {
    case 'dashboard':
      return <AdminDashboardPage />;
    case 'register-owner':
      return <RegisterOwnerPage />;
    case 'register-officer':
      return <RegisterOfficerPage />;
    case 'register-vehicle':
      return <RegisterVehiclePage />;
    case 'manage-checkpoints':
      return <ManageCheckpointsPage />;
    case 'checkpoint-list':
      return <CheckpointListPage />;
    case 'vehicle-list':
      return <VehicleListPage />;
    case 'verification-logs':
      return <VerificationLogsPage />;
    case 'expired-alerts':
      return <ExpiredAlertsPage />;
    case 'resolved-alerts':
      return <ResolvedAlertsPage />;
    default:
      return <div className="p-6">Page not found</div>;
  }
}
