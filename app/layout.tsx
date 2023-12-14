import type { Metadata } from 'next';
import localFont from 'next/font/local';

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
      <body className="bg-neutral-50">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
