import { Image } from '@lensshare/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import type {
  DisplayedMessage,
  ParentMessage
} from '@lib/mapReactionsToMessages';
import Attachment from './Attachment';
import type { IMessageIPFSWithCID } from '@pushprotocol/restapi';
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
  if (message.messageType === MessageType.MEDIA_EMBED) {
    return (
      <Attachment message={message.messageContent as unknown as IMessageIPFSWithCID} />
    );
  }

  if (message.messageType === MessageType.IMAGE) {
    return <Image alt="" src={message.messageContent} />;
  }
};

export default RenderMessage;
