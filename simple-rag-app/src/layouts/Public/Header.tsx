import { Link } from '@tanstack/react-router';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { useAuth0Context } from '@/integrations/auth0/auth-provider';

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

const Header = () => {
  const { isAuthenticated, user, login, logout, isLoading } = useAuth0Context();

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
          <div className="text-muted-foreground text-sm">Loading...</div>
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
              <NavigationMenuList>
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
              <>
                <span className="text-muted-foreground text-sm">
                  {user?.email || user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Logout
                </Button>
              </>
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

export default Header;
