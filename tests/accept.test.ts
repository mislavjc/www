import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { appendVaryAccept, notAcceptableBody, preferredType } from 'lib/accept';

describe('preferredType', () => {
  it('defaults to HTML when no Accept header is sent', () => {
    assert.equal(preferredType(null), 'text/html');
    assert.equal(preferredType(''), 'text/html');
  });

  it('defaults to HTML for a full wildcard', () => {
    assert.equal(preferredType('*/*'), 'text/html');
  });

  it('serves Markdown when it is asked for explicitly', () => {
    assert.equal(preferredType('text/markdown'), 'text/markdown');
    assert.equal(
      preferredType('text/markdown, text/html;q=0.9'),
      'text/markdown',
    );
  });

  it('serves HTML to a browser', () => {
    assert.equal(
      preferredType(
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      ),
      'text/html',
    );
  });

  it('ranks by q-value rather than by position', () => {
    assert.equal(
      preferredType('text/markdown;q=0.5, text/html;q=0.9'),
      'text/html',
    );
    assert.equal(
      preferredType('text/html;q=0.5, text/markdown;q=0.9'),
      'text/markdown',
    );
  });

  it('breaks q-value ties on client order', () => {
    assert.equal(
      preferredType('text/markdown, text/html, */*'),
      'text/markdown',
    );
    assert.equal(preferredType('text/html, text/markdown'), 'text/html');
  });

  it('honours q=0 as an explicit rejection', () => {
    assert.equal(
      preferredType('text/html;q=0, text/markdown'),
      'text/markdown',
    );
    assert.equal(preferredType('text/markdown;q=0, text/html'), 'text/html');
  });

  it('lets a specific range override a wildcard regardless of q', () => {
    // RFC 9110 §12.5.1: the more specific range wins, so HTML stays rejected.
    assert.equal(preferredType('text/html;q=0, */*;q=1'), 'text/markdown');
  });

  it('matches subtype wildcards', () => {
    assert.equal(preferredType('text/*'), 'text/html');
    assert.equal(preferredType('text/html;q=0, text/*'), 'text/markdown');
  });

  it('returns null only when nothing we produce is acceptable', () => {
    assert.equal(preferredType('application/pdf'), null);
    assert.equal(preferredType('image/png'), null);
    assert.equal(preferredType('text/markdown;q=0, text/html;q=0'), null);
    assert.equal(preferredType('*/*;q=0'), null);
  });

  it('ignores an unparseable q parameter instead of dropping the entry', () => {
    assert.equal(preferredType('text/markdown;q=banana'), 'text/markdown');
  });

  it('is case-insensitive on the media type', () => {
    assert.equal(preferredType('TEXT/MARKDOWN'), 'text/markdown');
  });
});

describe('appendVaryAccept', () => {
  it('sets Vary when absent', () => {
    const headers = new Headers();
    appendVaryAccept(headers);
    assert.equal(headers.get('Vary'), 'Accept');
  });

  it('appends without clobbering existing tokens', () => {
    const headers = new Headers({ Vary: 'Accept-Encoding, RSC' });
    appendVaryAccept(headers);
    assert.equal(headers.get('Vary'), 'Accept-Encoding, RSC, Accept');
  });

  it('does not duplicate Accept', () => {
    const headers = new Headers({ Vary: 'accept, Accept-Encoding' });
    appendVaryAccept(headers);
    assert.equal(headers.get('Vary'), 'accept, Accept-Encoding');
  });
});

describe('notAcceptableBody', () => {
  it('lists every representation and echoes the request', () => {
    const body = notAcceptableBody('application/pdf');
    assert.match(body, /text\/html/);
    assert.match(body, /text\/markdown/);
    assert.match(body, /You requested: application\/pdf/);
  });
});
