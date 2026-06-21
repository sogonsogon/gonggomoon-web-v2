'use client';

import * as React from 'react';

import LoginModal from '@/features/auth/components/ui/LoginModal';

export default function LoginGate() {
  const [open, setOpen] = React.useState(true);

  return (
    <LoginModal open={open} onOpenChange={setOpen} onNaverLogin={() => setOpen(false)} />
  );
}
