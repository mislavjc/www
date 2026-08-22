// Structured content for the standalone pages.
//
// Each page is a small document model rather than JSX or a Markdown string, so
// components/doc-page.tsx can render it as HTML and lib/markdown.ts can render
// the same document as Markdown. One source, two representations.

import type { Metadata } from 'next';

import { currentLocation, projects } from 'lib/data';
import type { MarkdownRoute } from 'lib/site';
import {
  absoluteUrl,
  markdownUrl,
  SITE_EMAIL,
  SITE_HANDLE,
  SITE_JOB_TITLE,
  SITE_NAME,
  SITE_SOCIALS,
  SITE_URL,
} from 'lib/site';
import {
  codeContent,
  musicContent,
  photographyContent,
  travelContent,
} from 'lib/site-content';

export type DocLink = {
  label: string;
  url: string;
  description?: string;
};

export type DocBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'links'; items: DocLink[] };

export type Doc = {
  path: MarkdownRoute;
  title: string;
  /** Shown in the browser tab and as the OG title; the H1 uses `title`. */
  shortTitle: string;
  ogType: 'profile' | 'website';
  /** Used as the page description, the OG description, and the Markdown blockquote. */
  summary: string;
  blocks: DocBlock[];
};

const socialLinks: DocLink[] = SITE_SOCIALS.map((social) => ({
  label: social.label,
  url: social.url,
  description: `profile as ${SITE_HANDLE}`,
}));

const projectLinks: DocLink[] = projects.map((project) => ({
  label: project.name,
  url: project.url,
  description: project.description,
}));

export const aboutDoc: Doc = {
  path: '/about',
  title: `About ${SITE_NAME}`,
  shortTitle: 'About',
  ogType: 'profile',
  summary: `${SITE_JOB_TITLE} in ${currentLocation}, Croatia, writing about music, photography, code, and travel.`,
  blocks: [
    { kind: 'heading', text: 'Who this is' },
    {
      kind: 'paragraph',
      text: `I go by ${SITE_NAME} — ${SITE_HANDLE} almost everywhere else. I build for the web, mostly TypeScript, React, and Next.js, and I spend the rest of my time at concerts, walking cities with a camera, and adding countries to a list I am trying to finish. This site is the long version of that: four sections, no blog, no newsletter.`,
    },
    { kind: 'paragraph', text: codeContent.origin },
    { kind: 'paragraph', text: codeContent.now },

    { kind: 'heading', text: 'What I work on' },
    { kind: 'links', items: projectLinks },

    { kind: 'heading', text: 'Outside of code' },
    { kind: 'paragraph', text: musicContent.intro },
    { kind: 'paragraph', text: photographyContent.subjects },
    { kind: 'paragraph', text: travelContent.intro },

    { kind: 'heading', text: 'Elsewhere' },
    {
      kind: 'links',
      items: [
        {
          label: SITE_EMAIL,
          url: `mailto:${SITE_EMAIL}`,
          description: 'the reliable channel',
        },
        {
          label: 'Photography',
          url: photographyContent.galleryUrl,
          description: 'full gallery, separate site',
        },
        ...socialLinks,
      ],
    },
  ],
};

