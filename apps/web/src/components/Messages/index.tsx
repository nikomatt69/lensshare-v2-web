import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@lensshare/data/constants';
import { Card, GridItemEight, GridLayout } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { loadKeys } from '@lib/xmtp/keys';
import { useClient } from '@xmtp/react-sdk';
import { useEffect } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useAccount, useWalletClient } from 'wagmi';

import StartConversation from './Composer/StartConversation';
import Conversations from './Conversations';
import MessagesList from './MessagesList';
import useResizeObserver from 'use-resize-observer';
import { PAGEVIEW } from '@lensshare/data/tracking';
import { Leafwatch } from '@lib/leafwatch';

const Messages: NextPage = () => {
  const { newConversationAddress, selectedConversation } = useMessagesStore();
  const { initialize, isLoading } = useClient();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'messages' });
  }, []);

  const initXmtp = async () => {
    if (!address) {
      return;
    }

    let keys = loadKeys(address);
    if (!keys) {
      return;
    }

    return await initialize({
      keys,
      options: { env: 'production' },
      signer: walletClient as any
    });
  };

  useEffect(() => {
    initXmtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { ref: divref, width: divWidth = 1080 } =
    useResizeObserver<HTMLDivElement>();

  return (
    <GridLayout classNameChild="md:gap-8 lg:flex md:flex xl:flex">
      <MetaTags title={`Messages • ${APP_NAME}`} />

      <GridItemEight className="xs:mx-2 relative mx-2 mb-0 sm:mx-2 md:flex-auto lg:flex-col ">
        <Card
          className={cn(
            !selectedConversation ? '  max-h-[22vh]' : 'max-h-[flex]',
            'my-5 w-full rounded-xl border-0 dark:bg-black md:mx-2 lg:mx-2'
          )}
        >
          <div className=" col-span-11  rounded-xl border bg-white dark:border-gray-700 dark:bg-black ">
            <Conversations isClientLoading={isLoading} />
          </div>
        </Card>
        <Card
          className={cn(
            !selectedConversation
              ? 'hidden'
              : 'xs:mx-2 xs:h-[70vh] xs:mx-2 xs:col-span-4 mb-0 flex w-full  flex-col justify-between rounded-xl sm:mx-2 sm:h-[80vh] md:col-span-4 md:h-[80vh] lg:h-[80vh] xl:h-[80vh]'
          )}
        >
          {newConversationAddress ? (
            <StartConversation />
          ) : selectedConversation ? (
            <MessagesList />
          ) : null}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
