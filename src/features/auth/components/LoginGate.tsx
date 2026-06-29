'use client';

import { useAuthStore } from '@/shared/provider/AuthProvider';
import { useLoginModal } from '@/features/auth/store/useLoginModal';
import { useEffect } from 'react';

export default function LoginGate() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { openDialog } = useLoginModal();
  useEffect(() => {
    if (!isLoggedIn) {
      openDialog();
    }
  }, [isLoggedIn]);
  return null;
}
