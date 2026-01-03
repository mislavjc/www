'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

type TopArtist = {
  id: string;
  name: string;
  imageUrl: string;
  spotifyUrl: string;
  genres: string[];
};

// Concert data sorted by date (newest first)
const concerts = [
  {
    date: '2025-12-07',
    artist: 'Bladee',
    location: 'Vienna',
    artistId: '2xvtxDNInKDV4AvGmBWetG',
  },
  {
    date: '2025-12-01',
    artist: 'Snow Strippers',
    location: 'Brussels',
    artistId: '3kE3U3sGs4RVm2avqvEzNq',
  },
  {
    date: '2025-08-05',
    artist: 'Röyksopp',
    location: 'Šibenik',
    artistId: '2EcHDMlUfuFgXNVaXUyJGb',
  },
  {
    date: '2025-08-03',
    artist: 'The Hellp',
    location: 'Katowice',
    artistId: null,
  },
  {
    date: '2025-08-02',
    artist: 'Ecco2k / Have a Nice Life / Panchiko',
    location: 'Katowice',
    artistId: null,
  },
  {
    date: '2025-08-01',
    artist: 'Kraftwerk',
    location: 'Katowice',
    artistId: null,
  },
  {
    date: '2025-05-22',
    artist: '2hollis',
    location: 'Dublin',
    artistId: '5kHMfzgljJJCPiTDQzXKy9',
  },
  {
    date: '2025-01-25',
    artist: 'Röyksopp',
    location: 'Milano',
    artistId: '2EcHDMlUfuFgXNVaXUyJGb',
  },
  {
    date: '2025-01-22',
    artist: 'JPEGMAFIA',
    location: 'Milano',
    artistId: '6yJ6QQ3Y5l0s0tn7b0arrO',
  },
  {
    date: '2024-11-12',
    artist: 'Snow Strippers',
    location: 'Amsterdam',
    artistId: '3kE3U3sGs4RVm2avqvEzNq',
  },
  {
    date: '2024-10-21',
    artist: 'The Voidz',
    location: 'NYC',
    artistId: '1jvAieRxVqQAXRDBxW8AXV',
  },
  {
    date: '2024-10-17',
    artist: 'Bladee',
    location: 'NYC',
    artistId: '2xvtxDNInKDV4AvGmBWetG',
  },
  {
    date: '2024-10-15',
    artist: 'Xiu Xiu',
    location: 'NYC',
    artistId: '68fPEubPt6XDLrJKPp3lMh',
  },
];

// Vibrant, distinct colors for the stubs
const TICKET_COLORS = [
  'bg-[#FF4D4D]', // Bright Red
  'bg-[#4D79FF]', // Bright Blue
  'bg-[#FFB347]', // Pastel Orange
  'bg-[#B39DDB]', // Lavender
  'bg-[#80CBC4]', // Teal
  'bg-[#FFD700]', // Gold
];

