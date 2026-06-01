'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Barcode, Search } from 'lucide-react';

export default function OfficerVerificationPanel() {
  const [plateNumber, setPlateNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const currentUser = storage.getCurrentUser();
        if (currentUser?.id) {
          const response = await api.get<{ success: boolean; data: any[] }>(`/logs/officer/${currentUser.id}`);
          if (response.success) {
            setRecentLogs(response.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch recent logs:', error);
      }
    };
    fetchLogs();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim()) {
      alert('Please enter a plate number');
      return;
    }

    setLoading(true);
    setVerificationResult(null);

    try {
      const currentUser = storage.getCurrentUser();
      const response = await api.post<{ success: boolean; data: any }>('/vehicles/verify', {
        plateNumber,
        officerId: currentUser?.id,
        officerName: currentUser?.fullName,
        checkpointName: currentUser?.checkpointName || 'Unknown Checkpoint'
      });

      if (response.success) {
        const vehicle = response.data;
        const taxStatus = vehicle.taxStatus; // Backend handles status logic now

        setVerificationResult({
          error: false,
          vehicle,
          owner: vehicle.ownerId,
          taxStatus,
          message: `Vehicle verified - Tax Status: ${taxStatus}`,
        });

        // Add to local recent logs
        const log = {
          _id: Date.now().toString(),
          plateNumber: vehicle.plateNumber,
          ownerName: vehicle.ownerId?.fullName,
          taxStatus,
          verifiedAt: new Date().toISOString(),
        };
        setRecentLogs([log, ...recentLogs.slice(0, 4)]);
        setPlateNumber('');
      }
    } catch (err: any) {
      setVerificationResult({
        error: true,
        message: err.message || 'Vehicle not found or verification failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateScan = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ success: boolean; data: any[] }>('/vehicles');
      if (response.success && response.data.length > 0) {
        const randomVehicle = response.data[Math.floor(Math.random() * response.data.length)];
        setPlateNumber(randomVehicle.plateNumber);
      }
    } catch (err) {
      console.error('Scan simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Expired':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'Unpaid':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
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
    <div className="space-y-4 sm:space-y-6">
      {/* Verification Panel */}
      <Card className="p-6 sm:p-8 border-0 shadow-2xl bg-white rounded-2xl lg:rounded-3xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Vehicle Verification</h2>
          <p className="text-sm sm:text-base text-slate-600">Scan or enter plate number to verify tax status</p>
        </div>
        <form onSubmit={handleVerify} className="space-y-4 sm:space-y-5">
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
              Vehicle Plate Number
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input
                type="text"
                placeholder="Enter plate number (e.g., ABC-123)"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                disabled={loading}
                className="flex-1 h-10 sm:h-12 border-slate-200 text-sm sm:text-base font-semibold"
              />
              <Button
                type="button"
                onClick={handleSimulateScan}
                disabled={loading}
                className="gap-2 bg-slate-200 text-slate-900 hover:bg-slate-300 rounded-lg px-4 sm:px-6 font-semibold text-sm sm:text-base h-10 sm:h-12"
              >
                <Barcode size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Scan</span>
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-10 sm:h-12 bg-gradient-to-r from-[#F12711] to-[#F5AF19] hover:from-[#F12711] hover:to-[#F5AF19] text-white font-bold text-sm sm:text-lg rounded-lg gap-2"
            disabled={loading}
          >
            <Search size={16} className="sm:w-5 sm:h-5" />
            {loading ? 'Verifying...' : 'Verify Vehicle'}
          </Button>
        </form>

        {/* Verification Result */}
        {verificationResult && (
          <div className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${
            verificationResult.error 
              ? 'bg-red-50 border-red-300' 
              : verificationResult.taxStatus === 'Paid'
              ? 'bg-green-50 border-green-300'
              : verificationResult.taxStatus === 'Expired'
              ? 'bg-red-50 border-red-300'
              : 'bg-orange-50 border-orange-300'
          }`}>
            {verificationResult.error ? (
              <div className="text-center">
                <p className="font-bold text-base sm:text-lg text-red-800">{verificationResult.message}</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-white rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Owner</p>
                    <p className="font-bold text-slate-900 text-sm sm:text-base mt-2">{verificationResult.owner.fullName}</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Plate</p>
                    <p className="font-bold text-slate-900 text-sm sm:text-base mt-2">{verificationResult.vehicle.plateNumber}</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Type</p>
                    <p className="font-bold text-slate-900 text-sm sm:text-base mt-2">{verificationResult.vehicle.vehicleType}</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Expires</p>
                    <p className="font-bold text-slate-900 text-sm sm:text-base mt-2">
                      {new Date(verificationResult.vehicle.taxExpiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white rounded-lg border-2 border-slate-200 gap-2 sm:gap-4">
                  <span className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Tax Status:</span>
                  <span className={`px-4 sm:px-6 py-2 rounded-full text-base sm:text-lg font-black ${
                    verificationResult.taxStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                    verificationResult.taxStatus === 'Expired' ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {verificationResult.taxStatus}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Recent Logs */}
      <Card className="p-6 sm:p-8 border-0 shadow-2xl bg-white rounded-2xl lg:rounded-3xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Recent Verifications</h2>
          <p className="text-sm sm:text-base text-slate-600">Latest verification activities</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-bold text-slate-700 uppercase tracking-wider text-xs">Plate</th>
                <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-bold text-slate-700 uppercase tracking-wider text-xs">Owner</th>
                <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-bold text-slate-700 uppercase tracking-wider text-xs">Status</th>
                <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-bold text-slate-700 uppercase tracking-wider text-xs">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <tr key={log._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 sm:py-4 px-2 sm:px-4 font-bold text-slate-900 text-sm sm:text-base">{log.plateNumber}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-slate-700 text-xs sm:text-sm truncate">{log.ownerName}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-black inline-block ${
                        log.taxStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                        log.taxStatus === 'Expired' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {log.taxStatus}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-600 font-medium text-xs sm:text-sm">
                      {new Date(log.verifiedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 sm:py-12 text-center text-slate-500 font-medium text-sm sm:text-base">
                    No verifications yet
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
