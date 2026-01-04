import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { getPhotos } from 'lib/photography';
import { PhotoSphere } from './photo-sphere';

const FAVORITE_PHOTO_UUID = '00000000-0000-761f-bbe1-9603a1134c4e';

const gear = [
  { name: 'Fuji X100VI', type: 'camera', acquired: '07/24' },
  { name: 'Fuji X-E5', type: 'camera', acquired: '11/25' },
  { name: 'Voigtlander 35mm f/1.2', type: 'lens', acquired: '11/25' },
  { name: 'Sigma 12mm f/1.4', type: 'lens', acquired: '12/25' },
  { name: 'TTArtisan 50mm f/1.2', type: 'lens', acquired: '12/25' },
];

// Pre-generated barcode heights to avoid hydration mismatch
const barcodeHeights = [
  68, 81, 67, 61, 94, 82, 94, 96, 78, 74, 94, 82, 62, 69, 84, 80, 88, 90, 98,
  90,
];

const PhotoSphereContent = async () => {
  const allPhotos = await getPhotos();

  // Get photos sorted by date (newest first), take 100 for the sphere
  const photos = allPhotos
    .filter((p) => p.exif.dateTime)
    .sort(
      (a, b) =>
        new Date(b.exif.dateTime!).getTime() -
        new Date(a.exif.dateTime!).getTime(),
    )
    .slice(0, 80)
    .map((p) => ({
      uuid: p.uuid,
      w: p.w,
      h: p.h,
      exif: p.exif,
    }));

  return <PhotoSphere photos={photos} />;
};

const PhotoSphereLoading = () => (
  <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-stone-900 md:aspect-[4/3]">
    <div className="font-mono text-xs text-stone-500">Loading sphere...</div>
  </div>
);

