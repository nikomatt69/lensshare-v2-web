import type { MarkupLinkProps } from '@lensshare/types/misc';

import ExternalLink from './ExternalLink';
import Hashtag from './Hashtag';
import Mention from './Mention';

const MarkupLink = ({ title, mentions }: MarkupLinkProps) => {
  if (!title) {
    return null;
  }

  if (title.startsWith('@')) {
    return <Mention title={title} mentions={mentions} />;
  }

  if (title.startsWith('#')) {
    return <Hashtag title={title} />;
  }

  return <ExternalLink title={title} />;
};

export default MarkupLink;
