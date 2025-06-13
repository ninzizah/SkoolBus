import type { ReactNode } from 'react';
import { Header } from './header';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-muted/50 text-muted-foreground p-4 text-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} SkoolBus. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" passHref aria-label="SkoolBus on X" className="hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" passHref aria-label="SkoolBus on Instagram" className="hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" passHref aria-label="SkoolBus on Facebook" className="hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
