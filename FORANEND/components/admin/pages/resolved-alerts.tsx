'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function ResolvedAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResolved = async () => {
      try {
        const response = await api.get<{ success: boolean; data: any[] }>('/vehicles');
        if (response.success) {
          const resolved = response.data
            .filter(v => v.taxStatus === 'Paid')
            .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
          setAlerts(resolved);
        }
      } catch (error) {
        console.error('Failed to fetch resolved alerts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResolved();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading alerts...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Resolved Alerts</h2>

      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <Card key={alert._id || alert.id} className="p-6 border-2 border-green-200 bg-green-50">
              <div className="flex items-start gap-4">
                <CheckCircle size={24} className="text-green-600" />
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Plate Number</p>
                      <p className="font-bold text-lg text-gray-900">{alert.plateNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Owner ID</p>
                      <p className="font-semibold text-gray-900 font-mono text-sm">
                        {alert.ownerId?.fullName || alert.ownerId || alert.ownerName || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Issue Type</p>
                      <p className="font-bold text-sm mt-1 text-green-800">Paid / Compliant</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Resolved</p>
                      <p className="font-semibold text-gray-900">
                        {alert.updatedAt ? new Date(alert.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No resolved alerts yet</p>
            <p className="text-gray-500 text-sm mt-2">Alerts will appear here once resolved</p>
          </Card>
        )}
      </div>
    </div>
  );
}
