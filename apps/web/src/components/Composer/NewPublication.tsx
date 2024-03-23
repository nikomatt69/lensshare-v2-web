import QuotedPublication from '@components/Publication/QuotedPublication';
import { AudioPublicationSchema } from '@components/Shared/Audio';
import Wrapper from '@components/Shared/Embed/Wrapper';
import EmojiPicker from '@components/Shared/EmojiPicker';
import withLexicalContext from '@components/Shared/Lexical/withLexicalContext';
import NewAttachments from '@components/Shared/NewAttachments';
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { Errors } from '@lensshare/data/errors';
import { PUBLICATION } from '@lensshare/data/tracking';
import type {
  AnyPublication,
  MirrorablePublication,
  MomokaCommentRequest,
  MomokaPostRequest,
  MomokaQuoteRequest,
  OnchainCommentRequest,
  OnchainPostRequest,
  OnchainQuoteRequest,
  Quote
} from '@lensshare/lens';
import { ReferenceModuleType } from '@lensshare/lens';
import checkDispatcherPermissions from '@lensshare/lib/checkDispatcherPermissions';
import collectModuleParams from '@lensshare/lib/collectModuleParams';
import getProfile from '@lensshare/lib/getProfile';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import removeQuoteOn from '@lensshare/lib/removeQuoteOn';
import type { IGif } from '@lensshare/types/giphy';
import type { NewAttachment } from '@lensshare/types/misc';
import { Button, Card, ErrorMessage, Spinner } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import errorToast from '@lib/errorToast';
import getTextNftUrl from '@lib/getTextNftUrl';
import { Leafwatch } from '@lib/leafwatch';
import uploadToArweave from '@lib/uploadToArweave';
import { useUnmountEffect } from 'framer-motion';
import { $getRoot } from 'lexical';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useCreatePoll from 'src/hooks/useCreatePoll';
import useCreatePublication from 'src/hooks/useCreatePublication';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import usePublicationMetadata from 'src/hooks/usePublicationMetadata';
import { useAppStore } from 'src/store/useAppStore';
import { useCollectModuleStore } from 'src/store/useCollectModuleStore';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { usePublicationStore } from 'src/store/usePublicationStore';
import { useReferenceModuleStore } from 'src/store/useReferenceModuleStore';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';
import { NftOpenActionKit } from 'nft-openaction-kit';
import LivestreamSettings from './Actions/LivestreamSettings';
import LivestreamEditor from './Actions/LivestreamSettings/LivestreamEditor';
import PollEditor from './Actions/PollSettings/PollEditor';
import Editor from './Editor';
import Discard from './Post/Discard';
import LinkPreviews from './LinkPreviews';
import getURLs from '@lensshare/lib/getURLs';
import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';

import { useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';
const Attachment = dynamic(
  () => import('@components/Composer/Actions/Attachment'),
  {
    loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
  }
);
const Gif = dynamic(() => import('@components/Composer/Actions/Gif'), {
  loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
});
const CollectSettings = dynamic(
  () => import('@components/Composer/Actions/CollectSettings'),
  {
    loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
  }
);
const ReferenceSettings = dynamic(
  () => import('@components/Composer/Actions/ReferenceSettings'),
  {
    loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
  }
);
const PollSettings = dynamic(
  () => import('@components/Composer/Actions/PollSettings'),
  {
    loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
  }
);

const OpenActionSettings = dynamic(
  () => import('@components/Composer/Actions/OpenActionSettings'),
  {
    loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
  }
);

const NEXT_PUBLIC_DECENT_API_KEY = 'fee46c572acecfc76c8cb2a1498181f9';
const NEXT_PUBLIC_OPENSEA_API_KEY = 'ee7460014fda4f58804f25c29a27df35';
const NEXT_PUBLIC_RARIBLE_API_KEY = '4ad887e1-fe57-47e9-b078-9c35f37c4c13';
const nftOpenActionKit = new NftOpenActionKit({
  decentApiKey: NEXT_PUBLIC_DECENT_API_KEY || '',
  openSeaApiKey: NEXT_PUBLIC_OPENSEA_API_KEY || '',
  raribleApiKey: NEXT_PUBLIC_RARIBLE_API_KEY || ''
});

interface NewPublicationProps {
  publication: MirrorablePublication;
}

const NewPublication: FC<NewPublicationProps> = ({ publication }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [openActionEmbedLoading, setOpenActionEmbedLoading] =
    useState<boolean>(false);
  const [openActionEmbed, setOpenActionEmbed] = useState<any | undefined>();
  
  // Modal store
  const setShowNewPostModal = useGlobalModalStateStore(
    (state) => state.setShowNewPostModal
  );
  const setShowDiscardModal = useGlobalModalStateStore(
    (state) => state.setShowDiscardModal
  );

  // Nonce store
  const { lensHubOnchainSigNonce } = useNonceStore();

  // Publication store
  const {
    publicationContent,
    setPublicationContent,
    quotedPublication,
    setQuotedPublication,
    audioPublication,
    attachments,
    setAttachments,
    addAttachments,
    isUploading,
    videoThumbnail,
    setVideoThumbnail,
    showPollEditor,
    setShowPollEditor,
    resetPollConfig,
    pollConfig,
    showLiveVideoEditor,  
    setShowLiveVideoEditor,
    resetLiveVideoConfig
  } = usePublicationStore();

  
  useEffect(() => {
    const fetchOpenActionEmbed = async () => {
      setOpenActionEmbedLoading(true);
      const publicationContentUrls = getURLs(publicationContent);

      try {
        const calldata = await nftOpenActionKit.detectAndReturnCalldata(
          publicationContentUrls[0]
        );
        if (calldata) {
          setOpenActionEmbed({
            unknownOpenAction: {
              address: VerifiedOpenActionModules.DecentNFT,
              data: calldata
            }
          });
        } else {
          setOpenActionEmbed(undefined);
        }
      } catch (error_) {
        setOpenActionEmbed(undefined);
        setOpenActionEmbedLoading(false);
      }
      setOpenActionEmbedLoading(false);
    };

    fetchOpenActionEmbed();
  }, [publicationContent]);
  const { openAction, reset: resetOpenActionSettings } = useOpenActionStore();
  // Collect module store
  const { collectModule, reset: resetCollectSettings } =
    useCollectModuleStore();

  // Reference module store
  const { selectedReferenceModule, onlyFollowers, degreesOfSeparation } =
    useReferenceModuleStore();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [publicationContentError, setPublicationContentError] = useState('');

  const [editor] = useLexicalComposerContext();
  const createPoll = useCreatePoll();
  const getMetadata = usePublicationMetadata();
  const handleWrongNetwork = useHandleWrongNetwork();

  const { isSponsored, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);

  const isComment = Boolean(publication);
  const isQuote = Boolean(quotedPublication);
  const hasAudio = attachments[0]?.type === 'Audio';
  const hasVideo = attachments[0]?.type === 'Video';
  const noOpenAction = !openAction;
  const noCollect = !collectModule.type;
  // Use Momoka if the profile the comment or quote has momoka proof and also check collect module has been disabled
  const useMomoka = isComment
    ? publication.momoka?.proof
    : isQuote
    ? quotedPublication?.momoka?.proof
    : noCollect && noOpenAction;

  const onError = (error?: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const onCompleted = (
    __typename?:
      | 'RelayError'
      | 'RelaySuccess'
      | 'CreateMomokaPublicationResult'
      | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return onError();
    }

    setIsLoading(false);
    editor.update(() => {
      $getRoot().clear();
    });
    setPublicationContent('');
    setQuotedPublication(null);
    setShowPollEditor(false);
    resetPollConfig();
    setShowLiveVideoEditor(false);
    resetLiveVideoConfig();
    setAttachments([]);
    setVideoThumbnail({
      url: '',
      type: '',
      uploading: false
    });
    resetCollectSettings();
    resetOpenActionSettings();

    if (!isComment) {
      setShowNewPostModal(false);
    }

    // Track in leafwatch
    const eventProperties = {
      // TODO: add encrypted type in future
      publication_type: 'public',
      publication_collect_module: collectModule.type,
      publication_reference_module: selectedReferenceModule,
      publication_reference_module_degrees_of_separation:
        selectedReferenceModule ===
        ReferenceModuleType.DegreesOfSeparationReferenceModule
          ? degreesOfSeparation
          : null,
      publication_has_attachments: attachments.length > 0,
      publication_has_poll: showPollEditor,
      publication_open_action: openAction?.address,
      publication_is_live: showLiveVideoEditor,
      comment_on: isComment ? publication.id : null,
      quote_on: isQuote ? quotedPublication?.id : null
    };
    Leafwatch.track(
      isComment
        ? PUBLICATION.NEW_COMMENT
        : isQuote
        ? PUBLICATION.NEW_QUOTE
        : PUBLICATION.NEW_POST,
      eventProperties
    );
  };

  const {
    createCommentOnMomka,
    createQuoteOnMomka,
    createPostOnMomka,
    createCommentOnChain,
    createQuoteOnChain,
    createPostOnChain,
    createMomokaCommentTypedData,
    createMomokaQuoteTypedData,
    createMomokaPostTypedData,
    createOnchainCommentTypedData,
    createOnchainQuoteTypedData,
    createOnchainPostTypedData,
    error
  } = useCreatePublication({
    onCompleted,
    onError,
    commentOn: publication,
    quoteOn: quotedPublication!
  });

  useUpdateEffect(() => {
    setPublicationContentError('');
  }, [audioPublication]);

  useEffect(() => {
    const fetchOpenActionEmbed = async () => {
      setOpenActionEmbedLoading(true);
      const publicationContentUrls = getURLs(publicationContent);

      try {
        const calldata = await nftOpenActionKit.detectAndReturnCalldata(
          publicationContentUrls[0]
        );
        if (calldata) {
          setOpenActionEmbed({
            unknownOpenAction: {
              address: VerifiedOpenActionModules.DecentNFT,
              data: calldata
            }
          });
        } else {
          setOpenActionEmbed(undefined);
        }
      } catch (error_) {
        setOpenActionEmbed(undefined);
        setOpenActionEmbedLoading(false);
      }
      setOpenActionEmbedLoading(false);
    };

    fetchOpenActionEmbed();
  }, [publicationContent]);

  useEffect(() => {
    editor.update(() => {
      $convertFromMarkdownString(publicationContent);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getAnimationUrl = () => {
    const fallback =
      'ipfs://bafkreiaoua5s4iyg4gkfjzl6mzgenw4qw7mwgxj7zf7ev7gga72o5d3lf4';
    if (attachments.length > 0 || hasAudio || hasVideo) {
      return attachments[0]?.uri || fallback;
    }
    return fallback;
  };

  const getTitlePrefix = () => {
    if (hasVideo) {
      return 'Video';
    }

    return isComment ? 'Comment' : isQuote ? 'Quote' : 'Post';
  };

  const createPublication = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    if (isComment && publication.momoka?.proof && !isSponsored) {
      return toast.error(
        'Momoka is currently in beta - during this time certain actions are not available to all profiles.'
      );
    }

    try {
      setIsLoading(true);
      if (hasAudio) {
        setPublicationContentError('');
        const parsedData = AudioPublicationSchema.safeParse(audioPublication);
        if (!parsedData.success) {
          const issue = parsedData.error.issues[0];
          return setPublicationContentError(issue.message);
        }
      }

      if (publicationContent.length === 0 && attachments.length === 0) {
        return setPublicationContentError(
          `${
            isComment ? 'Comment' : isQuote ? 'Quote' : 'Post'
          } should not be empty!`
        );
      }

      setPublicationContentError('');
      

      let processedPublicationContent =
        publicationContent.length > 0 ? publicationContent : undefined;

      if (showPollEditor) {
        processedPublicationContent = await createPoll();
      }
      const title = hasAudio
        ? audioPublication.title
        : `${getTitlePrefix()} by ${getProfile(currentProfile).slugWithPrefix}`;

      const baseMetadata = {
        title,
        content: processedPublicationContent,
        marketplace: {
          name: title,
          description: processedPublicationContent,
          animation_url: getAnimationUrl(),
          external_url: `https://mycrumbs.xyz${getProfile(currentProfile).link}`
        }
      };

      const metadata = getMetadata({ baseMetadata });
      const arweaveId = await uploadToArweave(metadata);

      // Payload for the open action module
      const openActionModules = [];

      if (openActionEmbed) {
        openActionModules.push(openActionEmbed);
      }

      if (collectModule.type) {
        openActionModules.push({
          collectOpenAction: collectModuleParams(collectModule, currentProfile)
        });
      }
      if (openAction) {
        openActionModules.push({ unknownOpenAction: openAction });
      }


      

      // Payload for the Momoka post/comment/quote
      const momokaRequest:
        | MomokaPostRequest
        | MomokaCommentRequest
        | MomokaQuoteRequest = {
        ...(isComment && { commentOn: publication.id }),
        ...(isQuote && { quoteOn: quotedPublication?.id }),
        contentURI: `ar://${arweaveId}`
      };

      if (useMomoka && !openActionEmbed) {
        if (canUseLensManager) {
          if (isComment) {
            return await createCommentOnMomka(
              momokaRequest as MomokaCommentRequest
            );
          }

          if (isQuote) {
            return await createQuoteOnMomka(
              momokaRequest as MomokaQuoteRequest
            );
          }

          return await createPostOnMomka(momokaRequest);
        }

        if (isComment) {
          return await createMomokaCommentTypedData({
            variables: { request: momokaRequest as MomokaCommentRequest }
          });
        }

        if (isQuote) {
          return await createMomokaQuoteTypedData({
            variables: { request: momokaRequest as MomokaQuoteRequest }
          });
        }

        return await createMomokaPostTypedData({
          variables: { request: momokaRequest }
        });
      }

      // Payload for the post/comment/quote
      const onChainRequest:
        | OnchainPostRequest
        | OnchainCommentRequest
        | OnchainQuoteRequest = {
        contentURI: `ar://${arweaveId}`,
        ...(isComment && { commentOn: publication.id }),
        ...(isQuote && { quoteOn: quotedPublication?.id }),
        openActionModules,
        ...(onlyFollowers && {
          referenceModule:
            selectedReferenceModule ===
            ReferenceModuleType.FollowerOnlyReferenceModule
              ? { followerOnlyReferenceModule: true }
              : {
                  degreesOfSeparationReferenceModule: {
                    commentsRestricted: true,
                    mirrorsRestricted: true,
                    quotesRestricted: true,
                    degreesOfSeparation
                  }
                }
        })
      };

      if (canUseLensManager) {
        if (isComment) {
          return await createCommentOnChain(
            onChainRequest as OnchainCommentRequest
          );
        }

        if (isQuote) {
          return await createQuoteOnChain(
            onChainRequest as OnchainQuoteRequest
          );
        }

        return await createPostOnChain(onChainRequest);
      }

      if (isComment) {
        return await createOnchainCommentTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: onChainRequest as OnchainCommentRequest
          }
        });
      }

      if (isQuote) {
        return await createOnchainQuoteTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: onChainRequest as OnchainQuoteRequest
          }
        });
      }

      return await createOnchainPostTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: onChainRequest
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const setGifAttachment = (gif: IGif) => {
    const attachment: NewAttachment = {
      mimeType: 'image/gif',
      previewUri: gif.images.original.url,
      type: 'Image',
      uri: gif.images.original.url
    };
    addAttachments([attachment]);
  };

  const isSubmitDisabledByPoll = showPollEditor
    ? !pollConfig.choices.length ||
      pollConfig.choices.some((choice) => !choice.length)
    : false;

  const onDiscardClick = () => {
    setShowNewPostModal(false);
    setShowDiscardModal(false);
  };

  useUnmountEffect(() => {
    setPublicationContent('');
    setShowPollEditor(false);
    resetPollConfig();
    setShowLiveVideoEditor(false);
    resetLiveVideoConfig();
    setAttachments([]);
    setVideoThumbnail({
      url: '',
      type: '',
      uploading: false
    });
    resetOpenActionSettings();
    resetCollectSettings();
  });

  return (
    <Card
      onClick={() => setShowEmojiPicker(false)}
      className={cn({ 'border-none dark:bg-gray-800/80': !isComment })}
    >
      {error ? (
        <ErrorMessage
          title="Transaction failed!"
          error={error}
          className="!rounded-none"
        />
      ) : null}
      <Editor />
      {publicationContentError ? (
        <div className="mt-1 px-5 pb-3 text-sm font-bold text-red-500">
          {publicationContentError}
        </div>
      ) : null}
      {showPollEditor ? <PollEditor /> : null}
      {showLiveVideoEditor ? <LivestreamEditor /> : null}
      {quotedPublication ? (
        <Wrapper className="m-5" zeroPadding>
          <QuotedPublication
            publication={removeQuoteOn(quotedPublication as Quote)}
            isNew
          />
        </Wrapper>
      ) : null}
      <LinkPreviews
        openActionEmbed={!!openActionEmbed}
        openActionEmbedLoading={openActionEmbedLoading}
      />
      <div className="divider mx-5" />
      <div className="mx-5 my-3 block items-center sm:flex">
        <div className="mx-1.5 flex items-center space-x-4">
          <Attachment />
          <EmojiPicker
            emojiClassName="text-brand"
            setShowEmojiPicker={setShowEmojiPicker}
            showEmojiPicker={showEmojiPicker}
            setEmoji={(emoji) => {
              setShowEmojiPicker(false);
              editor.update(() => {
                // @ts-ignore
                const index = editor?._editorState?._selection?.focus?.offset;
                const updatedContent =
                  publicationContent.substring(0, index) +
                  emoji +
                  publicationContent.substring(
                    index,
                    publicationContent.length
                  );
                $convertFromMarkdownString(updatedContent);
              });
            }}
          />
          <Gif setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
          {!publication?.momoka?.proof ? (
            <>
              <CollectSettings />
              <OpenActionSettings />
              <ReferenceSettings />
            </>
          ) : null}
          <PollSettings />
          {!isComment && <LivestreamSettings />}
          </div>
          <div className="ml-auto pt-2 sm:pt-0">
          <Button
            disabled={
              isLoading ||
              isUploading ||
              isSubmitDisabledByPoll ||
              videoThumbnail.uploading
            }
            icon={
              isLoading ? (
                <Spinner size="xs" />
              ) : isComment ? (
                <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
              ) : (
                <PencilSquareIcon className="h-4 w-4" />
              )
            }
            onClick={createPublication}
          >
            {isComment ? 'Comment' : 'Post'}
          </Button>
        </div>
      </div>
      <div className="px-5 py-2">
        <NewAttachments attachments={attachments} />
      </div>
      <Discard onDiscard={onDiscardClick} />
    </Card>
  );
};

export default withLexicalContext(NewPublication);
