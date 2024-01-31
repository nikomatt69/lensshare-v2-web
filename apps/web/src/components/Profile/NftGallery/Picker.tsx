import NftShimmer from '@components/Shared/Shimmer/NftShimmer';
import NftsShimmer from '@components/Shared/Shimmer/NftsShimmer';
import SingleNft from '@components/Shared/SingleNft';
import { CheckIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { IS_MAINNET } from '@lensshare/data/constants';
import type { Nft, NftsRequest } from '@lensshare/lens';
import { LimitType, useNftsQuery } from '@lensshare/lens';
import getProfile from '@lensshare/lib/getProfile';
import { ErrorMessage } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { VirtuosoGrid } from 'react-virtuoso';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/useAppStore';
import type { NftGalleryItem } from 'src/store/useNftGalleryStore';
import { useNftGalleryStore } from 'src/store/useNftGalleryStore';
import { mainnet } from 'wagmi/chains';

interface PickerProps {
  onlyAllowOne?: boolean;
}

const Picker: FC<PickerProps> = ({ onlyAllowOne }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const gallery = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);

  // Variables
  const request: NftsRequest = {
    where: {
      chainIds: IS_MAINNET ? [CHAIN_ID, mainnet.id] : [CHAIN_ID],
      forProfileId: currentProfile?.id
    },
    limit: LimitType.TwentyFive
  };

  const { data, loading, fetchMore, error } = useNftsQuery({
    variables: { request },
    skip: !currentProfile?.ownedBy.address
  });

  const nfts = data?.nfts?.items ?? [];

  const pageInfo = data?.nfts?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <NftsShimmer />;
  }

  if (nfts?.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center justify-items-center space-y-2 p-5">
        <div>
          <RectangleStackIcon className="text-brand h-8 w-8" />
        </div>
        <div>
          <div>
            <span className="mr-1 font-bold">
              {getProfile(currentProfile).slugWithPrefix}
            </span>
            <span>doesn't have any NFTs!</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load nft feed" error={error} />;
  }

  const onSelectItem = (item: Nft) => {
    if (gallery.items.length === 50) {
      return toast.error('Only 50 items allowed for gallery');
    }

    const customId = `${item.contract.chainId}_${item.contract.address}_${item.tokenId}`;
    const nft = {
      itemId: customId,
      ...item
    };

    if (onlyAllowOne) {
      setGallery({
        ...gallery,
        name: '',
        items: [nft],
        toAdd: [],
        toRemove: []
      });
      return;
    }

    const alreadySelectedIndex = gallery.items.findIndex(
      (n) => n.itemId === customId
    );
    if (alreadySelectedIndex !== -1) {
      // remove selection from gallery items
      const alreadyExistsIndex = gallery.alreadySelectedItems.findIndex(
        (i) => i.itemId === customId
      );
      let toRemove: NftGalleryItem[] = [];
      // if exists
      if (alreadyExistsIndex >= 0) {
        toRemove = [...gallery.toRemove, nft];
      }
      // Removing selected item
      const nfts = [...gallery.items];
      nfts.splice(alreadySelectedIndex, 1);
      // removing duplicates in the selection
      const sanitizeRemoveDuplicates = toRemove?.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.itemId === value.itemId)
      );
      setGallery({
        ...gallery,
        name: gallery.name,
        items: nfts,
        toRemove: sanitizeRemoveDuplicates,
        toAdd: gallery.toAdd
      });
    } else {
      // add selection to gallery items
      const alreadyExistsIndex = gallery.alreadySelectedItems.findIndex(
        (i) => i.itemId === customId
      );
      let toAdd: NftGalleryItem[] = [];
      // if not exists
      if (alreadyExistsIndex < 0) {
        toAdd = [...gallery.toAdd, nft];
      }
      // removing duplicates in the selection
      const sanitizeAddDuplicates = toAdd?.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.itemId === value.itemId)
      );
      setGallery({
        ...gallery,
        name: gallery.name,
        items: [...gallery.items, nft],
        toAdd: sanitizeAddDuplicates,
        toRemove: gallery.toRemove
      });
    }
  };

  const selectedItems = gallery.items.map((n) => {
    return n.itemId;
  });

  return (
    <VirtuosoGrid
      style={{ height: '68vh' }}
      totalCount={nfts.length}
      data={nfts}
      listClassName="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 px-5 my-5"
      endReached={onEndReached}
      components={{
        ScrollSeekPlaceholder: () => <NftShimmer />
      }}
      itemContent={(index, nft) => {
        const id = `${nft?.contract.chainId}_${nft?.contract.address}_${nft?.tokenId}`;
        const isSelected = selectedItems.includes(id);
        return (
          <div
            key={`${id}_${index}`}
            className={cn(
              'relative rounded-xl border-2',
              isSelected ? 'border-brand-500' : 'border-transparent'
            )}
          >
            {isSelected ? (
              <button className="bg-brand-500 absolute right-2 top-2 z-20 rounded-full">
                <CheckIcon className="h-5 w-5 p-1 text-white" />
              </button>
            ) : null}
            <button
              className="w-full text-left"
              onClick={() => onSelectItem(nft as Nft)}
            >
              <SingleNft nft={nft as Nft} linkToDetail={false} />
            </button>
          </div>
        );
      }}
    />
  );
};

export default Picker;
