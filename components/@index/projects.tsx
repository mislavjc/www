import Image from 'next/image';
import Link from 'next/link';

import { cn } from 'lib/utils';

import AcjLogoSvg from 'public/acj-logo.svg';
import CopylotSvg from 'public/copylot.svg';
import FinSvg from 'public/fin.svg';
import LogokodPng from 'public/logokod.png';
import MoveUpRightSvg from 'public/move-up-right.svg';
import QwizSvg from 'public/qwiz.svg';
import SpotistatsSvg from 'public/spotistats.svg';

const projects = [
  {
    name: 'Copylot',
    description:
      "A prototype for A/B testing content generation utilizing AI. This project was developed as part of my bachelor's thesis.",
    icon: CopylotSvg,
    url: 'https://github.com/mislavjc/copylot',
  },
  {
    name: 'Logokod d.o.o.',
    description:
      'Helped modernize the business by building a platform for tracking the inventory of the company.  ',
    icon: LogokodPng,
  },
  {
    name: 'Qwiz',
    description:
      'Platform for creation, organization & discovery of pub quizzes.',
    icon: QwizSvg,
    url: 'https://github.com/qwiz-app/qwiz',
  },
  {
    name: 'ACJ AIMS d.o.o.',
    description: 'Built a Next.js website with Prismic CMS integration.',
    icon: AcjLogoSvg,
    url: 'https://www.acj-aims.hr/',
  },
  {
    name: 'Spotistats',
    description:
      'Next.js application using Spotify API for user listening habits and statistics.',
    icon: SpotistatsSvg,
    url: 'https://github.com/mislavjc/spotistats',
  },
  {
    name: 'FIN',
    description:
      'Won 3rd place at a student coding competition by building a Next.js Web application that simplifies business process monitoring.',
    icon: FinSvg,
    url: 'https://github.com/mislavjc/next-fin',
  },
];

export const Projects = () => {
  return (
    <div>
      <h2 className="mb-8 font-grotesk text-4xl text-neutral-900" id="projects">
        Projects
      </h2>
      <div className="flex flex-col gap-4">
        {projects.map((project, index) => (
          <Link
            href={project.url ? project.url : '/'}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            className={cn(!project.url && 'pointer-events-none')}
          >
            <div className="flex flex-col gap-2 rounded-lg border-[1px] border-neutral-100 bg-neutral-100 p-4 transition-all duration-200 ease-in-out hover:border-neutral-200 md:flex-row">
              <div className="pr-4 md:w-1/3">
                <h3 className="flex items-center text-xl font-medium text-neutral-900">
                  <Image
                    src={project.icon}
                    alt={project.name}
                    className="mr-2 inline-block h-8 w-8 rounded align-middle"
                  />
                  {project.name}
                </h3>
              </div>
              <div className="relative md:w-2/3">
                <h3 className="text-lg text-neutral-700">
                  {project.description}
                </h3>
                {project.url && (
                  <Image
                    src={MoveUpRightSvg}
                    alt="arrow"
                    width={12}
                    height={12}
                    className="absolute bottom-0 right-0"
                  />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
