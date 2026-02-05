import Image from 'next/image';

import { cn } from 'lib/utils';

import AWSSvg from 'public/icons/aws.svg';
import CloudflareSvg from 'public/icons/cloudflare.svg';
import NextjsSvg from 'public/icons/nextjs.svg';
import NodejsSvg from 'public/icons/nodejs.svg';
import OpenAISvg from 'public/icons/openai.svg';
import PlanetScaleSvg from 'public/icons/planetscale.svg';
import PrismaSvg from 'public/icons/prisma.svg';
import PrismicSvg from 'public/icons/prismic.svg';
import ReactSvg from 'public/icons/react.svg';
import ReactQuerySvg from 'public/icons/reactquery.svg';
import SupabaseSvg from 'public/icons/supabase.svg';
import TailwindSvg from 'public/icons/tailwindcss.svg';
import TypeScriptSvg from 'public/icons/typescript.svg';
import VercelSvg from 'public/icons/vercel.svg';

import styles from './style.module.css';

const logos = [
  {
    name: 'AWS',
    img: AWSSvg,
    url: 'https://aws.amazon.com/',
  },
  {
    name: 'Cloudflare',
    img: CloudflareSvg,
    url: 'https://cloudflare.com/',
  },
  {
    name: 'Next.js',
    img: NextjsSvg,
    url: 'https://nextjs.org/',
  },
  {
    name: 'OpenAI',
    img: OpenAISvg,
    url: 'https://openai.com/',
  },
  {
    name: 'React',
    img: ReactSvg,
    url: 'https://reactjs.org/',
  },
  {
    name: 'Tailwind CSS',
    img: TailwindSvg,
    url: 'https://tailwindcss.com/',
  },
  {
    name: 'TypeScript',
    img: TypeScriptSvg,
    url: 'https://typescriptlang.org/',
  },
  {
    name: 'Node.js',
    img: NodejsSvg,
    url: 'https://nodejs.org/',
  },
  {
    name: 'PlanetScale',
    img: PlanetScaleSvg,
    url: 'https://planetscale.com/',
  },
  {
    name: 'Prisma',
    img: PrismaSvg,
    url: 'https://prisma.io/',
  },
  {
    name: 'Vercel',
    img: VercelSvg,
    url: 'https://vercel.com/',
  },
  {
    name: 'Supabase',
    img: SupabaseSvg,
    url: 'https://supabase.io/',
  },
  {
    name: 'Prismic',
    img: PrismicSvg,
    url: 'https://prismic.io/',
  },
  {
    name: 'React Query',
    img: ReactQuerySvg,
    url: 'https://tanstack.com/query/latest/',
  },
];

const duplicatedLogos = [...logos, ...logos];

export const Marquee = () => {
  return (
    <div
      className={cn(
        'relative mt-16 flex h-12 overflow-x-hidden',
        styles.gradient,
      )}
    >
      <div className="animate-marquee whitespace-nowrap">
        {duplicatedLogos.map((logo, index) => (
          <a
            href={logo.url}
            target="_blank"
            rel="noopener noreferrer"
            key={logo.name + '-' + index}
            className="mr-16 inline-block h-8 w-12 outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:rounded-sm"
          >
            <Image src={logo.img} alt={logo.name} width={48} height={32} />
          </a>
        ))}
      </div>
    </div>
  );
};
