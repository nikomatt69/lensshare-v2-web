import { IS_MAINNET } from '@lensshare/data/constants';
import { Localstorage } from '@lensshare/data/storage';

const getBasicWorkerPayload = () => {
  const accessToken = localStorage.getItem(Localstorage.AuthStore);

  return { accessToken, isMainnet: IS_MAINNET };
};

export default getBasicWorkerPayload;
