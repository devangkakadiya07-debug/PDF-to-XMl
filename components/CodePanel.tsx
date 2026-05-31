'use client';

import { useEffect, useState } from 'react';

type CodePanelProps = {
  title: string;
  language: string;
  code: string;
};

async function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M7 7h8v8H7z" />
      <path d="M5 13H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 10.5l3 3 8-8" />
    </svg>
  );
}

export default function CodePanel({ title, language, code }: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(code);
    setCopied(ok);
  };

  useEffect(() => {
    if (!copied) return undefined;
    const timeout = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <div className="min-w-0 w-full max-w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3">
        <p className="text-xs font-semibold text-zinc-300">{title}</p>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-zinc-800/80 bg-zinc-900 px-2 py-1 text-[10px] font-semibold text-zinc-400">
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-800/80 bg-zinc-950/60 px-2 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
            aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
          >
            {copied ? (
              <CheckIcon className="h-3.5 w-3.5" />
            ) : (
              <CopyIcon className="h-3.5 w-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <pre className="min-w-0 max-w-full overflow-x-auto px-4 py-5 text-[12px] leading-relaxed text-zinc-100">
        <code className="block w-max min-w-full whitespace-pre font-mono">{code}</code>
      </pre>
    </div>
  );
}
