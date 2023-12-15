import { PencilSquareIcon } from '@heroicons/react/24/outline';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import { Card, Image } from '@lensshare/ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';
import { usePublicationStore } from 'src/store/usePublicationStore';
import { useEffectOnce } from 'usehooks-ts';

const NewPost: FC = () => {
  const { query, isReady, push } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowNewPostModal = useGlobalModalStateStore(
    (state) => state.setShowNewPostModal
  );
  const setPublicationContent = usePublicationStore(
    (state) => state.setPublicationContent
  );

  const openModal = () => {
    setShowNewPostModal(true);
  };

  useEffectOnce(() => {
    if (isReady && query.text) {
      const { text, url, via, hashtags } = query;
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

      setShowNewPostModal(true);
      setPublicationContent(content);
    }
  });

  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-center space-x-3">
        <Image
          src={getAvatar(currentProfile)}
          className="h-9 w-9 cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700"
          onClick={() => push(getProfile(currentProfile).link)}
          alt={currentProfile?.id}
        />
        <button
          className="flex w-full items-center space-x-2 rounded-xl border bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
          type="button"
          onClick={() => openModal()}
        >
          <PencilSquareIcon className="h-5 w-5" />
          <span>What's happening?</span>
        </button>
      </div>
    </Card>
  );
};

export default NewPost;
