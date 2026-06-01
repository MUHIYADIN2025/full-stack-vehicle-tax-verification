'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit3, Eye, Trash2, X, Search } from 'lucide-react';

export default function VehicleListPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewVehicle, setViewVehicle] = useState<any>(null);
  const [editVehicle, setEditVehicle] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get<{ success: boolean; data: any[] }>('/vehicles');
        if (response.success) {
          setVehicles(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDelete = async (id: string, plateNumber: string) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${plateNumber}?`)) {
      try {
        const response = await api.delete<{ success: boolean }>(`/vehicles/${id}`);
        if (response.success) {
          setVehicles(vehicles.filter(v => v._id !== id));
        }
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('Failed to delete vehicle');
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVehicle) return;
    
    try {
      const response = await api.put<{ success: boolean; data: any }>(`/vehicles/${editVehicle._id}`, editVehicle);
      if (response.success) {
        setVehicles(vehicles.map(v => v._id === editVehicle._id ? response.data : v));
        setEditVehicle(null);
      }
    } catch (err) {
      console.error('Failed to update:', err);
      alert('Failed to update vehicle');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading vehicles...</div>;

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

  const filteredVehicles = vehicles.filter(v => 
    v.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.ownerId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.taxStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Vehicle List</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text"
              placeholder="Search vehicles..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 h-10 w-full bg-white border-gray-200"
            />
          </div>
        </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Plate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Color</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tax Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Expiry Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map(vehicle => {
                  const ownerName = vehicle.ownerId?.fullName || 'N/A';
                  const isExpired = new Date(vehicle.taxExpiryDate) < new Date();
                  const displayStatus = isExpired && vehicle.taxStatus !== 'Paid' ? 'Expired' : vehicle.taxStatus;

                  return (
                    <tr key={vehicle._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{vehicle.plateNumber}</td>
                      <td className="py-3 px-4 text-gray-600">{ownerName}</td>
                      <td className="py-3 px-4 text-gray-600">{vehicle.vehicleType}</td>
                      <td className="py-3 px-4 text-gray-600">{vehicle.model}</td>
                      <td className="py-3 px-4 text-gray-600">{vehicle.color}</td>
                      <td className="py-3 px-4 text-gray-600">${vehicle.taxAmount}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(vehicle.taxExpiryDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(displayStatus)}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setViewVehicle(vehicle)} className="p-1.5 text-[#F12711] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => setEditVehicle(vehicle)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit Vehicle">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(vehicle._id, vehicle.plateNumber)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Vehicle">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No vehicles registered
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
      
      {/* View Modal */}
      {viewVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full bg-white relative rounded-2xl shadow-2xl">
            <button onClick={() => setViewVehicle(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Plate Number</p>
                  <p className="text-lg font-semibold text-gray-900">{viewVehicle.plateNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                  <p className="text-lg font-semibold text-gray-900">{viewVehicle.taxStatus}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Type</p>
                  <p className="text-gray-900">{viewVehicle.vehicleType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Model</p>
                  <p className="text-gray-900">{viewVehicle.model} ({viewVehicle.year})</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Color</p>
                  <p className="text-gray-900">{viewVehicle.color}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Tax Amount</p>
                  <p className="text-[#F5AF19] font-bold">${viewVehicle.taxAmount}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Owner Details</p>
                <p className="text-gray-900 font-medium">{viewVehicle.ownerId?.fullName}</p>
                <p className="text-gray-600 text-sm">{viewVehicle.ownerId?.phone}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {editVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full bg-white relative rounded-2xl shadow-2xl">
            <button onClick={() => setEditVehicle(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Vehicle</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Plate Number</label>
                <Input value={editVehicle.plateNumber} onChange={e => setEditVehicle({...editVehicle, plateNumber: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Model</label>
                  <Input value={editVehicle.model} onChange={e => setEditVehicle({...editVehicle, model: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Color</label>
                  <Input value={editVehicle.color} onChange={e => setEditVehicle({...editVehicle, color: e.target.value})} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tax Amount ($)</label>
                  <Input type="number" value={editVehicle.taxAmount} onChange={e => setEditVehicle({...editVehicle, taxAmount: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                  <select 
                    value={editVehicle.taxStatus}
                    onChange={e => setEditVehicle({...editVehicle, taxStatus: e.target.value})}
                    className="w-full h-10 px-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F12711] font-medium text-sm"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#F12711] hover:bg-[#F12711] text-white font-bold h-12 rounded-xl mt-4">
                Save Changes
              </Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
