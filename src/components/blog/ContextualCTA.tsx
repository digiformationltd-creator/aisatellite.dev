import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ContextualCTAConfig } from '../../lib/blog/types';

interface ContextualCTAProps {
  cta: ContextualCTAConfig;
  articleId?: string;
  class?: string;
}

export default function ContextualCTA({
  cta,
  articleId = 'general',
  class: className = '',
}: ContextualCTAProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    // Client-side analytics beacon or log
    try {
      const payload = {
        articleId,
        ctaId: cta.id,
        destinationUrl: cta.destinationUrl,
        placementType: cta.type,
        timestamp: new Date().toISOString(),
      };
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('/api/blog/cta-click', JSON.stringify(payload));
      }
    } catch {
      // Telemetry best-effort
    }
  };

  const isCommercial = cta.partner === 'digiformation' || cta.partner === 'digibizos';

  // Card accent color mapping
  const getAccentBorder = () => {
    if (cta.partner === 'digiformation') return 'border-cosmic-cyan/40 hover:border-cosmic-cyan';
    if (cta.partner === 'digibizos') return 'border-emerald-500/40 hover:border-emerald-400';
    return 'border-border-subtle hover:border-border-hover';
  };

  const getBadgeStyle = () => {
    if (cta.partner === 'digiformation')
      return 'bg-cosmic-cyan/15 text-cosmic-cyan border-cosmic-cyan/30';
    if (cta.partner === 'digibizos')
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    return 'bg-space-800 text-text-muted border-border-subtle';
  };

  return (
    <aside
      className={`my-8 p-6 rounded-card bg-gradient-to-br from-space-900 to-space-850 border ${getAccentBorder()} transition-all duration-200 relative overflow-hidden shadow-orbital-glass group ${className}`}
      aria-label={`Contextual recommendation: ${cta.title}`}
      role="region"
    >
      {/* Decorative radial ambient blur */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-cosmic-cyan/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cosmic-cyan/10 transition-colors" />

      {/* Top Header & Disclosures */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${getBadgeStyle()}`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{cta.type}</span>
          </span>
          {cta.partner === 'digiformation' && (
            <span className="text-xs font-mono text-cosmic-cyan font-semibold">
              &bull; DigiFormation
            </span>
          )}
          {cta.partner === 'digibizos' && (
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              &bull; Digi Biz OS
            </span>
          )}
        </div>

        {/* Transparent Commercial Disclosure */}
        {cta.disclosure && (
          <span className="text-[11px] font-mono text-text-muted italic max-w-xs text-right">
            {cta.disclosure}
          </span>
        )}
      </div>

      {/* CTA Headline */}
      <h3 className="text-lg sm:text-xl font-heading font-bold text-text-primary mb-2 flex items-center gap-2">
        <span>{cta.title}</span>
      </h3>

      {/* CTA Description */}
      <p className="text-sm text-text-secondary leading-relaxed mb-5 max-w-2xl">
        {cta.description}
      </p>

      {/* Action Button & Verification Notice */}
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={cta.destinationUrl}
          target={isCommercial ? '_blank' : '_self'}
          rel={isCommercial ? 'noopener noreferrer' : undefined}
          onClick={handleClick}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cosmic-cyan ${
            cta.partner === 'digibizos'
              ? 'bg-emerald-500 hover:bg-emerald-400 text-space-950 font-bold shadow-glow-emerald'
              : 'bg-cosmic-cyan hover:bg-cosmic-cyan/90 text-space-950 font-bold shadow-glow-cyan'
          }`}
          aria-label={`${cta.buttonLabel} (opens ${isCommercial ? 'official partner destination in new tab' : 'resource'})`}
        >
          <span>{cta.buttonLabel}</span>
          {isCommercial ? (
            <ExternalLink className="w-3.5 h-3.5" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5" />
          )}
        </a>

        <span className="text-xs font-mono text-text-muted flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-cosmic-teal" />
          <span>
            {isCommercial
              ? 'Verified Official Destination \u2022 Verified Partner'
              : '100% Free Open-Source Resource'}
          </span>
        </span>
      </div>
    </aside>
  );
}
