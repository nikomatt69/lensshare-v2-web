import { Image } from '@lensshare/ui';
import Link from 'next/link';
import type { FC } from 'react';
import type { Attachment as TAttachment } from 'xmtp-content-type-remote-attachment';

interface AttachmentProps {
  attachment: TAttachment;
}

/**
 * Creating object URLs from blobs is non-deterministic, so we store the
 * generated URLs in a cache so that they can be reused, which results in
 * a more consistent rendering of images/data.
 */
const blobCache = new WeakMap<Uint8Array, string>();
const isAudio = (mimeType: string): boolean =>
  ['audio/mpeg', 'audio/mp3'].includes(mimeType);
const isImage = (mimeType: string): boolean =>
  ['image/png', 'image/jpeg', 'image/gif'].includes(mimeType);

const Attachment: FC<AttachmentProps> = ({ attachment }) => {
  /**
   * The attachment.data gets turned into an object when it's serialized
   * via JSON.stringify in the store persistence. This check restores it
   * to the correct type.
   */
  

  const objectURL = blobCache.get(attachment.data);

  if (isImage(attachment.mimeType)) {
    return (
      <Image
        className="max-h-48 rounded object-contain"
        src={objectURL!}
        alt={attachment.filename}
      />
    );
  }
  if (isAudio(attachment.mimeType)) {
    return (
      <div className="max-w-20">
        <audio controls>
          <source src={objectURL!}  />
        </audio>
      </div>
    );
  }

  return (
    <Link target="_blank" rel="noreferrer noopener" href={objectURL!}>
      {attachment.filename}
    </Link>
  );
};

export default Attachment;
