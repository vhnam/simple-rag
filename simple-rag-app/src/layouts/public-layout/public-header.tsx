import { Link } from '@tanstack/react-router';
import PublicMenuUser from './public-menu-user';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

const menu = [
  {
    label: 'Chat',
    to: '/chat',
  },
  {
    label: 'AI Recipe',
    to: '/ai-recipe',
  },
];

const PublicHeader = () => {
  const { isAuthenticated, user, login, logout, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <header className="bg-background fixed top-0 right-0 left-0 z-50 border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Logo width={32} height={32} />
              <span>{import.meta.env.VITE_APP_TITLE}</span>
            </Link>
          </div>
          <div className="text-muted-foreground text-sm">
            <Skeleton className="size-8" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-background fixed top-0 right-0 left-0 z-50 border-b p-4">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Logo width={32} height={32} />
            <span>{import.meta.env.VITE_APP_TITLE}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="space-x-2">
                {menu.map((item) => (
                  <NavigationMenuItem key={item.to}>
                    <NavigationMenuLink asChild>
                      <Link to={item.to} className="font-semibold">
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <PublicMenuUser user={user!} onLogout={logout} />
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => login()}>
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => login({ screen_hint: 'signup' })}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
