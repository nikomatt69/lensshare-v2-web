import type { ButtonType, Frame } from '@lensshare/types/misc';
import type { Document } from 'linkedom';

const getFrame = (document: Document, url?: string): Frame | null => {
  const getMeta = (key: string) => {
    const selector = `meta[name="${key}"], meta[property="${key}"]`;
    const metaTag = document.querySelector(selector);
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const version = getMeta('of:accepts:lens');
  const image = getMeta('of:image') || getMeta('og:image');
  const postUrl = getMeta('of:post_url') || url;
  const frameUrl = url || '';

  let buttons: Frame['buttons'] = [];
  for (let i = 1; i < 5; i++) {
    const button = getMeta(`of:button:${i}`);
    const action = getMeta(`of:button:${i}:action`) as ButtonType;
    const target = getMeta(`of:button:${i}:target`) as string;

    if (!button) {
      break;
    }

    buttons.push({ action, button, target });
  }

  if (!version || !postUrl || !image || buttons.length === 0) {
    return null;
  }

  return { buttons, frameUrl, image, postUrl, version };
};

export default getFrame;
