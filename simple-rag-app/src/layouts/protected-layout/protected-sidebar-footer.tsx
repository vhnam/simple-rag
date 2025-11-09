import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';
import { LogOutIcon, SettingsIcon, ChevronsUpDownIcon } from 'lucide-react';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { useAuthStore } from '@/stores/auth.store';
import { Badge } from '@/components/ui/badge';

const ProtectedSidebarFooter = () => {
  const { user, logout } = useAuthContext();
  const { role } = useAuthStore();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar>
                  <AvatarImage src={user?.picture} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <span>{user?.name || user?.email}</span>
                  <br />
                  <div className="flex gap-2">
                    {role.map((roleName) => (
                      <Badge key={roleName} variant="outline">
                        {roleName}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={4}
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile">
                  <SettingsIcon className="size-4" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOutIcon className="size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default ProtectedSidebarFooter;
