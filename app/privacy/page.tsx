import { DocPage } from 'components/doc-page';

import { docMetadata, privacyDoc } from 'lib/pages';

export const metadata = docMetadata(privacyDoc);

const PrivacyPage = () => <DocPage doc={privacyDoc} />;

export default PrivacyPage;
