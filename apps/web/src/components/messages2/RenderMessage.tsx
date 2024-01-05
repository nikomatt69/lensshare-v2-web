
import { Image } from '@lensshare/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import Video from '@components/Shared/Video';
import type {
  DisplayedMessage,
  ParentMessage
} from '@lib/mapReactionsToMessages';
const RenderMessage = ({
  message
}: {
  message: DisplayedMessage | ParentMessage;
}) => {
  const renderChild = (message: ParentMessage) => {
    if (message.messageObj.content.messageType === MessageType.TEXT) {
      return message.messageObj.content.messageObj.content;
    }
  };
  // This message prop can be a type of REPLY which is coming from `RenderReplyMessage` handling it here.
  if (message.messageType === MessageType.REPLY && !!message.parentMessage) {
    return renderChild(message as ParentMessage);
  }
  if (message.messageType === MessageType.TEXT) {
    return message.messageContent;
  }
  if (message.messageType === MessageType.VIDEO) {
    return (
      <Video src={message.messageContent} poster={message.messageContent} />
    );
  }

  if (message.messageType === MessageType.IMAGE) {
    return <Image alt="" src={message.messageContent} />;
  }
};

export default RenderMessage;
