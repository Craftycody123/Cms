'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export const useAuth = () => {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/admin/login');
      } else {
        setIsAuthed(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  return { isAuthed, loading };
};
