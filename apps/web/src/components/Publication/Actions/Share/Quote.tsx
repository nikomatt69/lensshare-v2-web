import { Menu } from '@headlessui/react';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { type AnyPublication, TriStateValue } from '@lensshare/lens';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import cn from '@lensshare/ui/cn';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';
import { usePublicationStore } from 'src/store/usePublicationStore';

interface QuoteProps {
  publication: AnyPublication;
}

const Quote: FC<QuoteProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const publicationType = targetPublication.__typename;

  const setShowNewPostModal = useGlobalModalStateStore(
    (state) => state.setShowNewPostModal
  );
  const setQuotedPublication = usePublicationStore(
    (state) => state.setQuotedPublication
  );

  if (targetPublication.operations.canQuote === TriStateValue.No) {
    return null;
  }

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
        )
      }
      onClick={() => {
        setQuotedPublication(publication);
        setShowNewPostModal(true);
      }}
    >
      <div className="flex items-center space-x-2">
        <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
        <div>
          {publicationType === 'Comment' ? 'Quote comment' : 'Quote post'}
        </div>
      </div>
    </Menu.Item>
  );
};

export default Quote;
