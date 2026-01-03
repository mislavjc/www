import Link from 'next/link';

const experiences = [
  {
    role: 'Founding Engineer',
    company: 'Preview.io',
    period: 'Oct 2025 – Present',
    description: 'Building AI-powered video generation tools.',
  },
  {
    role: 'Founding Applied AI Engineer',
    company: 'Steel',
    period: 'Feb 2025 – Jun 2025',
    description: 'Built AI infrastructure and applications.',
  },
  {
    role: 'Applied AI Engineer',
    company: 'Rubric Labs',
    period: 'Sep 2024 – Feb 2025',
    description: 'Worked on AI-powered applications.',
  },
  {
    role: 'Frontend Engineer',
    company: 'CoreLine',
    period: 'Jan 2024 – Sep 2024',
    description: 'Built a custom CMS for a web shop.',
  },
  {
    role: 'Frontend Engineer',
    company: 'Glassnode / Accointing',
    period: 'Aug 2021 – Dec 2023',
    description:
      'Worked across both companies as they merged. Built crypto analytics and portfolio tracking interfaces.',
  },
  {
    role: 'Frontend Engineer',
    company: 'CoreLine',
    period: 'Mar 2021 – Aug 2021',
    description: 'GraphQL endpoints and CoreEvent application improvements.',
  },
];

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
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={`${exp.company}-${exp.period}`}
              className="grid gap-1 md:grid-cols-[180px_1fr]"
            >
              <div>
                <p className="text-sm text-stone-400">{exp.period}</p>
              </div>
              <div>
                <p className="font-medium text-stone-900">
                  {exp.role}{' '}
                  <span className="font-normal text-stone-500">at</span>{' '}
                  {exp.company}
                </p>
                <p className="mt-1 text-sm text-stone-500">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
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
