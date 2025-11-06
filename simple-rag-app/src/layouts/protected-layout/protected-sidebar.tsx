import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import ProtectedSidebarFooter from './protected-sidebar-footer';
import { Activity, NotepadTextIcon, CircleUserRoundIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ComponentProps } from 'react';
import ProtectedSidebarHeader from './protected-sidebar-header';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Activity,
  },
  {
    title: 'Recipes',
    url: '/dashboard/recipes',
    icon: NotepadTextIcon,
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: CircleUserRoundIcon,
  },
];

const ProtectedSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <ProtectedSidebarHeader />
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <ProtectedSidebarFooter />
    </Sidebar>
  );
};

export default ProtectedSidebar;
