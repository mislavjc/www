import type { NextConfig } from 'next';
import { withPlausibleProxy } from 'next-plausible';

import { MARKDOWN_ROUTES } from './lib/site';

// Next appends its own RSC tokens to Vary, but a headers() rule replaces the
// key outright, so they have to be repeated here. Copied from Next 16's
// base-server.ts setVaryHeader — recheck on a major Next upgrade.
const VARY_ACCEPT =
  'Accept, RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Accept-Encoding';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'r2.photography.mislavjc.com',
      },
    ],
  },
  experimental: {
    useCache: true,
  },
  // Markdown content negotiation (acceptmarkdown.com): the CDN must key the
  // cache on Accept, or an agent asking for Markdown can be served a cached
  // HTML variant. Next's own server overwrites `Vary` on rendered pages, so
  // this is declared here and applied by the edge, above the Next server.
  // The RSC tokens are repeated because a header rule replaces the key.
  async headers() {
    return MARKDOWN_ROUTES.map((route) => ({
      source: route,
      headers: [{ key: 'Vary', value: VARY_ACCEPT }],
    }));
  },
};

export default withPlausibleProxy({
  src: 'https://plausible.io/js/pa-rQLYFqZpljnfroAtP9FyS.js',
})(nextConfig);
