import { PencilSquareIcon } from '@heroicons/react/24/outline';
import getAvatar from '@lensshare/lib/getAvatar';
import getLennyURL from '@lensshare/lib/getLennyURL';
import getProfile from '@lensshare/lib/getProfile';
import { Card, Image } from '@lensshare/ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import { useAppStore } from 'src/store/persisted/useAppStore';

import { useEffectOnce } from 'usehooks-ts';

const NewPost: FC = () => {
  const { isReady, push, query } = useRouter();
  const { currentProfile } = useAppStore();
  const {setShowNewPostModal} = useGlobalModalStateStore(
    
  );
  const {setPublicationContent} = usePublicationStore(
   
  );

  const openModal = () => {
    setShowNewPostModal(true);
  };

  useEffectOnce(() => {
    if (isReady && query.text) {
      const { hashtags, text, url, via } = query;
      let processedHashtags;

      if (hashtags) {
        processedHashtags = (hashtags as string)
          .split(',')
          .map((tag) => `#${tag} `)
          .join('');
      }

      const content = `${text}${
        processedHashtags ? ` ${processedHashtags} ` : ''
      }${url ? `\n\n${url}` : ''}${via ? `\n\nvia @${via}` : ''}`;

      openModal();
      setPublicationContent(content);
    }
  });

  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-center space-x-3">
        <Image
          alt={currentProfile?.id}
          className="h-9 w-9 cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700"
          onClick={() => push(getProfile(currentProfile).link)}
          onError={({ currentTarget }) => {
            currentTarget.src = getLennyURL(currentProfile?.id);
          }}
          src={getAvatar(currentProfile)}
        />
        <button
          className="outline-brand-500 flex w-full items-center space-x-2 rounded-xl border bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
          onClick={() => openModal()}
          type="button"
        >
          <PencilSquareIcon className="h-5 w-5" />
          <span>What's happening?</span>
        </button>
      </div>
    </Card>
  );
};
export default NewPost;
