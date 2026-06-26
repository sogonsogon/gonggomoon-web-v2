'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BriefcaseBusinessIcon, MenuIcon, TargetIcon } from 'lucide-react';

import { MainSidebarContent } from '@/shared/components/layout/MainSidebar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { NAV_ITEMS } from '@/shared/constants/navItems';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/cn';

type BottomNavigationIconKey = (typeof NAV_ITEMS)[number]['icon'];

type BottomNavigationItem = (typeof NAV_ITEMS)[number] & {
  iconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const bottomNavigationIconMap: Record<
  BottomNavigationIconKey,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  target: TargetIcon,
  briefcase: BriefcaseBusinessIcon,
};

const bottomNavigationItems: BottomNavigationItem[] = NAV_ITEMS.map((item) => ({
  ...item,
  iconComponent: bottomNavigationIconMap[item.icon],
}));

function isMainNavActive(pathname: string, href: string) {
  return pathname === href;
}

export default function MainBottomNavigation() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const drawerOpen = isMobile && open;

  return (
    <>
      <nav className="fixed inset-x-4 bottom-4 z-40 grid h-16 grid-cols-3 items-center gap-1 rounded-full border border-border/60 bg-background/95 p-1.5 shadow-[0_12px_32px_#0000001a] backdrop-blur md:hidden">
        {bottomNavigationItems.map((item) => (
          <BottomNavigationLink
            key={item.label}
            item={item}
            active={isMainNavActive(pathname, item.href)}
          />
        ))}

        <button
          type="button"
          className="flex h-full min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-full bg-transparent px-2 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          onClick={() => setOpen(true)}
        >
          <MenuIcon className="size-5 shrink-0" aria-hidden="true" />
          <span className="max-w-full truncate text-[11px] leading-none font-semibold whitespace-nowrap">
            메뉴
          </span>
        </button>
      </nav>

      <Sheet open={drawerOpen} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85svh] overflow-hidden rounded-t-[var(--radius-lg)] border-border/60 bg-background p-0 shadow-[0_-16px_40px_#0000001a] md:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>메뉴</SheetTitle>
            <SheetDescription>
              공고문 주요 메뉴와 최근 포트폴리오 전략을 확인합니다.
            </SheetDescription>
          </SheetHeader>
          <div className="max-h-[85svh] overflow-y-auto pb-6">
            <MainSidebarContent showCollapseToggle={false} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function BottomNavigationLink({ item, active }: { item: BottomNavigationItem; active: boolean }) {
  const Icon = item.iconComponent;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex h-full min-w-0 flex-col items-center justify-center gap-1 rounded-full px-2 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        active && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className="max-w-full truncate text-[11px] leading-none font-semibold whitespace-nowrap">
        {item.label}
      </span>
    </Link>
  );
}
