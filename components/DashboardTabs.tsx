'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'API Keys', href: '/dashboard/keys' },
  { name: 'Usage', href: '/dashboard/usage' },
];

export default function DashboardTabs() {
  const pathname = usePathname();

  return (
    <nav className="-mb-px flex flex-wrap gap-6 text-sm font-medium" aria-label="Dashboard">
      {tabs.map((tab) => {
        const isActive =
          tab.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={
              `border-b-2 pb-3 transition ${
                isActive
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-900'
              }`
            }
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
