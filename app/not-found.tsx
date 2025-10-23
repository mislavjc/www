import Link from 'next/link';

import { Section } from 'components/section';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-screen-md px-6 py-32">
      <Section>
        <div className="space-y-8 text-center">
          <div>
            <h1 className="font-grotesk text-5xl font-black text-neutral-900 lg:text-7xl">
              404
            </h1>
            <h2 className="font-grotesk mt-4 text-2xl font-medium text-neutral-700 lg:text-3xl">
              Page not found
            </h2>
          </div>

          <p className="text-lg leading-relaxed text-neutral-600">
            The page you&apos;re looking for doesn&apos;t exist. It might have
            been moved or deleted.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white transition-all hover:bg-neutral-800"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
