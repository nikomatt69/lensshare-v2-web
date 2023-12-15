import Mint from '@components/Publication/HeyOpenActions/Nft/ZoraNft/Mint';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { IS_MAINNET, PREFERENCES_WORKER_URL } from '@lensshare/data/constants';
import type { MembershipNft } from '@lensshare/types/hey';
import { Button, Card, Modal } from '@lensshare/ui';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useZoraNft from 'src/hooks/zora/useZoraNft';
import { useAppStore } from 'src/store/useAppStore';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';
import { useQuery } from 'wagmi';

const HeyMembershipNft: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showMintModal, setShowMintModal] = useState(false);

  const { data: nft, loading } = useZoraNft({
    chain: 'zora',
    address: '0x76CF6F95B5494716D8515E0C17D7374346BAa625',
    token: ''
  });

  const fetchPreferences = async (): Promise<MembershipNft> => {
    const response = await axios.get(
      `${PREFERENCES_WORKER_URL}/getHeyMemberNftStatus/${currentProfile?.ownedBy.address}`
    );
    const { data } = response;

    return data.result;
  };

  const { data, isLoading, refetch } = useQuery(
    ['getHeyMemberNftStatus', currentProfile?.id],
    () => fetchPreferences(),
    { enabled: Boolean(currentProfile?.id) }
  );

  if (isLoading) {
    return null;
  }

  const dismissedOrMinted = data?.dismissedOrMinted;

  if (dismissedOrMinted) {
    return null;
  }

  const updateHeyMemberNftStatus = async () => {
    try {
      toast.promise(
        axios.post(`${PREFERENCES_WORKER_URL}/updateHeyMemberNftStatus`, {
          headers: {
            'X-Access-Token': hydrateAuthTokens().accessToken,
            'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'mainnet'
          }
        }),
        {
          loading: 'Updating...',
          success: () => {
            refetch();
            setShowMintModal(false);
            return 'Updated!';
          },
          error: 'Error updating.'
        }
      );
    } catch {}
  };

  return (
    <Card
      as="aside"
      className="text-brand dark:bg-brand-10/50 !border-brand-500 !bg-brand-50 mb-4"
    >
      <img
        src="https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafkreibgcincgi42c6k4xistrvd5e6teixq4j7yfr5qw4mdulltpopjhd4&w=1920&q=75"
        alt="Gitcoin emoji"
        className="h-48 w-full rounded-t-xl object-cover"
      />
      <div className="p-5">
        <div className="mb-1 font-bold">
          LensShare Buddy! Grab your special LensShare NFT Here.
        </div>
        <div className="text-brand-400 mb-4">
          New or OG, this NFT's for our epic times together. Let's keep the vibe
          alive!
        </div>
        <div className="flex flex-col items-center space-y-1.5">
          <Button
            className="w-full"
            onClick={() => {
              setShowMintModal(true);
            }}
            disabled={loading}
          >
            Mint now
          </Button>
          <Modal
            title="Mint"
            show={showMintModal}
            icon={<CursorArrowRaysIcon className="text-brand h-5 w-5" />}
            onClose={() => setShowMintModal(false)}
          >
            <Mint
              nft={nft}
              zoraLink="https://zora.co/collect/zora:0x76cf6f95b5494716d8515e0c17d7374346baa625/1"
              onCompleted={updateHeyMemberNftStatus}
            />
          </Modal>
          <button
            className="text-sm underline"
            onClick={() => {
              updateHeyMemberNftStatus();
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </Card>
  );
};

export default HeyMembershipNft;
