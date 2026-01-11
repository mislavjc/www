'use client';

import { useState } from 'react';
import Link from 'next/link';

// Parse date string as local date (not UTC) to avoid timezone shift issues
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

type Experience = {
  role: string;
  company: string;
  companyId: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
};

const experiences: Experience[] = [
  {
    role: 'Founding Engineer',
    company: 'Preview.io',
    companyId: 'preview',
    startDate: parseLocalDate('2025-10-01'),
    endDate: null,
    description: 'Building AI-powered video generation tools.',
  },
  {
    role: 'Founding Applied AI Engineer',
    company: 'Steel',
    companyId: 'steel',
    startDate: parseLocalDate('2025-02-01'),
    endDate: parseLocalDate('2025-06-30'),
    description: 'Built AI infrastructure and applications.',
  },
  {
    role: 'Applied AI Engineer',
    company: 'Rubric Labs',
    companyId: 'rubric',
    startDate: parseLocalDate('2024-09-01'),
    endDate: parseLocalDate('2025-02-28'),
    description: 'Worked on AI-powered applications.',
  },
  {
    role: 'Frontend Engineer',
    company: 'CoreLine',
    companyId: 'coreline',
    startDate: parseLocalDate('2024-01-01'),
    endDate: parseLocalDate('2024-09-30'),
    description: 'Built a custom CMS for a web shop.',
  },
  {
    role: 'Frontend Engineer',
    company: 'Glassnode / Accointing',
    companyId: 'glassnode',
    startDate: parseLocalDate('2021-08-01'),
    endDate: parseLocalDate('2023-12-31'),
    description:
      'Worked across both companies as they merged. Built crypto analytics and portfolio tracking interfaces.',
  },
  {
    role: 'Frontend Engineer',
    company: 'CoreLine',
    companyId: 'coreline',
    startDate: parseLocalDate('2021-03-01'),
    endDate: parseLocalDate('2021-08-31'),
    description: 'GraphQL endpoints and CoreEvent application improvements.',
  },
];

const COMPANY_COLORS: Record<string, { bg: string; text: string }> = {
  preview: { bg: 'bg-violet-400', text: 'text-violet-400' },
  steel: { bg: 'bg-sky-400', text: 'text-sky-400' },
  rubric: { bg: 'bg-rose-400', text: 'text-rose-400' },
  coreline: { bg: 'bg-amber-400', text: 'text-amber-400' },
  glassnode: { bg: 'bg-emerald-400', text: 'text-emerald-400' },
};

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const getCompanyAtDate = (date: Date): string | null => {
  for (const exp of experiences) {
    const endDate = exp.endDate || new Date();
    if (date >= exp.startDate && date <= endDate) {
      return exp.companyId;
    }
  }
  return null;
};

type WeekData = {
  weekStart: Date;
  companyId: string | null;
  hasMultiple: boolean;
};

