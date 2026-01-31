import type { Metadata } from 'next';
import { Instrument_Serif } from 'next/font/google';
import localFont from 'next/font/local';
import PlausibleProvider from 'next-plausible';

import { Footer } from 'components/footer';
import { Navigation } from 'components/navigation';
import { Providers } from 'components/providers';
import { SpotifyIsland } from 'components/spotify-island';

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
    default: 'Mislav',
    template: '%s | Mislav',
  },
  description:
    'A love letter to music, photography, code, and the places in between.',
  metadataBase: new URL('https://mislavjc.com'),
  keywords: [
    'Mislav',
    'software engineer',
    'photography',
    'travel',
    'music',
    'web development',
  ],
  authors: [{ name: 'Mislav', url: 'https://mislavjc.com' }],
  creator: 'Mislav',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mislavjc.com',
    siteName: 'Mislav',
    title: 'Mislav',
    description:
      'A love letter to music, photography, code, and the places in between.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mislav',
    description:
      'A love letter to music, photography, code, and the places in between.',
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
      suppressHydrationWarning
    >
      <PlausibleProvider domain="mislavjc.com" trackOutboundLinks>
        <body className="bg-stone-50 font-sans text-stone-900 antialiased">
          <Providers>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
            >
              Skip to content
            </a>
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
