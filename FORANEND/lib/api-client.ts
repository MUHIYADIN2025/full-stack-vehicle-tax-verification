import { storage } from './storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data: any; message?: string } & T> {
  const token = storage.getToken();
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T = any>(endpoint: string, data: any, options?: RequestInit) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    
  put: <T = any>(endpoint: string, data: any, options?: RequestInit) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    
  delete: <T = any>(endpoint: string, options?: RequestInit) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'DELETE' }),
};
