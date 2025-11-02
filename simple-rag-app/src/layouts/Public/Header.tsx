import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { env } from '@/env'
import { Link } from '@tanstack/react-router'

const menu = [
  {
    label: 'Chat',
    to: '/chat',
  },
  {
    label: 'AI Recipe',
    to: '/ai-recipe',
  },
]

const Header = () => {
  return (
    <header className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
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
          <div className="flex gap-4">
            <Button asChild variant="outline" size="sm">
              <Link
                to="/auth/login"
                activeProps={{ className: 'bg-accent text-accent-foreground' }}
              >
                Login
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link
                to="/auth/register"
                activeProps={{ className: 'bg-accent text-accent-foreground' }}
              >
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
