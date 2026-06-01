'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Users, Car, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardData {
  stats: {
    totalVehicles: number;
    totalOwners: number;
    totalOfficers: number;
    activeAlerts: number;
  };
  nonCompliant: any[];
  recentLogs: any[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get<{ success: boolean; data: DashboardData }>('/stats');
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard metrics...</div>;
  if (!data) return <div className="p-8 text-red-500">Error loading dashboard</div>;

  const { stats, nonCompliant, recentLogs } = data;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 mb-2">Dashboard</h1>
        <p className="text-lg text-slate-600">System overview and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={<Car size={28} className="text-white" />}
          title="Total Vehicles"
          value={stats.totalVehicles.toString()}
          trend="+0 this week"
          bgGradient="from-[#F12711] to-[#F5AF19]"
          accentColor="blue"
        />
        <StatCard
          icon={<Users size={28} className="text-white" />}
          title="Vehicle Owners"
          value={stats.totalOwners.toString()}
          trend="+0 this week"
          bgGradient="from-[#F12711] to-[#F5AF19]"
          accentColor="emerald"
        />
        <StatCard
          icon={<Users size={28} className="text-white" />}
          title="Officers"
          value={stats.totalOfficers.toString()}
          trend="All active"
          bgGradient="from-[#F12711] to-[#F5AF19]"
          accentColor="purple"
        />
        <StatCard
          icon={<AlertCircle size={28} className="text-white" />}
          title="Active Alerts"
          value={stats.activeAlerts.toString()}
          trend="Needs attention"
          bgGradient="from-red-600 to-red-700"
          accentColor="red"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Non-Compliant Vehicles */}
        <Card className="lg:col-span-2 p-7 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle size={22} className="text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Non-Compliant Vehicles</h3>
          </div>
          <div className="space-y-3">
            {nonCompliant.map((v: any) => (
              <div key={v._id} className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:border-orange-300 transition-all hover:shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-orange-900 text-lg">{v.plateNumber}</p>
                    <p className="text-sm text-orange-700">{v.vehicleType} • {v.model}</p>
                  </div>
                  <span className="text-xs font-black text-white bg-gradient-to-r from-orange-600 to-red-600 px-3 py-2 rounded-lg">{v.taxStatus}</span>
                </div>
              </div>
            ))}
            {nonCompliant.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-slate-600 font-medium">All vehicles compliant</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Verifications */}
        <Card className="p-7 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={22} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Recent Checks</h3>
          </div>
          <div className="space-y-3">
            {recentLogs.map((log: any) => (
              <div key={log._id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{log.plateNumber}</p>
                    <p className="text-xs text-slate-600 truncate">{log.checkpointId?.name || 'Unknown'}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                    log.taxStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                    log.taxStatus === 'Expired' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {log.taxStatus}
                  </span>
                </div>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm">No verifications yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  trend,
  bgGradient,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  bgGradient: string;
  accentColor: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 text-white group cursor-default`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/20 backdrop-blur rounded-xl group-hover:bg-white/30 transition-all">
          {icon}
        </div>
        <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full text-white">{trend}</span>
      </div>
      <p className="text-white/90 text-sm font-medium">{title}</p>
      <p className="text-5xl font-black mt-3">{value}</p>
    </div>
  );
}
