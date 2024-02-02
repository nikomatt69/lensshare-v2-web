import type { OptmisticPublicationType } from './enums';

export interface IPFSResponse {
  uri: string;
  mimeType: string;
}

export interface NewAttachment {
  id?: string;
  type: 'Image' | 'Video' | 'Audio';
  uri: string;
  mimeType: string;
  previewUri: string;
  file?: File;
}

export type ButtonType = 'redirect' | 'submit';

export interface Portal {
  buttons: {
    button: string;
    type: ButtonType;
  }[];
  image: string;
  postUrl: string;
  version: string;
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
  lastIndexedAt?: string;
  portal: null | Portal;
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
