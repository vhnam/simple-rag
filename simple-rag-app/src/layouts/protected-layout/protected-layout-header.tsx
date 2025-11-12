import type { PropsWithChildren } from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface ProtectedLayoutHeaderProps extends PropsWithChildren {
  title: string;
}

const ProtectedLayoutHeader = ({
  children,
  title,
}: ProtectedLayoutHeaderProps) => {
  return (
    <header
      className={cn(
        'bg-opacity-10 sticky top-0 z-10 backdrop-blur-sm backdrop-filter',
        'flex shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6',
        'h-16 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <strong className="font-display text-lg text-gray-900 dark:text-gray-100">
          {title}
        </strong>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
};

export default ProtectedLayoutHeader;
