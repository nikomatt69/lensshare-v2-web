import webPush from 'web-push';

export const sendNotification = (subscription: any, data: any) => {
  webPush.sendNotification(subscription, JSON.stringify(data), {});
};
