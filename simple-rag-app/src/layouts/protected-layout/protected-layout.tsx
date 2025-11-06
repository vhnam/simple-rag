import ProtectedSidebar from './protected-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import type { PropsWithChildren } from 'react';

const ProtectedLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <ProtectedSidebar />
      <SidebarInset>
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
