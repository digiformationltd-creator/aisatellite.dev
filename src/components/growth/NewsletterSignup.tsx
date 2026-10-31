import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { trackEvent } from '../../lib/analytics.js';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid developer email address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate double opt-in client flow
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      trackEvent('newsletter_subscribe', { emailDomain: email.split('@')[1] });
    }, 500);
  };

  return (
    <div className="w-full orbital-glass border border-cosmic-cyan/25 rounded-2xl p-6 md:p-8 backdrop-blur-2xl shadow-orbital-glass relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-cosmic-cyan/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-cyan/10 border border-cosmic-cyan/30 text-cosmic-cyan text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Satellite Weekly Orbit</span>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
          Explore the Free Universe of AI, Open Source &amp; Development
        </h3>
        <p className="text-sm text-space-muted mt-2 max-w-lg mx-auto">
          Get a curated weekly dispatch of verified free tools, open-source releases, 3D Web Lab components, and autonomous agent workflows.
        </p>

        {isSuccess ? (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Almost there! Please check your inbox to confirm your double opt-in subscription.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-space-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-space-900 border border-cosmic-border rounded-xl text-sm text-white placeholder-space-muted focus:outline-none focus:border-cosmic-cyan transition"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-cosmic-cyan to-cosmic-purple text-space-900 font-bold rounded-xl text-sm hover:opacity-95 transition shadow-lg shadow-cosmic-cyan/20 shrink-0"
              >
                {isSubmitting ? 'Joining...' : 'Subscribe Free'}
              </button>
            </div>

            {errorMessage && <p className="text-xs text-rose-400 text-left">{errorMessage}</p>}

            <div className="flex items-center justify-center gap-2 text-[11px] text-space-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-cosmic-cyan shrink-0" />
              <span>Double opt-in required. Zero spam. Unsubscribe anytime in 1 click.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
