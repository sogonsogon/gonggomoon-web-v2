'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BriefcaseBusinessIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  TargetIcon,
  Trash2Icon,
} from 'lucide-react';

import logoImage from '@/shared/assets/images/logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from '@/shared/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/cn';

type SidebarIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type MainNavItem = {
  label: string;
  icon: SidebarIcon;
  active?: boolean;
  href: string;
};

type RecentStrategy = {
  id: string;
  title: string;
  date: string;
  href: string;
};

interface MainSidebarContentProps {
  showCollapseToggle?: boolean;
  onNavigate?: () => void;
}

const mainNavItems: MainNavItem[] = [
  {
    label: '포폴 전략',
    icon: TargetIcon,
    active: true,
    href: '/',
  },
  {
    label: '경험 관리',
    icon: BriefcaseBusinessIcon,
    href: '/experience',
  },
];

const mockRecentStrategies: RecentStrategy[] = [
  {
    id: '1',
    title: '당근 Frontend 개발자 채용',
    date: '2026. 06. 02',
    href: '/strategy/1/result',
  },
  {
    id: '2',
    title: '토스 Backend 개발자 채용',
    date: '2026. 06. 01',
    href: '/strategy/2/result',
  },
];

const mockUser = {
  name: '박세윤',
  email: 'seun0714@naver.com',
  initial: '박',
};

export default function MainSidebar() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-background shadow-[0_4px_6px_#00000008,0_16px_40px_#00000012]"
    >
      <MainSidebarContent />
    </Sidebar>
  );
}

