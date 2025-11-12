import ProtectedSidebar from './protected-sidebar';
import type { PropsWithChildren } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const ProtectedLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <ProtectedSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
