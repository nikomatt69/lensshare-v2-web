import mongoose from 'mongoose';
import { Subscription } from './Subscription';

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(process.env.MONGODB_URI!);
};

export const saveSubscription = async ({
  subscription,
  profileId
}: {
  subscription: any;
  profileId: string;
}) => {
  await connectDb();
  return new Subscription({ profileId, subscription }).save();
};

export const getSubscriptionsByProfileId = async (profileId: string) => {
  await connectDb();
  const subscriptions = await Subscription.find({ profileId });
  return subscriptions.map((sub) => sub.subscription);
};
