import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { concerts } from 'lib/data';
import { buildLlmsTxt } from 'lib/llms';
import { buildMarkdown, notFoundMarkdown } from 'lib/markdown';
import { DOCS } from 'lib/pages';
import {
  MARKDOWN_ROUTES,
  markdownPath,
  normalizeMarkdownPath,
  SITE_EMAIL,
  SITE_URL,
} from 'lib/site';
import { musicContent, travelContent } from 'lib/site-content';

describe('normalizeMarkdownPath', () => {
  it('strips the .md suffix', () => {
    assert.equal(normalizeMarkdownPath('/about.md'), '/about');
  });

  it('strips trailing slashes', () => {
    assert.equal(normalizeMarkdownPath('/about/'), '/about');
    assert.equal(normalizeMarkdownPath('/'), '/');
  });

  it('maps the index aliases to the homepage', () => {
    assert.equal(normalizeMarkdownPath('/index.md'), '/');
    assert.equal(normalizeMarkdownPath(''), '/');
  });
});

describe('buildMarkdown', () => {
  for (const route of MARKDOWN_ROUTES) {
    it(`renders ${route} with a single H1 and real content`, () => {
      const body = buildMarkdown(route);
      assert.ok(body, `expected Markdown for ${route}`);

      const h1s = body.split('\n').filter((line) => line.startsWith('# '));
      assert.equal(h1s.length, 1, 'exactly one H1');

      assert.ok(body.includes('\n## '), 'has at least one H2');
      // The audit's trust-anchor threshold.
      assert.ok(body.length > 500, `expected 500+ chars, got ${body.length}`);
      assert.ok(body.endsWith('\n'), 'ends with a newline');
    });

    it(`renders ${route} the same way for its .md sibling`, () => {
      assert.equal(buildMarkdown(markdownPath(route)), buildMarkdown(route));
    });
  }

  it('returns null for unknown paths', () => {
    assert.equal(buildMarkdown('/nope'), null);
    assert.equal(buildMarkdown('/about/deeper'), null);
  });

  it('carries the homepage prose so HTML and Markdown cannot drift', () => {
    const body = buildMarkdown('/');
    assert.ok(body?.includes(musicContent.intro));
    assert.ok(body?.includes(travelContent.berlin));
  });

  it('lists the most recent concerts newest-first', () => {
    const body = buildMarkdown('/') ?? '';
    const newest = concerts[0];
    assert.ok(body.includes(`${newest.date} — ${newest.artist}`));
  });

  it('renders every doc block kind', () => {
    for (const doc of DOCS) {
      const body = buildMarkdown(doc.path) ?? '';
      assert.ok(body.startsWith(`# ${doc.title}`));
      assert.ok(body.includes(`> ${doc.summary}`));

      for (const block of doc.blocks) {
        if (block.kind === 'heading') {
          assert.ok(body.includes(`## ${block.text}`), block.text);
        }
        if (block.kind === 'paragraph') {
          assert.ok(body.includes(block.text), block.text.slice(0, 40));
        }
        if (block.kind === 'list') {
          for (const item of block.items) {
            assert.ok(body.includes(`- ${item}`), item.slice(0, 40));
          }
        }
        if (block.kind === 'links') {
          for (const link of block.items) {
            assert.ok(
              body.includes(`[${link.label}](${link.url})`),
              link.label,
            );
          }
        }
      }
    }
  });
});

describe('notFoundMarkdown', () => {
  const body = notFoundMarkdown('/does-not-exist');

  it('names the missing path', () => {
    assert.match(body, /\/does-not-exist/);
  });

  it('points agents at every page and entry point', () => {
    for (const route of MARKDOWN_ROUTES) {
      assert.ok(body.includes(route === '/' ? `(${SITE_URL})` : route), route);
    }
    assert.match(body, /llms\.txt/);
    assert.match(body, /sitemap\.xml/);
    assert.match(body, /robots\.txt/);
    assert.ok(body.includes(SITE_EMAIL));
  });
});

describe('buildLlmsTxt', () => {
  const body = buildLlmsTxt();

  it('opens with a single H1 followed by a blockquote summary', () => {
    const lines = body.split('\n');
    assert.equal(lines[0], '# Mislav');
    assert.ok(lines[2].startsWith('> '));
    assert.equal(
      lines.filter((line) => line.startsWith('# ')).length,
      1,
      'exactly one H1',
    );
  });

  it('includes a when-to-use section with concrete jobs', () => {
    assert.ok(body.includes('## When to use this site'));
    assert.match(body, /use this when/);
    assert.match(body, /Do not use this site/);
  });

  it('lists every page as an absolute Markdown URL', () => {
    for (const route of MARKDOWN_ROUTES) {
      const md = markdownPath(route);
      assert.ok(body.includes(`${SITE_URL}${md}`), md);
    }
  });

  it('lists developer resources and contact by name', () => {
    assert.match(body, /## Projects/);
    assert.ok(body.includes('stamped.today'));
    assert.ok(body.includes('github.com/mislavjc'));
    assert.ok(body.includes(SITE_EMAIL));
  });

  it('uses the llmstxt.org file-list format in H2 sections', () => {
    const listLines = body.split('\n').filter((line) => line.startsWith('- '));
    assert.ok(listLines.length > 5);
    for (const line of listLines) {
      assert.match(line, /^- \[[^\]]+\]\([^)]+\):/, line);
    }
  });
});
