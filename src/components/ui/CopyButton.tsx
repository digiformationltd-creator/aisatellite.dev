import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = 'Copy', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code snippet'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-button bg-space-850 hover:bg-space-800 text-text-secondary hover:text-cosmic-cyan border border-border-subtle transition-all duration-150 active:scale-95 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-cosmic-emerald" />
          <span className="text-cosmic-emerald font-semibold">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
