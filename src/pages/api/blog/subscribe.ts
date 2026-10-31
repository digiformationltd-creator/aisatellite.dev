import type { APIRoute } from 'astro';
import { blogDatabase } from '@/lib/blog/database';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, consentGiven, privacyPolicyAccepted, topicPreferences } = body;

    if (!email || !consentGiven || !privacyPolicyAccepted) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Valid email address and explicit consent agreement are required.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = blogDatabase.addSubscriber(
      email,
      Boolean(consentGiven),
      Boolean(privacyPolicyAccepted),
      topicPreferences || ['All Technology & Business']
    );

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal error processing newsletter subscription.',
        error: err.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
