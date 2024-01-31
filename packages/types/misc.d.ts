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
    action: string;
    button: string;
    type: ButtonType;
  }[];
  image: string;
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
  url: string;
  title: string | null;
  description: string | null;
  site: string | null;
  image: string | null;
  favicon: string | null;
  isLarge: boolean | null;
  lastIndexedAt?: string;
  portal: null | Portal;
  html: string | null;
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
