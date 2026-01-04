import { Experience } from 'components/@index/experience';
import { Hero } from 'components/@index/hero';
import { Music } from 'components/@index/music';
import { Photography } from 'components/@index/photography';

import { getTopArtists } from 'lib/spotify';

const HomePage = async () => {
  const topArtists = await getTopArtists();

  return (
    <main className="mx-auto max-w-3xl overflow-x-hidden px-6">
      <Hero />
      <Music topArtists={topArtists} />
      <Photography />
      <Experience />
      <section id="travel" className="py-24">
        <div className="mb-4 flex items-baseline gap-3">
          <span className="font-serif text-sm text-stone-500">4</span>
          <h2 className="font-serif text-3xl text-stone-900">Travel</h2>
        </div>
        <p className="text-stone-500">Coming soon.</p>
      </section>
    </main>
  );
};

export default HomePage;
