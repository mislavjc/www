import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Fetch image and convert to base64 data URL
async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = res.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}

// More countries for stamps
const STAMP_COUNTRIES = [
  'jpn',
  'usa',
  'fra',
  'ita',
  'deu',
  'gbr',
  'esp',
  'nld',
  'che',
  'prt',
];

// More concerts
const CONCERTS = [
  {
    artist: 'Bladee',
    location: 'Vienna',
    date: '07',
    month: 'DEC',
    year: '25',
    color: '#FF4D4D',
  },
  {
    artist: 'Snow Strippers',
    location: 'Brussels',
    date: '01',
    month: 'DEC',
    year: '25',
    color: '#B39DDB',
  },
  {
    artist: 'Röyksopp',
    location: 'Milano',
    date: '25',
    month: 'JAN',
    year: '25',
    color: '#4D79FF',
  },
  {
    artist: 'JPEGMAFIA',
    location: 'Milano',
    date: '22',
    month: 'JAN',
    year: '25',
    color: '#FFB347',
  },
  {
    artist: 'The Voidz',
    location: 'NYC',
    date: '21',
    month: 'OCT',
    year: '24',
    color: '#80CBC4',
  },
  {
    artist: 'Xiu Xiu',
    location: 'NYC',
    date: '15',
    month: 'OCT',
    year: '24',
    color: '#FFD700',
  },
  {
    artist: 'Ecco2k',
    location: 'Katowice',
    date: '02',
    month: 'AUG',
    year: '25',
    color: '#FF6B6B',
  },
];

// More photos
const PHOTO_UUIDS = [
  '00000000-0000-761f-bbe1-9603a1134c4e',
  '00000000-0000-7006-bdf9-6e38cde95ed4',
  '00000000-0000-7011-a00d-5853de757a80',
  '00000000-0000-701e-8557-cb3601f5bb32',
  '00000000-0000-7021-a8b8-aa18238e6e8c',
  '00000000-0000-7030-bbec-a4c8db6e4b68',
  '00000000-0000-7017-9680-7cd41c979632',
];

// Concert stub component
const ConcertStub = ({
  concert,
  style,
}: {
  concert: (typeof CONCERTS)[0];
  style: { left: number; top: number; rotate: number };
}) => (
  <div
    style={{
      position: 'absolute',
      left: style.left,
      top: style.top,
      transform: `rotate(${style.rotate}deg)`,
      display: 'flex',
      width: 220,
      height: 85,
      borderRadius: 3,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        background: concert.color,
        borderRight: '2px dashed rgba(0,0,0,0.15)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 5,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 9,
          height: 9,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.15)',
        }}
      />
      <span style={{ fontSize: 26, fontWeight: 900, color: '#1c1917' }}>
        {concert.date}
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: '#1c1917',
          opacity: 0.8,
          textTransform: 'uppercase',
        }}
      >
        {concert.month}
      </span>
      <span style={{ fontSize: 8, color: '#1c1917', opacity: 0.6 }}>
        {concert.year}
      </span>
      <div
        style={{
          position: 'absolute',
          right: -7,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#F5F5F0',
        }}
      />
    </div>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        background: '#F5F5F0',
        padding: '10px 12px 10px 18px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 900,
            color: '#1c1917',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          {concert.artist}
        </span>
        <span style={{ fontSize: 10, color: '#78716c', fontStyle: 'italic' }}>
          {concert.location}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #e7e5e4',
          paddingTop: 4,
        }}
      >
        <span
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: '#78716c',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Admit One
        </span>
      </div>
    </div>
  </div>
);

// Photo component
const Photo = ({
  src,
  style,
  size,
}: {
  src: string | null;
  style: { left: number; top: number; rotate: number };
  size: { width: number; height: number };
}) => (
  <div
    style={{
      position: 'absolute',
      left: style.left,
      top: style.top,
      transform: `rotate(${style.rotate}deg)`,
      display: 'flex',
      borderRadius: 2,
      overflow: 'hidden',
      width: size.width,
      height: size.height,
    }}
  >
    {src ? (
      <img
        src={src}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    ) : (
      <div style={{ width: '100%', height: '100%', background: '#d6d3d1' }} />
    )}
  </div>
);

// Minimal terminal component
const Terminal = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a',
      borderRadius: 8,
      width: 300,
      height: 180,
      overflow: 'hidden',
      fontFamily: 'monospace',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 18px',
        fontSize: 13,
        lineHeight: 2,
      }}
    >
      <div style={{ display: 'flex' }}>
        <span style={{ color: '#525252' }}>$</span>
        <span style={{ color: '#e4e4e7', marginLeft: 10 }}>npm run dev</span>
      </div>
      <div style={{ display: 'flex', marginTop: 8 }}>
        <span style={{ color: '#525252' }}>▲ Next.js 16.1</span>
      </div>
      <div style={{ display: 'flex' }}>
        <span style={{ color: '#525252' }}>- Local:</span>
        <span style={{ color: '#a1a1aa', marginLeft: 8 }}>localhost:3000</span>
      </div>
      <div style={{ display: 'flex', marginTop: 8 }}>
        <span style={{ color: '#22c55e' }}>✓</span>
        <span style={{ color: '#525252', marginLeft: 8 }}>Ready</span>
      </div>
    </div>
  </div>
);

