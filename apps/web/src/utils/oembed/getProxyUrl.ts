const directUrls = [
  'zora.co/api/thumbnail',
  'social-images.lu.ma', // Lu.ma
  'drips.network' // Zora
];

const IMAGEKIT_URL = 'https://ik.imagekit.io/seasgram';

const getProxyUrl = (url: string, isLarge: boolean) => {
  if (!url) {
    return null;
  }

  const isDirect = directUrls.some((directUrl) => url.includes(directUrl));

  if (isDirect) {
    return url;
  }

  const isSquare = !isLarge;
  const height = isSquare ? 400 : 600;
  const width = isSquare ? 400 : 'auto';

  return `${IMAGEKIT_URL}/tr:di-placeholder.webp,h-${height},w-${width}/${url}`;
};

export default getProxyUrl;
