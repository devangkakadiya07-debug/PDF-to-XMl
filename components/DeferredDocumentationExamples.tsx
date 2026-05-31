'use client';

import dynamic from 'next/dynamic';

const DocumentationExamples = dynamic(() => import('@/components/DocumentationExamples'), {
  ssr: false,
  loading: () => <DocumentationExamplesSkeleton />,
});

function DocumentationExamplesSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm">
      <div className="grid gap-4">
        <div className="h-[360px] rounded-xl border border-zinc-200 bg-zinc-100/80" />
        <div className="h-[520px] rounded-xl border border-zinc-200 bg-zinc-100/80" />
      </div>
    </div>
  );
}

export default function DeferredDocumentationExamples() {
  return <DocumentationExamples />;
}