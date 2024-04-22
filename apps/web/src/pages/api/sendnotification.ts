/* eslint-disable react-hooks/rules-of-hooks */
import type { NextApiRequest, NextApiResponse } from 'next';
import * as PushAPI from '@pushprotocol/restapi';
import * as ethers from 'ethers';
import walletClient from '@lib/walletClient';
import { useWalletClient } from 'wagmi';


/**
 * @params toAddress : user wallet address to whom send notificatioon
 * @params title : title of notification
 * @params body : body of notification
 */

type SendNotificationPayload = {
  title: string;
  body: string;
  toAddress: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data: walletClient } = useWalletClient();
  const sendNoti = async () => {
    try {
      const { title, body, toAddress }: SendNotificationPayload = req.body;

      const apiResponse = await PushAPI.payloads.sendNotification({
        signer:walletClient,
        type: 3,
        identityType: 2,
        notification: {
          title: `MyCrumbs`,
          body: `New Notification`
        },
        payload: {
          title: `MyCrumbs`,
          body: `New Notification`,
          cta: '',
          img: ''
        },
        recipients: `eip155:137:${toAddress}`,
        channel: 'eip155:137:0x38B2b78246B9b162f3B365f3970ac77FB07AbF90'
      });
      // apiResponse?.status === 204, if sent successfully!
      console.log('API repsonse: ', apiResponse);
      if (apiResponse?.status === 204) {
        res.status(200).setHeader('Access-Control-Allow-Origin', '*').json('sent');
      }
    } catch (error) {
      res.status(500).json('error');

      console.error('Error: ', error);
    }
  };
  sendNoti();
}
