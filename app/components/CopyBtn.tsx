"use client";

import { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";

export default function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  return (
    <button
      className="cursor-pointer disabled:cursor-default ml-[16px]"
      disabled={copied}
      onClick={() => {
        copyText();
      }}
    >
      {copied ? (
        <CopyCheck size={14} className="text-primary" />
      ) : (
        <Copy size={14} className="text-accent2" />
      )}
    </button>
  );
}
