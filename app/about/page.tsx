import { DocPage } from 'components/doc-page';

import { aboutDoc, docMetadata } from 'lib/pages';

export const metadata = docMetadata(aboutDoc);

const AboutPage = () => <DocPage doc={aboutDoc} />;

export default AboutPage;
