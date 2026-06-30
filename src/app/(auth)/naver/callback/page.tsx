'use client';

import { useEffect } from 'react';

export default function CallbackPage() {
  useEffect(() => {
    window.opener?.postMessage({ type: 'AUTH_SUCCESS' }, window.location.origin);
    window.close();
  }, []);

  return null;
}
