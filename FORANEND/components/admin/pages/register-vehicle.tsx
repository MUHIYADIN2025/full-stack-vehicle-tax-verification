'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Edit3, Eye, Trash2, X, Search } from 'lucide-react';

export default function RegisterVehiclePage() {
  const [formData, setFormData] = useState({
    owner: '',
    plateNumber: '',
    vehicleType: '',
    model: '',
    year: '',
    color: '',
    taxAmount: '',
    taxStatus: 'Unpaid' as 'Paid' | 'Unpaid' | 'Expired',
    taxExpiryDate: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [ownerSearch, setOwnerSearch] = useState('');
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState('');
  const [viewVehicle, setViewVehicle] = useState<any>(null);
  const [editVehicle, setEditVehicle] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, ownersRes] = await Promise.all([
          api.get<{ success: boolean; data: any[] }>('/vehicles'),
          api.get<{ success: boolean; data: any[] }>('/owners'),
        ]);
        
        if (vehiclesRes.success) setVehicles(vehiclesRes.data);
        if (ownersRes.success) setOwners(ownersRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.owner || !formData.plateNumber || !formData.vehicleType || !formData.model || 
          !formData.color || !formData.taxAmount || !formData.taxExpiryDate) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      const response = await api.post<{ success: boolean; message: string; data: any }>('/vehicles/register', {
        ...formData,
        year: parseInt(formData.year),
        taxAmount: parseFloat(formData.taxAmount)
      });

      if (response.success) {
        setSuccess('Vehicle registered successfully!');
        setVehicles([response.data, ...vehicles]);

        setFormData({
          owner: '',
          plateNumber: '',
          vehicleType: '',
          model: '',
          year: '',
          color: '',
          taxAmount: '',
          taxStatus: 'Unpaid',
          taxExpiryDate: '',
        });

        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleDelete = async (id: string, plate: string) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${plate}?`)) {
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

  const handleVehicleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVehicle) return;
    
    try {
      const response = await api.put<{ success: boolean; data: any }>(`/vehicles/${editVehicle._id}`, editVehicle);
      if (response.success) {
        setVehicles(vehicles.map(v => v._id === editVehicle._id ? { ...response.data, ownerId: v.ownerId } : v));
        setEditVehicle(null);
      }
    } catch (err) {
      console.error('Failed to update:', err);
      alert('Failed to update vehicle');
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.plateNumber?.toLowerCase().includes(vehicleSearchTerm.toLowerCase()) || 
    vehicle.ownerId?.fullName?.toLowerCase().includes(vehicleSearchTerm.toLowerCase()) ||
    vehicle.vehicleType?.toLowerCase().includes(vehicleSearchTerm.toLowerCase()) ||
    vehicle.taxStatus?.toLowerCase().includes(vehicleSearchTerm.toLowerCase())
  );

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2">Register Vehicle</h1>
          <p className="text-base sm:text-lg text-slate-600">Add vehicles to the tax verification system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Registration Form */}
          <Card className="lg:col-span-1 p-6 sm:p-8 border-0 shadow-2xl bg-white rounded-2xl lg:rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="relative">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Vehicle Owner
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search and select owner..."
                    value={ownerSearch}
                    onChange={(e) => {
                      setOwnerSearch(e.target.value);
                      setIsOwnerDropdownOpen(true);
                      if (formData.owner) {
                        setFormData(prev => ({ ...prev, owner: '' }));
                      }
                    }}
                    onFocus={() => setIsOwnerDropdownOpen(true)}
                    onBlur={() => {
                      // Small delay to allow clicking on dropdown options before it closes
                      setTimeout(() => setIsOwnerDropdownOpen(false), 200);
                    }}
                    className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base focus:ring-2 focus:ring-[#F5AF19] w-full"
                    required={!formData.owner}
                  />
                  {/* Arrow Indicator */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {/* Dropdown Options */}
                {isOwnerDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {owners.filter(owner => owner.fullName.toLowerCase().includes(ownerSearch.toLowerCase())).length > 0 ? (
                      owners
                        .filter(owner => owner.fullName.toLowerCase().includes(ownerSearch.toLowerCase()))
                        .map(owner => (
                          <div
                            key={owner._id}
                            onMouseDown={(e) => e.preventDefault()} // Prevent blur firing before click
                            onClick={() => {
                              setFormData(prev => ({ ...prev, owner: owner._id }));
                              setOwnerSearch(owner.fullName);
                              setIsOwnerDropdownOpen(false);
                            }}
                            className={`px-4 py-2.5 cursor-pointer text-sm sm:text-base font-medium transition-colors ${
                              formData.owner === owner._id ? 'bg-emerald-50 text-[#F5AF19]' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {owner.fullName}
                          </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500 italic">No owners found...</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Plate Number
                </label>
                <Input
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleInputChange}
                  placeholder="ABC-123"
                  disabled={loading}
                  required
                  className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full h-10 sm:h-11 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5AF19] bg-white font-medium text-sm sm:text-base"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Car">Car</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Truck">Truck</option>
                  <option value="Bus">Bus</option>
                  <option value="SUV">SUV</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Model
                </label>
                <Input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Model name"
                  disabled={loading}
                  required
                  className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Year
                </label>
                <Input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="2024"
                  disabled={loading}
                  required
                  className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Color
                </label>
                <Input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Color"
                  disabled={loading}
                  required
                  className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Monthly Tax Amount ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  name="taxAmount"
                  value={formData.taxAmount}
                  onChange={handleInputChange}
                  placeholder="50"
                  disabled={loading}
                  required
                  className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Tax Status
                </label>
                <select
                  name="taxStatus"
                  value={formData.taxStatus}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full h-10 sm:h-11 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5AF19] bg-white font-medium text-sm sm:text-base"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Tax Expiry Date
                </label>
                <Input
                  type="date"
                  name="taxExpiryDate"
                  value={formData.taxExpiryDate}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                  className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base"
                />
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-red-100 border border-red-300 rounded-lg sm:rounded-xl text-red-700 text-xs sm:text-sm font-medium">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 sm:p-4 bg-green-100 border border-green-300 rounded-lg sm:rounded-xl text-green-700 text-xs sm:text-sm font-medium">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-[#F12711] to-[#F5AF19] hover:from-[#F12711] hover:to-[#F5AF19] text-white font-bold text-sm sm:text-lg rounded-lg sm:rounded-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Vehicle'}
              </Button>
            </form>
          </Card>

          {/* Vehicles List */}
          <Card className="lg:col-span-2 p-6 sm:p-8 border-0 shadow-2xl bg-white rounded-2xl lg:rounded-3xl flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Registered Vehicles</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">{vehicles.length} vehicles in system</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  type="text"
                  placeholder="Search vehicles..." 
                  value={vehicleSearchTerm} 
                  onChange={e => setVehicleSearchTerm(e.target.value)}
                  className="pl-10 h-10 w-full bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-[500px] overflow-y-auto">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map(vehicle => {
                  const ownerName = vehicle.ownerId?.fullName || 'N/A';
                  return (
                    <div key={vehicle._id} className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-[#F5AF19]/5 rounded-lg sm:rounded-xl border border-slate-200 hover:border-[#F12711] hover:shadow-md transition-all">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 items-center">
                        <div>
                          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Plate</p>
                          <p className="font-bold text-slate-900 text-sm sm:text-base mt-1 lg:text-lg">{vehicle.plateNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Owner</p>
                          <p className="font-semibold text-slate-900 text-sm sm:text-base mt-1">{ownerName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Type</p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-1">{vehicle.vehicleType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Expiry</p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-1">
                            {new Date(vehicle.taxExpiryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Status</p>
                          <span className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-black mt-1 ${
                            vehicle.taxStatus === 'Paid' ? 'bg-gradient-to-r from-green-100 to-[#F5AF19] text-green-800' :
                            vehicle.taxStatus === 'Expired' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-[#F12711]'
                          }`}>
                            {vehicle.taxStatus}
                          </span>
                        </div>
                        <div className="flex items-center sm:justify-end gap-1 mt-2 sm:mt-0 lg:col-span-1">
                          <button onClick={() => setViewVehicle(vehicle)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View Details">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => setEditVehicle(vehicle)} className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors" title="Edit Vehicle">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleVehicleDelete(vehicle._id, vehicle.plateNumber)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete Vehicle">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-slate-500 text-sm sm:text-lg font-medium">No vehicles registered yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>

      {/* View Modal */}
      {viewVehicle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full bg-white relative rounded-2xl shadow-2xl">
            <button onClick={() => setViewVehicle(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-6">Vehicle Details</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Plate Number</p>
                  <p className="text-xl font-bold text-[#F12711] mt-1">{viewVehicle.plateNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Vehicle Type</p>
                  <p className="text-lg font-medium text-slate-700 mt-1">{viewVehicle.vehicleType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Model</p>
                  <p className="text-lg font-medium text-slate-700 mt-1">{viewVehicle.model}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Color</p>
                  <p className="text-lg font-medium text-slate-700 mt-1">{viewVehicle.color}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Owner</p>
                  <p className="text-lg font-medium text-slate-700 mt-1">{viewVehicle.ownerId?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Tax Expiry</p>
                  <p className="text-lg font-medium text-slate-700 mt-1">{new Date(viewVehicle.taxExpiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Status</p>
                  <span className={`inline-block px-3 py-1 mt-2 rounded-lg text-xs font-black ${
                    viewVehicle.taxStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                    viewVehicle.taxStatus === 'Expired' ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-[#F12711]'
                  }`}>
                    {viewVehicle.taxStatus}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {editVehicle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full bg-white relative rounded-2xl shadow-2xl">
            <button onClick={() => setEditVehicle(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-6">Edit Vehicle</h3>
            <form onSubmit={handleVehicleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Plate Number</label>
                <Input value={editVehicle.plateNumber} onChange={e => setEditVehicle({...editVehicle, plateNumber: e.target.value})} required className="h-11" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Model</label>
                <Input value={editVehicle.model} onChange={e => setEditVehicle({...editVehicle, model: e.target.value})} required className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tax Status</label>
                  <select 
                    value={editVehicle.taxStatus}
                    onChange={e => setEditVehicle({...editVehicle, taxStatus: e.target.value})}
                    className="w-full h-11 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F12711] font-medium text-sm"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tax Amount</label>
                  <Input type="number" step="0.01" value={editVehicle.taxAmount} onChange={e => setEditVehicle({...editVehicle, taxAmount: parseFloat(e.target.value)})} required className="h-11" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-[#F12711] to-[#F5AF19] hover:opacity-90 text-white font-bold h-12 rounded-xl mt-6">
                Save Changes
              </Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
