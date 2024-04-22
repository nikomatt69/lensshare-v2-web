import type { NextApiRequest, NextApiResponse } from 'next';
import * as PushAPI from '@pushprotocol/restapi';
import * as ethers from 'ethers';
const PK = '7c2d4d5a2acb052b3547280c19b18081b0edc37a4aaccb602cd6e0706f79ba6b';
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);

/**
 * @params userAddress : user wallet address of whom to OPT-OUT for notification
 */

type OptInForNotificationPayload = {
  userAddress: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const getNoti = async () => {
    try {
      const { userAddress }: OptInForNotificationPayload = req.body;
      await PushAPI.channels.subscribe({
        signer,
        channelAddress: 'eip155:137:0x38B2b78246B9b162f3B365f3970ac77FB07AbF90',
        userAddress: `eip155:137:${userAddress}`,
        onSuccess: () => {
          res.status(200).json({ message: 'subscribed succesfully' });
        },
        onError: () => {
          res.status(500).json({ message: 'something went wrong' });
        }
      });
    } catch (error) {
      res.status(500).json('error');
      console.error('Error: ', error);
    }
  };
  getNoti();
}
