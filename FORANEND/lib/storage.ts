export type UserRole = 'admin' | 'officer' | 'owner';

export interface CurrentUser {
  id: string;
  fullName: string;
  role: UserRole;
  checkpointName?: string;
  phone?: string;
}

export const storage = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  getCurrentUser: (): CurrentUser | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser');
      const token = localStorage.getItem('token');
      if (user && token) {
        return JSON.parse(user);
      }
      if (user && !token) {
        localStorage.removeItem('currentUser');
      }
    }
    return null;
  },
  setCurrentUser: (user: CurrentUser & { token?: string }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
      if (user.token) {
        localStorage.setItem('token', user.token);
      }
    }
  },
  clearCurrentUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  },
  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  },
  getActiveAlerts: () => {
    return [];
  },
  getAllAlerts: () => {
    return [];
  }
};
