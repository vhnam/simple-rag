import { Sidebar } from '@/components/ui/sidebar';
import { type ComponentProps } from 'react';
import ProtectedSidebarFooter from './protected-sidebar-footer';
import ProtectedSidebarHeader from './protected-sidebar-header';
import ProtectSidebarContent from './protect-sidebar-content';

const ProtectedSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <ProtectedSidebarHeader />
      <ProtectSidebarContent />
      <ProtectedSidebarFooter />
    </Sidebar>
  );
};

export default ProtectedSidebar;
