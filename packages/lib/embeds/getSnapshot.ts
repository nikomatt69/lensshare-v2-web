import type { SnapshotMetadata } from '@lensshare/types/embed';

export const regex =
  /https:\/\/snapshot\.org\/#\/([\w.\-]+)\/proposal\/([\w\-]+)/;

const getSnapshot = (url: string): SnapshotMetadata | null => {
  const matches = regex.exec(url);
  if (regex.test(url) && matches && matches.length >= 3) {
    const space = matches[1];
    const proposal = matches[2];
    const embed = `https://snapshot.org/#/${space}/proposal/${proposal}`;

    return { space, proposal, embed, provider: 'snapshot' };
  }

  return null;
};

export default getSnapshot;
