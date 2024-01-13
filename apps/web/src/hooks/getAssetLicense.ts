import type { Maybe } from '@lensshare/lens';

import { PublicationMetadataLicenseType } from '@lensshare/lens';

const getAssetLicense = (
  licenseId: Maybe<PublicationMetadataLicenseType> | undefined
): null | string => {
  if (!licenseId) {
    return null;
  }

  switch (licenseId) {
    case PublicationMetadataLicenseType.Cco:
      return 'Anyone can use it, zero restrictions';
    case PublicationMetadataLicenseType.TbnlNcNdNplLedger:
      return 'NFT holder granted commercial rights';
    case PublicationMetadataLicenseType.TbnlNcNdNplLegal:
      return 'NFT holder granted personal rights';
    default:
      return null;
  }
};

export default getAssetLicense;
