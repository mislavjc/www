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

const getWeeksBetween = (start: Date, end: Date): number => {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.ceil((end.getTime() - start.getTime()) / msPerWeek);
};

const getCompanyAtWeek = (
  weekStart: Date,
  experiences: Experience[],
): string | null => {
  for (const exp of experiences) {
    const endDate = exp.endDate || new Date();
    if (weekStart >= exp.startDate && weekStart <= endDate) {
      return exp.companyId;
    }
  }
  return null;
};

const ExperienceGraph = () => {
  const startDate = new Date('2021-03-01');
  const endDate = new Date();
  const totalWeeks = getWeeksBetween(startDate, endDate);

  // Generate weeks data
  const weeks: { date: Date; companyId: string | null }[] = [];
  for (let i = 0; i < totalWeeks; i++) {
    const weekStart = new Date(
      startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000,
    );
    weeks.push({
      date: weekStart,
      companyId: getCompanyAtWeek(weekStart, experiences),
    });
  }

  // Group by year for labels
  const years: { year: number; startIndex: number }[] = [];
  let currentYear = -1;
  weeks.forEach((week, index) => {
    const year = week.date.getFullYear();
    if (year !== currentYear) {
      years.push({ year, startIndex: index });
      currentYear = year;
    }
  });

  // Get unique companies for legend (in order of appearance)
  const seenCompanies = new Set<string>();
  const legendCompanies: { id: string; name: string }[] = [];
  for (const exp of [...experiences].reverse()) {
    if (!seenCompanies.has(exp.companyId)) {
      seenCompanies.add(exp.companyId);
      legendCompanies.push({ id: exp.companyId, name: exp.company });
    }
  }

  return (
    <div className="w-full font-mono">
      {/* Year labels */}
      <div className="mb-2 flex text-xs text-stone-400">
        {years.map(({ year, startIndex }, i) => {
          const nextStart = years[i + 1]?.startIndex ?? totalWeeks;
          const width = ((nextStart - startIndex) / totalWeeks) * 100;
          return (
            <div key={year} style={{ width: `${width}%` }}>
              {year}
            </div>
          );
        })}
      </div>

      {/* ASCII Graph */}
      <div className="overflow-x-auto rounded bg-stone-100 p-3">
        <div className="flex text-sm leading-none tracking-tighter">
          {weeks.map((week) => {
            const companyColor = week.companyId
              ? COMPANY_COLORS[week.companyId]?.text
              : 'text-stone-300';

            return (
              <span
                key={week.date.toISOString()}
                className={`${companyColor} transition-opacity hover:opacity-70`}
                title={`${week.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}${week.companyId ? ` – ${experiences.find((e) => e.companyId === week.companyId)?.company}` : ''}`}
              >
                █
              </span>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {legendCompanies.map(({ id, name }) => (
          <div key={id} className="flex items-center gap-1.5">
            <span className={COMPANY_COLORS[id].text}>█</span>
            <span className="text-stone-500">{name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="text-stone-300">█</span>
          <span className="text-stone-400">gap</span>
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
    highlight: true,
  },
  {
    name: 'Photography Portfolio',
    description:
      'Personal photography portfolio built with Next.js, Cloudflare R2, and Effect.',
    url: 'https://photography.mislavjc.com',
  },
  {
    name: 'Qwiz',
    description:
      'Platform for creating and organizing pub quizzes. Like Pitch, but for trivia nights.',
    url: 'https://github.com/qwiz-app/qwiz',
  },
  {
    name: 'SpotiStats',
    description: 'Visualize your Spotify listening habits and statistics.',
    url: 'https://github.com/mislavjc/spotistats',
    spotify: true,
  },
  {
    name: 'SpotiChat',
    description:
      'Chat interface for exploring your Spotify data using AI function calling.',
    url: 'https://github.com/mislavjc/spotichat',
    spotify: true,
  },
];

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
        <div className="space-y-6">
          {projects.map((project) => (
            <Link
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-stone-900 group-hover:underline">
                    {project.name}
                    {project.spotify && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        Spotify
                      </span>
                    )}
                    {project.highlight && (
                      <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                        New
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {project.description}
                  </p>
                </div>
                <span className="shrink-0 text-stone-400 group-hover:text-stone-900">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
