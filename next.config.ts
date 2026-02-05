import type { NextConfig } from 'next';
import { withPlausibleProxy } from 'next-plausible';

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
};

export default withPlausibleProxy()(nextConfig);
