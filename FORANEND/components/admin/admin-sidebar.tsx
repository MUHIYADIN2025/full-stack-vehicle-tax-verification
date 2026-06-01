'use client';

import { X, LayoutDashboard, Users, Car, Settings, FileText, AlertCircle, CheckCircle } from 'lucide-react';

type AdminPageType = 'dashboard' | 'register-owner' | 'register-officer' | 'register-vehicle' | 'manage-checkpoints' | 'checkpoint-list' | 'vehicle-list' | 'verification-logs' | 'expired-alerts' | 'resolved-alerts';

interface MenuItem {
  id: AdminPageType;
  label: string;
  category?: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', category: 'Main', icon: <LayoutDashboard size={18} /> },
  { id: 'register-owner', label: 'Register Owner', category: 'Registration', icon: <Users size={18} /> },
  { id: 'register-officer', label: 'Register Officer', category: 'Registration', icon: <Users size={18} /> },
  { id: 'register-vehicle', label: 'Register Vehicle', category: 'Registration', icon: <Car size={18} /> },
  { id: 'manage-checkpoints', label: 'Manage Checkpoints', category: 'Management', icon: <Settings size={18} /> },
  { id: 'checkpoint-list', label: 'Checkpoint List', category: 'Management', icon: <FileText size={18} /> },
  { id: 'vehicle-list', label: 'Vehicle List', category: 'Management', icon: <Car size={18} /> },
  { id: 'verification-logs', label: 'Verification Logs', category: 'Logs', icon: <FileText size={18} /> },
  { id: 'expired-alerts', label: 'Active Alerts', category: 'Alerts', icon: <AlertCircle size={18} /> },
  { id: 'resolved-alerts', label: 'Resolved Alerts', category: 'Alerts', icon: <CheckCircle size={18} /> },
];

export default function AdminSidebar({
  currentPage,
  setCurrentPage,
  isOpen,
  onClose,
}: {
  currentPage: AdminPageType;
  setCurrentPage: (page: AdminPageType) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const handlePageClick = (page: AdminPageType) => {
    setCurrentPage(page);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-all"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-72 h-screen bg-white flex flex-col border-r border-slate-100 overflow-y-auto transition-all duration-300 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 p-6 bg-gradient-to-r from-[#F12711] to-[#F5AF19] shadow-md z-20 flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Vehicle</h2>
              <p className="text-xs font-semibold text-white/80">Checkpoint Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = currentPage === item.id;
            const isFirst = menuItems.findIndex(m => m.category === item.category) === index;

            return (
              <div key={item.id}>
                {item.category && isFirst && (
                  <div className="text-[11px] font-black text-slate-400 px-4 py-3 mt-6 first:mt-0 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    {item.category}
                  </div>
                )}
                <button
                  onClick={() => handlePageClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center gap-3 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F12711] to-[#F5AF19] text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-600 hover:bg-orange-50 hover:text-[#F12711]'
                  }`}
                >
                  <span className={`transition-all duration-200 ${isActive ? 'scale-125' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">System Version</p>
              <p className="text-sm font-bold text-[#F12711]">v1.0.0</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
          </div>
        </div>
      </aside>
    </>
  );
}