// Camera Store Receipt - worn and crumpled
const GearReceipt = () => {
  return (
    <div className="relative mx-auto max-w-xs">
      {/* Paper texture and wear effects */}
      <div
        className="relative bg-[#f5f2eb] px-5 py-6 font-mono text-xs"
        style={{
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.03)',
          background:
            'linear-gradient(180deg, #f5f2eb 0%, #ebe7df 50%, #f5f2eb 100%)',
        }}
      >
        {/* Torn top edge */}
        <div
          className="absolute -top-1 left-0 right-0 h-3 bg-[#f5f2eb]"
          style={{
            clipPath:
              'polygon(0% 100%, 2% 60%, 5% 100%, 8% 70%, 12% 100%, 15% 50%, 18% 100%, 22% 80%, 25% 100%, 28% 60%, 32% 100%, 35% 70%, 38% 100%, 42% 55%, 45% 100%, 48% 75%, 52% 100%, 55% 60%, 58% 100%, 62% 80%, 65% 100%, 68% 50%, 72% 100%, 75% 70%, 78% 100%, 82% 65%, 85% 100%, 88% 75%, 92% 100%, 95% 60%, 98% 100%, 100% 70%, 100% 100%)',
          }}
        />

        {/* Faded/smudged areas */}
        <div className="absolute right-4 top-12 h-8 w-16 rounded-full bg-white/40 blur-sm" />
        <div className="absolute bottom-20 left-6 h-6 w-12 rounded-full bg-stone-200/30 blur-sm" />

        {/* Store header */}
        <div className="relative mb-4 border-b border-dashed border-stone-300/70 pb-4 text-center">
          <div
            className="text-sm font-bold tracking-wide text-stone-700"
            style={{ letterSpacing: '0.15em' }}
          >
            CAMERA SHOP
          </div>
          <div className="mt-1 text-[10px] text-stone-400">EST. 2024</div>
          <div className="mt-2 text-[10px] leading-relaxed text-stone-400">
            123 FUJI STREET
            <br />
            TOKYO, JAPAN
          </div>
          <div className="mt-2 text-[10px] text-stone-400">
            TEL: 03-XXXX-XXXX
          </div>
        </div>

        {/* Date/time */}
        <div className="mb-3 flex justify-between text-[10px] text-stone-400">
          <span>DATE: 12/25/25</span>
          <span>14:32</span>
        </div>

        {/* Items */}
        <div className="mb-4 space-y-1.5">
          {gear.map((item) => (
            <div
              key={item.name}
              className="flex justify-between gap-2 text-stone-600"
            >
              <div className="flex-1 truncate">{item.name}</div>
              <div className="shrink-0 text-stone-400">{item.acquired}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-stone-300/70 pt-2 text-stone-400">
          <div className="flex justify-between">
            <span>ITEMS:</span>
            <span>{gear.length}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-dashed border-stone-300/70 pt-4 text-center">
          <div className="text-[10px] text-stone-400">
            THANK YOU FOR YOUR PURCHASE
          </div>
          <div className="mt-0.5 text-[10px] text-stone-400">
            NO REFUNDS ON USED GEAR
          </div>

          {/* Barcode - using pre-generated heights to avoid hydration mismatch */}
          <div className="mx-auto mt-4 flex h-8 w-32 items-end justify-center gap-px">
            {[2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2].map(
              (w, i) => (
                <div
                  key={`bar-${i}-${w}`}
                  className="bg-stone-600"
                  style={{ width: w, height: `${barcodeHeights[i]}%` }}
                />
              ),
            )}
          </div>
          <div className="mt-1 text-[8px] tracking-widest text-stone-400">
            0247 8392 1056
          </div>
        </div>

        {/* Crease lines */}
        <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-stone-300/20" />
        <div className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-stone-300/30" />

        {/* Torn bottom edge */}
        <div
          className="absolute -bottom-1 left-0 right-0 h-3 bg-[#f5f2eb]"
          style={{
            clipPath:
              'polygon(0% 0%, 3% 40%, 6% 0%, 10% 50%, 13% 0%, 17% 30%, 20% 0%, 24% 45%, 27% 0%, 31% 35%, 34% 0%, 38% 50%, 41% 0%, 45% 40%, 48% 0%, 52% 30%, 55% 0%, 59% 45%, 62% 0%, 66% 35%, 69% 0%, 73% 50%, 76% 0%, 80% 40%, 83% 0%, 87% 35%, 90% 0%, 94% 45%, 97% 0%, 100% 30%, 100% 0%)',
          }}
        />
      </div>

      {/* Shadow underneath */}
      <div
        className="absolute -bottom-2 left-2 right-2 h-4 rounded-full bg-black/5 blur-md"
        style={{ transform: 'rotateX(60deg)' }}
      />
    </div>
  );
};

export const Photography = () => {
  return (
    <section id="photography" className="py-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-stone-400">2</span>
        <h2 className="font-serif text-3xl text-stone-900">Lens</h2>
      </div>

      <p className="mb-8 max-w-xl text-stone-600">
        I was going to a conference in SF so I stopped over in NYC for 8 days.
        Ended up way more excited about the stopover than the actual trip. First
        time with my camera, running around Central Park like a kid. I don't
        plan shots, I just shoot. Framing something good brings instant
        dopamine. Headphones in, music on, just walking and looking.
      </p>

      <p className="mb-12 max-w-xl text-stone-600">
        I mostly shoot architecture and street. People stress me out. It's the
        pressure of getting it right, you know? I'd love to get into portraits
        eventually but not there yet.
      </p>

      {/* Favorite photo with story */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
        <div className="relative w-full md:w-1/2">
          <Image
            src={`https://r2.photography.mislavjc.com/variants/grid/avif/640/${FAVORITE_PHOTO_UUID}.avif`}
            alt="Rio de Janeiro at sunset"
            width={640}
            height={960}
            className="h-auto w-full"
          />
        </div>
        <div className="flex-1">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-stone-400">
            Favorite shot
          </p>
          <p className="text-stone-600">
            Rio, January 2025. I only stayed one night because I was scared of
            being there alone. My friend stayed in Paraguay and I flew back
            solo. Immediately regretted it. Turned out Rio is amazing and I
            should've stayed longer. Would love to go back.
          </p>
        </div>
      </div>

      {/* Photo Sphere */}
      <div className="mb-8">
        <Suspense fallback={<PhotoSphereLoading />}>
          <PhotoSphereContent />
        </Suspense>
        <div className="mt-4 text-center">
          <Link
            href="https://photography.mislavjc.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-stone-400 underline underline-offset-4 hover:text-stone-600"
          >
            VIEW FULL GALLERY →
          </Link>
        </div>
      </div>

      {/* Process note - styled like film canister label */}
      <div className="mb-12 border border-stone-200 bg-stone-50 p-4">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-stone-400">
          Process Notes
        </div>
        <p className="text-sm text-stone-600">
          SOOC (straight out of camera) using Fuji film simulation recipes.
          Started with Portra 160, now mostly shooting Portra do Sol. Committing
          to the image in-camera, no post-processing.
        </p>
      </div>

      {/* Gear */}
      <div>
        <GearReceipt />
      </div>
    </section>
  );
};
