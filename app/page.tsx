import { Experience } from 'components/@index/experience';
import { Hero } from 'components/@index/hero';
import { Music } from 'components/@index/music';
import { Photography } from 'components/@index/photography';

const HomePage = () => {
  return (
    <main className="mx-auto max-w-3xl overflow-x-hidden px-6">
      <Hero />
      <Music />
      <Photography />
      <Experience />
      <section id="travel" className="py-24">
        <div className="mb-4 flex items-baseline gap-3">
          <span className="font-serif text-sm text-stone-400">4</span>
          <h2 className="font-serif text-3xl text-stone-900">Travel</h2>
        </div>
        <p className="text-stone-500">Coming soon.</p>
      </section>
    </main>
  );
};

export default HomePage;
