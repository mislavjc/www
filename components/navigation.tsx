'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <li key={item.number}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-full px-3 py-2 text-sm transition-[background-color,color,padding] outline-none focus-visible:ring-2 focus-visible:ring-stone-400 hover:bg-stone-200 hover:pl-4 ${
                    isActive ? 'bg-stone-200' : 'bg-stone-100/80'
                  }`}
                >
                  <span
                    className={`font-mono text-xs transition-colors group-hover:text-stone-900 ${
                      isActive ? 'text-stone-900' : 'text-stone-500'
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
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile - dots */}
      <nav className="fixed right-0 top-1/2 z-50 -translate-y-1/2 lg:hidden">
        <ul className="flex flex-col">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <li key={item.number}>
                <Link
                  href={item.href}
                  className="group relative flex min-h-[44px] min-w-[44px] items-center justify-end pr-4 outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:rounded-full"
                  aria-label={item.label}
                >
                  {/* Label on hover/tap */}
                  <span className="absolute right-10 whitespace-nowrap rounded-full bg-stone-900 px-2 py-1 text-xs text-stone-100 opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100">
                    {item.label}
                  </span>
                  {/* Dot */}
                  <div
                    className={`rounded-full transition-all ${
                      isActive
                        ? 'h-2.5 w-2.5 bg-stone-900'
                        : 'h-1.5 w-1.5 bg-stone-400'
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};
