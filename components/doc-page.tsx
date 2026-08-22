import Link from 'next/link';

import type { Doc } from 'lib/pages';

/**
 * Renders a document from lib/pages.ts as HTML. The Markdown representation of
 * the same document is produced by lib/markdown.ts, so both stay in sync.
 */
export const DocPage = ({ doc }: { doc: Doc }) => {
  return (
    <main id="main" className="mx-auto max-w-[620px] px-6 py-32">
      <h1 className="text-balance font-serif text-4xl leading-tight text-stone-900 md:text-5xl">
        {doc.title}
      </h1>

      <p className="mt-6 max-w-xl text-lg text-stone-600">{doc.summary}</p>

      {doc.blocks.map((block, index) => {
        switch (block.kind) {
          case 'heading':
            return (
              <h2
                key={index}
                className="mt-12 mb-4 text-sm uppercase tracking-widest text-stone-600"
              >
                {block.text}
              </h2>
            );

          case 'paragraph':
            return (
              <p key={index} className="mb-4 max-w-xl text-stone-600">
                {block.text}
              </p>
            );

          case 'list':
            return (
              <ul
                key={index}
                className="mb-4 max-w-xl list-disc space-y-2 pl-5 text-stone-600 marker:text-stone-400"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );

          case 'links':
            return (
              <ul
                key={index}
                className="mb-4 max-w-xl space-y-2 text-stone-600"
              >
                {block.items.map((link) => {
                  const isExternal = link.url.startsWith('http');

                  return (
                    <li key={link.url}>
                      <Link
                        href={link.url}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="rounded-sm underline underline-offset-4 outline-none transition-colors hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-stone-400"
                      >
                        {link.label}
                      </Link>
                      {link.description ? (
                        <span className="text-stone-500">
                          {' '}
                          — {link.description}
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            );
        }
      })}

      <div className="mt-16 border-t border-stone-200 pt-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-sm text-stone-600 outline-none transition-colors hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-stone-400"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          <span className="font-serif text-lg">Back home</span>
        </Link>
      </div>
    </main>
  );
};
