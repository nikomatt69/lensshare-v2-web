import { ATTACHMENT } from '@lensshare/data/constants';
import { PUBLICATION } from '@lensshare/data/tracking';
import imageKit from '@lensshare/lib/imageKit';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { OG } from '@lensshare/types/misc';
import { Card, Image } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';

interface EmbedProps {
  og: OG;
  publicationId?: string;
}

const Embed: FC<EmbedProps> = ({ og, publicationId }) => {
  return (
    <div className="mt-4 w-full text-xs md:w-4/6">
      <Link
        href={og.url}
        onClick={(event) => {
          stopEventPropagation(event);
          Leafwatch.track(PUBLICATION.CLICK_OEMBED, {
            ...(publicationId && { publication_id: publicationId }),
            url: og.url
          });
        }}
        rel="noreferrer noopener"
        target={og.url.includes(location.host) ? '_self' : '_blank'}
      >
        <Card forceRounded>
          {og.isLarge && og.image ? (
            <Image
              alt="Thumbnail"
              className="divider aspect-2 w-full rounded-t-xl object-cover"
              onError={({ currentTarget }) => {
                currentTarget.src = og.image as string;
              }}
              src={imageKit(og.image, ATTACHMENT)}
            />
          ) : null}
          <div className="flex items-center">
            {!og.isLarge && og.image ? (
              <Image
                alt="Thumbnail"
                className="h-25 w-25 md:h-30 md:w-30 rounded-l-xl border-r dark:border-gray-700"
                height={120}
                onError={({ currentTarget }) => {
                  currentTarget.src = og.image as string;
                }}
                src={imageKit(og.image, ATTACHMENT)}
                width={120}
              />
            ) : null}
            <div className="truncate p-5">
              <div className="space-y-1.5">
                {og.title ? (
                  <div className="truncate text-xs font-bold">{og.title}</div>
                ) : null}
                {og.description ? (
                  <div className="ld-text-gray-500 line-clamp-1 whitespace-break-spaces text-xs">
                    {og.description}
                  </div>
                ) : null}
                {og.site ? (
                  <div className="flex items-center space-x-2 pt-1.5 text-xs">
                    {og.favicon ? (
                      <img
                        alt="Favicon"
                        className="h-4 w-4 rounded-full"
                        height={16}
                        src={og.favicon}
                        width={16}
                      />
                    ) : null}
                    <div className="ld-text-gray-500 text-xs">{og.site}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default Embed;
