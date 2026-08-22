import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { appendVaryAccept, notAcceptableBody, preferredType } from 'lib/accept';
import { isMarkdownRoute, markdownUrl } from 'lib/site';

/**
 * Served verbatim, never content-negotiated: anything with a file extension
 * other than `.md`. That covers /robots.txt, /sitemap.xml, /llms.txt, and
 * every static asset, without a list to keep in sync.
 */
const isVerbatim = (pathname: string) => {
  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
  return lastSegment.includes('.') && !lastSegment.endsWith('.md');
};

const rewriteToMarkdown = (request: NextRequest, targetPath: string) => {
  const url = request.nextUrl.clone();
  url.pathname = `/api/markdown${targetPath === '/' ? '' : targetPath}`;

  const response = NextResponse.rewrite(url);
  appendVaryAccept(response.headers);
  return response;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isVerbatim(pathname)) return NextResponse.next();

  // Next's own client-side navigation and prefetch requests. They are never
  // asking for Markdown, and a 406 here would break in-app navigation.
  if (request.headers.has('rsc')) return NextResponse.next();

  // An explicit `.md` URL always wins, regardless of Accept — crawlers
  // following the `Link: rel="alternate"` hint may send no Accept header.
  if (pathname.endsWith('.md')) {
    return rewriteToMarkdown(request, pathname);
  }

  const acceptHeader = request.headers.get('accept');
  const chosen = preferredType(acceptHeader);

  if (chosen === 'text/markdown') {
    return rewriteToMarkdown(request, pathname);
  }

  // The client ruled out every representation we can produce.
  if (chosen === null) {
    return new NextResponse(notAcceptableBody(acceptHeader), {
      status: 406,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        Vary: 'Accept',
      },
    });
  }

  // Rendered pages cannot carry `Vary: Accept`: Next's setVaryHeader replaces
  // the header after middleware runs, and a next.config headers() rule does
  // not survive it either (verified against production). It is not a
  // correctness problem — a Markdown request is rewritten to /api/markdown
  // before the cache is consulted, so the two representations occupy separate
  // CDN entries and cannot be served in place of one another. The Markdown
  // responses, which are route handlers, do set `Vary: Accept`.
  const response = NextResponse.next();
  appendVaryAccept(response.headers);

  if (isMarkdownRoute(pathname)) {
    response.headers.set(
      'Link',
      `<${markdownUrl(pathname)}>; rel="alternate"; type="text/markdown"`,
    );
  }

  return response;
}

export const config = {
  // Everything except Next internals and the API surface.
  matcher: ['/((?!api/|_next/|_vercel/).*)'],
};
