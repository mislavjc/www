import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { SAME_AS, siteJsonLd } from 'lib/json-ld';
import { SITE_HANDLE, SITE_NAME, SITE_SOCIALS, SITE_URL } from 'lib/site';

const nodes = siteJsonLd['@graph'] as ReadonlyArray<Record<string, unknown>>;
const byType = (type: string) => nodes.find((node) => node['@type'] === type);

describe('siteJsonLd', () => {
  it('is serialisable and declares a single @context', () => {
    assert.equal(siteJsonLd['@context'], 'https://schema.org');
    const parsed = JSON.parse(JSON.stringify(siteJsonLd));
    assert.deepEqual(parsed['@graph'].length, nodes.length);
  });

  it('describes the identity as a Person, not an Organization', () => {
    const person = byType('Person');
    assert.ok(person, 'Person node present');
    assert.equal(person.name, SITE_NAME);
    assert.equal(person.alternateName, SITE_HANDLE);
    assert.equal(person.url, SITE_URL);
    assert.ok(person.description, 'has a description');
  });

  it('links the WebSite and WebPage to the Person by @id', () => {
    const person = byType('Person');
    const website = byType('WebSite');
    const page = byType('WebPage');

    assert.ok(website && page);
    assert.deepEqual(website.publisher, { '@id': person!['@id'] });
    assert.deepEqual(page.isPartOf, { '@id': website['@id'] });
    assert.deepEqual(page.about, { '@id': person!['@id'] });
  });

  it('carries the handle as a WebSite alternateName for name queries', () => {
    const website = byType('WebSite');
    assert.ok(
      (website!.alternateName as string[]).includes(SITE_HANDLE),
      'handle is searchable as an alternate name',
    );
  });

  it('every @id it references is defined in the graph or is the site URL', () => {
    const defined = new Set(nodes.map((node) => node['@id']));
    defined.add(`${SITE_URL}/opengraph-image`);

    const refs: string[] = [];
    const walk = (value: unknown) => {
      if (Array.isArray(value)) return value.forEach(walk);
      if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const keys = Object.keys(record);
        if (keys.length === 1 && keys[0] === '@id') {
          refs.push(record['@id'] as string);
          return;
        }
        Object.values(record).forEach(walk);
      }
    };
    nodes.forEach(walk);

    assert.ok(refs.length > 0, 'graph actually cross-references');
    for (const ref of refs) {
      assert.ok(defined.has(ref), `dangling @id reference: ${ref}`);
    }
  });

  it('sameAs lists every social profile', () => {
    for (const social of SITE_SOCIALS) {
      assert.ok(SAME_AS.includes(social.url), social.label);
    }
    assert.equal(new Set(SAME_AS).size, SAME_AS.length, 'no duplicates');
  });
});
