import { prisma } from '../seed';

const seedMembershipNfts = async (): Promise<number> => {
  const membershipNfts = await prisma.membershipNft.createMany({
    data: [{ dismissedOrMinted: true, id: '0x933b' }]
  });

  return membershipNfts.count;
};

export default seedMembershipNfts;
