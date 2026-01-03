import Link from 'next/link';

const photos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: `/images/placeholder-${i + 1}.jpg`,
  alt: `Photography ${i + 1}`,
}));

const gear = [
  {
    name: 'Fuji X100VI',
    description:
      'My everyday carry since July 2024. The camera that changed everything.',
  },
  {
    name: 'Fuji X-E5',
    description: 'Added to the kit in November 2025 for more flexibility.',
  },
  {
    name: 'Voigtlander 35mm f/1.2',
    description: 'The perfect street lens. Fast, sharp, character.',
  },
  {
    name: 'Sigma 12mm f/1.4',
    description: 'For architecture and wide perspectives.',
  },
  {
    name: 'TTArtisan 50mm f/1.2',
    description: 'Portraits and that classic look.',
  },
];

export const Photography = () => {
  return (
    <section id="photography" className="py-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-stone-400">2</span>
        <h2 className="font-serif text-3xl text-stone-900">Photography</h2>
      </div>

      <p className="mb-12 max-w-xl text-stone-600">
        I&apos;ve always gravitated towards photography. Back in middle school,
        I was already obsessed with image quality. In high school, I&apos;d
        flash custom ROMs on my Xiaomi Mi 9 and use Google Camera APKs just to
        squeeze out better photos. Then I finally said fuck it and bought the
        X100VI—best purchase of my life.
      </p>

      <div className="mb-16">
        <h3 className="mb-6 text-sm uppercase tracking-widest text-stone-400">
          Selected Work
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square overflow-hidden rounded-lg bg-stone-200"
            >
              {/* Placeholder - replace with actual images */}
              <div className="flex size-full items-center justify-center text-sm text-stone-400">
                {photo.id}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link
            href="https://photography.mislavjc.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-500 underline underline-offset-4 hover:text-stone-900"
          >
            View full portfolio
          </Link>
        </div>
      </div>

      <div className="mb-16">
        <h3 className="mb-6 text-sm uppercase tracking-widest text-stone-400">
          Process
        </h3>
        <p className="max-w-xl text-stone-600">
          I shoot SOOC (straight out of camera) using Fuji&apos;s film
          simulation recipes. Started with Portra 160, now mostly shooting
          Portra do Sol. There&apos;s something beautiful about committing to
          the image in-camera and not relying on post-processing.
        </p>
      </div>

      <div>
        <h3 className="mb-6 text-sm uppercase tracking-widest text-stone-400">
          Gear
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {gear.map((item) => (
            <div key={item.name} className="border-l-2 border-stone-200 pl-4">
              <p className="font-medium text-stone-900">{item.name}</p>
              <p className="text-sm text-stone-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
