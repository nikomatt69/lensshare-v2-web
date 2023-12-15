import { Button } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { useClient } from '@xmtp/react-sdk';
import { initialize } from 'next/dist/server/lib/render-server';
import { useCallback } from 'react';
import useXmtpClient from 'src/hooks/useXmtpClient';
import { useMessageStore } from 'src/store/message';
import { useWalletClient } from 'wagmi';
type XMTPConnectButtonProps = {
 
};
const XMTPConnectButton: React.FC<XMTPConnectButtonProps> = () => {
  const xmtpClient = useMessageStore((state) => state.client);
  const { data: walletClient } = useWalletClient();
  const { initialize } = useClient();

  const handleConnect = useCallback(() => {
    void initialize({
      signer: walletClient
      
    });
  }, [xmtpClient, walletClient,initialize]);

  return (
    <Button
      className={cn({ 'text-sm': true }, 'mr-auto')}
      onClick={handleConnect}
    >
      Connect To XMTP
    </Button>
  );
};
export default XMTPConnectButton;
