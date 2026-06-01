'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Edit3, Eye, Trash2, X, Search } from 'lucide-react';

export default function RegisterOwnerPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewOwner, setViewOwner] = useState<any>(null);
  const [editOwner, setEditOwner] = useState<any>(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await api.get<{ success: boolean; data: any[] }>('/owners');
        if (response.success) {
          setOwners(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch owners:', err);
      }
    };
    fetchOwners();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const response = await api.post<{ success: boolean; message: string; data: { owner: any } }>('/owners/register', formData);

      if (response.success) {
        setSuccess(`Vehicle Owner "${formData.fullName}" registered successfully!`);
        setOwners([...owners, response.data.owner]);
        
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });

        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete owner ${name}?`)) {
      try {
        const response = await api.delete<{ success: boolean }>(`/owners/${id}`);
        if (response.success) {
          setOwners(owners.filter(o => o._id !== id));
        }
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('Failed to delete owner');
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOwner) return;
    
    try {
      const response = await api.put<{ success: boolean; data: any }>(`/owners/${editOwner._id}`, editOwner);
      if (response.success) {
        setOwners(owners.map(o => o._id === editOwner._id ? response.data : o));
        setEditOwner(null);
      }
    } catch (err) {
      console.error('Failed to update:', err);
      alert('Failed to update owner');
    }
  };

  const filteredOwners = owners.filter(owner => 
    owner.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone?.includes(searchTerm)
  );

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-[#F5AF19]/10 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2">Register Vehicle Owner</h1>
          <p className="text-base sm:text-lg text-slate-600">Add new vehicle owners to the system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Registration Form */}
          <Card className="lg:col-span-1 p-6 sm:p-8 border-0 shadow-2xl bg-white rounded-2xl lg:rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  disabled={loading}
                  required
                  className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  disabled={loading}
                  required
                  className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Phone
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  disabled={loading}
                  required
                  className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min 6 characters"
                  disabled={loading}
                  required
                  className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
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
                {loading ? 'Registering...' : 'Register Owner'}
              </Button>
            </form>
          </Card>

          {/* Owners List */}
          <Card className="lg:col-span-2 p-6 sm:p-8 border-0 shadow-2xl bg-white rounded-2xl lg:rounded-3xl flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Registered Owners</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">{owners.length} owners in system</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  type="text"
                  placeholder="Search owners..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 w-full bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-[500px] overflow-y-auto">
              {filteredOwners.length > 0 ? (
                filteredOwners.map(owner => (
                  <div key={owner._id} className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-[#F5AF19]/5 rounded-lg sm:rounded-xl border border-slate-200 hover:border-[#F12711] hover:shadow-md transition-all">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-center">
                      <div>
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Name</p>
                        <p className="font-bold text-slate-900 text-sm sm:text-base mt-1">{owner.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Email</p>
                        <p className="font-semibold text-slate-900 text-xs sm:text-sm break-all mt-1">{owner.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Phone</p>
                        <p className="font-semibold text-slate-900 text-sm sm:text-base mt-1">{owner.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Status</p>
                        <span className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-black mt-1 ${
                          owner.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-gradient-to-r from-green-100 to-[#F5AF19] text-green-800'
                        }`}>
                          {owner.status || 'Active'}
                        </span>
                      </div>
                      <div className="flex items-center sm:justify-end gap-1 mt-2 sm:mt-0 lg:col-span-1">
                        <button onClick={() => setViewOwner(owner)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View Details">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => setEditOwner(owner)} className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors" title="Edit Owner">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDelete(owner._id, owner.fullName)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete Owner">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-slate-500 text-sm sm:text-lg font-medium">No owners registered yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>

      {/* View Modal */}
      {viewOwner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full bg-white relative rounded-2xl shadow-2xl">
            <button onClick={() => setViewOwner(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-6">Owner Profile</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Full Name</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{viewOwner.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Email Address</p>
                  <p className="text-lg font-medium text-slate-700 mt-1">{viewOwner.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Phone Number</p>
                  <p className="text-lg font-medium text-slate-700 mt-1">{viewOwner.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Status</p>
                  <span className={`inline-block px-3 py-1 mt-2 rounded-lg text-xs font-black ${
                    viewOwner.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {viewOwner.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {editOwner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full bg-white relative rounded-2xl shadow-2xl">
            <button onClick={() => setEditOwner(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-6">Edit Owner</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <Input value={editOwner.fullName} onChange={e => setEditOwner({...editOwner, fullName: e.target.value})} required className="h-11" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <Input value={editOwner.phone} onChange={e => setEditOwner({...editOwner, phone: e.target.value})} required className="h-11" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                <select 
                  value={editOwner.status || 'Active'}
                  onChange={e => setEditOwner({...editOwner, status: e.target.value})}
                  className="w-full h-11 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F12711] font-medium text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
