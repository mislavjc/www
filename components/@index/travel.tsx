import Image from 'next/image';

import { AsciiMap } from 'components/@index/ascii-map';

import { VISITED_COUNTRY_CODES, VISITED_COUNTRY_COUNT } from 'lib/countries';

// Deterministic rotation based on country code
function getStampRotation(code: string): number {
  const hash = code.charCodeAt(0) + code.charCodeAt(1) * 2 + code.charCodeAt(2);
  return ((hash % 20) - 10) * 1.2; // -12 to +12 degrees
}

// Calculate optimal columns to fit stamps within aspect ratio 88:125
function getColumnsForStampCount(stampCount: number): number {
  // Page aspect ratio is 88:125 (w:h), so height = width * 1.42
  // For N columns, each stamp is (1/N) of width, so stamp height is also (1/N) of width
  // Rows that fit = floor(height / stampSize) = floor(1.42 * N)
  // Capacity = N * floor(1.42 * N)
  // Find smallest N where capacity >= stampCount
  for (let cols = 3; cols <= 10; cols++) {
    const rows = Math.floor((125 / 88) * cols);
    if (cols * rows >= stampCount) return cols;
  }
  return 10;
}

function PassportPage({
  countries,
  columns,
}: {
  countries: string[];
  columns: number;
}) {
  const stampWidthPercent = 115 / columns; // Slightly larger than container allows for overlap

  return (
    <div
      className="flex flex-wrap content-start bg-[#f5f1e8] p-[2%]"
      style={{ aspectRatio: '88 / 125' }}
    >
      {countries.map((country, i) => (
        <div
          key={country}
          style={{
            width: `${stampWidthPercent}%`,
            marginRight: `-${15 / columns}%`,
            marginBottom: `-${12 / columns}%`,
            transform: `rotate(${getStampRotation(country)}deg)`,
            zIndex: i,
          }}
        >
          <Image
            src={`/api/stamp/${country.toLowerCase()}?width=90`}
            alt={`${country} stamp`}
            width={90}
            height={90}
            className="h-auto w-full"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}

function Passport() {
  const midPoint = Math.ceil(VISITED_COUNTRY_CODES.length / 2);
  const leftPage = VISITED_COUNTRY_CODES.slice(0, midPoint);
  const rightPage = VISITED_COUNTRY_CODES.slice(midPoint);

  // Calculate columns based on the page with more stamps
  const maxStampsPerPage = Math.max(leftPage.length, rightPage.length);
  const columns = getColumnsForStampCount(maxStampsPerPage);

  return (
    <div className="mt-10">
      <div className="mx-auto max-w-3xl">
        <div className="grid grid-cols-2">
          <PassportPage countries={leftPage} columns={columns} />
          <PassportPage countries={rightPage} columns={columns} />
        </div>
      </div>
    </div>
  );
}

export const Travel = () => {
  return (
    <section id="travel" className="py-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-stone-600">4</span>
        <h2 className="font-serif text-3xl text-stone-900">Travel</h2>
      </div>

      <p className="mb-8 max-w-xl text-stone-600">
        I don&apos;t know what it is but there&apos;s something freeing about
        being somewhere new. Doesn&apos;t have to be far either, even just
        crossing to Ljubljana does it. I just like wandering around with no
        plan, getting lost in neighborhoods. And this is weird but I love
        checking out stores in foreign countries. You learn so much about a
        place from them. The Spätis in Berlin where you grab a euro beer and sit
        by the river, bodegas in NYC, meal deals in the UK. Berlin is probably
        my favorite place in Europe. It&apos;s rough compared to somewhere like
        Hamburg, but every neighborhood feels like its own world. Kreuzberg,
        Prenzlauer Berg, completely different vibes. I keep going back partly
        for the city but honestly mostly for Heimweh. My friends are so tired of
        hearing about it but the kumpir there is unreal. The portion is massive,
        you need to show up starving and even then you might not finish it. Last
        time I went I was staying in Hamburg but took a Flixtrain just for a day
        trip. I&apos;d been at the bunker club until 5am, train was at 7, felt
        like a zombie until I got there. But that kumpir was the mission and it
        delivered. Trying to finish all 45 European countries by end of next
        year. 15 left, god bless Ryanair.
      </p>

      <AsciiMap />

      <div className="mt-4 text-sm text-stone-600">
        {VISITED_COUNTRY_COUNT} countries visited
      </div>

      <div className="mt-16">
        <h3 className="font-serif text-xl text-stone-900">Passport</h3>
        <p className="mt-2 text-stone-600">
          My passport is a mess but here&apos;s a cleaner version.
        </p>
      </div>

      <Passport />
    </section>
  );
};
