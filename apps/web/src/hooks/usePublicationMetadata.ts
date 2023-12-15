import {
  audio,
  embed,
  image,
  liveStream,
  mint,
  textOnly,
  video
} from '@lens-protocol/metadata';
import { APP_NAME } from '@lensshare/data/constants';
import getEmbed from '@lensshare/lib/embeds/getEmbed';
import getURLs from '@lensshare/lib/getURLs';
import getNft from '@lensshare/lib/nft/getNft';
import getUserLocale from '@lib/getUserLocale';
import { useCallback } from 'react';
import { usePublicationStore } from 'src/store/usePublicationStore';
import { v4 as uuid } from 'uuid';

interface UsePublicationMetadataProps {
  baseMetadata: any;
}

const usePublicationMetadata = () => {
  const {
    attachments,
    audioPublication,
    videoThumbnail,
    videoDurationInSeconds,
    publicationContent,
    showLiveVideoEditor,
    liveVideoConfig
  } = usePublicationStore();

  const attachmentsHasAudio = attachments[0]?.type === 'Audio';
  const attachmentsHasVideo = attachments[0]?.type === 'Video';

  const cover = attachmentsHasAudio
    ? audioPublication.cover
    : attachmentsHasVideo
    ? videoThumbnail.url
    : attachments[0]?.uri;

  const getMetadata = useCallback(
    ({ baseMetadata }: UsePublicationMetadataProps) => {
      const urls = getURLs(publicationContent);

      const hasAttachments = attachments.length;
      const isImage = attachments[0]?.type === 'Image';
      const isAudio = attachments[0]?.type === 'Audio';
      const isVideo = attachments[0]?.type === 'Video';
      const isMint = Boolean(getNft(urls)?.mintLink);
      const isEmbed = Boolean(getEmbed(urls)?.embed);
      const isLiveStream = Boolean(showLiveVideoEditor && liveVideoConfig.id);

      const localBaseMetadata = {
        id: uuid(),
        locale: getUserLocale(),
        appId: APP_NAME
      };

      const attachmentsToBeUploaded = attachments.map((attachment) => ({
        item: attachment.uri,
        type: attachment.mimeType,
        cover: cover
      }));

      switch (true) {
        case isMint:
          return mint({
            ...baseMetadata,
            ...localBaseMetadata,
            ...(hasAttachments && { attachments: attachmentsToBeUploaded }),
            mintLink: getNft(urls)?.mintLink
          });
        case isEmbed:
          return embed({
            ...baseMetadata,
            ...localBaseMetadata,
            ...(hasAttachments && { attachments: attachmentsToBeUploaded }),
            embed: getEmbed(urls)?.embed
          });
        case isLiveStream:
          return liveStream({
            ...baseMetadata,
            ...localBaseMetadata,
            liveUrl: `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`,
            playbackUrl: `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`,
            startsAt: new Date().toISOString()
          });
        case !hasAttachments:
          return textOnly({
            ...baseMetadata,
            ...localBaseMetadata
          });
        case isImage:
          return image({
            ...baseMetadata,
            ...localBaseMetadata,
            image: {
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType
            },
            attachments: attachmentsToBeUploaded
          });
        case isAudio:
          return audio({
            ...baseMetadata,
            ...localBaseMetadata,
            audio: {
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType,
              artist: audioPublication.artist,
              cover: audioPublication.cover
            },
            attachments: attachmentsToBeUploaded
          });
        case isVideo:
          return video({
            ...baseMetadata,
            ...localBaseMetadata,
            video: {
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType,
              duration: parseInt(videoDurationInSeconds)
            },
            attachments: attachmentsToBeUploaded
          });
        default:
          return null;
      }
    },
    [
      attachments,
      videoDurationInSeconds,
      audioPublication,
      cover,
      publicationContent,
      showLiveVideoEditor,
      liveVideoConfig
    ]
  );

  return getMetadata;
};

export default usePublicationMetadata;
