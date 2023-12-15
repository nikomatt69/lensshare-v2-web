export enum NotificationTabType {
  All = 'ALL',
  Mentions = 'MENTIONS',
  Comments = 'COMMENTS',
  Likes = 'LIKES',
  Collects = 'COLLECTS'
}

export enum MessageTabs {
  Requests = 'Requests',
  Following = 'Following',
  Inbox = 'Inbox',
  Other = 'Other'
}

export enum ProfileFeedType {
  Feed = 'FEED',
  Replies = 'REPLIES',
  Media = 'MEDIA',
  Collects = 'COLLECTS',
  Gallery = 'GALLERY',
  Stats = 'STATS',
  Subscribers = 'SUBSCRIBERS',
  Bytes = 'BYTES'
}

export enum Errors {
  SomethingWentWrong = 'Something went wrong!',
  InternalServerError = 'Internal server error',
  SignWallet = 'Please sign in your wallet.',
  NoProperHeaders = 'No proper headers provided!',
  StatusCodeIsNot200 = 'Status code is not 200!',
  Limit500 = 'Limit must be less than 500!',
  InvalidAccesstoken = 'Invalid access token!',
  InvalidProfileId = 'Invalid profile id!',
  InvalidAddress = 'Invalid address!',
  NotAdmin = 'You are not admin!',
  NoBody = 'No body provided!'
}

export enum HomeFeedType {
  FOLLOWING = 'FOLLOWING',
  HIGHLIGHTS = 'HIGHLIGHTS',
  // Thirdparty Algorithms
  K3L_RECENT = 'K3L_RECENT',
  K3L_RECOMMENDED = 'K3L_RECOMMENDED',
  K3L_POPULAR = 'K3L_POPULAR',
  K3L_CROWDSOURCED = 'K3L_CROWDSOURCED',
  K3L_FOLLOWING = 'K3L_FOLLOWING',
  HEY_MOSTVIEWED = 'HEY_MOSTVIEWED',
  HEY_MOSTINTERACTED = 'HEY_MOSTINTERACTED'
}

export const AlgorithmProvider = {
  K3L: 'k3l',
  HEY: 'hey'
};
export enum MainnetContracts {
  LensHubProxy = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d',
  DefaultToken = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
}

export enum TestnetContracts {
  LensHubProxy = '0xC1E77eE73403B8a7478884915aA599932A677870',
  DefaultToken = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
}
