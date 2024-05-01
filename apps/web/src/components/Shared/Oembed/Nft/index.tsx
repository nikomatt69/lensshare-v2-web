import type { Nft as INft } from '@lensshare/types/misc';
import { useDefaultProfileQuery } from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getLennyURL from '@lensshare/lib/getLennyURL';
import getNftChainInfo from '@lensshare/lib/getNftChainInfo';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { Button, Card, Tooltip, Image } from '@lensshare/ui';
import type { FC } from 'react';
import { OPEN_ACTION_NO_EMBED_TOOLTIP } from '@components/Publication/LensOpenActions/UnknownModule/Decent 2';


interface NftProps {
  nft: INft;
}

const Nft: FC<NftProps> = ({ nft }) => {
  const { data } = useDefaultProfileQuery({
    skip: !nft.creatorAddress,
    variables: { request: { for: nft.creatorAddress } }
  });
  const byName = data?.defaultProfile?.handle?.localName ?? nft.creatorAddress;
  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <div className="relative">
        <img
          alt={nft.collectionName}
          className="h-[350px] max-h-[350px] w-full rounded-t-xl object-cover"
          src={nft.mediaUrl}
        />
      </div>
      <div className="flex items-center justify-between border-t p-3 dark:border-gray-700">
        <div className="flex w-full items-center space-x-2">
          {nft.chain ? (
            <Tooltip
              content={getNftChainInfo(nft.chain).name}
              placement="right"
            >
              <img
                alt={getNftChainInfo(nft.chain).name}
                className="h-5 w-5"
                src={getNftChainInfo(nft.chain).logo}
              />
            </Tooltip>
          ) : null}
          <div className="flex w-full flex-col items-start justify-between gap-2 sm:flex-row">
            <div className="flex items-center gap-2">
              {!!data && !!data.defaultProfile && (
                <Image
                  alt={data?.defaultProfile?.id}
                  className="h-6 w-6 rounded-full border bg-gray-200 dark:border-gray-700"
                  height={24}
                  loading="lazy"
                  onError={({ currentTarget }) => {
                    currentTarget.src = getLennyURL(data?.defaultProfile?.id);
                  }}
                  src={getAvatar(data?.defaultProfile)}
                  width={24}
                />
              )}
              <div className="flex flex-col items-start justify-start">
                <p className="line-clamp-1 text-sm">{nft.collectionName}</p>
                <p className="line-clamp-1 text-sm opacity-50">by {byName}</p>
              </div>
            </div>

            <Tooltip
              className="w-full sm:w-auto"
              content={<span>{OPEN_ACTION_NO_EMBED_TOOLTIP}</span>}
              placement="top"
            >
              <Button
                className="w-full text-base font-normal sm:w-auto"
                disabled={true}
                size="lg"
              >
                Mint
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Nft;