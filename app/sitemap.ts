import type { MetadataRoute } from 'next';

import { absoluteUrl, MARKDOWN_ROUTES } from 'lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return MARKDOWN_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: route === '/' ? 1 : 0.6,
  }));
}
