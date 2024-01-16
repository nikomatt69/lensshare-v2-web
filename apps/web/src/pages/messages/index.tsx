import MetaTags from '@components/Common/MetaTags';
import ChatView from '@components/messages2/ChatView';
import Loader from '@components/Shared/Loader';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME, PUSH_ENV } from '@lensshare/data/constants';
import { PushAPI } from '@pushprotocol/restapi';
import useMessageStore from 'src/store/useMessageStore';
import { useAppStore } from 'src/store/useAppStore';
import { useUpdateEffect } from 'usehooks-ts';
import { useWalletClient } from 'wagmi';


const ChatPage = () => {
  const { data: signer, isLoading } = useWalletClient();
  const pgpPvtKey = useMessageStore((state) => state.pgpPvtKey);
  const setPgpPvtKey = useMessageStore((state) => state.setPgpPvtKey);
  const currentProfile = useAppStore((state) => state.currentProfile);

  useUpdateEffect(() => {
    if (!signer || !currentProfile || pgpPvtKey) {
      return;
    }
    // chat.chats({env: PUSH_ENV, pgpPrivateKey})
    // Make use of zustand to store the client instead of doing it every component render
    const initialize = async () => {
      const _user = await PushAPI.initialize(signer, {
        env: PUSH_ENV
      });
      // @ts-ignore
      setPgpPvtKey(_user.decryptedPgpPvtKey);
      // Syncs name between push & lens
      const _userProfile = await _user.info();
      if (!_userProfile.profile.name) {
        await _user.profile.update({ name: currentProfile.handle?.localName });
      }
    };
    initialize();
  }, [signer, pgpPvtKey]);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  if (!pgpPvtKey || isLoading) {
    return (
      <div className="page-center flex-col">
        <Loader message="Connecting..." />
      </div>
    );
  }

  return (
    pgpPvtKey && (
      <>
        <MetaTags title={`Messages • ${APP_NAME}`} />
        <ChatView />

      </>
    )
  );
};

export default ChatPage;