export default async function GET() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const [stamps, photos, craftworkGrotesk] = await Promise.all([
    Promise.all(
      STAMP_COUNTRIES.map((country) =>
        fetchImageAsBase64(`${baseUrl}/api/stamp/${country}?width=200`),
      ),
    ),
    Promise.all(
      PHOTO_UUIDS.map((uuid) =>
        fetchImageAsBase64(
          `https://r2.photography.mislavjc.com/variants/grid/jpeg/640/${uuid}.jpeg`,
        ),
      ),
    ),
    fetch(
      new URL('../public/fonts/CraftworkGrotesk-Medium.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: '#fafaf9',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Paper texture */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle, #d6d3d1 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.4,
        }}
      />

      {/* Top Left - Passport Stamps (cut off from top-left) */}
      <div
        style={{
          position: 'absolute',
          left: -60,
          top: -50,
          width: 500,
          height: 380,
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {stamps.map((stamp, i) =>
          stamp ? (
            <img
              key={STAMP_COUNTRIES[i]}
              src={stamp}
              alt=""
              style={{
                width: 130,
                height: 130,
                transform: `rotate(${((i * 23) % 40) - 20}deg)`,
                marginRight: -35,
                marginBottom: -35,
              }}
            />
          ) : null,
        )}
      </div>

      {/* Top Right - Terminal (cut off from top-right) */}
      <div
        style={{
          position: 'absolute',
          right: -80,
          top: -40,
          display: 'flex',
          transform: 'rotate(3deg)',
        }}
      >
        <Terminal />
      </div>

      {/* Center - Name */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(250, 250, 249, 0.98)',
          padding: '18px 40px',
          borderRadius: 6,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: 58,
            fontWeight: 500,
            color: '#171717',
            letterSpacing: '-0.02em',
          }}
        >
          mislav
        </span>
        <span
          style={{
            fontSize: 13,
            color: '#78716c',
            marginTop: 2,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Frontend Engineer
        </span>
      </div>

      {/* Bottom Left - Concert Stubs (cut off from bottom-left) */}
      <div
        style={{
          position: 'absolute',
          left: -100,
          bottom: -120,
          width: 620,
          height: 450,
          display: 'flex',
        }}
      >
        <ConcertStub
          concert={CONCERTS[0]}
          style={{ left: 20, top: 30, rotate: -7 }}
        />
        <ConcertStub
          concert={CONCERTS[1]}
          style={{ left: 230, top: 50, rotate: 5 }}
        />
        <ConcertStub
          concert={CONCERTS[2]}
          style={{ left: 50, top: 120, rotate: 4 }}
        />
        <ConcertStub
          concert={CONCERTS[3]}
          style={{ left: 290, top: 140, rotate: -4 }}
        />
        <ConcertStub
          concert={CONCERTS[4]}
          style={{ left: 10, top: 210, rotate: -3 }}
        />
        <ConcertStub
          concert={CONCERTS[5]}
          style={{ left: 210, top: 225, rotate: 6 }}
        />
        <ConcertStub
          concert={CONCERTS[6]}
          style={{ left: 400, top: 240, rotate: -5 }}
        />
      </div>

      {/* Bottom Right - Photos (cut off from bottom-right) */}
      <div
        style={{
          position: 'absolute',
          right: -100,
          bottom: -100,
          width: 520,
          height: 480,
          display: 'flex',
        }}
      >
        <Photo
          src={photos[0]}
          style={{ left: 0, top: 30, rotate: -6 }}
          size={{ width: 145, height: 185 }}
        />
        <Photo
          src={photos[1]}
          style={{ left: 130, top: 10, rotate: 5 }}
          size={{ width: 140, height: 180 }}
        />
        <Photo
          src={photos[2]}
          style={{ left: 270, top: 40, rotate: -3 }}
          size={{ width: 150, height: 190 }}
        />
        <Photo
          src={photos[3]}
          style={{ left: 40, top: 200, rotate: 4 }}
          size={{ width: 135, height: 170 }}
        />
        <Photo
          src={photos[4]}
          style={{ left: 175, top: 185, rotate: -5 }}
          size={{ width: 145, height: 185 }}
        />
        <Photo
          src={photos[5]}
          style={{ left: 310, top: 210, rotate: 6 }}
          size={{ width: 140, height: 175 }}
        />
        <Photo
          src={photos[6]}
          style={{ left: 100, top: 355, rotate: -2 }}
          size={{ width: 150, height: 190 }}
        />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Craftwork Grotesk',
          data: craftworkGrotesk,
          style: 'normal',
          weight: 500,
        },
      ],
    },
  );
}
