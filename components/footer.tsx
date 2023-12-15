import Image from 'next/image';

import MoveUpRightSvg from 'public/move-up-right.svg';

import { Shape } from './shape';

type FooterLinkProps = {
  href: string;
  name: string;
  isEmail?: boolean;
};

const FooterLink = ({ href, name, isEmail }: FooterLinkProps) => {
  if (isEmail) {
    return (
      <li>
        <a href={`mailto:${href}`} className="underline">
          {name}
        </a>
      </li>
    );
  }
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1"
      >
        {name} <Image src={MoveUpRightSvg} alt="arrow" width={12} height={12} />
      </a>
    </li>
  );
};

const links = [
  { href: 'https://github.com/mislavjc', name: 'GitHub' },
  { href: 'https://www.linkedin.com/in/mislavjc/', name: 'LinkedIn' },
  { href: 'https://x.com/mislavjc', name: 'X' },
  { href: 'https://instagram.com/mislavjc', name: 'Instagram' },
  { href: 'mislavjc@gmail.com', name: 'mislavjc@gmail.com', isEmail: true },
];

export const Footer = () => {
  return (
    <footer className="bg-neutral-100">
      <div className="mx-auto flex max-w-screen-md justify-between p-8">
        <ul>
          {links.map((link) => (
            <FooterLink key={link.href} {...link} />
          ))}
        </ul>
        <Shape shape="16" />
      </div>
      <div className="h-4 w-full bg-neutral-200" />
      <div className="h-4 w-full bg-neutral-400" />
      <div className="h-4 w-full bg-neutral-500" />
      <div className="h-4 w-full bg-neutral-600" />
      <div className="h-4 w-full bg-neutral-700" />
      <div className="h-4 w-full bg-neutral-800" />
      <div className="h-4 w-full bg-neutral-900" />
    </footer>
  );
};