const ConcertItem = ({
  concert,
  index,
  totalCount,
  onHover,
}: {
  concert: (typeof concerts)[0];
  index: number;
  totalCount: number;
  onHover: (artistId: string | null) => void;
}) => {
  // Cycle through colors based on index
  const stubColor = TICKET_COLORS[index % TICKET_COLORS.length];
  // Determine text color for stub (mostly black for these brighter colors)
  const stubTextColor = 'text-stone-900';

  // Messy pile rotation - varies more dramatically
  const rotationSeed = ((index * 7) % 11) - 5; // pseudo-random between -5 and 5
  const rotation = rotationSeed * 1.2;

  // Slight horizontal offset for messiness
  const xOffset = ((index * 13) % 21) - 10; // pseudo-random between -10 and 10

  // Format date to DD.MM.YY
  const formattedDate = new Date(concert.date)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .replace(/\//g, '.');

  return (
    <motion.li
      layout
      initial={{
        y: 400,
        opacity: 0,
        scale: 0.4,
        rotate: -30 + (index % 5) * 15,
        x: (index % 2 === 0 ? -1 : 1) * 100,
      }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: rotation,
        x: xOffset,
        transition: {
          type: 'spring',
          damping: 18,
          stiffness: 150,
          delay: index * 0.05,
        },
      }}
      exit={{
        y: 300,
        opacity: 0,
        scale: 0.6,
        transition: { duration: 0.25, delay: (totalCount - index) * 0.02 },
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        x: 0,
        zIndex: 50,
        transition: { type: 'spring', damping: 20, stiffness: 300 },
      }}
      className="group relative flex w-full list-none overflow-hidden rounded-sm shadow-lg"
      onMouseEnter={() => onHover(concert.artistId)}
      onMouseLeave={() => onHover(null)}
      style={{
        marginBottom: 12,
        zIndex: totalCount - index,
        transformOrigin: 'center center',
      }}
    >
      {/* Ticket "Stub" (Left Side) - Colored */}
      <div
        className={`relative flex w-20 shrink-0 flex-col items-center justify-center border-r-2 border-dashed ${stubColor} ${stubTextColor} py-3 text-center md:w-24 md:p-4`}
        style={{ borderColor: 'rgba(0,0,0,0.15)' }}
      >
        {/* Hole Punch Effect */}
        <div className="absolute left-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-stone-900/20 shadow-inner md:left-2 md:h-3 md:w-3" />

        <span className="font-grotesk text-xl font-black opacity-90 md:text-2xl">
          {formattedDate.split('.')[0]}
        </span>
        <span className="font-mono text-[0.65rem] font-bold uppercase opacity-80 md:text-xs">
          {new Date(concert.date).toLocaleString('en-US', { month: 'short' })}
        </span>
        <span className="mt-0.5 font-mono text-[0.5rem] opacity-60 md:mt-1 md:text-[0.6rem]">
          {formattedDate.split('.')[2]}
        </span>

        {/* Semi-circle cutout for stub effect */}
        <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#F5F5F0] shadow-inner" />
      </div>

      {/* Ticket Body (Right Side) */}
      <div className="relative flex flex-grow flex-col justify-between bg-[#F5F5F0] p-3 pl-5 md:p-4 md:pl-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col pr-2 md:pr-4">
            <span className="font-grotesk text-base font-black uppercase leading-none tracking-tight text-stone-900 md:text-xl">
              {concert.artist}
            </span>
            <span className="mt-1 font-serif text-xs italic text-stone-500 md:text-sm">
              {concert.location}
            </span>
          </div>
          {/* Vertical Barcode Strip */}
          <div className="hidden h-8 w-10 shrink-0 opacity-80 mix-blend-multiply md:block md:w-12">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, 
                  #1c1917 0px, #1c1917 1px, 
                  transparent 1px, transparent 3px, 
                  #1c1917 3px, #1c1917 5px, 
                  transparent 5px, transparent 6px, 
                  #1c1917 6px, #1c1917 9px, 
                  transparent 9px, transparent 11px)`,
              }}
            />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-stone-200 pt-1.5 font-mono text-[0.5rem] uppercase tracking-widest text-stone-400 md:mt-3 md:pt-2 md:text-[0.6rem]">
          <span className="font-bold text-stone-500">Admit One</span>
          <span className="hidden sm:inline">
            Sec {String.fromCharCode(65 + (index % 5))} / Row {index + 1}
          </span>
          <span>No {1000 + index * 42}</span>
        </div>

        {/* Paper Texture Overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </motion.li>
  );
};

type ArtistPreviewProps = {
  artistId: string | null;
};

type ArtistData = {
  imageUrl: string;
  name: string;
} | null;

const ArtistPreview = ({ artistId }: ArtistPreviewProps) => {
  const [artistData, setArtistData] = useState<ArtistData>(null);

  useEffect(() => {
    if (!artistId) {
      return;
    }

    let cancelled = false;

    const fetchArtist = async () => {
      try {
        const response = await fetch(`/api/spotify/artist/${artistId}`);
        if (response.ok && !cancelled) {
          const data = await response.json();
          setArtistData({ imageUrl: data.imageUrl, name: data.name });
        }
      } catch {
        // Ignore errors
      }
    };

    fetchArtist();

    return () => {
      cancelled = true;
      setArtistData(null);
    };
  }, [artistId]);

  if (!artistId || !artistData?.imageUrl) return null;

  return (
    <div className="fixed bottom-24 right-8 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        <Image
          src={artistData.imageUrl}
          alt={artistData.name || 'Artist'}
          width={200}
          height={200}
          className="size-48 object-cover"
        />
      </div>
    </div>
  );
};

const ConcertEnvelope = ({
  onClick,
  isOpen,
  count,
}: {
  onClick: () => void;
  isOpen: boolean;
  count: number;
}) => {
  const peekingStubs = TICKET_COLORS;

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Envelope Container */}
      <div className="relative mx-auto" style={{ width: 300, height: 160 }}>
        {/* Envelope Back/Inside - the opening */}
        <div
          className="absolute inset-x-0 top-0 h-[90px] rounded-t bg-stone-300"
          style={{ zIndex: 1 }}
        >
          {/* Ticket stubs peeking out */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                exit={{ opacity: 0, y: 30, transition: { duration: 0.12 } }}
                className="absolute inset-x-0 bottom-0 flex items-end justify-center"
              >
                {peekingStubs.map((color, i) => {
                  // Fan them out evenly from center
                  const centerIndex = (peekingStubs.length - 1) / 2;
                  const offset = i - centerIndex;
                  const rotation = offset * 8;
                  const xOffset = offset * 26;
                  // Middle ones peek more
                  const peekAmount = 75 + (centerIndex - Math.abs(offset)) * 12;

                  return (
                    <motion.div
                      key={color}
                      className={`absolute ${color} rounded-t-sm`}
                      style={{
                        width: 36,
                        height: peekAmount,
                        bottom: 0,
                        left: '50%',
                        marginLeft: xOffset - 18,
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: 'bottom center',
                        zIndex: peekingStubs.length - Math.abs(offset),
                      }}
                      initial={{ y: 60, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: {
                          delay: 0.15 + Math.abs(offset) * 0.04,
                          type: 'spring',
                          damping: 22,
                          stiffness: 220,
                        },
                      }}
                    >
                      {/* Simple stub detail line */}
                      <div className="absolute inset-x-1 top-2 h-0.5 rounded-full bg-white/50" />
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Envelope Front Flap */}
        <motion.button
          onClick={onClick}
          disabled={isOpen}
          className={`absolute inset-x-0 bottom-0 h-[110px] rounded bg-stone-100 transition-colors ${
            isOpen ? 'cursor-default' : 'cursor-pointer hover:bg-stone-50'
          }`}
          style={{ zIndex: 15 }}
        >
          {/* Simple border line at top */}
          <div className="absolute inset-x-0 top-0 h-px bg-stone-300" />

          {/* Label */}
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center"
            >
              <h3 className="font-grotesk text-base font-black uppercase tracking-wide text-stone-400">
                Concert Stubs
              </h3>
              <p className="mt-1 font-mono text-[0.55rem] font-medium text-stone-400">
                Tap to open ({count})
              </p>
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Close button when open */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
          className="mt-6 text-center"
        >
          <button
            type="button"
            onClick={onClick}
            className="font-mono text-xs font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900"
          >
            Put Back in Envelope
          </button>
        </motion.div>
      )}
    </div>
  );
};

const ConcertTimeline = () => {
  const [hoveredArtist, setHoveredArtist] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const visibleConcerts = concerts;

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);

      setTimeout(() => {
        document
          .getElementById('concerts')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="flex w-full flex-col items-center">
        {/* Tickets area - above envelope */}
        <div className="relative min-h-[60px] w-full max-w-md px-4 pb-4">
          <AnimatePresence mode="sync">
            {isOpen && (
              <motion.ul
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {visibleConcerts.map((concert, index) => (
                  <ConcertItem
                    key={`${concert.artist}-${concert.date}`}
                    concert={concert}
                    index={index}
                    totalCount={visibleConcerts.length}
                    onHover={setHoveredArtist}
                  />
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Envelope - always at bottom */}
        <ConcertEnvelope
          onClick={handleToggle}
          isOpen={isOpen}
          count={concerts.length}
        />
      </div>

      <ArtistPreview artistId={hoveredArtist} />
    </div>
  );
};

type TopArtistsProps = {
  artists: TopArtist[];
};

const PosterArtist = ({
  artist,
  index,
  onHover,
  onLeave,
}: {
  artist: TopArtist;
  index: number;
  onHover: (url: string) => void;
  onLeave: () => void;
}) => {
  // Alternate fonts for that eclectic poster feel
  const isHeadliner = index < 3;
  const isSerif = index % 3 === 0 || index % 5 === 0;

  const fontClass = isSerif
    ? 'font-serif italic tracking-tight'
    : 'font-grotesk font-black tracking-tighter';

  // Sizing adjusted for the smaller container
  const sizeClass = isHeadliner ? 'text-3xl' : 'text-xl';

  return (
    <span className="inline-block leading-[0.85]">
      <Link
        href={artist.spotifyUrl}
        target="_blank"
        className={`group relative inline-flex items-baseline text-stone-900 transition-colors hover:text-[#FF3300] ${fontClass} ${sizeClass}`}
        onMouseEnter={() => onHover(artist.imageUrl)}
        onMouseLeave={onLeave}
      >
        <span>{artist.name}</span>
        {/* Superscript Metadata */}
        <sup className="ml-0.5 text-[0.4em] font-medium tracking-normal opacity-50 group-hover:text-[#FF3300]">
          ({artist.genres?.[0]?.slice(0, 3).toUpperCase() || 'INT'})
        </sup>
      </Link>
      <span className="mx-1.5 inline-block select-none text-lg font-light text-stone-400">
        /
      </span>
    </span>
  );
};

