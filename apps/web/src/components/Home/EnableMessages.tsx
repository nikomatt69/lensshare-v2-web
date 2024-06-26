
import { EnvelopeOpenIcon } from '@heroicons/react/24/solid';
import { Card } from '@lensshare/ui';
import getCurrentSession from '@lib/getCurrentSession';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';

import { Client } from '@xmtp/xmtp-js';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';

const EnableMessages: FC = () => {
  const { currentProfile } = useAppStore();
  const { push } = useRouter();
  const [canMessage, setCanMessage] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { id: sessionProfileId } = getCurrentSession();
  const onConversationSelected = () => {
    push('/messages');
  };

  useEffectOnce(() => {
    const fetchCanMessage = async () => {
      const isMessagesEnabled = await Client.canMessage(
        sessionProfileId,
        {
          env: 'production'
        }
      );
      setCanMessage(isMessagesEnabled);
      setLoaded(true);
    };
    fetchCanMessage();
  });

  return (
    <Card
      as="aside"
      className="mb-4 mt-2 space-y-2.5 border-green-400 !bg-green-300/20 p-5 text-green-600"
    >
      <div className="flex items-center space-x-2 font-bold">
        <EnvelopeOpenIcon className="h-5 w-5" />
        <p>Direct messages are here!</p>
      </div>
      <p className="mr-10 text-sm leading-[22px]">
        Activate XMTP to start using MyCrumbs to send end-to-end encrypted DMs
        to frens.
      </p>

    </Card>
  );
};

export default EnableMessages;
