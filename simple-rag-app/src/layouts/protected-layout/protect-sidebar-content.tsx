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
import {
  ActivityIcon,
  NotepadTextIcon,
  CircleUserRoundIcon,
  ShieldCheckIcon,
  UserRoundCogIcon,
  type LucideIcon,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: SidebarItem[];
}

const items: SidebarItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: ActivityIcon,
  },
  {
    title: 'Recipes',
    url: '/dashboard/recipes',
    icon: NotepadTextIcon,
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

const ProtectSidebarContent = () => {
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

export default ProtectSidebarContent;
