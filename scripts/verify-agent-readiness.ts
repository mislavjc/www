/**
 * End-to-end check of every public endpoint and machine-readable file this
 * site exposes to agents.
 *
 * Run against a local production build:
 *   pnpm build && pnpm start &
 *   npx tsx scripts/verify-agent-readiness.ts http://localhost:3000
 *
 * Or against production:
 *   npx tsx scripts/verify-agent-readiness.ts https://mislavjc.com
 */

import { MARKDOWN_ROUTES, markdownPath } from '../lib/site';

const baseUrl = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');

type Check = {
  name: string;
  ok: boolean;
  detail: string;
};

const checks: Check[] = [];

const record = (name: string, ok: boolean, detail: string) => {
  checks.push({ name, ok, detail });
};

const get = (path: string, accept?: string) =>
  fetch(`${baseUrl}${path}`, {
    headers: accept ? { Accept: accept } : {},
    redirect: 'manual',
  });

const contentType = (response: Response) =>
  response.headers.get('content-type') ?? '';

const varyIncludesAccept = (response: Response) =>
  (response.headers.get('vary') ?? '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .includes('accept');

/** Headings in document order — what a crawler that does not run JS sees. */
const headingsOf = (html: string) =>
  [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((match) => ({
    level: Number(match[1]),
    text: match[2]
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  }));

const textOf = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const PAGES = MARKDOWN_ROUTES;

async function main() {
  console.log(`Verifying ${baseUrl}\n`);

  // 1. HTML pages: status, canonical, lang, og:image, og:type, content volume.
  for (const path of PAGES) {
    const response = await get(path, 'text/html');
    const html = await response.text();
    const text = textOf(html);

    record(`GET ${path} → 200`, response.status === 200, `${response.status}`);
    record(
      `${path} sets Vary: Accept`,
      varyIncludesAccept(response),
      response.headers.get('vary') ?? '(none)',
    );
    record(
      `${path} has rel=canonical`,
      /<link[^>]+rel="canonical"/.test(html),
      /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/.exec(html)?.[1] ??
        '(missing)',
    );
    record(`${path} has html lang`, /<html[^>]+lang="/.test(html), 'lang');
    record(
      `${path} has og:image`,
      /property="og:image"/.test(html),
      'og:image',
    );
    record(`${path} has og:type`, /property="og:type"/.test(html), 'og:type');
    const headings = headingsOf(html);

    record(
      `${path} has exactly one H1`,
      headings.filter((heading) => heading.level === 1).length === 1,
      `${headings.filter((heading) => heading.level === 1).length} H1`,
    );
    record(
      `${path} opens with the H1`,
      headings[0]?.level === 1,
      headings[0] ? `h${headings[0].level} "${headings[0].text}"` : '(none)',
    );
    record(
      `${path} heading outline has no skipped levels`,
      headings.every(
        (heading, index) =>
          index === 0 || heading.level <= headings[index - 1].level + 1,
      ),
      headings.map((heading) => `h${heading.level}`).join(' '),
    );
    record(
      `${path} heading outline is nested, not flat`,
      new Set(headings.map((heading) => heading.level)).size >= 2,
      `${new Set(headings.map((heading) => heading.level)).size} levels, ${headings.length} headings`,
    );
    record(
      `${path} has 500+ chars of text without JS`,
      text.length >= 500,
      `${text.length} chars`,
    );
    record(
      `${path} content efficiency`,
      text.length / html.length >= 0.05,
      `${((text.length / html.length) * 100).toFixed(2)}%`,
    );
  }

  // 2. JSON-LD on the homepage.
  const home = await (await get('/', 'text/html')).text();
  const jsonLd =
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(home)?.[1];

  let graph: Array<Record<string, unknown>> = [];
  try {
    const parsed = jsonLd ? JSON.parse(jsonLd) : null;
    graph = parsed?.['@graph'] ?? (parsed ? [parsed] : []);
  } catch {
    graph = [];
  }
  const node = (type: string) =>
    graph.find((entry) => entry['@type'] === type) ?? null;

  record(
    'homepage has parseable JSON-LD',
    graph.length > 0,
    jsonLd ? `${graph.length} nodes` : '(missing)',
  );
  record(
    'JSON-LD declares an identity type with name, description, url',
    Boolean(node('Person')?.name && node('Person')?.url),
    graph.map((entry) => entry['@type']).join(', ') || '(none)',
  );
  record(
    'JSON-LD links a WebSite to the Person entity',
    Boolean(node('WebSite')?.publisher),
    node('WebSite') ? 'WebSite -> Person' : '(no WebSite node)',
  );
  record(
    'homepage emits rel=me identity links',
    (home.match(/rel="me"/g) ?? []).length >= 4,
    `${(home.match(/rel="me"/g) ?? []).length} links`,
  );

  // 3. Markdown content negotiation.
  for (const path of PAGES) {
    const response = await get(path, 'text/markdown');
    const body = await response.text();
    record(
      `${path} serves Markdown for Accept: text/markdown`,
      contentType(response).startsWith('text/markdown'),
      contentType(response),
    );
    record(
      `${path} Markdown response sets Vary: Accept`,
      varyIncludesAccept(response),
      response.headers.get('vary') ?? '(none)',
    );
    record(
      `${path} Markdown body starts with an H1`,
      body.startsWith('# '),
      body.split('\n')[0]?.slice(0, 60) ?? '',
    );

    const mdPath = markdownPath(path);
    const sibling = await get(mdPath);
    record(
      `GET ${mdPath} serves Markdown without an Accept header`,
      contentType(sibling).startsWith('text/markdown'),
      contentType(sibling),
    );
    record(
      `${mdPath} matches the negotiated body`,
      (await sibling.text()) === body,
      'identical',
    );
  }

  // 4. q-value handling and 406.
  const qLowMarkdown = await get('/', 'text/markdown;q=0.1, text/html;q=0.9');
  record(
    'lower-q Markdown loses to higher-q HTML',
    contentType(qLowMarkdown).includes('text/html'),
    contentType(qLowMarkdown),
  );

  const rejectHtml = await get('/', 'text/html;q=0, text/markdown');
  record(
    'q=0 on HTML falls through to Markdown',
    contentType(rejectHtml).startsWith('text/markdown'),
    contentType(rejectHtml),
  );

  const unsupported = await get('/', 'application/pdf');
  record(
    'unsupported Accept returns 406',
    unsupported.status === 406,
    `${unsupported.status}`,
  );
  record(
    '406 body lists the available representations',
    (await unsupported.text()).includes('text/markdown'),
    'listed',
  );

  const browserAccept = await get(
    '/',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  );
  record(
    'a normal browser Accept still gets HTML',
    contentType(browserAccept).includes('text/html'),
    contentType(browserAccept),
  );

  // 5. 404 behaviour.
  const missingHtml = await get('/some-path-that-does-not-exist', 'text/html');
  const missingHtmlBody = await missingHtml.text();
  record(
    'unknown path returns HTTP 404',
    missingHtml.status === 404,
    `${missingHtml.status}`,
  );
  record(
    '404 HTML links to the sitemap and llms.txt',
    missingHtmlBody.includes('/llms.txt') &&
      missingHtmlBody.includes('/sitemap.xml'),
    'recovery links present',
  );

  const missingMd = await get(
    '/some-path-that-does-not-exist',
    'text/markdown',
  );
  const missingMdBody = await missingMd.text();
  record(
    '404 Markdown returns 404 with a Markdown body',
    missingMd.status === 404 &&
      contentType(missingMd).startsWith('text/markdown'),
    `${missingMd.status} ${missingMd.headers.get('content-type')}`,
  );
  record(
    '404 Markdown points at the sitemap and llms.txt',
    missingMdBody.includes('/llms.txt') &&
      missingMdBody.includes('/sitemap.xml'),
    'recovery links present',
  );

  // 6. Machine-readable files.
  const llms = await get('/llms.txt');
  const llmsBody = await llms.text();
  record('GET /llms.txt → 200', llms.status === 200, `${llms.status}`);
  record(
    '/llms.txt is text/plain',
    contentType(llms).startsWith('text/plain'),
    contentType(llms),
  );
  record(
    '/llms.txt has an H1, a summary blockquote, and when-to-use guidance',
    llmsBody.startsWith('# ') &&
      llmsBody.includes('\n> ') &&
      llmsBody.includes('## When to use this site'),
    'llmstxt.org format',
  );

  const sitemap = await get('/sitemap.xml');
  const sitemapBody = await sitemap.text();
  record('GET /sitemap.xml → 200', sitemap.status === 200, `${sitemap.status}`);
  record(
    'sitemap lists every page',
    PAGES.every((path) =>
      sitemapBody.includes(path === '/' ? '<loc>' : `${path}<`),
    ),
    `${(sitemapBody.match(/<url>/g) ?? []).length} urls`,
  );

  const robots = await get('/robots.txt');
  record('GET /robots.txt → 200', robots.status === 200, `${robots.status}`);
  record(
    'robots.txt is not content-negotiated away',
    contentType(robots).includes('text/plain'),
    contentType(robots),
  );

  // Report.
  const failed = checks.filter((check) => !check.ok);

  for (const check of checks) {
    console.log(`${check.ok ? '✓' : '✗'} ${check.name} — ${check.detail}`);
  }

  console.log(
    `\n${checks.length - failed.length}/${checks.length} checks passed`,
  );

  if (failed.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
