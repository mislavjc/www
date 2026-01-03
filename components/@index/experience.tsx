'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    startDate: new Date('2025-10-01'),
    endDate: null,
    description: 'Building AI-powered video generation tools.',
  },
  {
    role: 'Founding Applied AI Engineer',
    company: 'Steel',
    companyId: 'steel',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-06-30'),
    description: 'Built AI infrastructure and applications.',
  },
  {
    role: 'Applied AI Engineer',
    company: 'Rubric Labs',
    companyId: 'rubric',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2025-02-28'),
    description: 'Worked on AI-powered applications.',
  },
  {
    role: 'Frontend Engineer',
    company: 'CoreLine',
    companyId: 'coreline',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-09-30'),
    description: 'Built a custom CMS for a web shop.',
  },
  {
    role: 'Frontend Engineer',
    company: 'Glassnode / Accointing',
    companyId: 'glassnode',
    startDate: new Date('2021-08-01'),
    endDate: new Date('2023-12-31'),
    description:
      'Worked across both companies as they merged. Built crypto analytics and portfolio tracking interfaces.',
  },
  {
    role: 'Frontend Engineer',
    company: 'CoreLine',
    companyId: 'coreline',
    startDate: new Date('2021-03-01'),
    endDate: new Date('2021-08-31'),
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
      <div className="mb-2 flex pl-12">
        {MONTH_NAMES.map((month) => (
          <div key={month} className="flex-1 text-stone-400">
            {month}
          </div>
        ))}
      </div>

      {/* Year rows */}
      <div className="flex flex-col gap-1.5">
        {yearData.map(({ year, weeks }) => (
          <div key={year} className="flex items-center gap-3">
            {/* Year label */}
            <div className="w-9 shrink-0 text-right text-stone-500">{year}</div>

            {/* Weeks grid */}
            <div className="flex flex-1 gap-0.5">
              {weeks.map((week) => {
                const companyColor = week.companyId
                  ? COMPANY_COLORS[week.companyId]?.bg
                  : 'bg-stone-200';

                const isFuture = week.weekStart > currentDate;

                return (
                  <div
                    key={week.weekStart.toISOString()}
                    className={`h-4 flex-1 rounded-sm ${isFuture ? 'bg-stone-100' : companyColor} transition-all ${!isFuture && 'hover:ring-1 hover:ring-stone-400'}`}
                    title={
                      isFuture
                        ? ''
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
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {legendCompanies.map(({ id, name }) => (
            <div key={id} className="flex items-center gap-1.5">
              <div className={`h-3 w-3 rounded-sm ${COMPANY_COLORS[id].bg}`} />
              <span className="text-stone-600">{name}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-stone-100" />
            <span className="text-stone-400">gap</span>
          </div>
        </div>
        <div className="text-stone-400">
          <span className="text-stone-600">{totalYears}</span> years
        </div>
      </div>
    </div>
  );
};

const projects = [
  {
    name: 'stamped.today',
    description:
      'Collect stamps of your favorite artists with their monthly listener count frozen in time. A love letter to music discovery.',
    url: 'https://stamped.today',
    favicon: '💿',
    highlight: true,
  },
  {
    name: 'Photography',
    description:
      'Personal photography portfolio built with Next.js, Cloudflare R2, and Effect.',
    url: 'https://photography.mislavjc.com',
    favicon: '📷',
  },
  {
    name: 'Qwiz',
    description:
      'Platform for creating and organizing pub quizzes. Like Pitch, but for trivia nights.',
    url: 'https://github.com/qwiz-app/qwiz',
    favicon: '🧠',
  },
  {
    name: 'SpotiStats',
    description: 'Visualize your Spotify listening habits and statistics.',
    url: 'https://github.com/mislavjc/spotistats',
    favicon: '📊',
    spotify: true,
  },
  {
    name: 'SpotiChat',
    description:
      'Chat interface for exploring your Spotify data using AI function calling.',
    url: 'https://github.com/mislavjc/spotichat',
    favicon: '💬',
    spotify: true,
  },
];

const BrowserWindow = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeProject = projects[activeTab];
  const isGitHub = activeProject.url.includes('github.com');

  return (
    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-stone-300 bg-white shadow-xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-stone-200 bg-gradient-to-b from-stone-100 to-stone-50 px-4 py-2.5">
        {/* Traffic lights */}
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-inner" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-inner" />
          <div className="h-3 w-3 rounded-full bg-[#28CA41] shadow-inner" />
        </div>

        {/* Tabs */}
        <div className="ml-6 flex flex-1 items-end gap-1 overflow-x-auto">
          {projects.map((project, index) => (
            <button
              key={project.name}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 rounded-t-lg border-x border-t px-4 py-2 font-mono text-xs transition-all ${
                activeTab === index
                  ? 'border-stone-200 bg-white text-stone-900'
                  : 'border-transparent bg-transparent text-stone-400 hover:bg-stone-100 hover:text-stone-600'
              }`}
            >
              <span>{project.favicon}</span>
              <span className="hidden md:inline">{project.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-2">
        {/* Navigation buttons */}
        <div className="flex gap-2 text-stone-300">
          <span>‹</span>
          <span>›</span>
        </div>

        {/* URL input */}
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-stone-100 px-3 py-1.5 font-mono text-xs">
          {isGitHub ? (
            <svg
              className="h-3.5 w-3.5 text-stone-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5 text-green-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          )}
          <span className="text-stone-500">
            {activeProject.url.replace('https://', '')}
          </span>
        </div>
      </div>

      {/* Content area */}
      <div className="flex h-[calc(100%-88px)] flex-col bg-stone-50 p-8">
        {isGitHub ? (
          /* GitHub repo style */
          <div className="flex flex-1 flex-col">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl">{activeProject.favicon}</span>
              <div>
                <h4 className="flex items-center gap-2 text-xl font-semibold text-stone-900">
                  {activeProject.name}
                  {activeProject.spotify && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Spotify API
                    </span>
                  )}
                </h4>
                <p className="mt-1 text-sm text-stone-500">Public repository</p>
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <p className="text-stone-700">{activeProject.description}</p>
            </div>

            <div className="mt-auto pt-6">
              <Link
                href={activeProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </Link>
            </div>
          </div>
        ) : (
          /* Website style */
          <div className="flex flex-1 flex-col">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl">{activeProject.favicon}</span>
              <div>
                <h4 className="flex items-center gap-2 text-xl font-semibold text-stone-900">
                  {activeProject.name}
                  {activeProject.highlight && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                      New
                    </span>
                  )}
                </h4>
                <p className="mt-1 text-sm text-stone-500">
                  {activeProject.url.replace('https://', '')}
                </p>
              </div>
            </div>

            <div className="flex-1 rounded-lg border border-stone-200 bg-white p-5">
              <p className="text-stone-700">{activeProject.description}</p>
            </div>

            <div className="mt-auto pt-6">
              <Link
                href={activeProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                Visit Website
                <span>↗</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Experience = () => {
  return (
    <section id="code" className="py-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-stone-400">3</span>
        <h2 className="font-serif text-3xl text-stone-900">Code</h2>
      </div>

      <p className="mb-12 max-w-xl text-stone-600">
        It&apos;s like art, and I&apos;m the artist—the canvas is code.
        There&apos;s something magical about being able to think &quot;I want to
        track my favorite artists&apos; growth&quot; and just... build it.
        Nothing stopping you.
      </p>

      <div className="mb-16">
        <h3 className="mb-6 text-sm uppercase tracking-widest text-stone-400">
          Experience
        </h3>
        <ExperienceGraph />
      </div>

      <div>
        <h3 className="mb-6 text-sm uppercase tracking-widest text-stone-400">
          Projects
        </h3>
        <BrowserWindow />
      </div>
    </section>
  );
};
