'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { useInitializeApp } from '@/hooks/use-initialize-app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { UserRole } from '@/lib/storage';
import { api } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize app with demo data (remove this once backend is fully populated)
  useInitializeApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post<{
        success: boolean;
        data: {
          id: string;
          role: UserRole;
          fullName: string;
          email: string;
          phone: string;
          checkpointName?: string;
          token: string;
        };
      }>('/auth/login', { identifier, password });

      if (response.success) {
        // Set current user session with token
        storage.setCurrentUser(response.data);

        // Redirect based on role
        const roleRedirects: Record<UserRole, string> = {
          admin: '/admin/dashboard',
          officer: '/officer/dashboard',
          vehicleOwner: '/owner/dashboard',
        };

        router.push(roleRedirects[response.data.role]);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#F12711] to-[#F5AF19] rounded-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Vehicle Checkpoint
            </h1>
            <p className="text-slate-500 text-sm">Tax Verification System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Email or Phone
              </label>
              <Input
                type="text"
                placeholder="muhidiin090448@.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={loading}
                className="h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#F12711] to-[#F5AF19] hover:from-[#F12711] hover:to-[#F5AF19] text-white font-semibold rounded-lg transition-all duration-200"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-orange-50/50 rounded-lg border border-orange-200">
            <p className="text-xs font-semibold text-[#F12711] mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span className="font-mono text-[#F12711]">muhidiin090448@.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Officer:</span>
                <span className="font-mono text-[#F12711]">officer1@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Owner:</span>
                <span className="font-mono text-[#F12711]">owner1@example.com</span>
              </div>
              <div className="pt-2 border-t border-orange-200 mt-2 text-center">
                <span className="font-mono text-[#F12711]">Password: password</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
