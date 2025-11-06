import ProtectedSidebar from './protected-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import type { PropsWithChildren } from 'react';

const ProtectedLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <ProtectedSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
