import PublicationWrapper from '@components/Shared/PublicationWrapper';
import type { PrimaryPublication } from '@lensshare/lens';
import type { FC } from 'react';

import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import pushToImpressions from '@lib/pushToImpressions';
import { useInView } from 'react-cool-inview';

interface QuotedPublicationProps {
  publication: PrimaryPublication;
  isNew?: boolean;
}

const QuotedPublication: FC<QuotedPublicationProps> = ({
  publication,
  isNew = false
}) => {
  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      pushToImpressions(publication.id);
    }
  });
  return (
    <PublicationWrapper
      className="cursor-pointer p-5 first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-900"
      publication={publication}
    >
      <span ref={observe} />
      <PublicationHeader publication={publication} quoted isNew={isNew} />
      {publication.isHidden ? (
        <HiddenPublication type={publication.__typename} />
      ) : (
        <PublicationBody publication={publication} showMore quoted />
      )}
    </PublicationWrapper>
  );
};

export default QuotedPublication;
