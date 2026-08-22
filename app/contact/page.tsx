import { DocPage } from 'components/doc-page';

import { contactDoc, docMetadata } from 'lib/pages';

export const metadata = docMetadata(contactDoc);

const ContactPage = () => <DocPage doc={contactDoc} />;

export default ContactPage;
