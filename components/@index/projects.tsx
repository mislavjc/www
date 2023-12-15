import Image from 'next/image';
import Link from 'next/link';

import { SectionTitle } from 'components/section-title';

import { cn } from 'lib/utils';

import AcjLogoSvg from 'public/acj-logo.svg';
import CopylotSvg from 'public/copylot.svg';
import FinSvg from 'public/fin.svg';
import LogokodPng from 'public/logokod.png';
import MoveUpRightSvg from 'public/move-up-right.svg';
import QwizSvg from 'public/qwiz.svg';
import SpotichatSvg from 'public/spotichat.svg';
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
    name: 'Spotichat',
    description:
      'A playground for testing out OpenAI function calling using the Spotify API to create a message-like interface for getting user stats.',
    icon: SpotichatSvg,
    url: 'https://github.com/mislavjc/spotichat',
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
      'Platform for creation, organization & discovery of pub quizzes built for a student coding competition.',
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
    <div id="projects">
      <SectionTitle>Projects</SectionTitle>
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
                    height={20}
                    className="mr-3 inline-block w-5"
                  />
                  {project.name}
                </h3>
              </div>
              <div className="relative md:w-2/3">
                <h3 className=" text-neutral-600">{project.description}</h3>
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
