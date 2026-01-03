const { withPlausibleProxy } = require('next-plausible');

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = withPlausibleProxy()(nextConfig);
