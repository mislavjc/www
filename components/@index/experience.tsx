import Image from 'next/image';

import { SectionTitle } from 'components/section-title';

type Experience = {
  date: string;
  company: string;
  role: string;
  description?: string;
  img: string;
};

const workExperiences = [
  {
    date: 'Feb 2025 - Jun 2025',
    company: 'Steel',
    role: 'Founding Applied AI Engineer',
    img: '/steel.png',
  },
  {
    date: 'Sep 2024 - Feb 2025',
    company: 'Rubric Labs',
    role: 'Applied AI Engineer',
    img: '/rubric.png',
  },
  {
    date: 'Jan 2024 - Sep 2024',
    company: 'CoreLine',
    role: 'Frontend Engineer',
    img: '/coreline.png',
    description:
      'Built a custom content management system for a web shop, making it super easy to manage and update content on the fly.',
  },
  {
    date: 'Oct 2022 - Dec 2023',
    company: 'Glassnode',
    role: 'Frontend Engineer',
    description:
      'Worked tightly with the Marketing team to increase conversion rates and reach metrics. Helped by improving Next.js performance, developing pages and adding A/B tests and tracking.',
    img: '/glassnode.png',
  },
  {
    date: 'Aug 2021 - Oct 2022',
    company: 'ACCOINTING.com',
    role: 'Frontend Engineer',
    description:
      'Worked on improving the metrics and performance of landing page in Next.js, led the development of the quiz doiowecryptotax.com.',
    img: '/accointing.png',
  },
  {
    date: 'Mar 2021 - Aug 2021',
    company: 'CoreLine',
    role: 'Frontend Engineer',
    description:
      'Worked on the implementation of GraphQL endpoints and improvement of the functionality of the CoreEvent application.',
    img: '/coreline.png',
  },
] satisfies Experience[];

export const Experience = () => {
  return (
    <div id="experience">
      <SectionTitle>Experience</SectionTitle>
      <div className="space-y-8">
        {workExperiences.map((experience, index) => (
          <div className="flex flex-row " key={index}>
            <div className="w-1/3 pr-4">
              <span className="text-lg font-medium text-neutral-900">
                {experience.date}
              </span>
            </div>
            <div className="w-2/3 space-y-2">
              <h3 className="flex items-center text-xl font-bold text-neutral-900">
                <Image
                  src={experience.img}
                  alt={experience.company}
                  width={28}
                  height={28}
                  className="mr-2 inline-block rounded align-middle"
                />
                {experience.company}
              </h3>
              <h3 className="text-lg text-neutral-700">{experience.role}</h3>
              <p className="text-neutral-600">{experience.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
