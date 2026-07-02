'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

import SettingsModal from '@/features/auth/components/ui/SettingsModal';
import logoImage from '@/shared/assets/images/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from '@/shared/components/ui/sidebar';
import { NAV_ITEMS } from '@/shared/constants/navItems';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/cn';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDeleteStrategy, useGetStrategyList } from '@/features/strategy/queries';
import { Strategy } from '@/features/strategy/types';
import { toast } from 'sonner';
import { useGetUser } from '@/features/auth/queries';

type SidebarIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type MainNavIconKey = (typeof NAV_ITEMS)[number]['icon'];

type MainNavItem = (typeof NAV_ITEMS)[number] & {
  iconComponent: SidebarIcon;
};
interface MainSidebarContentProps {
  showCollapseToggle?: boolean;
  onNavigate?: () => void;
}

const strategyRoutePattern = /^\/strategy\/([^/]+)\/(analysis|experience-select|result)$/;

const mainNavIconMap: Record<MainNavIconKey, SidebarIcon> = {
  target: TargetIcon,
  briefcase: BriefcaseBusinessIcon,
};

const mainNavItems: MainNavItem[] = NAV_ITEMS.map((item) => ({
  ...item,
  iconComponent: mainNavIconMap[item.icon],
}));

function isMainNavActive(pathname: string, href: string) {
  return pathname === href;
}

function getActiveStrategyId(pathname: string) {
  return strategyRoutePattern.exec(pathname)?.[1] ?? null;
}

