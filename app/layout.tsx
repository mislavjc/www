import type { Metadata } from 'next';
import { Instrument_Serif } from 'next/font/google';
import localFont from 'next/font/local';
import PlausibleProvider from 'next-plausible';

import { Footer } from 'components/footer';
import { Navigation } from 'components/navigation';
import { Providers } from 'components/providers';
import { SpotifyIsland } from 'components/spotify-island';

import { SAME_AS, siteJsonLd } from 'lib/json-ld';
import {
  absoluteUrl,
  markdownUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from 'lib/site';
import { cn } from 'lib/utils';

import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-serif',
});

const craftworkSans = localFont({
  src: '../public/fonts/CraftworkSans.ttf',
  variable: '--font-sans',
  display: 'swap',
});

const craftworkGrotesk = localFont({
  src: [
    {
      path: '../public/fonts/CraftworkGrotesk-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/CraftworkGrotesk-Heavy.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-craftwork-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: absoluteUrl('/'),
    types: { 'text/markdown': markdownUrl('/') },
  },
  keywords: [
    'Mislav',
    'software engineer',
    'photography',
    'travel',
    'music',
    'web development',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'theme-color': '#fafaf9',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        instrumentSerif.variable,
        craftworkSans.variable,
        craftworkGrotesk.variable,
      )}
    >
      <PlausibleProvider>
        <body className="bg-stone-50 font-sans text-stone-900 antialiased">
          <Providers>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
            >
              Skip to content
            </a>
            <script
              type="application/ld+json"
              // Static, build-time JSON from lib/json-ld.ts — no user input.
              dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
            />
            {/* rel=me ties this domain to the same identity on each profile,
                the machine-readable half of a consistent-NAP claim. */}
            {SAME_AS.map((url) => (
              <link key={url} rel="me" href={url} />
            ))}
            <Navigation />
            {children}
            <Footer />
            <SpotifyIsland />
          </Providers>
        </body>
      </PlausibleProvider>
    </html>
  );
}
