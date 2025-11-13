import { Link } from '@tanstack/react-router';

import {
  ActivityIcon,
  CircleUserRoundIcon,
  ShieldCheckIcon,
  UserRoundCogIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: Array<SidebarItem>;
}

const items: Array<SidebarItem> = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: ActivityIcon,
  },
  {
    title: 'User Management',
    url: '#',
    icon: UserRoundCogIcon,
    items: [
      {
        title: 'Users',
        url: '/dashboard/users',
        icon: CircleUserRoundIcon,
      },
      {
        title: 'Roles',
        url: '/dashboard/roles',
        icon: ShieldCheckIcon,
      },
    ],
  },
];

const renderMenuItemWithSubItems = (item: SidebarItem) => (
  <SidebarMenuItem key={item.title}>
    <SidebarMenuButton>
      <item.icon />
      <span>{item.title}</span>
    </SidebarMenuButton>
    <SidebarMenuSub>
      {item.items?.map((subItem) => (
        <SidebarMenuSubItem key={subItem.title}>
          <SidebarMenuButton asChild>
            <Link to={subItem.url}>
              <subItem.icon />
              <span>{subItem.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  </SidebarMenuItem>
);

const renderMenuItemWithoutSubItems = (item: SidebarItem) => (
  <SidebarMenuItem key={item.title}>
    <SidebarMenuButton asChild>
      <Link to={item.url}>
        <item.icon />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const ProtectedSidebarContent = () => {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              if ('items' in item && item.items) {
                return renderMenuItemWithSubItems(item);
              }
              return renderMenuItemWithoutSubItems(item);
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default ProtectedSidebarContent;
