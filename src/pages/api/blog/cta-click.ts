import type { APIRoute } from 'astro';
import { ctaEngine } from '@/lib/blog/cta-engine';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { articleId, ctaId, destinationUrl, placementType } = body;

    if (!articleId || !ctaId || !destinationUrl) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing telemetry parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const event = ctaEngine.recordClick(
      articleId,
      ctaId,
      destinationUrl,
      placementType || 'inline'
    );

    return new Response(JSON.stringify({ success: true, event }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: 'Telemetry error', error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
