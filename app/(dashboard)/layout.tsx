import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="mb-8 border-b border-zinc-200">
        <nav className="-mb-px flex space-x-8 text-sm font-medium text-zinc-600" aria-label="Tabs">
          <Link 
            href="/dashboard" 
            className="border-b-2 border-transparent pb-4 hover:border-zinc-300 hover:text-zinc-900"
          >
            Overview
          </Link>
          <Link 
            href="/dashboard/keys" 
            className="border-b-2 border-transparent pb-4 hover:border-zinc-300 hover:text-zinc-900"
          >
            API Keys
          </Link>
          <Link 
            href="/dashboard/usage" 
            className="border-b-2 border-transparent pb-4 hover:border-zinc-300 hover:text-zinc-900"
          >
            Usage
          </Link>
        </nav>
      </div>

      <main>
        {children}
      </main>
    </div>
  );
}