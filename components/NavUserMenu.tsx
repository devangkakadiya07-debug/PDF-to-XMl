'use client';

import { UserButton } from '@clerk/nextjs';
import { BarChart3, CreditCard, LayoutDashboard } from 'lucide-react';

type NavUserMenuProps = {
  billableCalls: number;
  monthlyCallLimit: number | null;
};

export default function NavUserMenu({
  billableCalls,
  monthlyCallLimit,
}: NavUserMenuProps) {
  const usageLabel = monthlyCallLimit === null
    ? 'Usage unavailable until your email is verified'
    : `Usage: ${billableCalls.toLocaleString()} / ${monthlyCallLimit.toLocaleString()}`;

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full border border-zinc-200/80 bg-white/90 p-1 shadow-sm">
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Action label="manageAccount" />
            <UserButton.Link
              href="/dashboard"
              label="Dashboard"
              labelIcon={<LayoutDashboard className="h-4 w-4" />}
            />
            <UserButton.Link
              href="/dashboard/usage"
              label={usageLabel}
              labelIcon={<BarChart3 className="h-4 w-4" />}
            />
            <UserButton.Link
              href="/api/billing/portal"
              label="Manage Billing"
              labelIcon={<CreditCard className="h-4 w-4" />}
            />
            <UserButton.Action label="signOut" />
          </UserButton.MenuItems>
        </UserButton>
      </div>
    </div>
  );
}