import type { Metadata } from 'next';
import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
import localFont from 'next/font/local';
import PlausibleProvider from 'next-plausible';

import { Footer } from 'components/footer';
import { Navigation } from 'components/navigation';
import { SpotifyIsland } from 'components/spotify-island';

import { cn } from 'lib/utils';

import './globals.css';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-serif',
});

const craftworkSans = localFont({
  src: '../public/fonts/CraftworkSans.ttf',
  variable: '--font-craftwork-sans',
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
  title: 'Mislav',
  description:
    'A love letter to music, photography, code, and the places in between.',
  metadataBase: new URL('https://mislavjc.com'),
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
        instrumentSans.variable,
        instrumentSerif.variable,
        craftworkSans.variable,
        craftworkGrotesk.variable,
      )}
    >
      <head>
        <PlausibleProvider domain="mislavjc.com" trackOutboundLinks />
      </head>
      <body className="bg-stone-50 font-sans text-stone-900 antialiased">
        <Navigation />
        {children}
        <Footer />
        <SpotifyIsland />
      </body>
    </html>
  );
}
