import { Suspense } from 'react';

import { Experience } from 'components/@index/experience';
import { Hero } from 'components/@index/hero';
import { Music, TopArtistsSkeleton } from 'components/@index/music';
import { Photography } from 'components/@index/photography';
import { TopArtistsAsync } from 'components/@index/top-artists-async';
import { Travel } from 'components/@index/travel';

const HomePage = () => {
  return (
    <main id="main" className="mx-auto max-w-[620px] overflow-x-hidden px-6">
      <Hero />
      <Music>
        <Suspense fallback={<TopArtistsSkeleton />}>
          <TopArtistsAsync />
        </Suspense>
      </Music>
      <Photography />
      <Experience />
      <Travel />
    </main>
  );
};

export default HomePage;
