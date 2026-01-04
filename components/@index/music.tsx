'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import type { TopArtist } from 'lib/spotify';

// Concert data sorted by date (newest first)
const concerts = [
  {
    date: '2025-12-07',
    artist: 'Bladee',
    location: 'Vienna',
    spotifyUrl: 'https://open.spotify.com/artist/2xvtxDNInKDV4AvGmjw6d1',
  },
  {
    date: '2025-12-01',
    artist: 'Snow Strippers',
    location: 'Brussels',
    spotifyUrl: 'https://open.spotify.com/artist/6TsAG8Ve1icEC8ydeHm3C8',
  },
  {
    date: '2025-08-05',
    artist: 'Röyksopp',
    location: 'Šibenik',
    spotifyUrl: 'https://open.spotify.com/artist/5nPOO9iTcrs9k6yFffPxjH',
  },
  {
    date: '2025-08-03',
    artist: 'The Hellp',
    location: 'Katowice',
    spotifyUrl: 'https://open.spotify.com/artist/5DslL3PUa3BcRlCCEP64A4',
  },
  {
    date: '2025-08-02',
    artist: 'Ecco2k / Have a Nice Life / Panchiko',
    location: 'Katowice',
    spotifyUrl: 'https://open.spotify.com/artist/6hG0VsXXlD10l60TqiIHIX',
  },
  {
    date: '2025-08-01',
    artist: 'Kraftwerk',
    location: 'Katowice',
    spotifyUrl: 'https://open.spotify.com/artist/0dmPX6ovclgOy8WWJaFEUU',
  },
  {
    date: '2025-05-22',
    artist: '2hollis',
    location: 'Dublin',
    spotifyUrl: 'https://open.spotify.com/artist/72NhFAGG5Pt91VbheJeEPG',
  },
  {
    date: '2025-01-25',
    artist: 'Röyksopp',
    location: 'Milano',
    spotifyUrl: 'https://open.spotify.com/artist/5nPOO9iTcrs9k6yFffPxjH',
  },
  {
    date: '2025-01-22',
    artist: 'JPEGMAFIA',
    location: 'Milano',
    spotifyUrl: 'https://open.spotify.com/artist/6yJ6QQ3Y5l0s0tn7b0arrO',
  },
  {
    date: '2024-11-12',
    artist: 'Snow Strippers',
    location: 'Amsterdam',
    spotifyUrl: 'https://open.spotify.com/artist/6TsAG8Ve1icEC8ydeHm3C8',
  },
  {
    date: '2024-10-21',
    artist: 'The Voidz',
    location: 'NYC',
    spotifyUrl: 'https://open.spotify.com/artist/4nUBBtLtzqZGpdiynTJbYJ',
  },
  {
    date: '2024-10-17',
    artist: 'Bladee',
    location: 'NYC',
    spotifyUrl: 'https://open.spotify.com/artist/2xvtxDNInKDV4AvGmjw6d1',
  },
  {
    date: '2024-10-15',
    artist: 'Xiu Xiu',
    location: 'NYC',
    spotifyUrl: 'https://open.spotify.com/artist/5JLqvjW3Nyom2OsRUyFsS9',
  },
];

// Parse date string as local date (not UTC) to avoid timezone shift issues
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Vibrant, distinct colors for the stubs
const TICKET_COLORS = [
  'bg-[#FF4D4D]', // Bright Red
  'bg-[#4D79FF]', // Bright Blue
  'bg-[#FFB347]', // Pastel Orange
  'bg-[#B39DDB]', // Lavender
  'bg-[#80CBC4]', // Teal
  'bg-[#FFD700]', // Gold
];

// Pin colors for the thumbtacks
const PIN_COLORS = [
  '#ef4444', // red
  '#eab308', // yellow
  '#3b82f6', // blue
  '#22c55e', // green
  '#f97316', // orange
  '#ec4899', // pink
];

// Washi tape colors/patterns
const WASHI_STYLES = [
  { bg: 'bg-pink-300/80', pattern: 'stripes' },
  { bg: 'bg-amber-300/80', pattern: 'dots' },
  { bg: 'bg-sky-300/80', pattern: 'solid' },
  { bg: 'bg-lime-300/80', pattern: 'stripes' },
  { bg: 'bg-violet-300/80', pattern: 'dots' },
  { bg: 'bg-rose-300/80', pattern: 'solid' },
];

const WashiTape = ({
  styleIndex,
  rotation,
}: {
  styleIndex: number;
  rotation: number;
}) => {
  const style = WASHI_STYLES[styleIndex % WASHI_STYLES.length];

  return (
    <div
      className={`absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 ${style.bg}`}
      style={{
        transform: `translateX(-50%) rotate(${rotation}deg)`,
        clipPath: 'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)',
      }}
    >
      {/* Tape pattern */}
      {style.pattern === 'stripes' && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px)',
          }}
        />
      )}
      {style.pattern === 'dots' && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)',
            backgroundSize: '6px 6px',
          }}
        />
      )}
      {/* Torn edge effect */}
      <div className="absolute inset-x-0 -top-px h-1 bg-gradient-to-b from-white/20 to-transparent" />
    </div>
  );
};

