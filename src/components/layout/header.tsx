import Link from 'next/link';
import { BusFront, Users, Smile, MapPin, Gauge, Route } from 'lucide-react'; // Changed SteeringWheel to Gauge
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/parents', label: 'Parents', icon: Users },
  { href: '/children', label: 'Children', icon: Smile },
  { href: '/tracking', label: 'Tracking', icon: MapPin },
  { href: '/driver', label: 'Driver', icon: Gauge }, // Changed SteeringWheel to Gauge
  { href: '/route-optimization', label: 'Optimize Route', icon: Route },
];

export function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <BusFront className="h-8 w-8" />
          <span className="text-2xl font-bold font-headline">RouteRider</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild>
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        {/* Mobile Menu Trigger (optional, can be added later) */}
        {/* <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div> */}
      </div>
    </header>
  );
}
