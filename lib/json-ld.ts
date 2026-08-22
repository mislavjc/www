// JSON-LD identity for the homepage. A personal site, so the identity type is
// Person (schema.org/Person) rather than Organization or SoftwareApplication.

import { currentLocation, projects } from 'lib/data';
import {
  absoluteUrl,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_HANDLE,
  SITE_JOB_TITLE,
  SITE_NAME,
  SITE_SOCIALS,
  SITE_URL,
} from 'lib/site';
import { photographyContent } from 'lib/site-content';

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: SITE_NAME,
  alternateName: SITE_HANDLE,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  email: `mailto:${SITE_EMAIL}`,
  jobTitle: SITE_JOB_TITLE,
  knowsAbout: [
    'TypeScript',
    'React',
    'Next.js',
    'Web development',
    'Photography',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: currentLocation,
    addressCountry: 'HR',
  },
  sameAs: [
    ...SITE_SOCIALS.map((social) => social.url),
    photographyContent.galleryUrl,
  ],
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': SITE_URL,
  },
  subjectOf: projects.map((project) => ({
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: project.url,
  })),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'personal',
    email: SITE_EMAIL,
    url: absoluteUrl('/contact'),
  },
} as const;
