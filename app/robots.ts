import type { MetadataRoute } from 'next';

import { absoluteUrl } from 'lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // /api/markdown is the rewrite target for Accept: text/markdown and for
      // the .md siblings; agents should crawl those canonical URLs instead.
      allow: '/',
      disallow: '/api/',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
