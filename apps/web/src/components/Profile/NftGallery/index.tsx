import NftGalleryShimmer from '@components/Shared/Shimmer/NftGalleryShimmer';
import type { Profile } from '@lensshare/lens';
import { useNftGalleriesQuery } from '@lensshare/lens';
import type { FC } from 'react';

import Gallery from './Gallery';
import NoGallery from './NoGallery';

interface NftGalleryHomeProps {
  profile: Profile;
}

const NftGalleryHome: FC<NftGalleryHomeProps> = ({ profile }) => {
  const { data, loading } = useNftGalleriesQuery({
    variables: { request: { for: profile?.id } }
  });

  const nftGalleries = data?.nftGalleries.items;

  if (loading) {
    return <NftGalleryShimmer />;
  }

  if (!nftGalleries?.length) {
    return <NoGallery profile={profile} />;
  }

  return <Gallery galleries={nftGalleries} />;
};

export default NftGalleryHome;
