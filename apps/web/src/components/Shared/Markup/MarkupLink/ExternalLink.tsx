import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import truncateUrl from '@lensshare/lib/truncateUrl';
import type { MarkupLinkProps } from '@lensshare/types/misc';
import Link from 'next/link';
import type { FC } from 'react';

const ExternalLink: FC<MarkupLinkProps> = ({ title }) => {
  let href = title;

  if (!href) {
    return null;
  }

  if (!href.includes('://')) {
    href = `https://${href}`;
  }

  return (
    <Link
      href={href}
      onClick={stopEventPropagation}
      target={href.includes(location.host) ? '_self' : '_blank'}
      rel="noopener"
    >
      {title ? truncateUrl(title, 30) : title}
    </Link>
  );
};

export default ExternalLink;
