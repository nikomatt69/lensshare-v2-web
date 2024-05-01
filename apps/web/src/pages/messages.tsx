import Messages from '@components/Messages';
import {
  attachmentContentTypeConfig,
  reactionContentTypeConfig,
  XMTPProvider
} from '@xmtp/react-sdk';

import Custom404 from './404';
import { useAppStore } from 'src/store/persisted/useAppStore';

const contentTypeConfigs = [
  reactionContentTypeConfig,

];

const XMTPMessages = () => {
  const { currentProfile } = useAppStore();
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
