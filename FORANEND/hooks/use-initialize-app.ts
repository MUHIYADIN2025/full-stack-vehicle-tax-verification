import { useEffect } from 'react';
import { seedDemoData } from '@/lib/seed-demo-data';

export function useInitializeApp() {
  useEffect(() => {
    // Seed demo data on first load
    seedDemoData();
  }, []);
}
