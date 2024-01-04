import type { DisplayedMessage } from '@lib/mapReactionsToMessages';

import { Image } from '@lensshare/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import Video from '@components/Shared/Video';

const RenderMessage = ({ message }: { message: DisplayedMessage }) => {
  if (message.messageType === MessageType.TEXT) {
    return message.messageContent;
  }
  if (message.messageType === MessageType.VIDEO) {
    return <Video src={message.messageContent} />;
  }

  if (message.messageType === MessageType.IMAGE) {
    return <Image alt="" src={message.messageContent} />;
  }
};

export default RenderMessage;
