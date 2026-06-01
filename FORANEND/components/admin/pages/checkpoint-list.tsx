'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Search, MapPin } from 'lucide-react';

export default function CheckpointListPage() {
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCheckpoints = async () => {
      try {
        const response = await api.get<{ success: boolean; data: any[] }>('/checkpoints');
        if (response.success) {
          setCheckpoints(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch checkpoints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckpoints();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete checkpoint ${name}?`)) {
      try {
        const response = await api.delete<{ success: boolean }>(`/checkpoints/${id}`);
        if (response.success) {
          setCheckpoints(checkpoints.filter(c => c._id !== id));
        }
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('Failed to delete checkpoint');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading checkpoints...</div>;

  const filteredCheckpoints = checkpoints.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Checkpoint List</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="text"
            placeholder="Search checkpoints..." 
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
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Created At</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheckpoints.length > 0 ? (
                filteredCheckpoints.map(checkpoint => (
                  <tr key={checkpoint._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{checkpoint.name}</td>
                    <td className="py-3 px-4 text-gray-600 flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      {checkpoint.location}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        checkpoint.status === 'active' || !checkpoint.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {checkpoint.status || 'active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(checkpoint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDelete(checkpoint._id, checkpoint.name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Checkpoint">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No checkpoints found
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
