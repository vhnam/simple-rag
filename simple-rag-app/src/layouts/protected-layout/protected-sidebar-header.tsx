import Logo from '@/components/Logo';
import { SidebarHeader, SidebarMenuButton } from '@/components/ui/sidebar';

const ProtectedSidebarHeader = () => {
  return (
    <SidebarHeader>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <Logo width={32} height={32} />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          {import.meta.env.VITE_APP_TITLE}
        </div>
      </SidebarMenuButton>
    </SidebarHeader>
  );
};

export default ProtectedSidebarHeader;
