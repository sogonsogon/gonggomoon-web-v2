import MainBottomNavigation from '@/shared/components/layout/MainBottomNavigation';
import MainSidebar from '@/shared/components/layout/MainSidebar';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '280px',
          '--sidebar-width-icon': '72px',
        } as React.CSSProperties
      }
    >
      <MainSidebar />
      <SidebarInset className="pb-24 md:pb-0">{children}</SidebarInset>
      <MainBottomNavigation />
    </SidebarProvider>
  );
}
