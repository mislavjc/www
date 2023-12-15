import Link from 'next/link';

import { InflatedWord } from './word';

export const Navigation = () => {
  return (
    <nav className="sticky top-2 z-10 w-full px-4">
      <div className="mx-auto my-8 flex max-w-screen-md items-center justify-between rounded-full bg-neutral-100 px-4 py-2">
        <Link href="/">
          <InflatedWord word="M" size="small" />
        </Link>
        <ul className="flex gap-4 text-neutral-900">
          <li>
            <Link href="/#about">About</Link>
          </li>
          <li>
            <Link href="/#experience">Experience</Link>
          </li>
          <li>
            <Link href="/#projects">Projects</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
