import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    profileId: { type: String, required: true },
    subscription: {
      endpoint: { type: String, required: true },
      keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true }
      }
    }
  },
  { timestamps: true }
);

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
