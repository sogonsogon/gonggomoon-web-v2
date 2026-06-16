'use client';

import * as React from 'react';

import MainFooterLegalModal, {
  type MainFooterLegalModalType,
} from '@/shared/components/layout/MainFooterLegalModal';

export default function MainFooter() {
  const [legalModalType, setLegalModalType] = React.useState<MainFooterLegalModalType | null>(null);

  return (
    <footer className="flex h-[72px] shrink-0 items-center justify-between gap-[var(--gap-md)] border-t border-border/60 bg-background px-6 text-xs text-muted-foreground md:px-10">
      <p className="min-w-0 truncate whitespace-nowrap">© 2026 공고문. All rights reserved.</p>

      <div className="flex shrink-0 items-center gap-6">
        <button
          type="button"
          className="cursor-pointer whitespace-nowrap transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          onClick={() => setLegalModalType('terms')}
        >
          이용약관
        </button>
        <button
          type="button"
          className="cursor-pointer whitespace-nowrap transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          onClick={() => setLegalModalType('privacy')}
        >
          개인정보처리방침
        </button>
      </div>

      <MainFooterLegalModal
        type={legalModalType}
        onOpenChange={(open) => {
          if (!open) {
            setLegalModalType(null);
          }
        }}
      />
    </footer>
  );
}
