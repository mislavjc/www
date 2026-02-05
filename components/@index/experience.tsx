import { BrowserWindow } from './browser-window';

import { parseLocalDate } from 'lib/date';

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

const COMPANY_COLORS: Record<string, { bg: string }> = {
  preview: { bg: 'bg-violet-400' },
  steel: { bg: 'bg-sky-400' },
  rubric: { bg: 'bg-rose-400' },
  coreline: { bg: 'bg-amber-400' },
  glassnode: { bg: 'bg-emerald-400' },
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
        weeks.push({ weekStart, companyId: null });
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
                    className={`h-2.5 flex-1 rounded-[2px] sm:h-4 sm:rounded-sm ${isFuture ? 'bg-stone-100' : companyColor} transition-shadow ${!isFuture && 'hover:ring-1 hover:ring-stone-400'}`}
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

export const Experience = () => {
  return (
    <section id="code" className="scroll-mt-24 py-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-stone-600">3</span>
        <h2 className="text-balance font-serif text-3xl text-stone-900">
          Code
        </h2>
      </div>

      <p className="mb-4 max-w-xl text-stone-600">
        It started during lockdown. First HTML & CSS class on Microsoft Teams,
        and something just clicked. I spent days locked in my room watching
        Udemy courses, building barebones CRUD apps with Express and EJS. Two
        people I owe my career to: my professor who introduced me to it, and
        Colt Steele whose course got me through those early days.
      </p>

      <p className="mb-12 max-w-xl text-stone-600">
        Now coding is my craft, my safe place. Half my side projects are
        Spotify-based. I&apos;m not a musician but making things with music is
        what I love. stamped.today is the current one: you collect stamps of
        artists you love, frozen with their monthly listener count at that
        moment. Proof you were a day 1 before they blew up.
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
