// Canonical identity for the site. Used by metadata, JSON-LD, llms.txt, and
// the Markdown representations so every surface agrees on one set of facts.
//
// Kept free of imports so middleware.ts can pull it into the edge bundle
// without dragging the content modules along.

export const SITE_URL = 'https://mislavjc.com';

export const SITE_NAME = 'Mislav';

export const SITE_HANDLE = 'mislavjc';

export const SITE_DESCRIPTION =
  'A love letter to music, photography, code, and the places in between.';

export const SITE_EMAIL = 'm@mislavjc.com';

export const SITE_JOB_TITLE = 'Software engineer';

export const SITE_SOCIALS = [
  { label: 'GitHub', icon: 'GH', url: 'https://github.com/mislavjc' },
  {
    label: 'LinkedIn',
    icon: 'LI',
    url: 'https://www.linkedin.com/in/mislavjc/',
  },
  { label: 'X', icon: 'X', url: 'https://x.com/mislavjc' },
  { label: 'Instagram', icon: 'IG', url: 'https://instagram.com/mislavjc' },
] as const;

/**
 * Every page on the site. These have both an HTML and a Markdown
 * representation: negotiable via `Accept: text/markdown` and reachable at the
 * `.md` sibling.
 *
 * This is the one list. The sitemap, the Markdown builders, both 404s, and
 * llms.txt all derive from it, and `MarkdownRoute` makes a missing builder a
 * compile error rather than a runtime 404.
 */
export const SITE_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
  { path: '/privacy', label: 'Privacy' },
] as const;

export type MarkdownRoute = (typeof SITE_PAGES)[number]['path'];

export const MARKDOWN_ROUTES: readonly MarkdownRoute[] = SITE_PAGES.map(
  (page) => page.path,
);

export const isMarkdownRoute = (pathname: string): pathname is MarkdownRoute =>
  (MARKDOWN_ROUTES as readonly string[]).includes(pathname);

export const absoluteUrl = (pathname: string) =>
  pathname === '/' ? SITE_URL : `${SITE_URL}${pathname}`;

/**
 * The Markdown sibling of a page. The homepage has no path segment to hang
 * `.md` off, so it gets `/index.md`.
 */
export const markdownPath = (route: string) =>
  route === '/' ? '/index.md' : `${route}.md`;

export const markdownUrl = (route: string) => absoluteUrl(markdownPath(route));

/** Inverse of `markdownPath`: `/about.md` and `/about/` both mean `/about`. */
export const normalizeMarkdownPath = (pathname: string): string => {
  let path = pathname;
  if (path.endsWith('.md')) path = path.slice(0, -3);
  if (path.length > 1 && path.endsWith('/')) path = path.replace(/\/+$/, '');
  if (path === '' || path === '/index') return '/';
  return path;
};
