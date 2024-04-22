import { Regex } from '@lensshare/data/regex';
import type { ProfileMentioned } from '@lensshare/lens';

const getMentions = (text: string): ProfileMentioned[] | [] => {
  const mentions = text.match(Regex.mention);
  const processedMentions = mentions?.map((mention) => {
    const splited = mention.split('/');
    const handle = mention.replace('@', '');
    const handleWithoutNameSpace = splited[splited.length - 1];

    return {
      profile: {},
      snapshotHandleMentioned: {
        fullHandle: handle,
        localName: handleWithoutNameSpace
      },
      stillOwnsHandle: true
    } as ProfileMentioned;
  });

  return processedMentions || [];
};

export default getMentions;
