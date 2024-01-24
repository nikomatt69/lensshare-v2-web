import { PrimaryPublication } from "@lensshare/lens";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";


const getVideoCoverUrl = (publication: PrimaryPublication): string => {
  const url = publication?.metadata?.content?.cover?.original?.url;
  return sanitizeDStorageUrl(url);
};

export default getVideoCoverUrl;