function isRecentStrategyActive(pathname: string, strategyId: number) {
  return getActiveStrategyId(pathname) === strategyId.toString();
}

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
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const {
    data: strategyData = {
      totalCount: 0,

      contents: [],
    },
    isLoading,
  } = useGetStrategyList();

  return (
    <>
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
              <MainSidebarNavItem
                key={item.label}
                item={item}
                active={isMainNavActive(pathname, item.href)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </nav>

        <nav className="hidden flex-col items-center gap-2 group-data-[collapsible=icon]:flex">
          {mainNavItems.map((item) => (
            <CollapsedIconButton
              key={item.label}
              label={item.label}
              icon={item.iconComponent}
              href={item.href}
              active={isMainNavActive(pathname, item.href)}
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
              {isLoading ? (
                <RecentStrategySkeletonList />
              ) : strategyData.contents.length > 0 ? (
                strategyData.contents.map((strategy) => (
                  <RecentStrategyCard
                    key={strategy.strategyId}
                    strategy={strategy}
                    active={isRecentStrategyActive(pathname, strategy.strategyId)}
                    onNavigate={onNavigate}
                  />
                ))
              ) : (
                <p className="min-w-0 overflow-hidden px-2 py-3 text-xs leading-[1.55] whitespace-nowrap text-muted-foreground">
                  아직 생성된 포폴 전략이 없어요
                </p>
              )}
            </div>
          </div>

          <div className="hidden min-h-0 flex-1 flex-col items-center gap-2 group-data-[collapsible=icon]:flex">
            {isLoading ? (
              <RecentStrategySkeletonList collapsed />
            ) : strategyData.contents.length > 0 ? (
              strategyData.contents.map((strategy) => (
                <CollapsedIconButton
                  key={strategy.strategyId}
                  label={strategy.title}
                  icon={FileTextIcon}
                  href={`/strategy/${strategy.strategyId}/result`}
                  active={isRecentStrategyActive(pathname, strategy.strategyId)}
                  onNavigate={onNavigate}
                />
              ))
            ) : null}
          </div>
        </SidebarContent>

        <SidebarSeparator className="mx-0 bg-border group-data-[collapsible=icon]:w-10" />

        <SidebarFooter className="p-0">
          <UserProfile onSettingsClick={() => setSettingsOpen(true)} />
        </SidebarFooter>
      </div>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
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

function MainSidebarNavItem({
  item,
  active,
  onNavigate,
}: {
  item: MainNavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.iconComponent;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex h-10 w-full cursor-pointer items-center justify-between gap-[var(--gap-sm)] overflow-hidden rounded-[var(--radius-sm)] bg-transparent px-2.5 py-2 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        active && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
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
  onClick,
}: {
  label: string;
  icon: SidebarIcon;
  href?: string;
  active?: boolean;
  onNavigate?: () => void;
  onClick?: () => void;
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
    <button type="button" aria-label={label} title={label} className={className} onClick={onClick}>
      <Icon className="size-[18px]" aria-hidden="true" />
    </button>
  );
}

function RecentStrategyCard({
  strategy,
  active,
  onNavigate,
}: {
  strategy: Strategy;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="relative min-w-0 rounded-[var(--radius-sm)]">
      <Link
        href={`/strategy/${strategy.strategyId}/result`}
        onClick={onNavigate}
        className={cn(
          'flex min-w-0 cursor-pointer flex-col gap-[7px] rounded-[var(--radius-sm)] bg-transparent p-2.5 pr-9 text-left transition-colors hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          active && 'bg-primary/10 hover:bg-primary/10',
        )}
      >
        <span
          className={cn(
            'min-w-0 truncate whitespace-nowrap text-[13px] leading-[1.3] font-semibold text-foreground',
            active && 'text-primary',
          )}
        >
          {strategy.title}
        </span>
        <span
          className={cn(
            'truncate whitespace-nowrap text-[11px] leading-[1.25] font-medium text-muted-foreground',
            active && 'text-primary/80',
          )}
        >
          {strategy.createdAt.slice(0, 10).replace(/-/g, '.')}
        </span>
      </Link>
      <div className="absolute top-2 right-2 z-10">
        <StrategyItemDropdown strategy={strategy} active={active} />
      </div>
    </div>
  );
}

function RecentStrategySkeletonList({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <>
      <span className="sr-only" role="status">
        최근 포트폴리오 전략을 불러오는 중입니다.
      </span>
      {[0, 1, 2].map((item) =>
        collapsed ? (
          <Skeleton key={item} aria-hidden="true" className="size-10 shrink-0 rounded-[10px]" />
        ) : (
          <div
            key={item}
            aria-hidden="true"
            className="relative grid min-h-[57px] gap-[7px] rounded-[var(--radius-sm)] p-2.5 pr-9"
          >
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="absolute top-2 right-2 size-6 rounded-md" />
          </div>
        ),
      )}
    </>
  );
}

function StrategyItemDropdown({ strategy, active }: { strategy: Strategy; active: boolean }) {
  const { mutate: deleteStrategy, isPending } = useDeleteStrategy();
  const router = useRouter();
  const handleDelete = () => {
    if (confirm('정말 포폴 전략을 삭제하시겠습니까?')) {
      deleteStrategy(strategy.strategyId, {
        onSuccess: () => {
          toast.success(`포폴 전략이 삭제되었습니다.`);
          if (active) {
            router.replace('/');
          }
        },
        onError: (error) => {
          toast.error(error.message || '포폴 전략 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
        },
      });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`${strategy.title} 메뉴`}
          className={cn(
            'flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md bg-transparent text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            active && 'text-primary hover:bg-primary/10 hover:text-primary',
          )}
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
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2Icon className="size-4" aria-hidden="true" />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserProfile({ onSettingsClick }: { onSettingsClick: () => void }) {
  const { data, isLoading } = useGetUser();

  return (
    <>
      <div className="group-data-[collapsible=icon]:hidden">
        <div className="flex min-w-0 items-center justify-between gap-[var(--gap-sm)] rounded-[var(--radius-sm)] p-2">
          <div className="flex min-w-0 items-center gap-[9px]">
            <UserAvatar data={data} isLoading={isLoading} />
            <div className="flex min-w-0 flex-col gap-0.5">
              {isLoading ? (
                <>
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3 w-24" />
                </>
              ) : data ? (
                <>
                  <span className="min-w-0 truncate whitespace-nowrap text-[13px] leading-[1.25] font-semibold text-foreground">
                    {data.name}
                  </span>
                  <span className="min-w-0 truncate whitespace-nowrap text-[11px] leading-[1.25] font-medium text-muted-foreground">
                    {data.email}
                  </span>
                </>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            aria-label="설정"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] bg-transparent text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            onClick={onSettingsClick}
          >
            <SettingsIcon className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="hidden justify-center group-data-[collapsible=icon]:flex">
        <CollapsedIconButton label="설정" icon={SettingsIcon} onClick={onSettingsClick} />
      </div>
    </>
  );
}

function UserAvatar({
  data,
  isLoading,
}: {
  data: { profileImageUrl?: string | null; name: string } | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Skeleton className="size-[34px] shrink-0 rounded-full" />;
  }

  if (!data) return null;

  return (
    <Avatar className="size-[34px] text-sm">
      <AvatarImage src={data.profileImageUrl || undefined} alt={`${data.name} 프로필`} />
      <AvatarFallback className="font-bold text-foreground">{data.name.slice(0, 1)}</AvatarFallback>
    </Avatar>
  );
}
