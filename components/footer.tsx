'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

const links = [
  { href: 'https://github.com/mislavjc', label: 'GitHub', icon: 'GH' },
  {
    href: 'https://www.linkedin.com/in/mislavjc/',
    label: 'LinkedIn',
    icon: 'LI',
  },
  { href: 'https://x.com/mislavjc', label: 'X', icon: 'X' },
  { href: 'https://instagram.com/mislavjc', label: 'Instagram', icon: 'IG' },
];

const STAMP_COLORS = ['#FF4D4D', '#4D79FF', '#FFB347', '#80CBC4'];

const SocialStamp = ({
  link,
  index,
}: {
  link: (typeof links)[number];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = STAMP_COLORS[index % STAMP_COLORS.length];
  const rotation = ((index * 13) % 20) - 10;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotate: rotation,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 200,
          delay: index * 0.1,
        },
      }}
      whileHover={{
        scale: 1.15,
        rotate: 0,
        transition: { type: 'spring', damping: 15, stiffness: 300 },
      }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
        aria-label={link.label}
      >
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-sm border-2 border-dashed transition-colors duration-200"
          style={{
            borderColor: isHovered ? color : '#a8a29e',
            backgroundColor: isHovered ? `${color}10` : 'transparent',
          }}
        >
          <div
            className="absolute inset-2 rounded-full border-2 transition-colors duration-200"
            style={{ borderColor: isHovered ? color : '#a8a29e' }}
          />
          <span
            className="relative z-10 font-grotesk text-lg font-black transition-colors duration-200"
            style={{ color: isHovered ? color : '#78716c' }}
          >
            {link.icon}
          </span>
          <div
            className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full transition-colors duration-200"
            style={{ backgroundColor: isHovered ? color : '#d6d3d1' }}
          />
          <div
            className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full transition-colors duration-200"
            style={{ backgroundColor: isHovered ? color : '#d6d3d1' }}
          />
          <div
            className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full transition-colors duration-200"
            style={{ backgroundColor: isHovered ? color : '#d6d3d1' }}
          />
          <div
            className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full transition-colors duration-200"
            style={{ backgroundColor: isHovered ? color : '#d6d3d1' }}
          />
        </div>
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-stone-900 px-2 py-0.5 text-xs text-stone-100"
        >
          {link.label}
        </motion.span>
      </Link>
    </motion.div>
  );
};

export const Footer = () => {
  return (
    <footer className="border-t border-stone-200 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex flex-col items-center gap-10">
          {/* Email button */}
          <a
            href="mailto:m@mislavjc.com"
            className="rounded-full bg-stone-900 px-6 py-3 text-sm text-stone-100 transition-all hover:bg-[#FF3300] hover:scale-[1.02] active:scale-[0.98]"
          >
            m@mislavjc.com
          </a>

          {/* Social stamps */}
          <div className="flex flex-wrap justify-center gap-4">
            {links.map((link, index) => (
              <SocialStamp key={link.href} link={link} index={index} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
