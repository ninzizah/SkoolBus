
"use client";

import Link from 'next/link';
import { BusFront, Users, Smile, MapPin, Gauge, Briefcase, School as SchoolIcon, Settings, Moon, Sun, Bell, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: '/parents', label: 'Parents', icon: Users },
  { href: '/children', label: 'Children', icon: Smile },
  { href: '/tracking', label: 'Tracking', icon: MapPin },
  { href: '/driver', label: 'Driver', icon: Gauge },
  { href: '/school', label: 'School Portal', icon: SchoolIcon },
  { href: '/admin/schools', label: 'System Admin', icon: Briefcase },
];

export function Header() {
  const { toast } = useToast();

  const handleFeatureComingSoon = (featureName: string) => {
    toast({
      title: "Feature Coming Soon!",
      description: `${featureName} functionality will be available in a future update.`,
    });
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <BusFront className="h-8 w-8" />
          <span className="text-2xl font-bold font-headline">SkoolBus</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" asChild>
                <Link href={item.href} className="flex items-center gap-2 text-foreground hover:text-accent-foreground/80">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                aria-label="Account and Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFeatureComingSoon('Profile Settings')}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFeatureComingSoon('Theme Toggling')}>
                <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Toggle Theme</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFeatureComingSoon('Notification Settings')}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFeatureComingSoon('Logout')}>
                {/* Consider adding a LogOut icon from lucide-react if desired */}
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}
