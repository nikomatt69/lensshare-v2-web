import { Menu } from '@headlessui/react';
import { LanguageIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@lensshare/data/tracking';
import type { AnyPublication } from '@lensshare/lens';
import getPublicationData from '@lensshare/lib/getPublicationData';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';
import urlcat from 'urlcat';

interface TranslateProps {
  publication: AnyPublication;
}

const Translate: FC<TranslateProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const filteredContent =
    getPublicationData(targetPublication.metadata)?.content || '';
  const getGoogleTranslateUrl = (text: string): string => {
    return encodeURI(
      urlcat('https://translate.google.com/#auto|en|:text', { text })
    );
  };

  return (
    <Menu.Item
      as={Link}
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      href={getGoogleTranslateUrl(filteredContent || '')}
      onClick={(event: any) => {
        stopEventPropagation(event);
   
      }}
      target="_blank"
    >
      <div className="flex items-center space-x-2">
        <LanguageIcon className="h-4 w-4" />
        <div>Translate</div>
      </div>
    </Menu.Item>
  );
};

export default Translate;
