import { buildLlmsTxt } from 'lib/llms';

// The body is fixed at build time, so prerender it instead of booting a
// function on every CDN miss.
export const dynamic = 'force-static';

export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