const TopArtists = ({ artists }: TopArtistsProps) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (artists.length === 0) return null;

  return (
    <div className="relative isolate mx-auto w-full max-w-[340px] rotate-1 scale-100 transform-gpu backface-hidden transition-transform duration-300 will-change-transform hover:rotate-0 hover:scale-105">
      {/* Tape Effect */}
      <div className="absolute -top-3 left-1/2 h-8 w-24 -translate-x-1/2 rotate-[-2deg] bg-yellow-100/80 shadow-sm backdrop-blur-[1px]"></div>

      {/* The Poster Container */}
      <div
        className="aspect-[3/4] overflow-hidden bg-[#EBEBE5] p-5 text-stone-900 shadow-[2px_4px_16px_rgba(0,0,0,0.2)]"
        style={{
          // Jagged edges via clip-path (subtle roughness)
          clipPath:
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 2% 50%, 0% 10%, 1% 0%)',
        }}
      >
        {/* Paper Texture Overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 opacity-20 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom_right,transparent_0%,rgba(0,0,0,0.05)_100%)]"></div>

        {/* Content Layer - Mix Blend Multiply to look like Ink */}
        <div className="relative z-0 flex h-full flex-col justify-between mix-blend-multiply">
          {/* Header */}
          <div className="mb-4 border-b border-stone-900 pb-1">
            <h3 className="flex w-full items-end justify-between font-grotesk text-3xl font-black uppercase leading-none tracking-tighter">
              <span>Lineup</span>
              <span className="font-serif text-sm italic tracking-normal text-[#FF3300]">
                &apos;25
              </span>
            </h3>
          </div>

          {/* The Wall of Text */}
          <div className="flex-grow content-start text-justify leading-tight">
            {artists.map((artist, i) => (
              <PosterArtist
                key={artist.id}
                artist={artist}
                index={i}
                onHover={setHoveredImage}
                onLeave={() => setHoveredImage(null)}
              />
            ))}
          </div>

          {/* Footer / Info */}
          <div className="mt-4 flex items-center justify-between border-t border-stone-900 pt-2 font-mono text-[0.5rem] font-bold uppercase tracking-widest text-stone-600">
            <div className="flex flex-col">
              <span>Spotify API</span>
              <span>Online</span>
            </div>
            <div className="h-6 w-6 rounded-full bg-stone-900"></div>
            <div className="flex flex-col text-right">
              <span>Free Entry</span>
              <span>All Ages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Image Preview */}
      {hoveredImage && (
        <div
          className="pointer-events-none fixed z-50 h-48 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden border-4 border-white bg-stone-100 shadow-2xl"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
          }}
        >
          <Image
            src={hoveredImage}
            alt=""
            fill
            className="object-cover contrast-125 grayscale"
          />
        </div>
      )}
    </div>
  );
};

export const Music = () => {
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const response = await fetch('/api/spotify/top-artists');
        const data = await response.json();
        setTopArtists(data);
      } catch {
        setTopArtists([]);
      }
    };

    fetchTopArtists();
  }, []);

  return (
    <section id="music" className="overflow-x-clip py-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-stone-400">1</span>
        <h2 className="font-serif text-3xl text-stone-900">Music</h2>
      </div>

      <p className="mb-12 max-w-xl text-stone-600">
        Music is at the core of everything I do. From cloud rap to hyperpop to
        experimental, I find myself drawn to artists who push boundaries and
        create something entirely new.
      </p>

      <div className="mb-16 flex justify-center py-8">
        <TopArtists artists={topArtists} />
      </div>

      <div>
        <h3
          id="concerts"
          className="mb-6 scroll-mt-24 text-sm uppercase tracking-widest text-stone-400"
        >
          Concerts
        </h3>
        <ConcertTimeline />
      </div>
    </section>
  );
};
