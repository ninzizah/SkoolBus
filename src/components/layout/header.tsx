
"use client";

import Link from 'next/link';
import { BusFront, Users, Smile, MapPin, Gauge, Briefcase, School as SchoolIcon, Settings, Moon, Sun, Bell, User as UserIcon, LogOut, Clock, UserPlus, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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

interface MockNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string; 
  read: boolean;
  icon?: React.ElementType;
  type?: 'info' | 'warning' | 'success' | 'route' | 'system';
}

const initialMockNotifications: MockNotification[] = [
  { id: 'n1', title: 'Route Delayed: Morning Star', description: 'Morning Star route is estimated to be 15 minutes late due to unexpected road closure on Elm St.', timestamp: '10m ago', read: false, icon: Clock, type: 'warning' },
  { id: 'n2', title: 'Child Added: Mia W.', description: 'Mia Wonderland has been successfully assigned to "Morning Star Route". Parent notified.', timestamp: '30m ago', read: false, icon: UserPlus, type: 'info' },
  { id: 'n3', title: 'Payment Confirmed', description: 'Your monthly subscription for SkoolBus services has been successfully renewed. Thank you!', timestamp: '2h ago', read: true, icon: CheckCircle, type: 'success' },
  { id: 'n4', title: 'New School Policy Update', description: 'Wonderland Elementary has updated its early pick-up policy. Please review in the school portal.', timestamp: '1d ago', read: true, icon: SchoolIcon, type: 'system'},
  { id: 'n5', title: 'Driver Alert: BUS-42 Maintenance', description: 'Reminder: Bus BUS-42 is scheduled for routine maintenance next Tuesday. Please coordinate with dispatch.', timestamp: '3h ago', read: false, icon: AlertTriangle, type: 'warning' },
  { id: 'n6', title: 'Welcome to SkoolBus!', description: 'Your account setup is complete. Explore the dashboard to get started.', timestamp: '3d ago', read: true, icon: BusFront, type: 'info'}
];


export function Header() {
  const { toast } = useToast();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsDialogOpen, setIsNotificationsDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState<MockNotification[]>(initialMockNotifications);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
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

  const handleLogout = () => {
     toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login');
  }

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({ title: "Notifications Updated", description: "All notifications marked as read." });
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    toast({ title: "Notifications Cleared", description: "All notifications have been removed." });
  };

  const getNotificationIcon = (notification: MockNotification) => {
    if (notification.icon) return <notification.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />;
    return <Bell className={`mr-3 h-5 w-5 flex-shrink-0 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />;
  };


  return (
    <>
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
                  className="relative"
                >
                  <Settings className="h-5 w-5" />
                   {unreadNotificationsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 min-w-4 p-0 flex items-center justify-center text-xs rounded-full"
                    >
                      {unreadNotificationsCount}
                    </Badge>
                  )}
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
                <DropdownMenuItem onClick={() => setIsNotificationsDialogOpen(true)}>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">{unreadNotificationsCount}</Badge>
                  )}
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

      <Dialog open={isNotificationsDialogOpen} onOpenChange={setIsNotificationsDialogOpen}>
        <DialogContent className="sm:max-w-lg md:max-w-xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center text-xl">
              <Bell className="mr-2 h-6 w-6 text-primary"/> Notifications
            </DialogTitle>
            <DialogDescription>
              Review your recent alerts and updates.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-grow pr-6 -mr-6"> {/* Added negative margin to offset scrollbar padding */}
            {notifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                You have no new notifications.
              </div>
            ) : (
              <div className="space-y-3 py-1">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border flex items-start cursor-pointer hover:bg-muted/50 transition-colors ${notification.read ? 'bg-muted/30 border-border/50' : 'bg-card border-primary/30'}`}
                    onClick={() => handleMarkNotificationAsRead(notification.id)}
                  >
                    {!notification.read && <div className="h-2 w-2 bg-accent rounded-full mr-3 mt-1.5 flex-shrink-0 animate-pulse"></div>}
                    {notification.read && <div className="h-2 w-2 bg-transparent rounded-full mr-3 mt-1.5 flex-shrink-0"></div>}
                    
                    {getNotificationIcon(notification)}
                    <div className="flex-grow">
                      <p className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>{notification.title}</p>
                      <p className={`text-sm ${notification.read ? 'text-muted-foreground/80' : 'text-foreground/90'}`}>{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <DialogFooter className="mt-4 pt-4 border-t gap-2 sm:gap-0">
            {notifications.length > 0 && (
              <>
                <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadNotificationsCount === 0}>
                  Mark all as read
                </Button>
                <Button variant="ghost" onClick={handleClearAllNotifications}>
                  Clear All
                </Button>
              </>
            )}
            <DialogClose asChild>
              <Button variant="default">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
