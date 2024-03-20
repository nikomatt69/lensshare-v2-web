import type { OG } from '@lensshare/types/misc';
import { parseHTML } from 'linkedom';

import getProxyUrl from './getProxyUrl';
import generateIframe from './meta/generateIframe';
import getDescription from './meta/getDescription';
import getEmbedUrl from './meta/getEmbedUrl';
import getImage from './meta/getImage';
import getIsLarge from './meta/getIsLarge';
import getSite from './meta/getSite';
import getTitle from './meta/getTitle';
import getFavicon from './getFavicon';
import getPortal from './meta/getPortal';
import getNft from './meta/getNft';


const getMetadata = async (url: string): Promise<OG> => {
  const { html } = await fetch(url, {
    headers: { 'User-Agent': 'MyCrumbs' }
  }).then(async (res) => ({
    html: await res.text()
  }));

  const { document } = parseHTML(html);
  const isLarge = getIsLarge(document) as boolean;
  const image = getImage(document) as string;
  const proxiedUrl = getProxyUrl(image, isLarge);
  const metadata: OG = {
    url,
    title: getTitle(document),
    description: getDescription(document),
    image: proxiedUrl,
    site: getSite(document),
    favicon: getFavicon(url),
    isLarge,
    nft: getNft(document, url),
    lastIndexedAt: new Date().toISOString(),
    portal: getPortal(document),
    html: generateIframe(getEmbedUrl(document), url)
  };

  return metadata;
};

export default getMetadata;
