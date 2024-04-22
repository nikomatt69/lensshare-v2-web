import { EXPLORE } from '@lensshare/data/tracking';
import { PublicationMetadataMainFocusType } from '@lensshare/lens';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import type { Dispatch, FC, SetStateAction } from 'react';

interface FeedLinkProps {
  name: string;
  type?: PublicationMetadataMainFocusType;
}

interface FeedFocusTypeProps {
  focus?: PublicationMetadataMainFocusType;
  setFocus: Dispatch<
    SetStateAction<PublicationMetadataMainFocusType | undefined>
  >;
}

const FeedFocusType: FC<FeedFocusTypeProps> = ({ focus, setFocus }) => {
  const FeedLink: FC<FeedLinkProps> = ({ name, type }) => (
    <button
      type="button"
      onClick={() => {
        setFocus(type as PublicationMetadataMainFocusType);
      
      }}
      className={cn(
        { '!bg-brand-500 !text-white': focus === type },
        'text-brand rounded-full px-3 py-1.5 text-xs sm:px-4',
        'border-brand-300 dark:border-brand-500 border',
        'bg-brand-100 dark:bg-brand-300/20'
      )}
      aria-label={name}
      aria-selected={focus === type}
    >
      {name}
    </button>
  );

  return (
    <div className="mt-3 flex flex-wrap gap-1 px-2 sm:mt-0 sm:px-0">
      <FeedLink name="All posts" />
      <FeedLink name="Text" type={PublicationMetadataMainFocusType.TextOnly} />
      <FeedLink name="Video" type={PublicationMetadataMainFocusType.Video} />
      <FeedLink name="Audio" type={PublicationMetadataMainFocusType.Audio} />
      <FeedLink name="Images" type={PublicationMetadataMainFocusType.Image} />
    </div>
  );
};

export default FeedFocusType;
