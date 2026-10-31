import type { AnalyticsEventType } from '../../growth/schemas/index.js';

export function trackEvent(eventType: AnalyticsEventType, metadata?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  // Respect Do Not Track
  if (navigator.doNotTrack === '1' || (window as unknown as { doNotTrack?: string }).doNotTrack === '1') {
    return;
  }

  const payload = {
    eventType,
    url: window.location.pathname,
    referrer: document.referrer || undefined,
    metadata,
    clientHint: `${navigator.language}-${screen.width}x${screen.height}`,
  };

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/growth/analytics', JSON.stringify(payload));
    } else {
      fetch('/api/growth/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Non-fatal
      });
    }
  } catch {
    // Non-fatal analytics error
  }
}