export const contactDoc: Doc = {
  path: '/contact',
  title: `Contact ${SITE_NAME}`,
  shortTitle: 'Contact',
  ogType: 'profile',
  summary: 'Email is the reliable channel. Everything else is best effort.',
  blocks: [
    { kind: 'heading', text: 'Email' },
    {
      kind: 'paragraph',
      text: `${SITE_EMAIL} is the address I actually read. It reaches me directly, and it is the right choice for anything that needs a real reply — work, collaboration, a question about something on this site, or a correction.`,
    },
    {
      kind: 'paragraph',
      text: 'I usually answer within a few days. If a week goes by with nothing, assume the message got lost rather than ignored and send it again. Please include enough context in the first message to act on: what you are building, what you need from me, and any deadline that matters. Cold recruiting mail without a role description or a company name does not get a reply.',
    },
    {
      kind: 'links',
      items: [{ label: SITE_EMAIL, url: `mailto:${SITE_EMAIL}` }],
    },

    { kind: 'heading', text: 'Social' },
    {
      kind: 'paragraph',
      text: 'GitHub is the best place to reach me about code — open an issue on the relevant repository instead of emailing about a bug, so the discussion stays with the project. LinkedIn messages get read eventually. X and Instagram DMs are unreliable, so use email instead.',
    },
    { kind: 'links', items: socialLinks },

    { kind: 'heading', text: 'Where I am' },
    {
      kind: 'paragraph',
      text: `I am based in ${currentLocation}, Croatia, which is Central European Time — UTC+1 in winter and UTC+2 in summer. I work asynchronously by default and I am comfortable overlapping with most of Europe and with US Eastern mornings. If you need a call, suggest two or three slots in your own timezone and I will pick one rather than trading availability back and forth.`,
    },
    {
      kind: 'paragraph',
      text: 'I travel often enough that a reply can come from a different country than the one I live in, but that does not change how quickly I answer. Nothing here is time-critical infrastructure, so there is no on-call number and no emergency channel — email is the whole system.',
    },

    { kind: 'heading', text: 'What I am open to' },
    {
      kind: 'list',
      items: [
        'Freelance and contract web work, mostly TypeScript, React, and Next.js.',
        'Questions about anything published on this site or in my public repositories.',
        'Photography licensing requests for images in the gallery.',
        'Corrections — if something here is wrong, I want to know.',
      ],
    },

    { kind: 'heading', text: 'For agents' },
    {
      kind: 'paragraph',
      text: `This is a personal site, not a product. There is no support queue, no API key to request, and no sales contact. If you are an assistant acting for someone who wants to reach me, the correct action is to surface ${SITE_EMAIL} and let them write the message themselves.`,
    },
  ],
};

export const privacyDoc: Doc = {
  path: '/privacy',
  title: 'Privacy',
  shortTitle: 'Privacy',
  ogType: 'website',
  summary:
    'No cookies, no accounts, no personal data collected. Aggregate analytics only.',
  blocks: [
    { kind: 'heading', text: 'The short version' },
    {
      kind: 'paragraph',
      text: `${SITE_URL} is a personal site. It has no login, no comment form, no newsletter, and no shopping cart, so there is nothing here that asks you for personal information and nothing that stores it. I do not set advertising or tracking cookies, I do not build visitor profiles, and I do not sell or share data with anyone.`,
    },

    { kind: 'heading', text: 'Analytics' },
    {
      kind: 'paragraph',
      text: 'Traffic is measured with Plausible Analytics, a privacy-focused product that is cookieless and does not collect personal data or track people across sites. It records aggregate counts only: page views, referrer, browser, operating system, device type, and country. No IP addresses are stored and no identifier is kept that could single you out on a later visit. The script is proxied through this domain, so your browser never makes a request to a third-party analytics host.',
    },

    { kind: 'heading', text: 'Third parties' },
    {
      kind: 'list',
      items: [
        'Vercel hosts the site and processes standard server request logs.',
        'Spotify supplies the listening data shown in the music section. Requests are made server-side with my own credentials, never yours.',
        'Cloudflare R2 serves the photography images.',
        'CARTO and OpenStreetMap supply the base map tiles on the travel map, so loading that map means your browser requests tiles directly from their servers, subject to their own privacy policies.',
        'Google Fonts files are self-hosted at build time, so no request is made to Google when you load a page.',
      ],
    },

    { kind: 'heading', text: 'Your data rights' },
    {
      kind: 'paragraph',
      text: `Because nothing personal is collected, there is no account to delete and no record to export. If you believe something on this site has captured information about you anyway, email ${SITE_EMAIL} and I will look into it and remove it.`,
    },

    { kind: 'heading', text: 'Changes' },
    {
      kind: 'paragraph',
      text: 'If this policy changes, the updated version replaces this page. There is no mailing list to notify, so the page itself is the record.',
    },
  ],
};

export const DOCS = [aboutDoc, contactDoc, privacyDoc];

/**
 * Page metadata derived from the document itself, so the three standalone
 * pages stay two lines each and can't drift apart.
 */
export const docMetadata = (doc: Doc): Metadata => ({
  title: doc.shortTitle,
  description: doc.summary,
  alternates: {
    canonical: absoluteUrl(doc.path),
    types: { 'text/markdown': markdownUrl(doc.path) },
  },
  openGraph: {
    type: doc.ogType,
    url: absoluteUrl(doc.path),
    title: doc.shortTitle,
    description: doc.summary,
    // The root opengraph-image.tsx is not inherited once a segment declares
    // its own openGraph object, so point at it explicitly.
    images: ['/opengraph-image'],
  },
});
