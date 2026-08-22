import { buildMarkdown, notFoundMarkdown } from 'lib/markdown';
import { MARKDOWN_ROUTES } from 'lib/site';

// The four known bodies are fixed at build time, so prerender them — these are
// the URLs agents actually fetch. Unknown paths still fall through to the
// handler for the Markdown 404.
export function generateStaticParams() {
  return MARKDOWN_ROUTES.map((route) => ({
    slug: route === '/' ? [] : route.slice(1).split('/'),
  }));
}

const markdownHeaders = {
  'Content-Type': 'text/markdown; charset=utf-8',
  Vary: 'Accept',
  'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
};

/**
 * Serves the Markdown representation of a page. Reached only through the
 * rewrite in middleware.ts — either from `Accept: text/markdown` on the
 * canonical URL, or from the explicit `<path>.md` sibling.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;
  const pathname = `/${slug.join('/')}`;

  const body = buildMarkdown(pathname);

  if (body === null) {
    return new Response(notFoundMarkdown(pathname), {
      status: 404,
      headers: { ...markdownHeaders, 'Cache-Control': 'no-store' },
    });
  }

  return new Response(body, { headers: markdownHeaders });
}
