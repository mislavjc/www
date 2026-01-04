'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

const navItems = [
  { number: '1', label: 'Music', href: '#music' },
  { number: '2', label: 'Photography', href: '#photography' },
  { number: '3', label: 'Code', href: '#code' },
  { number: '4', label: 'Travel', href: '#travel' },
];

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );

    navItems.forEach((item) => {
      const element = document.querySelector(item.href);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop - full nav */}
      <nav className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 lg:block">
        <motion.ul
          className="flex flex-col gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {navItems.map((item, index) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <motion.li
                key={item.number}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-full px-3 py-2 text-sm backdrop-blur-sm transition-all hover:bg-stone-200 hover:pl-4 ${
                    isActive ? 'bg-stone-200' : 'bg-stone-100/80'
                  }`}
                >
                  <span
                    className={`font-mono text-xs transition-colors group-hover:text-stone-900 ${
                      isActive ? 'text-stone-900' : 'text-stone-400'
                    }`}
                  >
                    {item.number}
                  </span>
                  <span
                    className={`transition-colors group-hover:text-stone-900 ${
                      isActive ? 'text-stone-900' : 'text-stone-600'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>

      {/* Mobile - dots */}
      <nav className="fixed right-2 top-1/2 z-50 -translate-y-1/2 lg:hidden">
        <motion.ul
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {navItems.map((item, index) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <motion.li
                key={item.number}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="group relative flex items-center justify-end"
                >
                  {/* Label on hover/tap */}
                  <span className="absolute right-5 whitespace-nowrap rounded-full bg-stone-900 px-2 py-1 text-xs text-stone-100 opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100">
                    {item.label}
                  </span>
                  {/* Dot */}
                  <motion.div
                    className={`rounded-full transition-colors ${
                      isActive ? 'bg-stone-900' : 'bg-stone-300'
                    }`}
                    animate={{
                      width: isActive ? 10 : 6,
                      height: isActive ? 10 : 6,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>
    </>
  );
};
