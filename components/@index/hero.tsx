import Link from 'next/link';

import { currentLocation, getCurrentProject, getLastConcert } from 'lib/data';

export const Hero = () => {
  const lastConcert = getLastConcert();
  const currentProject = getCurrentProject();

  return (
    <section className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-balance font-serif text-4xl leading-tight text-stone-900 md:text-5xl lg:text-6xl">
        Building. Shooting. Moving.
      </h1>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-600">
        <p>
          <span className="text-stone-400">currently in</span> {currentLocation}
        </p>
        <span className="text-stone-300">·</span>
        <p>
          <span className="text-stone-400">building</span>{' '}
          <Link
            href={currentProject.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-stone-900"
          >
            {currentProject.name}
          </Link>
        </p>
        <span className="text-stone-300">·</span>
        <p>
          <span className="text-stone-400">last saw</span> {lastConcert.artist}{' '}
          in {lastConcert.location}
        </p>
      </div>
    </section>
  );
};
