import type { DisplayedMessage } from '@lib/mapReactionsToMessages';

import { MessageType } from '@pushprotocol/restapi/src/lib/constants';

import RenderMessage from './RenderMessage';

const RenderReplyMessage = ({
  message
}: {
  message: DisplayedMessage & {
    messageObj: {
      content: {
        messageObj: {
          content: string;
        };
        messageType: string;
      };
      reference: string;
    };
  };
}) => {
  if (message.messageType !== MessageType.REPLY) {
    return null;
  }

  if (typeof message.messageObj !== 'object') {
    return null;
  }

  if (message.messageObj.content.messageType === MessageType.TEXT) {
    return (
      <>
        <div className="text-brand-900 rounded-lg bg-cyan-200 p-1.5">
          <span className="block text-xs font-bold">Replied To:</span>
          {message.parentMessage && (
            <RenderMessage message={message.parentMessage} />
          )}
        </div>
        {message.messageObj.content.messageObj.content}
      </>
    );
  }
};

export default RenderReplyMessage;
