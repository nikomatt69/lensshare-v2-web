import PublicationWrapper from '@components/Shared/PublicationWrapper';
import type { PrimaryPublication } from '@lensshare/lens';
import type { FC } from 'react';

import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import pushToImpressions from '@lib/pushToImpressions';
import { useInView } from 'react-cool-inview';
import usePushToImpressions from 'src/hooks/usePushToImpressions';

interface QuotedPublicationProps {
  isNew?: boolean;
  publication: PrimaryPublication;
}

const QuotedPublication: FC<QuotedPublicationProps> = ({
  isNew = false,
  publication
}) => {
  usePushToImpressions(publication.id);

  return (
    <PublicationWrapper
      className="cursor-pointer p-4 first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-900"
      publication={publication}
    >
      <div className="flex items-center space-x-2">
        <PublicationHeader isNew={isNew} publication={publication} quoted />
      </div>
      {publication.isHidden ? (
        <HiddenPublication type={publication.__typename} />
      ) : (
        <PublicationBody publication={publication} quoted showMore />
      )}
    </PublicationWrapper>
  );
};

export default QuotedPublication;