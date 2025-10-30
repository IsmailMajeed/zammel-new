'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function ProtectedRoutes({ children, requireAdmin = false, redirectTo = '/auth/admin/login' }) {
  const { user, token } = useSelector((state) => requireAdmin ? state.adminUser : state.user);
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
      router.replace(redirectTo);
      return;
    }
    if (requireAdmin && !user?.isAdmin) {
      router.replace(redirectTo);
    }
  }, [user, token, requireAdmin, router, redirectTo]);

  if (!token || !user) return null;
  if (requireAdmin && !user?.isAdmin) return null;

  return children;
}


