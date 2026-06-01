'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Calendar, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function OwnerVehiclePanel({ currentUserId }: { currentUserId: string }) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [paymentMonths, setPaymentMonths] = useState('12');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<{ success: boolean; data: any[] }>(`/vehicles/owner/${currentUserId}`);
        if (response.success) {
          setVehicles(response.data);
          if (response.data.length > 0) {
            setSelectedVehicle(response.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch vehicles:', err);
      }
    };
    fetchData();
  }, [currentUserId]);

  const handlePayTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    setLoading(true);
    try {
      const months = parseInt(paymentMonths);
      const today = new Date();
      const newExpiryDate = new Date(today);
      newExpiryDate.setMonth(newExpiryDate.getMonth() + months);

      // Update vehicle status via API
      const response = await api.put<{ success: boolean; data: any }>(`/vehicles/${selectedVehicle._id}`, {
        taxStatus: 'Paid',
        taxExpiryDate: newExpiryDate.toISOString(),
      });

      if (response.success) {
        setSuccessMessage(`Tax paid successfully! Vehicle cleared until ${newExpiryDate.toLocaleDateString()}`);
        setShowPaymentForm(false);
        
        // Refresh vehicles list
        const listRes = await api.get<{ success: boolean; data: any[] }>(`/vehicles/owner/${currentUserId}`);
        if (listRes.success) {
          setVehicles(listRes.data);
          const updated = listRes.data.find(v => v._id === selectedVehicle._id);
          if (updated) setSelectedVehicle(updated);
        }

        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err: any) {
      alert(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
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

  const isVehicleExpired = selectedVehicle && new Date(selectedVehicle.taxExpiryDate) < new Date();

  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 p-4 sm:p-6 md:p-8">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 sm:p-5 bg-gradient-to-r from-green-500 to-[#F5AF19] text-white rounded-lg sm:rounded-xl shadow-2xl flex items-center gap-3 max-w-sm sm:max-w-md animate-slide-in text-xs sm:text-sm">
          <CheckCircle2 className="flex-shrink-0" size={20} />
          <p className="font-bold">{successMessage}</p>
        </div>
      )}

      {/* Vehicle Selection */}
      {vehicles.length > 0 && (
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-4">Your Vehicles</h2>
          <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">Select a vehicle to manage tax payments</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle._id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                  selectedVehicle?._id === vehicle._id
                    ? 'border-[#F5AF19] bg-gradient-to-br from-emerald-50 to-[#F5AF19] shadow-xl'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="font-bold text-slate-900 text-lg sm:text-2xl mb-2">{vehicle.plateNumber}</div>
                <div className="text-xs sm:text-sm text-slate-600 mb-3">{vehicle.vehicleType} • {vehicle.model} ({vehicle.year})</div>
                <div className={`text-xs font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg w-fit ${
                  vehicle.taxStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                  vehicle.taxStatus === 'Expired' ? 'bg-red-100 text-red-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {vehicle.taxStatus}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle Details Card */}
      {selectedVehicle && (
        <Card className="p-6 sm:p-8 border-0 shadow-2xl bg-white rounded-2xl lg:rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8 gap-4">
            <div>
              <p className="text-xs text-[#F5AF19] font-black uppercase tracking-widest mb-2">Vehicle Information</p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">{selectedVehicle.plateNumber}</h3>
            </div>
            <span className={`text-base sm:text-lg font-black px-3 sm:px-4 py-2 rounded-full w-fit ${
              selectedVehicle.taxStatus === 'Paid' ? 'bg-green-100 text-green-800' :
              selectedVehicle.taxStatus === 'Expired' ? 'bg-red-100 text-red-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {selectedVehicle.taxStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl border border-slate-200">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Type</p>
              <p className="text-lg sm:text-xl font-black text-slate-900 mt-2">{selectedVehicle.vehicleType}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl border border-slate-200">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Model</p>
              <p className="text-lg sm:text-xl font-black text-slate-900 mt-2">{selectedVehicle.model}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl border border-slate-200">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Year</p>
              <p className="text-lg sm:text-xl font-black text-slate-900 mt-2">{selectedVehicle.year}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl border border-slate-200">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Color</p>
              <p className="text-lg sm:text-xl font-black text-slate-900 mt-2">{selectedVehicle.color}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-[#F5AF19] rounded-lg sm:rounded-xl border border-[#F5AF19]">
              <p className="text-xs text-[#F5AF19] font-bold uppercase tracking-wider">Monthly Tax</p>
              <p className="text-xl sm:text-2xl font-black text-[#F5AF19] mt-2">${selectedVehicle.taxAmount}</p>
            </div>
          </div>

          {/* Expiry Information */}
          <div className={`p-4 sm:p-6 rounded-lg sm:rounded-2xl mb-6 sm:mb-8 border-2 ${
            isVehicleExpired
              ? 'bg-red-50 border-red-300'
              : 'bg-emerald-50 border-[#F5AF19]'
          }`}>
            <div className="flex items-center gap-3 sm:gap-4">
              <Calendar className={isVehicleExpired ? 'text-red-600' : 'text-[#F5AF19]'} size={24} />
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isVehicleExpired ? 'text-red-600' : 'text-[#F5AF19]'}`}>
                  {isVehicleExpired ? 'EXPIRED' : 'Tax Expires'}
                </p>
                <p className={`text-xl sm:text-2xl font-black ${isVehicleExpired ? 'text-red-900' : 'text-slate-900'}`}>
                  {new Date(selectedVehicle.taxExpiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Alert for expired/unpaid */}
          {(selectedVehicle.taxStatus === 'Unpaid' || isVehicleExpired) && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-400 rounded-lg sm:rounded-2xl flex items-start gap-3 sm:gap-4">
              <AlertCircle className="text-red-700 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="font-black text-red-900 text-base sm:text-lg">Action Required Immediately</p>
                <p className="text-red-800 mt-1 font-semibold text-sm sm:text-base">Your vehicle tax needs to be renewed to avoid penalties.</p>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <Button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className={`w-full h-10 sm:h-14 text-white font-bold text-sm sm:text-lg gap-2 transition-all duration-300 rounded-lg sm:rounded-xl ${
              showPaymentForm
                ? 'bg-slate-600 hover:bg-slate-700'
                : 'bg-gradient-to-r from-[#F12711] to-[#F5AF19] hover:from-[#F12711] hover:to-[#F5AF19]'
            }`}
          >
            <DollarSign size={18} />
            {showPaymentForm ? 'Cancel Payment' : 'Pay Tax Now'}
          </Button>
        </Card>
      )}

      {/* Payment Form */}
      {selectedVehicle && showPaymentForm && (
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-2 border-[#F5AF19] shadow-2xl rounded-2xl lg:rounded-3xl">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 sm:mb-8">Complete Tax Payment</h3>
          <form onSubmit={handlePayTax} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3 uppercase tracking-wider">
                Vehicle Plate Number
              </label>
              <Input
                type="text"
                value={selectedVehicle.plateNumber}
                disabled={true}
                className="h-10 sm:h-12 border-slate-300 bg-slate-100 text-slate-900 font-bold text-sm sm:text-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3 uppercase tracking-wider">
                  Monthly Tax Rate
                </label>
                <div className="h-10 sm:h-12 px-3 sm:px-4 border-2 border-[#F5AF19] rounded-lg bg-white font-bold text-[#F5AF19] flex items-center text-base sm:text-lg">
                  ${selectedVehicle.taxAmount}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3 uppercase tracking-wider">
                  Valid for (Months)
                </label>
                <select
                  value={paymentMonths}
                  onChange={(e) => setPaymentMonths(e.target.value)}
                  disabled={loading}
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 border-2 border-[#F5AF19] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5AF19] bg-white text-slate-900 font-bold text-sm sm:text-base"
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gradient-to-r from-[#F12711] to-green-100 rounded-lg sm:rounded-2xl border-3 border-[#F5AF19] shadow-lg">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-slate-700 font-bold text-sm sm:text-lg uppercase tracking-wider">Total Amount Due:</span>
                <span className="text-3xl sm:text-4xl font-black text-[#F5AF19]">
                  ${(selectedVehicle.taxAmount * parseInt(paymentMonths)).toFixed(2)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 bg-white px-3 sm:px-4 py-2 rounded-lg font-semibold">
                {parseInt(paymentMonths)} month{parseInt(paymentMonths) > 1 ? 's' : ''} × ${selectedVehicle.taxAmount} = ${(selectedVehicle.taxAmount * parseInt(paymentMonths)).toFixed(2)}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-10 sm:h-14 bg-gradient-to-r from-[#F12711] to-green-700 hover:from-[#F12711] hover:to-green-800 text-white font-black text-sm sm:text-lg rounded-lg sm:rounded-xl transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Processing Payment...' : 'Complete Payment'}
            </Button>
          </form>
        </Card>
      )}

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <Card className="p-6 sm:p-8 border-0 shadow-2xl bg-white rounded-2xl lg:rounded-3xl">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 sm:mb-8">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b-3 border-slate-300">
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-black text-slate-700 uppercase text-xs tracking-wider">Amount</th>
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-black text-slate-700 uppercase text-xs tracking-wider">Paid Date</th>
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-black text-slate-700 uppercase text-xs tracking-wider">Valid Until</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-100 hover:bg-emerald-50 transition-colors">
                    <td className="py-4 sm:py-5 px-2 sm:px-4 font-bold text-[#F5AF19] text-base sm:text-lg">${payment.amount.toFixed(2)}</td>
                    <td className="py-4 sm:py-5 px-2 sm:px-4 text-slate-700 font-semibold text-sm sm:text-base">
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 sm:py-5 px-2 sm:px-4 text-slate-700 font-semibold text-sm sm:text-base">
                      {new Date(payment.newExpiryDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* No Vehicles Message */}
      {vehicles.length === 0 && (
        <Card className="p-12 sm:p-16 text-center border-0 shadow-xl bg-white rounded-2xl lg:rounded-3xl">
          <p className="text-slate-600 text-lg sm:text-xl font-bold">No vehicles registered under your account</p>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">Contact the system administrator to register your vehicle</p>
        </Card>
      )}
    </div>
  );
}
