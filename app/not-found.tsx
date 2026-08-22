'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { m } from 'motion/react';
import Link from 'next/link';

import { SITE_PAGES } from 'lib/site';
import { getRandomRotation, getStampDate } from 'lib/stamp';

const emptySubscribe = () => () => {};

// The HTML mirror of lib/markdown.ts's 404 body. Both derive their page list
// from SITE_PAGES, so adding a page updates the two representations together.
const RECOVERY_LINKS = [
  ...SITE_PAGES.map((page) => ({ href: page.path, label: page.label })),
  { href: '/llms.txt', label: 'llms.txt' },
  { href: '/sitemap.xml', label: 'Sitemap' },
];

export default function NotFound() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const rotation = useMemo(() => getRandomRotation(), []);

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <m.div
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{
          scale: mounted ? 1 : 0,
          rotate: mounted ? rotation : -20,
          opacity: mounted ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
        className="relative"
      >
        {/* Outer stamp border */}
        <div className="relative flex h-72 w-72 flex-col items-center justify-center rounded-lg border-4 border-red-700 p-6 sm:h-80 sm:w-80">
          {/* Inner decorative border */}
          <div className="absolute inset-2 rounded border-2 border-red-700/60" />

          {/* Top arc text */}
          <div className="absolute top-5 text-center">
            <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-red-700 sm:text-xs">
              IMMIGRATION CONTROL
            </span>
          </div>

          {/* Main content */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="text-center">
              <div className="font-mono text-5xl font-black text-red-700 sm:text-6xl">
                404
              </div>
              <div className="mt-1 font-mono text-lg font-bold tracking-wider text-red-700 sm:text-xl">
                ENTRY DENIED
              </div>
            </div>

            {/* Divider lines */}
            <div className="my-2 flex w-full items-center gap-2">
              <div className="h-0.5 flex-1 bg-red-700/40" />
              <div className="h-1.5 w-1.5 rotate-45 bg-red-700/60" />
              <div className="h-0.5 flex-1 bg-red-700/40" />
            </div>

            {/* Reason */}
            <div className="text-center">
              <div className="font-mono text-[10px] text-red-700/80 sm:text-xs">
                REASON
              </div>
              <div className="font-mono text-xs font-semibold text-red-700 sm:text-sm">
                PAGE NOT FOUND
              </div>
            </div>

            {/* Date */}
            <div className="mt-2 text-center">
              <div
                className="font-mono text-sm font-bold tracking-wider text-red-700 sm:text-base"
                suppressHydrationWarning
              >
                {getStampDate()}
              </div>
            </div>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-5 text-center">
            <span className="font-mono text-[10px] tracking-[0.2em] text-red-700/80 sm:text-xs">
              MISLAVJC.COM
            </span>
          </div>

          {/* Corner decorations */}
          <div className="absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-red-700/40" />
          <div className="absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-red-700/40" />
          <div className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-red-700/40" />
          <div className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-red-700/40" />
        </div>

        {/* Ink splatter effect - subtle imperfections */}
        <div className="absolute -right-2 top-1/4 h-1 w-1 rounded-full bg-red-700/30" />
        <div className="absolute -left-1 top-1/3 h-0.5 w-0.5 rounded-full bg-red-700/20" />
        <div className="absolute bottom-1/4 right-1/4 h-0.5 w-0.5 rounded-full bg-red-700/25" />
      </m.div>

      {/* Return home link */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-12"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-sm text-stone-600 outline-none transition-colors hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          <span className="font-serif text-lg">Return to valid territory</span>
        </Link>
      </m.div>

      {/* Recovery links, so an agent that lands here without JS still gets a
          route out. */}
      <nav
        aria-label="Where to go next"
        className="mt-10 max-w-md text-center text-sm text-stone-600"
      >
        <p className="mb-3">Every page on this site is listed below.</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {RECOVERY_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-sm underline underline-offset-4 outline-none transition-colors hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-stone-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
