// Markdown representations of the site's pages.
//
// Built from the same modules the HTML renders from (lib/site-content,
// lib/data, lib/countries) so the two representations of a URL stay in sync.

import { VISITED_COUNTRY_COUNT } from 'lib/countries';
import { concerts, currentLocation, projects } from 'lib/data';
import type { Doc } from 'lib/pages';
import { aboutDoc, contactDoc, privacyDoc } from 'lib/pages';
import type { MarkdownRoute } from 'lib/site';
import {
  absoluteUrl,
  isMarkdownRoute,
  markdownUrl,
  normalizeMarkdownPath,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_JOB_TITLE,
  SITE_NAME,
  SITE_PAGES,
  SITE_SOCIALS,
  SITE_URL,
} from 'lib/site';
import {
  codeContent,
  heroContent,
  musicContent,
  photographyContent,
  travelContent,
} from 'lib/site-content';

const CONCERTS_IN_MARKDOWN = 12;

const joinBlocks = (blocks: string[]) =>
  `${blocks.filter(Boolean).join('\n\n').trim()}\n`;

const homeMarkdown = () => {
  const recent = concerts.slice(0, CONCERTS_IN_MARKDOWN);

  return joinBlocks([
    `# ${SITE_NAME} — ${heroContent.headline}`,
    `> ${SITE_DESCRIPTION}`,
    `${SITE_JOB_TITLE} based in ${currentLocation}, Croatia. This is a personal site — no product, no API, no sign-up. Canonical URL: ${SITE_URL}`,

    `## ${musicContent.heading}`,
    musicContent.intro,

    `### ${musicContent.concertsHeading}`,
    musicContent.concertsIntro,
    recent
      .map(
        (concert) =>
          `- ${concert.date} — ${concert.artist} (${concert.location})`,
      )
      .join('\n'),
    `Full list of ${concerts.length} shows is rendered on the page itself.`,

    `## ${photographyContent.heading}`,
    photographyContent.intro,
    photographyContent.subjects,
    `**${photographyContent.favoriteShotLabel}:** ${photographyContent.favoriteShot}`,
    `**${photographyContent.processLabel}:** ${photographyContent.process}`,
    `Full gallery: ${photographyContent.galleryUrl}`,

    `## ${codeContent.heading}`,
    codeContent.origin,
    codeContent.now,

    '### Projects',
    projects
      .map(
        (project) =>
          `- [${project.name}](${project.url}) — ${project.description}`,
      )
      .join('\n'),

    `## ${travelContent.heading}`,
    travelContent.intro,
    travelContent.berlin,
    travelContent.kumpir,
    `Countries visited so far: ${VISITED_COUNTRY_COUNT}.`,

    '## Contact',
    [
      `- Email: ${SITE_EMAIL}`,
      ...SITE_SOCIALS.map((social) => `- ${social.label}: ${social.url}`),
    ].join('\n'),
  ]);
};

const renderDoc = (doc: Doc) =>
  joinBlocks([
    `# ${doc.title}`,
    `> ${doc.summary}`,
    ...doc.blocks.map((block) => {
      switch (block.kind) {
        case 'heading':
          return `## ${block.text}`;
        case 'paragraph':
          return block.text;
        case 'list':
          return block.items.map((item) => `- ${item}`).join('\n');
        case 'links':
          return block.items
            .map(
              (link) =>
                `- [${link.label}](${link.url})${link.description ? ` — ${link.description}` : ''}`,
            )
            .join('\n');
      }
    }),
  ]);

// Keyed by MarkdownRoute, so adding a page to SITE_PAGES without a builder
// (or a builder without a page) is a compile error rather than a live 404.
const BUILDERS: Record<MarkdownRoute, () => string> = {
  '/': homeMarkdown,
  '/about': () => renderDoc(aboutDoc),
  '/contact': () => renderDoc(contactDoc),
  '/privacy': () => renderDoc(privacyDoc),
};

export const buildMarkdown = (pathname: string): string | null => {
  const path = normalizeMarkdownPath(pathname);
  return isMarkdownRoute(path) ? BUILDERS[path]() : null;
};

/**
 * The Markdown body for a 404. Agents that hit a dead URL get a map of the
 * site and the machine-readable entry points instead of a bare status code.
 */
export const notFoundMarkdown = (pathname: string) =>
  joinBlocks([
    '# 404 — Not found',
    `> \`${pathname}\` does not exist on ${SITE_URL}.`,

    'This site is small and every page is listed below. There is no archive, no pagination, and no search index to crawl — if a URL is not on this list, it has never existed.',

    '## Pages',
    SITE_PAGES.map(
      (page) =>
        `- [${page.label}](${absoluteUrl(page.path)}) — also available as Markdown at ${markdownUrl(page.path)}`,
    ).join('\n'),

    '## Machine-readable entry points',
    [
      `- [llms.txt](${SITE_URL}/llms.txt) — what this site is and when to use it`,
      `- [sitemap.xml](${SITE_URL}/sitemap.xml) — every canonical URL`,
      `- [robots.txt](${SITE_URL}/robots.txt) — crawl rules`,
    ].join('\n'),

    '## Where to look next',
    `Send \`Accept: text/markdown\` to any page URL to get its Markdown representation. For anything not covered here, email ${SITE_EMAIL}.`,
  ]);
