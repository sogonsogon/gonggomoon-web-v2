'use client';

import { userQueryOptions } from '@/features/auth/queries';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function CallbackPage() {
  useEffect(() => {
    window.opener?.postMessage({ type: 'AUTH_SUCCESS' }, window.location.origin);
    window.close();
  }, []);

  return null;
}
