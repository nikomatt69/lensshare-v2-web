import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { hashflags } from '@lensshare/data/hashflags';
import { prideHashtags } from '@lensshare/data/pride-hashtags';
import { PUBLICATION } from '@lensshare/data/tracking';
import isPrideMonth from '@lensshare/lib/isPrideMonth';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { MarkupLinkProps } from '@lensshare/types/misc';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';

const Hashtag: FC<MarkupLinkProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  const tag = title.slice(1).toLowerCase();
  const hasHashflag = hashflags.hasOwnProperty(tag);
  const isPrideHashtag = isPrideMonth() ? prideHashtags.includes(tag) : false;

  return (
    <span className="inline-flex items-center space-x-1">
      <span>
        <Link
          href={`/search?q=${title.slice(1)}&type=pubs&src=link_click`}
          onClick={(event) => {
            stopEventPropagation(event);
          
          }}
        >
          {isPrideHashtag ? <span className="pride-text">{title}</span> : title}
        </Link>
      </span>
      {hasHashflag ? (
        <img
          className="!mr-0.5 h-4"
          height={16}
          src={`${STATIC_ASSETS_URL}/hashflags/${hashflags[tag]}.png`}
          alt={tag}
        />
      ) : null}
    </span>
  );
};

export default Hashtag;
