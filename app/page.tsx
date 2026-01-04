import { Experience } from 'components/@index/experience';
import { Hero } from 'components/@index/hero';
import { Music } from 'components/@index/music';
import { Photography } from 'components/@index/photography';
import { Travel } from 'components/@index/travel';

import { getTopArtists } from 'lib/spotify';

const HomePage = async () => {
  const topArtists = await getTopArtists();

  return (
    <main className="mx-auto max-w-3xl overflow-x-hidden px-6">
      <Hero />
      <Music topArtists={topArtists} />
      <Photography />
      <Experience />
      <Travel />
    </main>
  );
};

export default HomePage;