export function MainSidebarContent({
  showCollapseToggle = true,
  onNavigate,
}: MainSidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2.5 overflow-hidden bg-background p-3 text-foreground group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
      <SidebarHeader className="p-0">
        <div className="group-data-[collapsible=icon]:hidden">
          <div className="flex h-11 min-w-0 items-center justify-between p-1">
            <Link href="/" className="flex min-w-0 items-center" onClick={onNavigate}>
              <Image
                src={logoImage}
                alt="공고문"
                className="h-[30px] w-auto shrink-0 object-contain"
                priority
              />
            </Link>
            {showCollapseToggle ? <SidebarToggleButton /> : null}
          </div>
        </div>
        {showCollapseToggle ? (
          <div className="hidden justify-center group-data-[collapsible=icon]:flex">
            <SidebarToggleButton collapsed />
          </div>
        ) : null}
      </SidebarHeader>

      <nav className="group-data-[collapsible=icon]:hidden">
        <div className="flex flex-col gap-1 px-1">
          {mainNavItems.map((item) => (
            <MainSidebarNavItem key={item.label} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>

      <nav className="hidden flex-col items-center gap-2 group-data-[collapsible=icon]:flex">
        {mainNavItems.map((item) => (
          <CollapsedIconButton
            key={item.label}
            label={item.label}
            icon={item.icon}
            href={item.href}
            active={item.active}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <SidebarSeparator className="mx-0 bg-border group-data-[collapsible=icon]:w-10" />

      <SidebarContent className="gap-2 overflow-hidden p-0">
        <div className="flex min-h-0 flex-1 flex-col gap-2 group-data-[collapsible=icon]:hidden">
          <div className="px-2 text-xs leading-[1.3] font-semibold whitespace-nowrap text-muted-foreground">
            최근 포트폴리오 전략
          </div>
          <div className="flex min-h-0 flex-col gap-1">
            {mockRecentStrategies.map((strategy) => (
              <RecentStrategyCard key={strategy.id} strategy={strategy} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <div className="hidden min-h-0 flex-1 flex-col items-center gap-2 group-data-[collapsible=icon]:flex">
          {mockRecentStrategies.map((strategy) => (
            <CollapsedIconButton
              key={strategy.id}
              label={strategy.title}
              icon={FileTextIcon}
              href={strategy.href}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </SidebarContent>

      <SidebarSeparator className="mx-0 bg-border group-data-[collapsible=icon]:w-10" />

      <SidebarFooter className="p-0">
        <UserProfile />
      </SidebarFooter>
    </div>
  );
}

function SidebarToggleButton({ collapsed = false }: { collapsed?: boolean }) {
  const { toggleSidebar } = useSidebar();
  const Icon = collapsed ? ChevronRightIcon : ChevronLeftIcon;

  return (
    <button
      type="button"
      aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
      className={cn(
        'flex shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        collapsed ? 'size-[34px] rounded-[9px]' : 'size-8 rounded-[var(--radius-sm)]',
      )}
      onClick={toggleSidebar}
    >
      <Icon className="size-[17px]" aria-hidden="true" />
    </button>
  );
}

function MainSidebarNavItem({ item, onNavigate }: { item: MainNavItem; onNavigate?: () => void }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex h-10 w-full cursor-pointer items-center justify-between gap-[var(--gap-sm)] overflow-hidden rounded-[var(--radius-sm)] bg-transparent px-2.5 py-2 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        item.active && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
      )}
    >
      <span className="flex min-w-0 items-center gap-[9px] overflow-hidden">
        <Icon className="size-[17px] shrink-0" aria-hidden="true" />
        <span className="min-w-0 truncate whitespace-nowrap text-sm leading-[1.35] font-semibold">
          {item.label}
        </span>
      </span>
    </Link>
  );
}

function CollapsedIconButton({
  label,
  icon: Icon,
  href,
  active = false,
  onNavigate,
}: {
  label: string;
  icon: SidebarIcon;
  href?: string;
  active?: boolean;
  onNavigate?: () => void;
}) {
  const className = cn(
    'flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-transparent text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
    active && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={className} onClick={onNavigate}>
        <Icon className="size-[18px]" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} title={label} className={className}>
      <Icon className="size-[18px]" aria-hidden="true" />
    </button>
  );
}

function RecentStrategyCard({
  strategy,
  onNavigate,
}: {
  strategy: RecentStrategy;
  onNavigate?: () => void;
}) {
  return (
    <div className="relative min-w-0 rounded-[var(--radius-sm)]">
      <Link
        href={strategy.href}
        onClick={onNavigate}
        className="flex min-w-0 cursor-pointer flex-col gap-[7px] rounded-[var(--radius-sm)] bg-transparent p-2.5 pr-9 text-left transition-colors hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="min-w-0 truncate whitespace-nowrap text-[13px] leading-[1.3] font-semibold text-foreground">
          {strategy.title}
        </span>
        <span className="truncate whitespace-nowrap text-[11px] leading-[1.25] font-medium text-muted-foreground">
          {strategy.date}
        </span>
      </Link>
      <div className="absolute top-2 right-2 z-10">
        <StrategyItemDropdown strategy={strategy} />
      </div>
    </div>
  );
}

function StrategyItemDropdown({ strategy }: { strategy: RecentStrategy }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`${strategy.title} 메뉴`}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md bg-transparent text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontalIcon className="size-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        className="min-w-20 border-border/60 shadow-[0_8px_24px_#00000014]"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DropdownMenuItem variant="destructive" className="cursor-pointer">
          <Trash2Icon className="size-4" aria-hidden="true" />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserProfile() {
  return (
    <>
      <div className="group-data-[collapsible=icon]:hidden">
        <div className="flex min-w-0 items-center justify-between gap-[var(--gap-sm)] rounded-[var(--radius-sm)] p-2">
          <div className="flex min-w-0 items-center gap-[9px]">
            <UserAvatar />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="min-w-0 truncate whitespace-nowrap text-[13px] leading-[1.25] font-semibold text-foreground">
                {mockUser.name}
              </span>
              <span className="min-w-0 truncate whitespace-nowrap text-[11px] leading-[1.25] font-medium text-muted-foreground">
                {mockUser.email}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="설정"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] bg-transparent text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <SettingsIcon className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="hidden justify-center group-data-[collapsible=icon]:flex">
        <CollapsedIconButton label="설정" icon={SettingsIcon} />
      </div>
    </>
  );
}

function UserAvatar() {
  return (
    <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-muted text-sm leading-none font-bold text-foreground">
      {mockUser.initial}
    </div>
  );
}
