'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LogoutButton } from '@/components/layout/LogoutButton';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Insights', href: '/insights' },
];

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex items-center gap-4 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href
                    ? 'text-foreground font-medium underline underline-offset-4'
                    : 'text-muted hover:text-foreground transition'
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
      {children}
    </main>
  );
}
