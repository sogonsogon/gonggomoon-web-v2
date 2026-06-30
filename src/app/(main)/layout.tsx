import LoginGate from '@/features/auth/components/LoginGate';
import LoginModal from '@/features/auth/components/ui/LoginModal';
import MainBottomNavigation from '@/shared/components/layout/MainBottomNavigation';
import MainFooter from '@/shared/components/layout/MainFooter';
import MainSidebar from '@/shared/components/layout/MainSidebar';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { Toaster } from '@/shared/components/ui/sonner';
import { AuthStoreProvider } from '@/shared/provider/AuthProvider';
import QueryProvider from '@/shared/provider/QueryProvider';
import { cookies } from 'next/headers';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get('access_token')?.value);

  return (
    <QueryProvider>
      <AuthStoreProvider isLoggedIn={isLoggedIn}>
        <SidebarProvider
          style={
            {
              '--sidebar-width': '280px',
              '--sidebar-width-icon': '72px',
            } as React.CSSProperties
          }
        >
          <MainSidebar />
          <SidebarInset className="pb-24 md:pb-0">
            <div className="min-h-svh">{children}</div>
            <MainFooter />
          </SidebarInset>
          <MainBottomNavigation />
          <LoginGate />
          <LoginModal />
          <Toaster richColors position="top-center" />
        </SidebarProvider>
      </AuthStoreProvider>
    </QueryProvider>
  );
}
