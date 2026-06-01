'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function ExpiredAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get<{ success: boolean; data: any }>('/stats');
        if (response.success && response.data.nonCompliant) {
          setAlerts(response.data.nonCompliant);
        }
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getIssueColor = (issueType: string) => {
    return issueType === 'Expired' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200';
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading alerts...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Active Alerts</h2>

      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <Card key={alert._id || alert.id} className={`p-6 border-2 ${getIssueColor(alert.taxStatus || alert.issueType)}`}>
              <div className="flex items-start gap-4">
                <AlertCircle
                  size={24}
                  className={(alert.taxStatus || alert.issueType) === 'Expired' ? 'text-red-600' : 'text-orange-600'}
                />
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Plate Number</p>
                      <p className="font-bold text-lg text-gray-900">{alert.plateNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Owner ID</p>
                      <p className="font-semibold text-gray-900 font-mono text-sm">{alert.ownerId || alert.ownerName || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Issue Type</p>
                      <p className={`font-bold text-sm mt-1 ${(alert.taxStatus || alert.issueType) === 'Expired' ? 'text-red-800' : 'text-orange-800'}`}>
                        {alert.taxStatus || alert.issueType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Detected</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No active alerts</p>
            <p className="text-gray-500 text-sm mt-2">All vehicles are compliant</p>
          </Card>
        )}
      </div>
    </div>
  );
}