const Thumbtack = ({ color }: { color: string }) => (
  <div
    className="absolute -top-2 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full shadow-md"
    style={{
      background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 60%), ${color}`,
    }}
  >
    <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-white/40" />
  </div>
);

const PinnedTicket = ({
  concert,
  index,
  style,
  spotifyUrl,
}: {
  concert: (typeof concerts)[0];
  index: number;
  style: { left: string; top: number; rotate: number; zIndex: number };
  spotifyUrl?: string;
}) => {
  const stubColor = TICKET_COLORS[index % TICKET_COLORS.length];
  const pinColor = PIN_COLORS[index % PIN_COLORS.length];
  const stubTextColor = 'text-stone-900';

  // Alternate between washi tape and thumbtacks
  const useWashi = index % 3 === 0;
  const washiRotation = ((index * 11) % 20) - 10;

  // Shadow direction based on rotation
  const shadowX = style.rotate * 0.3;
  const shadowY = 4;

  // Format date to DD.MM.YY
  const date = parseLocalDate(concert.date);
  const formattedDate = date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .replace(/\//g, '.');

  const TicketContent = (
    <>
      {/* Washi tape or thumbtack */}
      {useWashi ? (
        <WashiTape styleIndex={index} rotation={washiRotation} />
      ) : (
        <Thumbtack color={pinColor} />
      )}

      {/* The ticket */}
      <div className="relative flex overflow-hidden rounded-sm">
        {/* Ticket "Stub" (Left Side) - Colored */}
        <div
          className={`relative flex w-16 shrink-0 flex-col items-center justify-center border-r-2 border-dashed ${stubColor} ${stubTextColor} py-2 text-center md:w-20 md:py-3`}
          style={{ borderColor: 'rgba(0,0,0,0.15)' }}
        >
          {/* Hole Punch Effect */}
          <div className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-stone-900/20 shadow-inner md:left-1.5 md:h-2.5 md:w-2.5" />

          <span className="font-grotesk text-lg font-black opacity-90 md:text-xl">
            {formattedDate.split('.')[0]}
          </span>
          <span className="font-mono text-[0.55rem] font-bold uppercase opacity-80 md:text-[0.65rem]">
            {date.toLocaleString('en-US', { month: 'short' })}
          </span>
          <span className="mt-0.5 font-mono text-[0.45rem] opacity-60 md:text-[0.5rem]">
            {formattedDate.split('.')[2]}
          </span>

          {/* Semi-circle cutout for stub effect */}
          <div className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#F5F5F0] shadow-inner" />
        </div>

        {/* Ticket Body (Right Side) */}
        <div className="relative flex flex-grow flex-col justify-between bg-[#F5F5F0] p-2 pl-4 md:p-3 md:pl-5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col pr-2">
              <span className="font-grotesk text-sm font-black uppercase leading-tight tracking-tight text-stone-900 md:text-base">
                {concert.artist}
              </span>
              <span className="mt-0.5 font-serif text-[0.65rem] italic text-stone-500 md:text-xs">
                {concert.location}
              </span>
            </div>
            {/* Vertical Barcode Strip */}
            <div className="hidden h-6 w-8 shrink-0 opacity-80 mix-blend-multiply md:block">
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

          <div className="mt-1.5 flex items-center justify-between border-t border-stone-200 pt-1 font-mono text-[0.45rem] uppercase tracking-widest text-stone-400 md:mt-2 md:pt-1.5 md:text-[0.5rem]">
            <span className="font-bold text-stone-500">Admit One</span>
            <span className="hidden sm:inline">
              Sec {String.fromCharCode(65 + (index % 5))} / Row {index + 1}
            </span>
            <span>No {1000 + index * 42}</span>
          </div>

          {/* Paper Texture Overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: -50 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 200,
          delay: index * 0.03,
        },
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        y: -4,
        zIndex: 50,
        transition: { type: 'spring', damping: 20, stiffness: 300 },
      }}
      className="absolute w-[280px] md:w-[320px]"
      style={{
        left: style.left,
        top: style.top,
        rotate: `${style.rotate}deg`,
        zIndex: style.zIndex,
        filter: `drop-shadow(${shadowX}px ${shadowY}px 6px rgba(0,0,0,0.15))`,
      }}
    >
      {spotifyUrl ? (
        <Link href={spotifyUrl} target="_blank" className="block">
          {TicketContent}
        </Link>
      ) : (
        TicketContent
      )}
    </motion.div>
  );
};

const ConcertPinboard = () => {
  const getTicketStyle = (index: number, isMobile: boolean) => {
    if (isMobile) {
      // Single column, centered
      const rotation = ((index * 7) % 6) - 3;
      return {
        left: 'calc(50% - 140px)', // half of ticket width (280px)
        top: index * 100 + 20,
        rotate: rotation,
        zIndex: concerts.length - index,
      };
    }

    // Desktop: 2 columns with proper spacing
    const col = index % 2;
    const row = Math.floor(index / 2);
    const rotation = ((index * 7) % 10) - 5;

    return {
      left: col === 0 ? '5%' : '52%',
      top: row * 110 + 20,
      rotate: rotation,
      zIndex: concerts.length - index,
    };
  };

  const mobileRows = concerts.length;
  const desktopRows = Math.ceil(concerts.length / 2);

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Pinboard */}
      <div className="relative mx-auto w-full overflow-hidden rounded-lg bg-stone-200">
        {/* Mobile height */}
        <div
          className="block md:hidden"
          style={{ height: mobileRows * 100 + 50 }}
        />
        {/* Desktop height */}
        <div
          className="hidden md:block"
          style={{ height: desktopRows * 110 + 50 }}
        />

        {/* Simple dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #78716c 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Mobile layout */}
        <div className="absolute inset-0 md:hidden">
          {concerts.map((concert, index) => {
            const style = getTicketStyle(index, true);
            return (
              <PinnedTicket
                key={`mobile-${concert.artist}-${concert.date}`}
                concert={concert}
                index={index}
                style={style}
                spotifyUrl={concert.spotifyUrl}
              />
            );
          })}
        </div>

        {/* Desktop layout */}
        <div className="absolute inset-0 hidden md:block">
          {concerts.map((concert, index) => {
            const style = getTicketStyle(index, false);
            return (
              <PinnedTicket
                key={`desktop-${concert.artist}-${concert.date}`}
                concert={concert}
                index={index}
                style={style}
                spotifyUrl={concert.spotifyUrl}
              />
            );
          })}
        </div>
      </div>
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
  const imagePreviewRef = useRef<HTMLDivElement>(null);

  const handleHover = useCallback((url: string) => setHoveredImage(url), []);
  const handleLeave = useCallback(() => setHoveredImage(null), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update position via DOM directly to avoid re-renders
      if (imagePreviewRef.current) {
        imagePreviewRef.current.style.left = `${e.clientX}px`;
        imagePreviewRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (artists.length === 0) return null;

  return (
    <div className="relative isolate mx-auto w-full max-w-[340px] rotate-1 scale-100 transform-gpu backface-hidden transition-transform duration-300 will-change-transform hover:rotate-0 hover:scale-105">
      {/* Tape Effect */}
      <div className="absolute -top-3 left-1/2 h-8 w-24 -translate-x-1/2 rotate-[-2deg] bg-yellow-100/80 shadow-sm"></div>

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
                onHover={handleHover}
                onLeave={handleLeave}
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
          ref={imagePreviewRef}
          className="pointer-events-none fixed z-50 h-48 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden border-4 border-white bg-stone-100 shadow-2xl"
        >
          <Image
            src={hoveredImage}
            alt=""
            fill
            sizes="192px"
            className="object-cover contrast-125 grayscale"
          />
        </div>
      )}
    </div>
  );
};

type MusicProps = {
  topArtists: TopArtist[];
};

export const Music = ({ topArtists }: MusicProps) => {
  return (
    <section id="music" className="overflow-x-clip py-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-stone-500">1</span>
        <h2 className="font-serif text-3xl text-stone-900">Music</h2>
      </div>

      <p className="mb-12 max-w-xl text-stone-600">
        What I love about concerts is that everyone there is like-minded.
        We&apos;re all there to see an artist we love, even if our lives are
        completely different outside of it. I can walk up to anyone in the queue
        and ask &quot;what song are you dying to hear tonight?&quot; and
        suddenly we&apos;re friends. Queue friendships are temporary but
        they&apos;re real. The show that changed everything was seeing Bladee,
        Ecco2k, and Thaiboy together in Stockholm for Rift Festival, September
        2022. Old warehouse venue, perfect light show, crowd energy was unreal.
        They opened with Western Union and I have a video where you can see my
        camera fly around because the crowd went so wild I couldn&apos;t hold my
        hand still.
      </p>

      <div className="mb-16 flex justify-center py-8">
        <TopArtists artists={topArtists} />
      </div>

      <div>
        <h3
          id="concerts"
          className="mb-4 scroll-mt-24 text-sm uppercase tracking-widest text-stone-500"
        >
          Recent Concerts
        </h3>
        <p className="mb-8 max-w-xl text-stone-600">
          Sometimes I go with friends, sometimes solo. Both are fun honestly.
          When I&apos;m alone I usually start chatting with someone right when I
          get in line. Headphones are in 24/7 when I&apos;m outside anyway so
          concerts are just the natural extension of that I guess.
        </p>
        <ConcertPinboard />
      </div>
    </section>
  );
};
