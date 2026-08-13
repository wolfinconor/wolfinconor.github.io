"use client";

import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-pill border border-terracotta px-4 py-1.5 text-sm font-semibold text-terracotta hover:bg-terracotta-pale"
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
