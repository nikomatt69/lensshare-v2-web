import type { OptmisticPublicationType } from './enums';

export interface IPFSResponse {
  uri: string;
  mimeType: string;
}

export interface NewAttachment {
  file?: File;
  id?: string;
  mimeType: string;
  previewUri: string;
  type: 'Audio' | 'Image' | 'Video';
  uri?: string;
}



export type ButtonType = 'link' | 'mint' | 'post_redirect' | 'post' | 'tx';

export interface Frame {
  buttons: {
    action: ButtonType;
    button: string;
    target?: string;
  }[];
  frameUrl: string;
  image: string;
  postUrl: string;
  version: string;
}

export interface MarketInfo {
  buttons: {
    action: ButtonType;
    button: string;
    target?: string;
  }[];
  marketId: string;         // Unique identifier for the market
  marketQuestion: string;   // The question or proposition that the market is based on
  conditionId: string;      // Unique identifier for the market's condition
  outcomes: string[];       // Array of possible outcomes for the market
  marketUrl: string;        // URL to the market's page or related resource
}
export interface Portal {
  buttons: {
    action: ButtonType;
    button: string;
    target?: string;
  }[];
  image: string;
  portalUrl: string;
  postUrl: string;
  version: string;
}

export interface Nft {
  chain: null | string;
  collectionName: string;
  contractAddress: `0x${string}` | null;
  creatorAddress: `0x${string}`;
  description: string;
  endTime: null | string;
  mediaUrl: string;
  mintCount: null | string;
  mintStatus: 'closed' | 'live' | null | string;
  mintUrl: null | string;
  schema: 'erc1155' | 'erc721' | string;
  sourceUrl: string;
}

export interface UserSuggestion {
  uid: string;
  id: string;
  display: string;
  name: string;
  picture: string;
}

export interface InflowType {
  id: string;
  sender: {
    id: string;
  };
}

export interface OG {
  description: null | string;
  favicon: null | string;
  html: null | string;
  image: null | string;
  isLarge: boolean | null;
  frame: Frame | null;
  polymarket: null | MarketInfo;
  lastIndexedAt?: string;
  portal: null | Portal;
  nft: Nft | null;
  site: null | string;
  title: null | string;
  url: string;
}
export interface ProfileInterest {
  category: { label: string; id: string };
  subCategories: { label: string; id: string }[];
}

export interface Emoji {
  emoji: string;
  description: string;
  category: string;
  aliases: string[];
  tags: string[];
}

export interface MessageDescriptor {
  id?: string;
  comment?: string;
  message?: string;
  context?: string;
  values?: Record<string, unknown>;
}

export interface OptimisticTransaction {
  type: OptmisticPublicationType;
  content: string;
  commentOn?: string;
  txHash?: string;
  txId?: string;
}

export interface MarkupLinkProps {
  title?: string;
  mentions?: ProfileMentioned[];
}

export interface MetadataAsset {
  type: 'Image' | 'Video' | 'Audio';
  uri: string;
  cover?: string;
  artist?: string;
  title?: string;
}
export interface SpaceMetadata {
  id: string;
  host: `0x${string}`;
  startTime: string;
}
