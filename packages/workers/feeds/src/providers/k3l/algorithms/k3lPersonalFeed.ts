import urlcat from 'urlcat';

import randomizeIds from '../../../helpers/randomizeIds';

const k3lPersonalFeed = async (
  strategy: string,
  profile: string,
  limit: number,
  offset: number
) => {
  try {
    const response = await fetch(
      urlcat('https://lens-api.k3l.io/feed/personal/:profile/:strategy', {
        profile,
        strategy,
        limit,
        offset
      }),
      { headers: { 'User-Agent': 'Hey.xyz' } }
    );
    const json: {
      postId: string;
    }[] = await response.json();
    const ids = json.map((item: any) => item.postId);

    return randomizeIds(ids);
  } catch {
    return [];
  }
};

export default k3lPersonalFeed;
