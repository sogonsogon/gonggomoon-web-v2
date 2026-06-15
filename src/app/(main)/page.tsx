'use client';
import ExperienceModalTest from '@/features/experience/components/ui/ExperienceModalTest';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';

export default function Page() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>열기</Button>
      <ExperienceModalTest open={open} setOpen={setOpen} />
    </div>
  );
}
