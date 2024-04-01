import Messages from '@components/Messages';
import { attachmentContentTypeConfig, CachedConversationWithId, reactionContentTypeConfig, useStreamAllMessages, useStreamMessages, XMTPProvider } from '@xmtp/react-sdk';

import Custom404 from './404';
import { useAppStore } from 'src/store/useAppStore';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';

const contentTypeConfigs = [
  reactionContentTypeConfig,
  attachmentContentTypeConfig
];

const XMTPMessages = () => {
  const { currentProfile } = useAppStore();
  const { selectedConversation  } = useMessagesStore();
  useStreamAllMessages();
  useStreamMessages(selectedConversation as CachedConversationWithId);
  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <XMTPProvider contentTypeConfigs={contentTypeConfigs}>
      <Messages />
    </XMTPProvider>
  );
};

export default XMTPMessages;
