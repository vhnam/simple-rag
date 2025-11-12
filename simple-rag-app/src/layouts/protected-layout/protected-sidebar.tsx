import ProtectedSidebarFooter from './protected-sidebar-footer';
import ProtectedSidebarHeader from './protected-sidebar-header';
import ProtectedSidebarContent from './protected-sidebar-content';
import type { ComponentProps } from 'react';
import { Sidebar } from '@/components/ui/sidebar';

const ProtectedSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <ProtectedSidebarHeader />
      <ProtectedSidebarContent />
      <ProtectedSidebarFooter />
    </Sidebar>
  );
};

export default ProtectedSidebar;
