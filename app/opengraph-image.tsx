/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const Header = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      borderBottom: '2px solid #171717',
      padding: '0 32px',
      position: 'absolute',
      top: 0,
    }}
  >
    {['Frontend Engineer', 'Portfolio'].map((text, i) => (
      <h2
        key={i}
        style={{
          fontSize: '64px',
          color: '#171717',
          fontWeight: 500,
        }}
      >
        {text}
      </h2>
    ))}
  </div>
);

const Footer = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      borderTop: '2px solid #171717',
      padding: '0 32px',
      position: 'absolute',
      bottom: 0,
    }}
  >
    <h2
      style={{
        fontSize: '64px',
        color: '#171717',
        fontWeight: 500,
      }}
    >
      ©{new Date().getFullYear()}
    </h2>
  </div>
);

const MainContent = ({ imageSrc }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <img width="256" height="256" src={imageSrc} alt="m" />
    <h1
      style={{
        fontSize: '256px',
        color: '#171717',
      }}
    >
      islav
    </h1>
  </div>
);

export default async function GET() {
  const m = await fetch(
    new URL('../public/images/black/m.png', import.meta.url),
  ).then((res) => res.arrayBuffer());

  const craftworkGrotesk = await fetch(
    new URL('../public/fonts/CraftworkGrotesk-Medium.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: '#fafafa',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Header />
        <MainContent imageSrc={m as unknown as string} />
        <Footer />
      </div>
    ),
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
