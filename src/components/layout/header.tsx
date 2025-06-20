
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
  { href: '/parents', label: 'Ababyeyi', icon: Users },
  { href: '/children', label: 'Abana', icon: Smile },
  { href: '/tracking', label: 'Gukurikirana', icon: MapPin },
  { href: '/driver', label: 'Umushoferi', icon: Gauge },
  { href: '/school', label: 'Ishuri (Portal)', icon: SchoolIcon },
  { href: '/admin/schools', label: 'Ubuyobozi', icon: Briefcase },
];

interface MockNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string; 
  read: boolean;
  icon?: React.ElementType;
  type?: 'info' | 'warning' | 'success' | 'route' | 'system';
  href?: string; // <-- New field for navigation
}

const initialMockNotifications: MockNotification[] = [
  { id: 'n1', title: 'Urugendo Rwakererewe: Umuseke', description: 'Urugendo rw\'Umuseke rushobora gukererwaho iminota 15 kubera umuhanda wafunzwe kuri KG 567 St.', timestamp: '10m ishize', read: false, icon: Clock, type: 'warning', href: '/tracking' },
  { id: 'n2', title: 'Umwana Yongewemo: Ineza A.', description: 'Ineza Ange yongewe mu rugendo "GS Kacyiru Umuseke A". Umubyeyi yamenyeshejwe.', timestamp: '30m ishize', read: false, icon: UserPlus, type: 'info', href: '/children' },
  { id: 'n3', title: 'Ubwishyu Bwemejwe', description: 'Ifatabuguzi ryawe rya buri kwezi rya SkoolBus ryemejwe neza. Murakoze!', timestamp: '2h ishize', read: true, icon: CheckCircle, type: 'success' },
  { id: 'n4', title: 'Amabwiriza Mashya y\'Ishuri', description: 'Groupe Scolaire Kacyiru ryavuguruye amabwiriza yaryo yo gufata abana mbere y\'igihe. Nyamuneka reba mu ishyirahamwe ry\'ishuri.', timestamp: '1d ishize', read: true, icon: SchoolIcon, type: 'system', href: '/school'},
  { id: 'n5', title: 'Ubutumwa bw\'Umushoferi: Imodoka RAD123B Ikeneye Gusuzumwa', description: 'Wibukijwe: Imodoka RAD123B iteganyijwe gusuzumwa kuwa kabiri utaha. Nyamuneka vugana n\'ababishinzwe.', timestamp: '3h ishize', read: false, icon: AlertTriangle, type: 'warning', href: '/driver' },
  { id: 'n6', title: 'Murakaza neza kuri SkoolBus!', description: 'Konti yawe yafunguwe neza. Reba imbonerahamwe kugira ngo utangire.', timestamp: '3d ishize', read: true, icon: BusFront, type: 'info', href: '/dashboard'}
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
      toast({ title: "Insanganyamatsiko Yahinduwe", description: "Wahinduye ujya ku nsanganyamatsiko y'umucyo." });
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
      toast({ title: "Insanganyamatsiko Yahinduwe", description: "Wahinduye ujya ku nsanganyamatsiko y'umwijima." });
    }
  };

  const handleLogout = () => {
     toast({
      title: "Mwasohotse",
      description: "Mwasohotse neza muri konti yanyu.",
    });
    router.push('/login');
  }

  const handleNotificationClick = (notification: MockNotification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    if (notification.href) {
      router.push(notification.href);
    }
    setIsNotificationsDialogOpen(false); // Close dialog after click/navigation
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({ title: "Amenyesha Yavuguruwe", description: "Amenyesha yose yashyizweho ko yasomwe." });
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    toast({ title: "Amenyesha Yasibwe", description: "Amenyesha yose yakuweho." });
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
                  aria-label="Konti n'Iboneza"
                  className="relative"
                >
                  <Settings className="h-5 w-5" />
                   {unreadNotificationsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 min-w-4 p-0 flex items-center justify-center text-xs rounded-full"
                    >
                      {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Konti Yanjye</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/login')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Umwirondoro / Injira</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeToggle}>
                  {isDarkMode ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  <span>Hindura Insanganyamatsiko</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsNotificationsDialogOpen(true)}>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Amenyesha</span>
                  {unreadNotificationsCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">{unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sohoka</span>
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
              <Bell className="mr-2 h-6 w-6 text-primary"/> Amenyesha
            </DialogTitle>
            <DialogDescription>
              Reba ubutumwa bwawe bwa vuba n'ibyakozwe.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-grow pr-6 -mr-6">
            {notifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                Nta menyesha mashya ufite.
              </div>
            ) : (
              <div className="space-y-3 py-1">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border flex items-start cursor-pointer hover:bg-muted/50 transition-colors ${notification.read ? 'bg-muted/30 border-border/50' : 'bg-card border-primary/30'}`}
                    onClick={() => handleNotificationClick(notification)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNotificationClick(notification);}}
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
                  Shyiraho ko Byasomwe Byose
                </Button>
                <Button variant="ghost" onClick={handleClearAllNotifications}>
                  Siba Byose
                </Button>
              </>
            )}
            <DialogClose asChild>
              <Button variant="default">Funga</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    