const ExperienceGraph = () => {
  const startYear = 2021;
  const endYear = new Date().getFullYear();
  const currentDate = new Date();

  // Build data: for each year, all weeks from Jan 1 to Dec 31
  const yearData: { year: number; weeks: WeekData[] }[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const weeks: WeekData[] = [];

    // Start from Jan 1
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    // Generate weeks for the entire year
    const current = new Date(yearStart);
    while (current <= yearEnd) {
      const weekStart = new Date(current);

      // Check if future
      const isFuture = weekStart > currentDate;

      if (isFuture) {
        weeks.push({ weekStart, companyId: null, hasMultiple: false });
      } else {
        // Check all 7 days of the week for companies
        const companiesThisWeek = new Set<string>();
        for (let d = 0; d < 7; d++) {
          const day = new Date(weekStart);
          day.setDate(weekStart.getDate() + d);
          if (day <= yearEnd) {
            const company = getCompanyAtDate(day);
            if (company) companiesThisWeek.add(company);
          }
        }

        const companyArray = Array.from(companiesThisWeek);
        weeks.push({
          weekStart,
          companyId: companyArray[0] || null,
          hasMultiple: companyArray.length > 1,
        });
      }

      current.setDate(current.getDate() + 7);
    }

    yearData.push({ year, weeks });
  }

  // Get unique companies for legend (in order of appearance)
  const seenCompanies = new Set<string>();
  const legendCompanies: { id: string; name: string }[] = [];
  for (const exp of [...experiences].reverse()) {
    if (!seenCompanies.has(exp.companyId)) {
      seenCompanies.add(exp.companyId);
      legendCompanies.push({ id: exp.companyId, name: exp.company });
    }
  }

  // Calculate total experience
  let totalWeeks = 0;
  yearData.forEach(({ weeks }) => {
    weeks.forEach((w) => {
      if (w.companyId) totalWeeks++;
    });
  });
  const totalYears = (totalWeeks / 52).toFixed(1);

  return (
    <div className="w-full font-mono text-xs">
      {/* Month labels */}
      <div className="mb-2 flex pl-8 sm:pl-12">
        {MONTH_NAMES.map((month) => (
          <div
            key={month}
            className="flex-1 text-[10px] text-stone-600 sm:text-xs"
          >
            {month}
          </div>
        ))}
      </div>

      {/* Year rows */}
      <div className="flex flex-col gap-1">
        {yearData.map(({ year, weeks }) => (
          <div key={year} className="flex items-center gap-2 sm:gap-3">
            {/* Year label */}
            <div className="w-6 shrink-0 text-right text-[10px] text-stone-600 sm:w-9 sm:text-xs">
              <span className="sm:hidden">&apos;{String(year).slice(-2)}</span>
              <span className="hidden sm:inline">{year}</span>
            </div>

            {/* Weeks grid */}
            <div className="flex flex-1 gap-px sm:gap-0.5">
              {weeks.map((week) => {
                const companyColor = week.companyId
                  ? COMPANY_COLORS[week.companyId]?.bg
                  : 'bg-stone-200';

                const isFuture = week.weekStart > currentDate;

                return (
                  <div
                    key={week.weekStart.toISOString()}
                    className={`h-2.5 flex-1 rounded-[2px] sm:h-4 sm:rounded-sm ${isFuture ? 'bg-stone-100' : companyColor} transition-all ${!isFuture && 'hover:ring-1 hover:ring-stone-400'}`}
                    title={
                      isFuture
                        ? undefined
                        : `${week.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${week.companyId ? ` – ${experiences.find((e) => e.companyId === week.companyId)?.company}` : ' – gap'}`
                    }
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend and stats */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:mt-6 sm:gap-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 sm:gap-x-4 sm:gap-y-2">
          {legendCompanies.map(({ id, name }) => (
            <div key={id} className="flex items-center gap-1 sm:gap-1.5">
              <div
                className={`h-2.5 w-2.5 rounded-sm sm:h-3 sm:w-3 ${COMPANY_COLORS[id].bg}`}
              />
              <span className="text-[10px] text-stone-600 sm:text-xs">
                {name}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-stone-100 sm:h-3 sm:w-3" />
            <span className="text-[10px] text-stone-600 sm:text-xs">gap</span>
          </div>
        </div>
        <div className="text-[10px] text-stone-600 sm:text-xs">
          <span className="text-stone-700">{totalYears}</span> years
        </div>
      </div>
    </div>
  );
};

const projects = [
  {
    name: 'stamped.today',
    description:
      'Collect stamps of your favorite artists with their monthly listener count frozen in time.',
    url: 'https://stamped.today',
    favicon: '💿',
    highlight: true,
    type: 'web' as const,
  },
  {
    name: 'Constellator',
    description:
      'AI-powered CLI that transforms GitHub stars into organized Awesome lists.',
    url: 'https://github.com/mislavjc/constellator',
    favicon: '⭐',
    type: 'cli' as const,
  },
  {
    name: 'Photography',
    description:
      'Personal photography portfolio. Next.js, Cloudflare R2, Effect.',
    url: 'https://photography.mislavjc.com',
    favicon: '📷',
    type: 'web' as const,
  },
  {
    name: 'Cadro',
    description:
      'Add clean borders to images with precise controls and live preview.',
    url: 'https://cadro.us',
    favicon: '🖼️',
    type: 'web' as const,
  },
  {
    name: 'ACJ AIMS',
    description:
      'Corporate website for consulting company. Next.js, Prismic CMS.',
    url: 'https://www.acj-aims.hr/',
    favicon: '💼',
    type: 'web' as const,
  },
];

// Terminal mockup for CLI projects
const TerminalContent = ({
  project: _project,
}: {
  project: (typeof projects)[0];
}) => (
  <div className="flex h-full flex-col bg-[#1e1e1e] font-mono text-sm">
    {/* Terminal header */}
    <div className="flex items-center gap-2 border-b border-stone-700 bg-[#323232] px-4 py-2">
      <div className="flex gap-1.5">
        <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <div className="h-3 w-3 rounded-full bg-[#27ca40]" />
      </div>
      <span className="ml-2 text-xs text-stone-400">zsh</span>
    </div>

    {/* Terminal content */}
    <div className="flex-1 space-y-2 p-4 text-stone-300">
      <div>
        <span className="text-green-400">~</span>
        <span className="text-stone-500"> $ </span>
        <span>npx constellator</span>
      </div>
      <div className="text-stone-400">
        <div className="mb-2">
          <span className="text-yellow-400">⭐</span> Fetching your GitHub
          stars...
        </div>
        <div className="mb-2">
          <span className="text-blue-400">📦</span> Found 247 starred repos
        </div>
        <div className="mb-2">
          <span className="text-purple-400">🤖</span> Categorizing with AI...
        </div>
        <div className="mb-2">
          <span className="text-green-400">✓</span> Generated awesome-list.md
        </div>
      </div>
      <div className="mt-4">
        <span className="text-green-400">~</span>
        <span className="text-stone-500"> $ </span>
        <span className="animate-pulse">▌</span>
      </div>
    </div>
  </div>
);

const BrowserWindow = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeProject = projects[activeTab];

  return (
    <div className="w-full overflow-hidden rounded-lg border border-stone-300/50 bg-[#dee1e6] shadow-xl">
      {/* Tab bar */}
      <div className="relative">
        <div className="flex items-end gap-0.5 overflow-x-auto bg-[#dee1e6] px-2 pt-2 hide-scrollbar">
          {projects.map((project, index) => (
            <button
              key={project.name}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`group relative flex shrink-0 items-center gap-2 rounded-t-lg px-3 py-2 text-xs transition-all sm:px-4 ${
                activeTab === index
                  ? 'bg-white text-stone-700'
                  : 'text-stone-500 hover:bg-stone-200/50'
              }`}
            >
              <span className="text-sm">{project.favicon}</span>
              <span className="hidden max-w-[100px] truncate sm:inline">
                {project.name}
              </span>
              <span
                className={`ml-1 hidden rounded-full p-0.5 text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-600 sm:inline ${
                  activeTab === index
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </svg>
              </span>
            </button>
          ))}
          {/* New tab button */}
          <div className="mb-2 ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded text-stone-400 transition-colors hover:bg-stone-300/50">
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
              />
            </svg>
          </div>
        </div>
        {/* Scroll indicator gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#dee1e6] to-transparent" />
      </div>

      {/* URL bar area */}
      <div className="flex h-10 items-center gap-2 bg-white px-2 sm:gap-3 sm:px-3">
        {/* Navigation buttons - hidden on mobile */}
        <div className="hidden items-center gap-1 text-stone-400 sm:flex">
          <button
            type="button"
            className="rounded-full p-1.5 transition-colors hover:bg-stone-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-full p-1.5 transition-colors hover:bg-stone-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-full p-1.5 transition-colors hover:bg-stone-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              />
            </svg>
          </button>
        </div>

        {/* URL bar */}
        <div className="flex flex-1 items-center gap-2 rounded-full bg-stone-100 px-4 py-1.5 text-sm">
          <svg
            className="h-4 w-4 shrink-0 text-stone-400"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
            />
          </svg>
          <span className="truncate text-stone-600">
            {activeProject.url.replace('https://', '')}
          </span>
        </div>

        {/* Right side icons - hidden on mobile */}
        <div className="hidden items-center gap-1 text-stone-400 sm:flex">
          <button
            type="button"
            className="rounded-full p-1.5 transition-colors hover:bg-stone-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content - iframe for web, terminal for CLI */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
        {activeProject.type === 'cli' ? (
          <TerminalContent project={activeProject} />
        ) : (
          <iframe
            key={activeProject.url}
            src={activeProject.url}
            title={activeProject.name}
            className="h-[200%] w-[200%] origin-top-left scale-50 border-0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
        {/* Overlay with info on hover */}
        <Link
          href={activeProject.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/0 opacity-0 transition-all hover:bg-stone-900/80 hover:opacity-100"
        >
          <span className="mb-2 text-lg font-medium text-white">
            {activeProject.name}
          </span>
          <span className="max-w-xs text-center text-sm text-stone-300">
            {activeProject.description}
          </span>
          <span className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-stone-900">
            {activeProject.type === 'cli' ? 'View on GitHub' : 'Visit site'}{' '}
            <span>↗</span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export const Experience = () => {
  return (
    <section id="code" className="py-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-stone-600">3</span>
        <h2 className="font-serif text-3xl text-stone-900">Code</h2>
      </div>

      <p className="mb-12 max-w-xl text-stone-600">
        It started during lockdown. First HTML & CSS class on Microsoft Teams,
        and something just clicked. I spent days locked in my room watching
        Udemy courses, building barebones CRUD apps with Express and EJS. Two
        people I owe my career to: my professor who introduced me to it, and
        Colt Steele whose course got me through those early days. Now coding is
        my craft, my safe place. Half my side projects are Spotify-based.
        I&apos;m not a musician but making things with music is what I love.
        stamped.today is the current one: you collect stamps of artists you
        love, frozen with their monthly listener count at that moment. Proof you
        were a day 1 before they blew up.
      </p>

      <div className="mb-16">
        <h3 className="mb-6 text-sm uppercase tracking-widest text-stone-600">
          Experience
        </h3>
        <ExperienceGraph />
      </div>

      <div>
        <h3 className="mb-6 text-sm uppercase tracking-widest text-stone-600">
          Projects
        </h3>
        <BrowserWindow />
      </div>
    </section>
  );
};
