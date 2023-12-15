import type { Metadata } from 'next';
import localFont from 'next/font/local';
import PlausibleProvider from 'next-plausible';

import { Footer } from 'components/footer';
import { Navigation } from 'components/navigation';

import { cn } from 'lib/utils';

import './globals.css';

const craftworksGrotesk = localFont({
  src: [
    {
      path: '../public/fonts/CraftworkGrotesk-Heavy.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/CraftworkGrotesk-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-craftwork-grotesk',
});

const craftworkSans = localFont({
  src: '../public/fonts/CraftworkSans.ttf',
  display: 'swap',
  variable: '--font-craftwork-sans',
});

export const metadata: Metadata = {
  title: 'Mislav | Frontend Engineer',
  description: "Frontend engineer with a passion for DX and UX.'",
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
      className={cn(craftworksGrotesk.variable, craftworkSans.variable)}
    >
      <head>
        <PlausibleProvider domain="mislavjc.com" trackOutboundLinks />
      </head>
      <body className="bg-neutral-50">
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
