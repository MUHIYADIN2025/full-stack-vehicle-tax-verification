'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

export default function ManageCheckpointsPage() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkpoints, setCheckpoints] = useState<any[]>([]);

  useEffect(() => {
    const fetchCheckpoints = async () => {
      try {
        const response = await api.get<{ success: boolean; data: any[] }>('/checkpoints');
        if (response.success) {
          setCheckpoints(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch checkpoints:', err);
      }
    };
    fetchCheckpoints();
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
      if (!formData.name || !formData.location) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      const response = await api.post<{ success: boolean; data: any }>('/checkpoints', formData);

      if (response.success) {
        setSuccess('Checkpoint created successfully!');
        setCheckpoints([...checkpoints, response.data]);
        setFormData({ name: '', location: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create checkpoint');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this checkpoint?')) {
      try {
        const response = await api.delete<{ success: boolean }>(`/checkpoints/${id}`);
        if (response.success) {
          setCheckpoints(checkpoints.filter(c => c._id !== id));
          setSuccess('Checkpoint deleted');
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete checkpoint');
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Manage Checkpoints</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Checkpoint Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Downtown Checkpoint"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Main Street"
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#F12711] hover:bg-[#F12711]"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Checkpoint'}
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Active Checkpoints ({checkpoints.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {checkpoints.length > 0 ? (
              checkpoints.map(checkpoint => {
                return (
                  <div key={checkpoint._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{checkpoint.name}</p>
                      <p className="text-sm text-gray-600">{checkpoint.location}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(checkpoint._id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-8">No checkpoints created yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
