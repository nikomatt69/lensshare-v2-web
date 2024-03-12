import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import type {
  MirrorablePublication, PrimaryPublication,

} from '@lensshare/lens';
import { Image } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

import { getThumbnailUrl } from 'src/hooks/getThumbnailUrl';
import useEchoStore from 'src/store/echos';

type Props = {
  publication: PrimaryPublication;
};

const Item: FC<Props> = ({ publication }) => {
  const setSelectedTrack = useEchoStore((state) => state.setSelectedTrack);

  const onPlayPause = (track: PrimaryPublication) => {
    setSelectedTrack(track);
  };

  return (
    <div className="flex h-full w-full flex-col rounded-sm p-2">
      <div className="group relative flex justify-center">
        <Image
          src={getThumbnailUrl(publication.metadata)}
          className="w-full rounded-lg object-cover transition duration-300 ease-in-out group-hover:scale-105 md:h-[220px]"
          alt={publication?.id.name}
        />
        <button
          onClick={() => onPlayPause(publication)}
          className={cn(
            'invisible absolute bottom-2.5 left-2.5 rounded-full bg-white p-2 outline-none backdrop-blur-lg transition-all duration-100 ease-in-out group-hover:visible dark:bg-gray-900/70'
          )}
        >
          {publication?.id === 'selectedTrack?.id' ? (
            <PauseIcon className="animate-spin-slow h-7 w-7 text-black dark:text-white" />
          ) : (
            <PlayIcon className="h-7 w-7 pl-0.5 text-black dark:text-white" />
          )}
        </button>
      </div>
      <div className="mt-1">
        <Link
          href={`/u/${publication?.by?.id}`}
          className="text-xs font-medium uppercase text-black opacity-80 hover:underline hover:opacity-70 dark:text-white"
        >
          {publication?.by?.handle?.localName}
        </Link>
        <Link
          href={`/posts/${publication?.id}`}
          className="md:text-md line-clamp-1 text-sm font-semibold text-black hover:opacity-70 dark:text-white"
        >
          {publication?.metadata?.content}
        </Link>
      </div>
    </div>
  );
};

export default Item;
