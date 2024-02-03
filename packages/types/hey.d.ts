import type {
  AmountInput,
  CollectOpenActionModuleType,
  RecipientDataInput
} from '@lensshare/lens';
import type { Database } from './database.types';

export type Group = Database['public']['Tables']['groups']['Row'];

export type StaffPick = Database['public']['Tables']['staff-picks']['Row'];


export type Group = {
  avatar: string;
  createdAt: Date;
  description: string;
  discord: null | string;
  featured: boolean;
  id: string;
  instagram: null | string;
  lens: null | string;
  name: string;
  slug: string;
  tags: string[];
  x: null | string;
};


export type StaffPick = {
  createdAt: Date;
  id: string;
  score: number;
  type: 'GROUP' | 'PROFILE';
};

export type Feature = {
  createdAt: Date;
  enabled: boolean;
  id: string;
  key: string;
  priority: number;
};

export type AllowedToken = {
  contractAddress: string;
  decimals: number;
  id: string;
  name: string;
  symbol: string;
};

export type MembershipNft =
  Database['public']['Tables']['membership-nft']['Row'];

export type Preferences = {
  features: string[];
  membershipNft: { dismissedOrMinted: boolean };
  preference?: {
    createdAt: Date;
    highSignalNotificationFilter: boolean;
    id: string;
    isPride: boolean;
  } | null;
  pro: { enabled: boolean };
};

export type CollectModuleType = {
  type?:
    | CollectOpenActionModuleType.SimpleCollectOpenActionModule
    | CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule
    | null;
  amount?: AmountInput | null;
  collectLimit?: string | null;
  referralFee?: number | null;
  recipient?: string | null;
  recipients?: RecipientDataInput[];
  followerOnly?: boolean;
  endsAt?: string | null;
};

export type PublicationViewCount = {
  id: string;
  views: number;
};
