
"use client";

import Link from 'next/link';
import { BusFront, Users, Smile, MapPin, Gauge, Briefcase, School as SchoolIcon, Settings, Moon, Sun, Bell, User as UserIcon, LogOut } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

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
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme based on class or system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    } else if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
    // If no preference in local storage, use system preference
    else if (prefersDark) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
        localStorage.setItem('theme', 'light');
    }


  }, []);

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
      toast({ title: "Theme Changed", description: "Switched to Light Mode." });
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
      toast({ title: "Theme Changed", description: "Switched to Dark Mode." });
    }
  };

  const handleFeatureComingSoon = (featureName: string) => {
    toast({
      title: "Feature Coming Soon!",
      description: `${featureName} functionality will be available in a future update.`,
    });
  };

  const handleLogout = () => {
     toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login');
  }

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
                <Link href={item.href} className="flex items-center gap-2 text-foreground hover:text-primary/90">
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
              <DropdownMenuItem onClick={() => router.push('/login')}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile / Login</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleThemeToggle}>
                {isDarkMode ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>Toggle Theme</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFeatureComingSoon('Notification Settings')}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}
