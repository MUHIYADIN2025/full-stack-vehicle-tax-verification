'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Card } from '@/components/ui/card';

export default function VerificationLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get<{ success: boolean; data: any[] }>('/logs');
        if (response.success) {
          setLogs(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Unpaid':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Verification Logs</h2>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Plate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Officer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Checkpoint</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tax Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Verified At</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{log.plateNumber}</td>
                    <td className="py-3 px-4 text-gray-600">{log.ownerName}</td>
                    <td className="py-3 px-4 text-gray-600">{log.officerName}</td>
                    <td className="py-3 px-4 text-gray-600">{log.checkpointName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.taxStatus)}`}>
                        {log.taxStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(log.verifiedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    {loading ? 'Loading logs...' : 'No verification logs yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
