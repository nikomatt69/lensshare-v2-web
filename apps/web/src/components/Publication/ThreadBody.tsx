import PublicationWrapper from '@components/Shared/PublicationWrapper';
import type { AnyPublication } from '@lensshare/lens';
import type { FC } from 'react';

import PublicationActions from './Actions';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import { useInView } from 'react-cool-inview';
import pushToImpressions from '@lib/pushToImpressions';
import usePushToImpressions from 'src/hooks/usePushToImpressions';

interface ThreadBodyProps {
  publication: AnyPublication;
}

const ThreadBody: FC<ThreadBodyProps> = ({ publication }) => {
  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      // eslint-disable-next-line react-hooks/rules-of-hooks
      usePushToImpressions(publication.id);
    }
  });
  return (
    <PublicationWrapper publication={publication}>
      <span ref={observe} />
      <PublicationHeader publication={publication} />
      <div className="flex">
        <div className="-my-6 ml-5 mr-8 border-[0.8px] border-gray-300 bg-gray-300 dark:border-gray-700 dark:bg-gray-700" />
        <div className="w-full max-w-[calc(100%_-_53px)] pb-5">
          {publication.isHidden ? (
            <HiddenPublication type={publication.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} />
              <PublicationActions publication={publication} />
            </>
          )}
        </div>
      </div>
    </PublicationWrapper>
  );
};

export default ThreadBody;
