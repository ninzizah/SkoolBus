import type { ReactNode } from 'react';
import { Header } from './header';

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
      <footer className="bg-muted/50 text-muted-foreground text-center p-4 text-sm">
        © {new Date().getFullYear()} RouteRider. All rights reserved.
      </footer>
    </div>
  );
}
