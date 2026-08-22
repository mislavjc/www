// JSON-LD identity for the homepage. A personal site, so the identity type is
// Person (schema.org/Person) rather than Organization or SoftwareApplication.
//
// Emitted as an @graph so the Person, the WebSite, and the WebPage are three
// linked nodes rather than one blob. Search engines resolve the site to a named
// entity through these @id links, which is what a bare-name query ("Mislav")
// needs in order to surface this domain over more established uses of the word.

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

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Every profile that represents the same entity, for `sameAs` and `rel=me`. */
export const SAME_AS = [
  ...SITE_SOCIALS.map((social) => social.url),
  photographyContent.galleryUrl,
];

const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
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
  sameAs: SAME_AS,
  mainEntityOfPage: { '@id': SITE_URL },
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
};

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: [SITE_HANDLE, `${SITE_NAME} (${SITE_HANDLE})`],
  description: SITE_DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
  copyrightHolder: { '@id': PERSON_ID },
};

const homePage = {
  '@type': 'WebPage',
  '@id': SITE_URL,
  url: SITE_URL,
  name: `${SITE_NAME} — ${SITE_JOB_TITLE} in ${currentLocation}`,
  description: SITE_DESCRIPTION,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': PERSON_ID },
  primaryImageOfPage: { '@id': `${SITE_URL}/opengraph-image` },
};

export const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [person, website, homePage],
} as const;
