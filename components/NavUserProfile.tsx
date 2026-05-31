import NavUserMenu from '@/components/NavUserMenu';
import { ensureUserRecord } from '@/lib/auth/syncUser';
import { getMonthlyUsage } from '@/lib/billing/usageAggregation';

type NavUserProfileProps = {
  userId: string;
};

export default async function NavUserProfile({ userId }: NavUserProfileProps) {
  const user = await ensureUserRecord(userId);
  const now = new Date();
  const { billableCalls } = await getMonthlyUsage(
    userId,
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
  );

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2 rounded-full border border-zinc-200/80 bg-white/90 px-3 py-2 text-xs text-zinc-500 shadow-sm sm:flex">
        <span className="uppercase tracking-[0.18em]">Usage</span>
        <span className="font-semibold tracking-normal text-zinc-900">
          {billableCalls.toLocaleString()} / {user.monthlyCallLimit.toLocaleString()}
        </span>
      </div>
      <NavUserMenu
        billableCalls={billableCalls}
        monthlyCallLimit={user.monthlyCallLimit}
      />
    </div>
  );
}