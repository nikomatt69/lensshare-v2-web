import { Text } from '@radix-ui/themes';

import React, { useEffect } from 'react';

import IrysInfo from './IrysInfo';
import useBytesStore from 'src/store/bytes';
import { canUploadedToIpfs } from 'src/hooks/canUploadedToIpfs';
import { formatMB } from 'src/hooks/formatMB';
import { IPFS_FREE_UPLOAD_LIMIT } from '@lensshare/data/constants';

const UploadMethod = () => {
  const uploadedMedia = useBytesStore((state) => state.uploadedMedia);
  const setUploadedMedia = useBytesStore((state) => state.setUploadedMedia);

  const isUnderFreeLimit = canUploadedToIpfs(uploadedMedia.file?.size);

  useEffect(() => {
    if (!isUnderFreeLimit) {
      setUploadedMedia({ isUploadToIpfs: false });
    }
  }, [isUnderFreeLimit, setUploadedMedia]);

  if (isUnderFreeLimit) {
    return null;
  }

  return (
    <div className="pt-4">
      <Text weight="medium">
        Please note that your media exceeds the free limit (
        {formatMB(IPFS_FREE_UPLOAD_LIMIT)}), and you can proceed with the upload
        by paying the storage fee.
      </Text>
      <IrysInfo />
    </div>
  );
};

export default UploadMethod;
